'use strict';

/** The AccentMarkup mutation and reactivity module that manages compilations of the page **/
class AccentDOMController {
  /**
   * The callback function that is called when the MutationObserver is triggered
   * @param {*} mutationsList - The list of mutations that have been made to the DOM
   */
  static observerCallback = (mutationsList) => {
    // Loop through the mutations list
    mutationsList.forEach((mutation) => {
      // If it is a child list change, then check if the attributes have a directive in them
      if (mutation.type == 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.attributes) {
            const bTranspile = (node) => {
              const attrs = node.getAttributeNames();
              const attrArray = Object.keys(AccentDirectives)
                  .map((e) => AccentMarkup.DIRECTIVE_PREFIX + e)
                  .concat(attrs);
              if (attrArray.some((val, i) => attrArray.indexOf(val) !== i)) {
                AccentMarkup._transpile(node.parentElement ?? node); // If so call transpile() on the parentElement (or the element itself, assuming that there is no parent element).
              }
            };
            bTranspile(node); // Run the bTranspile function to transpile the nodes
          }
        });
      } else if (mutation.type == 'attributes') {
        if (
          Object.keys(mutation.attributeName)
              .map((e) => AccentMarkup.DIRECTIVE_PREFIX + e)
              .includes(mutation.attributeName)
        ); // Check if the attribute is a directive
        AccentMarkup._transpile(
            mutation.target.parentElement ?? mutation.target,
        ); // If so then transpile()
      }
    });
  };

  static observer = new MutationObserver(AccentDOMController.observerCallback); // The static observer object

  /**
   * @constructor
   * @param {Object} opts - The options for the MutationObserver
   */
  constructor(opts) {
    AccentDOMController.observer.observe(document.body, opts); // Create a new observer with those options
  }

  /**
   * Find the local AccentContext of a given element
   * @param {*} el - The starting element for the local context search
   * @return {HTMLElement} - The element of the local context if found, undefined if there is no local context found
   */
  static findLocalContext(el) {
    // Loop through all of the elements while there is a parentElement
    while (el) {
      if (
        el
            .getAttributeNames()
            .includes(`${AccentMarkup.DIRECTIVE_PREFIX}context`) ||
        AccentContext.contexts.get(el)
      ) {
        return el; // Return the element if it contains an Accent context
      } else {
        el = el.parentElement; // Go to the next parentElement for the context
      }
    }
  }
}

/** AccentMarkup class that stores an elements with metadata and maintains an element cache **/
class AccentElement {
  static elements = new Map();
  element;
  data;

  /**
   * Initializes a new AccentElement
   * @constructor
   * @param {HTMLElement} el
   * @param {Object} [dat={}]
   */
  constructor(el, dat = {}) {
    this.element = el;
    this.data = dat; // Push dat if defined, otherwise make an element with an empty context
    AccentElement.elements.set(el, this);
  }

  /**
   * Execute a loop on an iterable and element for the executing AccentElement
   * @param {Object} iterator - The object that is to be iterated over
   * @param {string} iterable - The name of the "index" variable when iterated over
   */
  for(iterator, iterable) {
    const loop = this.data.loop.value; // Get the loop data
    if (!loop) return; // If the loop does not exist, then return
    const template = loop.template; // The stored template for the loop
    (iterator = iterator || loop.iterator),
    (iterable = iterable || loop.iterable); // Get the loop data
    this.element.innerHTML = '';
    if (!iterator || !Array.isArray(iterator)) return;
    iterator.forEach((prop, i) => {
      let out = template; // Create a variable for the HTML output of the element
      let temp; // Variable that stores the regex matches
      const regex = /{{(.*?)}}/g; // The regex that gets the {{ values }}
      // Loop through matches of the regex
      while ((temp = regex.exec(template)) !== null) {
        try {
          temp[1] = temp[1].replaceAll('this.', '').trim();
          const value = AccentMarkup._compile(
              temp[1],
              JSON.parse(
                  `{ "${iterable}": ${
                typeof prop == 'string' ? `"${prop}"` : prop
                  }, "index": ${i} }`,
              ),
              true,
          ); // Get the value of the variable
          const matchIndex =
            template == out ?
              temp.index :
              temp.index + (out.length - template.length); // Get the index of the match
          out =
            out.substr(0, matchIndex) +
            value +
            out.substr(matchIndex + temp[0].length, out.length); // Replace the {{value}} with the real value without disrupting the rest of the items
        } catch {
          throw Error(
              `Accent.js: An error occurred while executing the for loop.`,
          );
        }
      }
      this.element.innerHTML += out; // Add to the innerHTML
      AccentMarkup._transpile(this.element);
    });
  }

  /**
   * Creates a new AccentElement from an HTMLElement
   * @param {HTMLElement} el - The HTMLElement that will correspond to the created AccentElement
   * @return {AccentElement} - The newly created (or existing) AccentElement
   */
  static from(el) {
    return AccentElement.elements.get(el) ?? new AccentElement(el);
  }
}

/** AccentMarkup class that stores contexts and their corresponding data/bindings **/
class AccentContext extends AccentElement {
  static contexts = new Map();
  element;
  data;
  objects;
  callback;

  /**
   * Initializes a new AccentContext with the appropriate AccentObservables
   * @param {HTMLElement} el - The element that is being instantiated as the context scope
   * @param {Object} dat - The data that the context is storing
   * @param {Function} cb - The callback that is to be called when the context is initiated
   */
  constructor(el, dat, cb) {
    super(el);
    this.element = el;
    this.data = this.objects = {};
    if (dat) {
      Object.keys(dat).forEach((d, i) => {
        const obj = new AccentObservable(d, dat[d], true);
        this.data[d] = obj.proxy;
        this.objects[d] = obj;
      });
    }
    AccentContext.contexts.set(el, this);
    if (cb) {
      this.callback = cb;
      this.callback(this);
    }
  }

  /**
   * Set a certain parameter in the context scope
   * @param {string} prop - The property that is being set
   * @param {*} val - The value that is being assigned
   */
  set(prop, val) {
    if (val) {
      if (this.objects[prop]) {
        this.objects[prop].set(val);
      } else {
        this.objects[prop] = new AccentObservable(prop, val, true);
      }
    } else {
      AccentDirectives.context(this.element, prop);
    }
  }

  /**
   * Read a property from an AccentContext's scope
   * @param {string} prop - The property that is being read
   * @return {*} - The target value
   */
  get(prop) {
    return prop ?
      this.objects[prop].value :
      Object.keys(this.objects).map((o) => this.objects[o].value);
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
      AccentContext.contexts.get(AccentDOMController.findLocalContext(el)) ??
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
  bind(element, property, event, callback) {
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
        this.set(bind.el[bind.prop]);
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
  set(prop, value) {
    typeof value !== 'undefined' ?
      (this.value[prop] = value) :
      (this.value = prop); // Set the value of the AccentObservable
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
   * @return {string} - Current AccentObservableValue
   */
  get() {
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
          `Accent.js: Binding of element '${el}' cannot be found on object '${this.name}'`,
      );
    }

    // Remove the event listener for that element (assuming that it is a text box that it is bound to)
    el.removeEventListener(
        this.bindings[obj].event,
        this.bindings[obj].listener,
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
    if (typeof target !== 'object') {
      target = {
        ObservableValue: target,
        AccentObservableObject: true,
      };
    }
    const handler = {
      get: (obj, prop) => {
        return prop in obj ? obj[prop] : obj.value;
      },
      set: (target, prop, value) => {
        if (typeof value !== 'undefined' && typeof prop !== 'undefined') {
          if (target.AccentObservableObject && prop == 'ObservableValue') {
            object.set(value);
          } else prop ? object.set(prop, value) : object.set(value);
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
    const cg = AccentDOMController.findLocalContext(el);
    prop = prop || typeof el.value !== 'undefined' ? 'value' : 'innerHTML'; // Set value if value property exists, otherwise choose innerHTML
    let obj;
    if (cg) {
      const ctx = AccentContext.contexts.get(cg);
      if (ctx) {
        obj = ctx.objects[val]; // If there is a control grou p with that object, then set the value to that control group
      }
    }

    // If there is an event, two way bind, otherwise one way bind
    obj =
      obj ??
      AccentObservable.objects[val] ??
      (ev ? new AccentObservable(val, el[prop]) : null);
    if (!obj) throw Error(`Accent.js: '${val}' is not defined.`); // Throw an error if the object does not exist
    return obj.bind(el, prop, ev); // Create a binding to the object
  }
}

/**
 * All directives for accent and their functions
 */
const AccentDirectives = {
  // Find and ignore elements with ignore directive
  ignore: (el) => {
    const attr = `${AccentMarkup.DIRECTIVE_PREFIX}ignore`;
    if (el?.hasAttribute(attr)) {
      if (el.getAttribute(attr) == 'recursive') {
        while (el) {
          Array.from(el.children).forEach((c) => {
            c.setAttribute(attr, 'true');
          });
          el = el.firstElementChild;
        }
      }
      return true;
    }
    return false;
  },
  // Define context of an element
  context: (el, val) => {
    if (AccentDirectives.ignore(el) || AccentContext.contexts.get(el)) return;
    try {
      val =
        typeof val === 'object' ?
          val :
          JSON.parse(
              val.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '),
          ); // Fix the "bad" json
      new AccentContext(el, val); // Define a new element with data of object provided in the context group
    } catch {
      throw Error(
          `Accent.js: error while parsing object data of element ${el}. '${val}' is not a valid context.`,
      ); // Throw an error if the json cannot be parsed
    }
  },
  // Renders "template" html for each value in a given object
  for: (el, val, template) => {
    if (AccentDirectives.ignore(el)) {
      return;
    }
    const cg = AccentDOMController.findLocalContext(el); // Get the local context
    const args = val.split(' in ');
    const elem = AccentContext.contexts.get(cg); // Get the args and define the element
    if (!elem) {
      throw Error(
          `Accent.js: Local context could not be found for ${AccentMarkup.DIRECTIVE_PREFIX}for. ${AccentMarkup.DIRECTIVE_PREFIX}for elements must be localized to a context.`,
      );
    }
    const iterator = elem.data[args[1]]; // If element exists, then get the context value from it, otherwise get it by compiling.
    const loop = AccentElement.elements.get(el) ?
      AccentElement.elements.get(el) :
      new AccentElement(el, {
        loop: new AccentObservable(
            'loop',
            {
              template: template || el.innerHTML.trim(),
              iterable: args[0],
              iterator: iterator,
            },
            true,
        ),
      }); // Create a new accent element that stores the loop data
    const accentObject = elem.objects[args[1]];
    accentObject.bind(el, null, null, (element) => {
      const obj = AccentElement.elements.get(element);
      obj.element.innerHTML = obj.data.loop.value.template;
      AccentDirectives.for(element, val);
    }); // Bind the loop data so that changes in the object also refect in the for directive DOM element

    loop.for(); // Initiate the for loop
  },
  // Two-way binding of an element
  model: (el, val, prop) => {
    if (AccentDirectives.ignore(el)) return;
    AccentObservable.create(el, val, 'input', prop); // Two-way binding to global accent object
  },
  // One-way binding of an element
  bind: (el, val, prop) => {
    if (AccentDirectives.ignore(el)) return;
    AccentObservable.create(el, val, null, prop); // One-way binding to global AccentObservable
  },
  // Execute a code segment
  set: (el, val, prop) => {
    if (AccentDirectives.ignore(el)) return;
    const cg = AccentDOMController.findLocalContext(el);
    const context = AccentContext.contexts.get(cg);
    const params = context ? context.objects || {} : {};
    const cont = AccentMarkup._compile(val, params, true, true, el);
    el[prop] = cont ?? '';
  },
  // Set textContent with an expression
  text: (el, val) => {
    AccentDirectives.set(el, val, 'textContent');
  },
  // Set html with an expression
  html: (el, val) => {
    AccentDirectives.set(el, val, 'innerHTML');
  },
  // Set class with an expression
  class: (el, val) => {
    AccentDirectives.set(el, val, 'class');
  },
  // Set style with an expression
  style: (el, val) => {
    AccentDirectives.set(el, val, 'style');
  },
  // Reactive event handler (context-aware event handling)
  on: (el, val, ev) => {
    if (AccentDirectives.ignore(el)) return;
    const accentEl =
      AccentElement.elements.get(el) ??
      new AccentElement(el, {
        handler: (event) => {
          event.preventDefault();
          try {
            AccentMarkup._compile(
                val,
                AccentContext.contexts.get(
                    AccentDOMController.findLocalContext(el),
                ).objects,
                false,
                true,
            );
          } catch {
            throw Error(
                `Accent.js: An error occurred while executing ${AccentCore.DIRECTIVE_PREFIX}on. The local context could not be found.`,
            );
          }
        },
      });
    el.removeEventListener(ev, accentEl.data?.handler);
    el.addEventListener(ev, accentEl.data?.handler);
  },
  // Accent click event
  click: (el, val) => {
    AccentDirectives.on(el, val, 'click');
  },
  // Accent submit event
  submit: (el, val) => {
    AccentDirectives.on(el, val, 'submit');
  },
};

/** Public AccentMarkup Object **/
const AccentMarkup = {
  DIRECTIVE_PREFIX: 'ac-',
  _el: (sel, forceArr) => {
    const obj = document.querySelectorAll(sel);
    return obj.length <= 1 && !forceArr ? obj[0] : obj;
  },
  _render: () => {
    // Configure mutation observer on body
    new AccentDOMController({
      attributes: true,
      childList: true,
      subtree: true,
    });
    AccentMarkup._transpile(document).then((v) => {
      document.dispatchEvent(AccentMarkupEvents.DOM_READY);
    });
  },
  _transpile: async (el) => {
    el.dispatchEvent(AccentMarkupEvents.TRANSPILE_STARTED); // Dispatch event for start of transpilation
    new Promise((res, rej) => {
      // Loop through directives and find nodes that include them. Execute the directive for each of these elements.
      const directives = Object.keys(AccentDirectives);
      directives.forEach((di, i) => {
        const selector = `${AccentMarkup.DIRECTIVE_PREFIX}${di}`;
        const nodes = el.querySelectorAll(`[${selector}]`);
        nodes.forEach((node) => {
          AccentDirectives[di](node, node.getAttribute(selector));
        });
        // If the end of the directives list has been reached, end the transpilation process and dispatch the transpile ended event
        if (i + 1 == directives.length) res();
      });
    }).then((v) => {
      el.dispatchEvent(AccentMarkupEvents.TRANSPILE_ENDED);
    });
  },
  _compile: (arg, params, bReturn, bRaw, el) => {
    try {
      const args = {}; // Instantiate an empty object for the arguments
      Object.keys(params).forEach((p) => {
        const par = params[p]; // Reference the current element of params
        if (par instanceof AccentObservable) {
          // If the current element is an AccentObservable, then set args[p] to the value of that AccentObservable and bind the object to the current element
          args[p] = par.proxy;
          if (el) {
            par.bind(el, null, null, (elem) => {
              const cg = AccentDOMController.findLocalContext(elem);
              const context = cg ? AccentContext.contexts.get(cg) : undefined;
              if (context?.callback) {
                context.callback(context);
              }
              AccentMarkup._transpile(elem.parentElement ?? elem);
            });
          }
        } else {
          args[p] = par; // Otherwise keep par as is and push it to args[p]
        }
      }); // Loop through the params and add the values to the args array to exclude accent objects
      const exp = arg.replaceAll(/this./g, 'params.');
      return (
        AccentObservable.objects[arg] ?? // Return the requested AccentObservable if applicable
        AccentElement.elements.get(arg) ?? // Return the requested AccentElement if applicable
        (bRaw ?
          Function('params', `${bReturn ? 'return ' : ''}${exp};`)(args) : // Execute raw if specified
          Function(
              'params',
              `${
                bReturn ? 'return ' : ''
              }typeof ${exp} !== 'undefined' ? ${exp} : params['${exp}'];`,
          )(args))
      ); // Otherwise execute with awareness
    } catch {}
  },
};

/** Events for AccentMarkup **/
const AccentMarkupEvents = {
  TRANSPILE_STARTED: new Event('markup:transpile-started'),
  TRANSPILE_ENDED: new Event('markup:transpile-ended'),
  DOM_READY: new Event('markup:dom-ready'),
};

if (typeof $el === 'undefined') {
  var $el = AccentMarkup._el;
}

const $els = (sel) => {
  return AccentMarkup._el(sel, true);
};

// JavaScript access variables
const $for = AccentDirectives.for;
const $event = AccentDirectives.on;
const $attr = AccentDirectives.set;
const $subscribe = (el, obj, callback) => {
  obj.bind(el, null, null, callback);
};
const $model = AccentDirectives.model;

// Accent Objects
const $object = (name, ctx) => {
  return ctx ? ctx.objects[name] : AccentObservable.objects[name];
};
const $set = (obj, prop, value) => {
  obj.set(prop, value);
};
const $get = (obj, prop) => {
  obj.get(prop);
};

// Accent DOM
const $context = AccentContext.from;
const $element = AccentElement.from;
const $render = AccentMarkup._transpile;

AccentMarkup._render(); // Render page
