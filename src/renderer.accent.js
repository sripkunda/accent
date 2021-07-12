"use strict";

/** The AccentRenderer mutation and reactivity module that manages compilations of the page **/
class AccentDOMController {
  /**
   * The callback function that is called when the MutationObserver is triggered
   * @param {*} mutationsList - The list of mutations that have been made to the DOM
   */
  static #observerCallback = (mutationsList) => {
    // Loop through the mutations list
    mutationsList.forEach((mutation) => {
      // If it is a child list change, then check if the attributes have a directive in them
      if (mutation.type == "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.attributes) {
            const bTranspile = (node) => {
              const attrs = node.getAttributeNames();
              const attrArray = Object.keys(DefaultAccentDirectives)
                .map((e) => AccentRenderer.DIRECTIVE_PREFIX + e)
                .concat(attrs);
              if (attrArray.some((val, i) => attrArray.indexOf(val) !== i)) {
                AccentRenderer._transpile(node); // If so call transpile() on the parentElement (or the element itself, assuming that there is no parent element).
              }
            };
            bTranspile(node); // Run the bTranspile function to transpile the nodes
          }
        });
      } else if (mutation.type == "attributes") {
        if (
          Object.keys(mutation.attributeName)
            .map((e) => AccentRenderer.DIRECTIVE_PREFIX + e)
            .includes(mutation.attributeName)
        ); // Check if the attribute is a directive
        AccentRenderer._transpile(mutation.target); // If so then transpile()
      }
    });
  };

  static #observer = new MutationObserver(AccentDOMController.#observerCallback); // The static observer object

  /**
   * @constructor
   * @param {Object} opts - The options for the MutationObserver
   */
  constructor(opts) {
    AccentDOMController.#observer.observe(document.body, opts); // Create a new observer with those options
  }

  /**
   * Find the local AccentContext of a given element
   * @param {*} el - The starting element for the local context search
   * @return {HTMLElement} - The element of the local context if found, undefined if there is no local context found
   */
  static _findLocalContext(el) {
    // Loop through all of the elements while there is a parentElement
    while (el) {
      if (
        el
          .getAttributeNames()
          .includes(`${AccentRenderer.DIRECTIVE_PREFIX}context`) ||
        AccentContext.contexts.get(el)
      ) {
        return el; // Return the element if it contains an Accent context
      } else {
        el = el.parentElement; // Go to the next parentElement for the context
      }
    }
  }
}

/** AccentRenderer class that stores an elements with metadata and maintains an element cache **/
class AccentComponent {
  static elements = new Map();
  element;
  data;

  /**
   * Initializes a new AccentComponent
   * @constructor
   * @param {HTMLElement} el
   * @param {Object} [dat={}]
   */
  constructor(el, dat = {}) {
    this.element = el;
    this.data = dat; // Push dat if defined, otherwise make an element with an empty context
    AccentComponent.elements.set(el, this);
  }

  /**
   * Execute a loop on an iterable and element for the executing AccentComponent
   * @param {Object} iterator - The object that is to be iterated over
   * @param {string} iterable - The name of the "index" variable when iterated over
   */
  for(iterator, iterable) {
    const loop = this.data.loop.value; // Get the loop data
    const element = this.element;
    if (!loop) return; // If the loop does not exist, then return
    const template = loop.template; // The stored template for the loop
    (iterator = (iterator || loop.iterator)?.proxy),
      (iterable = iterable || loop.iterable); // Get the loop data
    element.innerHTML = "";
    if (!iterator || !Array.isArray(iterator)) return;
    iterator.forEach((prop, i) => {
      let out = template; // Create a variable for the HTML output of the element
      let temp; // Variable that stores the regex matches
      const regex = /{{(.*?)}}/g; // The regex that gets the {{ values }}
      // Loop through matches of the regex
      while ((temp = regex.exec(template)) !== null) {
        try {
          temp[1] = temp[1].replaceAll("this.", "").trim();
          const value = AccentRenderer._compile(
            temp[1],
            JSON.parse(
              `{ "${iterable}": ${typeof prop == "string" ? `"${prop}"` : prop
              }, "index": ${i} }`
            ),
            true
          ); // Get the value of the variable
          const matchIndex =
            template == out
              ? temp.index
              : temp.index + (out.length - template.length); // Get the index of the match
          out =
            out.substr(0, matchIndex) +
            value +
            out.substr(matchIndex + temp[0].length, out.length); // Replace the {{value}} with the real value without disrupting the rest of the items
        } catch {
          throw Error(
            `Accent.js: An error occurred while executing the for loop.`
          );
        }
      }
      element.innerHTML += out; // Add to the innerHTML
      if (i + 1 == iterator.length) AccentRenderer._transpile(element);
    });
  }

  /**
   * Creates a new AccentComponent from an HTMLElement
   * @param {HTMLElement} el - The HTMLElement that will correspond to the created AccentComponent
   * @return {AccentComponent} - The newly created (or existing) AccentComponent
   */
  static from(el) {
    return AccentComponent.elements.get(el) ?? new AccentComponent(el);
  }
}

/** AccentRenderer class that stores contexts and their corresponding data/bindings **/
class AccentContext extends AccentComponent {
  static contexts = new Map();
  callback;
  #fillDat = (dat) => {
    Object.keys(dat).forEach((d, i) => {
      this.data[d] = new AccentObservable(d, dat[d], true);
    });
  }

  /**
   * Initializes a new AccentContext with the appropriate AccentObservables
   * @param {HTMLElement} el - The element that is being instantiated as the context scope
   * @param {Object} dat - The data that the context is storing
   * @param {Function} cb - The callback that is to be called when the context is initiated
   */
  constructor(el, dat, cb) {
    super(el);
    this.element = el;
    this.data = {};
    if (dat) this.#fillDat(dat);
    AccentContext.contexts.set(el, this);
    if (cb) {
      this.callback = cb;
      this.callback(this);
    }
  }

  /**
   * Set the scope data of an AccentContext
   * @param {(string|Object)} prop - The property that is being set/the final value of the context
   * @param {*} val - The value that is being assigned
   */
  set(prop, val) {
    if (val) {
      if (this.data[prop]) {
        this.data[prop]._set(val);
      } else {
        this.data[prop] = new AccentObservable(prop, val, true);
        this.data[prop] = this.data[prop].proxy;
      }
    } else {
      this.#fillDat(prop);
    }
  }

  /**
   * Read a property from an AccentContext's scope
   * @param {string} prop - The property that is being read
   * @return {*} - The target value
   */
  get(prop) {
    return prop
      ? this.data[prop].value
      : Object.keys(this.data).map((o) => this.data[o].value);
  }
  /**
   * @returns {(Object)} - The proxy values of each AccentObservable stored in the context.
   */
  values() {
    let obj = {}; 
    return Object.keys(this.data).forEach(d => obj[d] = this.data[d].proxy), obj; 
  }

  /**
   * Create an AccentContext from an element
   * @param {HTMLElement} el - The element that encompasses the context's scope
   * @param {Object} dat - The data to create the context with
   * @param {Function} callback - The callback function that will be called after the AccentContext's initilialization
   * @return {AccentContext} - The newly created AccentContext
   */
  static from(el, dat, callback) {
    return (
      AccentContext.contexts.get(el) ??
      AccentContext.contexts.get(AccentDOMController._findLocalContext(el)) ??
      new AccentContext(el, dat, callback)
    );
  }
}

/** A class that represents an Accent equivalent of an observable: an Object that can be bound to specific elements and callbacks **/
class AccentObservable {
  static objects = {}; // The objects that accent stores
  name; // The name of the object
  bindings; // The bindings that the object has
  value; // The value of the object

  /**
   * Initialize an AccentObservable
   * @param {string} name -The name of the AccentObservable
   * @param {*} val - The value of the AccentObservable
   * @param {boolean} standalone - Determines whether or not the AccentObservable will be stored in Accent.js
   * @param {Array} bindings - A list of bindings to initialize the observable with
   */
  constructor(name, val, standalone, bindings) {
    // Create a new binding
    this.bindings = bindings || [];
    this.value = val;
    this.name = name;
    this.proxy = AccentObservable.proxify(this);
    if (!standalone) AccentObservable.objects[name] = this;
  }

  /**
   * Create a binding to an AccentObservable
   * @param {HTMLElement} element - The event that is being binded to the Observable
   * @param {string} property - The property that is being changed when the Observable value is modified
   * @param {string} event - The event of the element to bind to
   * @param {Function} callback - The function that will be called when the value of the Observable is changed
   * @return {string} - The value of the binding
   */
  _bind(element, property, event, callback) {
    // Prevent duplicate bindings
    const bindingIndex = this.bindings.findIndex((b) => b.el == element);
    if (bindingIndex > -1) {
      this.removeBind(this.bindings[bindingIndex].el); // Remove the binding if it already exists
    }

    const bind = {
      el: element,
      prop: property,
      event: event,
      callback: callback,
    }; // Create a new object for that binding
    const listener = (e) => {
      if (!e) {
        bind.el[bind.prop] = this.value;
      } else {
        this._set(bind.el[bind.prop]);
      } // Set() the value if the property is defined
    };
    if (event) {
      element.addEventListener(event, listener); // Add the event listener for the binding if the event is specified, making this binding a two-way binding.
    }
    // Add the binding to the array of bindings
    this.bindings.push(bind);
    listener();

    // Clean up bindings that no longer have live references
    this.bindings
      .filter((b) => !document.documentElement.contains(b.el))
      .forEach((b) => {
        this.removeBind(b.el);
      });

    return this.value;
  }

  /**
   * Set an object on an AccentObservable
   * @param {string} prop - The property that is being set
   * @param {*} value - The value that is being set to the property
   */
  _set(prop, value) {
    typeof value !== "undefined"
      ? (this.value[prop] = value)
      : (this.value = prop); // Set the value of the AccentObservable
    // Apply property change to all bindings
    this.bindings.forEach((b) => {
      if (b.el) {
        b.el[b.prop] = prop; // Set the property
      }
      if (b.callback) {
        b.callback(b.el); // Call the callback if it exists
      }
    });
    this.proxy = AccentObservable.proxify(this); // Reset proxy
  }

  /**
   * @return {string} - Current ObservableValue
   */
  _get() {
    return this.value;
  }

  /**
   * Remove a binding from the list of bindings.
   * @param {*} el - The element of the binding that needs to be removed
   */
  removeBind(el) {
    const obj = this.bindings.findIndex((e) => e.el == el); // Get the index of the binding to the specified element

    // If the index is -1, throw an error because the binding cannot be found
    if (obj < 0) {
      throw Error(
        `Accent.js: Binding of element '${el}' cannot be found on object '${this.name}'`
      );
    }

    // Remove the event listener for that element (assuming that it is a text box that it is bound to)
    el.removeEventListener(
      this.bindings[obj].event,
      this.bindings[obj].listener
    );
    this.bindings.splice(obj, 1); // Remove the binding from the array
  }

  /**
   * Create a proxy for an AccentObservable.
   * @param {*} object - The target AccentObservable
   * @return {Proxy} - The newly created proxt for the AccentObservable
   */
  static proxify(object) {
    let target = object.value;
    if (typeof target !== "object") {
      target = {
        Value: target,
        AccentObservableObject: true,
      };
    }
    const handler = {
      get: (obj, prop) => {
        return prop in obj ? obj[prop] : obj.value;
      },
      set: (target, prop, value) => {
        if (typeof value !== "undefined" && typeof prop !== "undefined") {
          if (target.AccentObservableObject && prop == "Value") {
            object._set(value);
          } else prop ? object._set(prop, value) : object._set(value);
        }
        return true;
      },
    };
    return new Proxy(target, handler);
  }

  /**
   * Creates an AccentObservale with one preset binding.
   * @param {*} el - The element to create the binding from
   * @param {*} val - The value of the Observable to create
   * @param {*} ev - The event of the binding
   * @param {*} prop - The property that is to be changed/read for the binding
   * @return {string} - The value of the binding
   */
  static create(el, val, ev, prop) {
    // Multi-dimensional binding
    const cg = AccentDOMController._findLocalContext(el);
    prop = prop || typeof el.value !== "undefined" ? "value" : "innerHTML"; // Set value if value property exists, otherwise choose innerHTML
    let obj;
    if (cg) {
      const ctx = AccentContext.contexts.get(cg);
      if (ctx) {
        obj = ctx.data[val]; // If there is a control grou p with that object, then set the value to that control group
      }
    }

    // If there is an event, two way bind, otherwise one way bind
    obj =
      obj ??
      AccentObservable.objects[val] ??
      (ev ? new AccentObservable(val, el[prop]) : null);
    if (!obj) throw Error(`Accent.js: '${val}' is not defined.`); // Throw an error if the object does not exist
    return obj._bind(el, prop, ev); // Create a binding to the object
  }
}

class AccentDirective {
  static directives = {};
  name;
  callback;

  constructor(nam, cb) {
    this.name = nam;
    this.callback = cb;
    AccentDirective.directives[this.name] = this;
  }

  exec(...args) {
    this.callback(...args);
  }
}

/**
 * All directives for accent and their functions
 */
const DefaultAccentDirectives = {
  // Find and ignore elements with ignore directive
  ignore: new AccentDirective("ignore", (el) => {
    const attr = `${AccentRenderer.DIRECTIVE_PREFIX}ignore`;
    if (el?.hasAttribute(attr)) {
      if (el.getAttribute(attr) == "recursive") {
        while (el) {
          Array.from(el.children).forEach((c) => {
            c.setAttribute(attr, "true");
          });
          el = el.firstElementChild;
        }
      }
      return true;
    }
    return false;
  }),
  // Define context of an element
  context: new AccentDirective("context", (el, val) => {
    if (
      DefaultAccentDirectives.ignore.exec(el) ||
      AccentContext.contexts.get(el)
    )
      return;
    try {
      val =
        typeof val === "object"
          ? val
          : JSON.parse(
            val.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
          ); // Fix the "bad" json
      new AccentContext(el, val); // Define a new element with data of object provided in the context group
    } catch {
      throw Error(
        `Accent.js: error while parsing object data of element ${el}. '${val}' is not a valid context.`
      ); // Throw an error if the json cannot be parsed
    }
  }),
  // Renders "template" html for each value in a given object
  for: new AccentDirective("for", (el, val, template) => {
    if (DefaultAccentDirectives.ignore.exec(el)) {
      return;
    }
    const cg = AccentDOMController._findLocalContext(el); // Get the local context
    const args = val.split(" in ");
    const elem = AccentContext.contexts.get(cg); // Get the args and define the element
    if (!elem) {
      throw Error(
        `Accent.js: Local context could not be found for ${AccentRenderer.DIRECTIVE_PREFIX}for. ${AccentRenderer.DIRECTIVE_PREFIX}for elements must be localized to a context.`
      );
    }
    const iterator = elem.data[args[1]]; // If element exists, then get the context value from it, otherwise get it by compiling.
    const loop = AccentComponent.elements.get(el)
      ? AccentComponent.elements.get(el)
      : new AccentComponent(el, {
        loop: new AccentObservable(
          "loop",
          {
            template: template || el.innerHTML.trim(),
            iterable: args[0],
            iterator: iterator,
          },
          true
        ),
      }); // Create a new accent element that stores the loop data
    const accentObject = elem.data[args[1]];
    accentObject._bind(el, null, null, (element) => {
      const obj = AccentComponent.elements.get(element);
      obj.element.innerHTML = obj.data.loop.value.template;
      DefaultAccentDirectives.for.exec(element, val);
    }); // Bind the loop data so that changes in the object also refect in the for directive DOM element

    loop.for(); // Initiate the for loop
  }),
  // Two-way binding of an element
  model: new AccentDirective("model", (el, val, prop) => {
    if (DefaultAccentDirectives.ignore.exec(el)) return;
    AccentObservable.create(el, val, "input", prop); // Two-way binding to global accent object
  }),
  // One-way binding of an element
  bind: new AccentDirective("bind", (el, val, prop) => {
    if (DefaultAccentDirectives.ignore.exec(el)) return;
    AccentObservable.create(el, val, null, prop); // One-way binding to global AccentObservable
  }),
  // Execute a code segment
  set: new AccentDirective("set", (el, val, prop) => {
    if (DefaultAccentDirectives.ignore.exec(el)) return;
    const cg = AccentDOMController._findLocalContext(el);
    const context = AccentContext.contexts.get(cg);
    const params = context ? context.data || {} : {};
    const cont = AccentRenderer._compile(val, params, true, true, el);
    el[prop] = cont ?? "";
  }),
  // Set textContent with an expression
  text: new AccentDirective("text", (el, val) => {
    DefaultAccentDirectives.set.exec(el, val, "textContent");
  }),
  // Set html with an expression
  html: new AccentDirective("html", (el, val) => {
    DefaultAccentDirectives.set.exec(el, val, "innerHTML");
  }),
  // Set class with an expression
  class: new AccentDirective("class", (el, val) => {
    DefaultAccentDirectives.set.exec(el, val, "class");
  }),
  // Set style with an expression
  style: new AccentDirective("style", (el, val) => {
    DefaultAccentDirectives.set.exec(el, val, "style");
  }),
  // Reactive event handler (context-aware event handling)
  on: new AccentDirective("on", (el, val, ev) => {
    if (DefaultAccentDirectives.ignore.exec(el)) return;
    const accentEl =
      AccentComponent.elements.get(el) ??
      new AccentComponent(el, {
        handler: (event) => {
          event.preventDefault();
          try {
            AccentRenderer._compile(
              val,
              AccentContext.contexts.get(
                AccentDOMController._findLocalContext(el)
              ).data,
              false,
              true
            );
          } catch(err) {
            throw Error(
              `Accent.js: An error occurred while executing ${AccentRenderer.DIRECTIVE_PREFIX}on: ${err}`
            );
          }
        },
      });
    el.removeEventListener(ev, accentEl.data?.handler);
    el.addEventListener(ev, accentEl.data?.handler);
  }),
  // Accent click event
  click: new AccentDirective("click", (el, val) => {
    DefaultAccentDirectives.on.exec(el, val, "click");
  }),
  // Accent submit event
  submit: new AccentDirective("submit", (el, val) => {
    DefaultAccentDirectives.on.exec(el, val, "submit");
  }),
};

/** Public AccentRenderer Object **/
const AccentRenderer = {
  DIRECTIVE_PREFIX: "ac-",
  _render: () => {
    // Configure mutation observer on body
    new AccentDOMController({
      attributes: true,
      childList: true,
      subtree: true,
    });
    AccentRenderer._transpile(document).then((v) => {
      document.dispatchEvent(_AccentRendererEvents.DOM_READY);
    });
  },
  _transpile: async (el) => {
    el.dispatchEvent(_AccentRendererEvents.TRANSPILE_STARTED); // Dispatch event for start of transpilation
    new Promise((res, rej) => {
      // Loop through directives and find nodes that include them. Execute the directive for each of these elements.
      const directives = Object.keys(AccentDirective.directives);
      directives.forEach((di, i) => {
        const selector = `${AccentRenderer.DIRECTIVE_PREFIX}${di}`;
        const nodes = el.querySelectorAll(`[${selector}]`);
        nodes.forEach((node) => {
          AccentDirective.directives[di].exec(
            node,
            node.getAttribute(selector)
          );
        });
        // If the end of the directives list has been reached, end the transpilation process and dispatch the transpile ended event
        if (i + 1 == directives.length) res();
      });
    }).then((v) => {
      el.dispatchEvent(_AccentRendererEvents.TRANSPILE_ENDED);
    });
  },
  _compile: (arg, params, bReturn, bRaw, el) => {
      const args = {}; // Instantiate an empty object for the arguments
      Object.keys(params).forEach((p) => {
        const par = params[p]; // Reference the current element of params
        if (par instanceof AccentObservable) {
          // If the current element is an AccentObservable, then set args[p] to the value of that AccentObservable and bind the object to the current element
          args[p] = par.proxy;
          if (el) {
            par._bind(el, null, null, (elem) => {
              const cg = AccentDOMController._findLocalContext(elem);
              const context = cg ? AccentContext.contexts.get(cg) : undefined;
              if (context?.callback) {
                context.callback(context);
              }
              AccentRenderer._transpile(elem);
            });
          }
        } else {
          args[p] = par; // Otherwise keep par as is and push it to args[p]
        }
      }); // Loop through the params and add the values to the args array to exclude accent objects
      let exp = arg.replaceAll(/this\./g, "params.").replaceAll(/this/g, "params");
      return (
        AccentObservable.objects[arg] ?? // Return the requested AccentObservable if applicable
        AccentComponent.elements.get(arg) ?? // Return the requested AccentComponent if applicable
        (bRaw
          ? Function("params", `${bReturn ? "return " : ""}${exp};`)(args) // Execute raw if specified
          : Function(
            "params",
            `${bReturn ? "return " : ""
            }typeof ${exp} !== 'undefined' ? ${exp} : params['${exp}'];`
          )(args))
      ); // Otherwise execute with awareness
  },
};

/** Events for AccentRenderer **/
const _AccentRendererEvents = {
  TRANSPILE_STARTED: new Event("markup:transpile-started"),
  TRANSPILE_ENDED: new Event("markup:transpile-ended"),
  DOM_READY: new Event("markup:dom-ready"),
};

// JavaScript access variables
const $for = DefaultAccentDirectives.for.exec;
const $event = DefaultAccentDirectives.on.exec;
const $attr = DefaultAccentDirectives.set.exec;
const $subscribe = (el, obj, callback) => {
  obj._bind(el, null, null, callback);
};
const $model = (...args) => { DefaultAccentDirectives.model.exec(...args) };
const $bind = (...args) => { DefaultAccentDirectives.bind.exec(...args) };

// Accent Objects
const $object = (name, ctx) => {
  return ctx ? ctx.data[name] : AccentObservable.objects[name];
};
const $set = (obj, prop, value) => {
  obj._set(prop, value);
};
const $get = (obj, prop) => {
  obj._get(prop);
};

// Accent DOM
const $context = AccentContext.from;
const $component = AccentComponent.from;
const $render = AccentRenderer._transpile;

AccentRenderer._render(); // Render page
