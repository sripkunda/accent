/**
 * Accent Renderer: The "core" functionality of a modern web framework with power for customizability and extendability.
 * Provides: Reactive "observables," configurable directives, built-in functionality for interacting with the HTML DOM efficiently, and execution of in-line JS logic.
 */

"use strict";

/* Class for Accent's reactive objects. */
class AccentObservable extends Object {
  __subscribers__ = [];

  /**
   * Initialize a new AccentObservable
   * @param {Object} value - The value to initialize the observable from
   * @return {Proxy} - The proxy that was created as a result of the AccentObservable
   */
  constructor(value) {
    super(value);
    Object.keys(value).forEach((k) => {
      this[k] = value[k];
    });
    const handler = () => {
      return {
        set: (target, prop, value) => {
          if (target[prop] == value && prop != "length") return true; // If there are no changes then return here

          target[prop] = value; // Set the value

          // Loop through observers and play the callbacks
          if (Renderer.state.reactive) {
            this.__subscribers__.forEach(
              (subscriber, subscriberIndex, subscribers) => {
                this.$clean(subscriber, subscriberIndex, target);
                if (subscriber.key == prop) {
                  subscriber?.instructions(target[prop], subscriber.data);
                }
              }
            );
          }
          return true;
        },
        get: (obj, prop, receiver) => {
          return ["[object Object]", "[object Array]"].indexOf(
            Object.prototype.toString.call(obj[prop])
          ) > -1 && prop != "__subscribers__"
            ? new Proxy(obj[prop], handler())
            : obj[prop];
        },
      };
    };
    return new Proxy(this, handler());
  }

  /**
   * Clean up element-bound subscribers with not-found element references.
   * @param {Object} subscriber - The subscriber to clean
   * @param {number} subscriberIndex - The index of the subscriber to clean
   * @param {(Object|Proxy|AccentObservable)} target - The observable object to clean.
   */
  $clean(subscriber, subscriberIndex, target) {
    const snip = (s, i) => {
      if (
        s.data?._AccentElement &&
        !document.documentElement.contains(s.data._AccentElement)
      )
        target.__subscribers__?.splice(i ?? this.__subscribers__.indexOf(s), 1);
    };
    const clean = (s, i) => {
      if (typeof target[s.key] === "object") {
        const subs = target[s.key].__subscribers__;
        if (subs)
          subs.forEach((s, i) => {
            snip(s, i);
          });
      } else {
        snip(s, i);
      }
    };
    if (!subscriber) {
      this.__subscribers__.forEach((s, i) => {
        clean(s, i);
      });
    } else {
      clean(subscriber, subscriberIndex);
    }
  }

  /**
   * Subscribe to updates on a specific key of an AccentObservable
   * @param {string} key - The key to subscribe to
   * @param {function} instructions - Function to be called whenever a change is observed.
   * @param {*} data - Custom data to be passed to the instructions
   */
  $subscribe(key, instructions, data) {
    this.__subscribers__.push({
      key: key,
      instructions: instructions,
      data: data,
    });
  }

  /**
   * One-way bind an element's property to a key in an AccentObservable
   * @param {HTMLElement} element - Element to bind to
   * @param {string} prop - The property of the element to bind to
   * @param {string} key - The key of the AccentObservable
   */
  $bind(element, prop, key) {
    const change = () => {
      typeof element[prop] !== "undefined"
        ? (element[prop] = this[key] || "")
        : element.setAttribute(prop, this[key] || ""); // Change the property of the element accordingly
    };
    change();
    this.$subscribe(key, change, { _AccentElement: element });
  }

  /**
   * Two-way bind an element's property to a key in an AccentObservable
   * @param {HTMLElement} element - Element to bind to
   * @param {string} prop - The property of the element to bind to
   * @param {string} trigger - The trigger event for a two-way binding
   * @param {string} key - The key of the AccentObservable
   */
  $model(element, prop, trigger, key) {
    this.$bind(element, prop, key);
    element[trigger] = () => {
      this[key] = element[prop];
    };
  }
}

// Defines the structure for a built-in Accent module.
class _AccentUnit {
  template;
  id;
  scope = new AccentObservable({});
  instructions;
  element;

  constructor(element, scope, id, template, instructions) {
    this.element = element;
    this.scope = new AccentObservable(scope);
    this.instructions = instructions;
    this.template = template;
    this.id = id;
    if (instructions && typeof instructions === "function")
      instructions.call(scope, this);
  }
}

// The AccentUnit that represents a context group
class AccentContext extends _AccentUnit {
  static contexts = new Map();

  constructor(element, scope, id, template, instructions) {
    super(element, scope, id, template, instructions);
    AccentContext.contexts.set(element, this);
  }

  /**
   * Find the local context of an HTMLElement
   * @param {HTMLElement} el - Element used as starting point for search.
   * @param {string} attr - The attribute of the element to search for
   * @return {(AccentContext|HTMLElement)} - The existing or uninstantiated AccentContext.
   */
  static find(el, attr) {
    if (typeof el === "string") {
      for (const item of AccentContext.contexts[Symbol.iterator]()) {
        const key = item[0];
        const value = item[1];
        if (value.id == el) {
          return AccentContext.contexts.get(key);
        }
      }
    }
    while (el) {
      if (
        AccentContext.contexts.get(el) ||
        el.hasAttribute(`${AccentDirective.prefix}context`)
      )
        return AccentContext.contexts.get(el) || el;
      el = el[attr || "parentElement"];
    }
  }

  /**
   * Get or create a new AccentContext
   * @param  {...any} args - The arguments to be passed to create or get the context
   * @return {AccentContext} - The newly created or found AccentContext
   */
  static get(...args) {
    return (AccentContext.find(args[0]) ?? $new(AccentContext, ...args)).scope;
  }
}

// The class for directives using Accent.
class AccentDirective {
  static prefix = `ac-`;
  static helperPrefix = "@";
  static bindingPrefix = ":";
  static eventPrefix = "*";
  static directives = {};
  prefix;
  id;
  instructions;

  constructor(id, instructions, prefix) {
    this.prefix = prefix ?? AccentDirective.prefix;
    this.id = id;
    this.instructions = instructions || (() => {});
    AccentDirective.directives[id] = this;
  }

  /**
   * Execute an AccentDirective
   * @param {*} id - The id of the directive
   * @param  {...any} args - The arguments to pass to the directive's instructions.
   */
  static exec(id, ...args) {
    AccentDirective.directives[id].instructions(...args);
  }
}

// A "replica" of an AccentContext, but differentiated for use as an iteration group
class AccentIterator extends _AccentUnit {
  static childNodeSelector = `${AccentDirective.prefix}for-child`;
  static iterators = new Map();

  constructor(element, context, key, indexVar, iteratorVar, template) {
    super(element, {
      context: context,
      key: key,
      indexVar: indexVar,
      iteratorVar: iteratorVar,
      template: template,
    });
    AccentIterator.iterators.set(element, this);
  }

  static _findInScope(el) {
    if (!el) return;
    let iterator;
    let currentFor = el.closest(AccentIterator.childNodeSelector);
    while (el) {
      if (AccentIterator.iterators.has(el)) {
        iterator = el;
        break;
      }
      el = el.parentElement;
    }
    if (!iterator) return;
    const it = AccentIterator.iterators.get(iterator);
    const data = it.scope;
    const index = Array.prototype.slice
      .call(it.element.children)
      .indexOf(currentFor);
    const ret = {};
    ret[data.indexVar || "index"] = index;
    ret[data.iteratorVar || "value"] = data.context.scope[data.key][index];
    return ret;
  }
}

/* Directive Execution Functions */

const _context = (el, data, instructions) => {
  if (!document.documentElement.contains(el) || AccentContext.contexts.has(el))
    return;
  const objectify = (o) => {
    try {
      return typeof o === "string"
      ? Renderer.compiler._executeInContext(
          `return ${o}`,
          AccentContext.find(el),
          [],
          [],
          el
        )
      : o;
    } catch (e) {
      throw _AccentRendererErrors.INVALID_CONTEXT();
    }
  };
  const extend = el.getAttribute(`${AccentDirective.helperPrefix}extends`);
  const extendContext = AccentContext.find(extend);
  const template = extend ? extendContext?.template : data;
  const dat = objectify(template);
  if (!dat) return;
  if (extend) Object.assign(dat, dat, objectify(data) || {});
  const id = el.getAttribute(`${AccentDirective.helperPrefix}id`);
  return new AccentContext(el, dat, id, template, instructions);
};

const _ref = (el, value) => {
  const context = AccentContext.find(el);
  context.scope[value] = el;
};

const _bind = (el, observable, attribute = "innerHTML") => {
  const attributes = Array.from(el.attributes);
  let attrs = {};
  attributes.forEach((a) => {
    const name = a.name;
    if (name.startsWith(AccentDirective.bindingPrefix))
      attrs[name.substr(1, a.length)] = a.value;
  });
  attrs =
    Object.keys(attrs).length > 0
      ? attrs
      : (() => {
          let o = {};
          o[attribute] = observable;
          return o;
        })();
  const context = AccentContext.find(el);
  if (!context) return;
  Object.keys(attrs).forEach((a) => {
    const o = attrs[a];
    context.scope.$bind(el, a, o.replace(/this\.?/g, ""));
  });
};

const _model = (el, observable) => {
  const context = AccentContext.find(el);
  if (context)
    context.scope.$model(
      el,
      "value",
      "oninput",
      observable.replace(/this\.?/g, "")
    );
};

// Events
const _on = (el, value, trigger) => {
  const attributes = Array.from(el.attributes);
  let attrs = {};
  attributes.forEach((a) => {
    const name = a.name;
    if (name.startsWith(AccentDirective.eventPrefix))
      attrs[name.substr(1, a.length)] = a.value;
  });
  attrs =
    Object.keys(attrs).length > 0
      ? attrs
      : (() => {
          let o = {};
          o[trigger] = value;
          return o;
        })();
  Object.keys(attrs).forEach((a) => {
    const handler = Renderer.compiler._executeInContext(
      `return (async () => { ${attrs[a]} });`,
      AccentContext.find(el) ?? {},
      [],
      [],
      el
    );
    el[a] = handler;
  });
};

const _click = (el, value) => {
  _on(el, value, "onclick");
};

const _submit = (el, value) => {
  _on(el, value, "onsubmit");
};

const _if = (el, value) => {
  const context = AccentContext.find(el);
  const change = () => {
    Renderer.compiler._executeInContext(
      `return ${value}`,
      context ?? {},
      [],
      [],
      el
    )
      ? (el.style.display = "")
      : (el.style.display = "none");
  };
  change();
  if (context) Renderer.compiler._resolveSubscriptions(el, context, change);
};

const _show = (el, value) => {
  const context = AccentContext.find(el);
  const show = context?.scope[value];
  context.$subscribe("show", (key) => {
    key ? (el.style.display = "") : (el.style.display = "none");
  });
};

const _for = (el, value, iterator, iterable, template, indexVar = "index") => {
  const sides = value.split(" in ").map((s) => {
    const side = s.trim().split(" ");
    return side[side.length - 1];
  });

  const elems = _AccentRendererConfig.FOR_SYNTAX.exec(value);

  if (!elems) {
    iterator = iterator ?? sides[0];
    iterable = iterable ?? sides[1];
  } else {
    iterator = elems[2].trim();
    iterable = elems[5].trim();
    indexVar = elems[3].trim();
  }

  _AccentRendererConfig.FOR_SYNTAX.lastIndex = 0; // Reset pointer

  template = template ?? el.innerHTML;

  let previousObjectSnapshot = [];
  const evalFunc = Function(`return ${iterable}`);

  const iterate = async (el, iterator, iterable, template, context) => {
    const fillGreedy = () => {
      el.innerHTML = "";
      if (!object) return;

      const frag = document.createDocumentFragment();

      iterableObject.forEach((value, i) => {
        const append = document.createElement(AccentIterator.childNodeSelector);
        append.innerHTML = Renderer.compiler._resolveInterpolation(
          template,
          context,
          [iterator, indexVar],
          [value, i]
        );
        frag.appendChild(append);
      });
      el.append(frag);
    };
    const fillLazy = () => {
      const areEqual = (a, b) => {
        if (!(typeof a === "object" && typeof b === "object")) return false;
        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
          return false;
        }
        for (let propName of aProps) {
          if (a[propName] !== b[propName]) {
            return false;
          }
        }
        return true;
      };

      const nl = el.getElementsByTagName(AccentIterator.childNodeSelector);
      if (nl.length < 1) return fillGreedy();
      const frag = document.createDocumentFragment();

      const shorter =
        object.length - previousObjectSnapshot.length <= 0
          ? iterableObject
          : previousObjectSnapshot;
      const longer =
        object.length - previousObjectSnapshot.length > 0
          ? iterableObject
          : previousObjectSnapshot;

      let lengthOffset = 0;
      if (!longer.length || longer.length < 1) return fillGreedy();

      longer.every((element, index) => {
        if (element != shorter[index] && !areEqual(element, shorter[index])) {
          const objIndex = index + lengthOffset;
          if (typeof object[index] === "undefined") {
            lengthOffset--;
            fillGreedy();
            return false;
          }
          const content = Renderer.compiler._resolveInterpolation(
            template,
            AccentContext.find(el),
            [iterator, indexVar],
            [element, index]
          );
          nl[objIndex]
            ? (nl[objIndex].innerHTML = content)
            : (() => {
                lengthOffset++;
                const append = document.createElement(
                  AccentIterator.childNodeSelector
                );
                append.innerHTML = content;
                frag.appendChild(append);
              })();
        }
        return true;
      });
      el.appendChild(frag);
    };

    const object = evalFunc.call(context?.scope ?? {});

    const iterableObject = Array.isArray(object)
      ? object
      : typeof object === "object"
      ? Object.keys(object)
      : Array.from(object);

    fillLazy();
    previousObjectSnapshot = Object.assign([], iterableObject);
    Renderer.compiler.transpile(el);
  };

  const context = AccentContext.find(el);
  iterate(el, iterator, iterable, template, context);

  const handler = async (...args) => {
    iterate(el, iterator, iterable, template, context);
  };

  const data = { _AccentElement: el };
  if (Renderer.compiler._bExpressionRefersToContext(iterable, context)) {
    const it = iterable.replaceAll(/this\.?/g, "");
    context.scope.$subscribe("length", handler, data);
    context.scope.$subscribe(it, handler, data);
    return new AccentIterator(el, context, it, indexVar, iterator, template);
  }

  Renderer.compiler._resolveSubscriptions(el, context, handler);
};

/* --- Access Variables --- */

const $new = (Obj, ...args) => {
  if (args.length < 1) return Obj;
  return new Obj(...args);
};
const $context = AccentContext.get;
const $ctx = $context;
const $directive = (...args) => $new(AccentDirective, ...args);
const $observable = (...args) => $new(AccentObservable, ...args);

/* --- Data and Configuration --- */

const _AccentRendererConfig = {
  EVENT_PREFIX: `renderer:`,
  INTERPOLATION_TAG: `${AccentDirective.prefix.replace(/-/g, "")}`,
  DUAL_SEPARATOR: ",",
  CHILD_PARENT_SEPARATOR: ":",
  FOR_SYNTAX: /^(let|const|var)? ?\(?(.+?), ?(.+?)?\)? (of|in) (.+?)$/g,
  INTERPOLATION_COMPLETED_FLAG: `ac-loaded`,
};

/**
 * AccentRenderer events
 */
const _AccentRendererEvents = {
  DOM_READY: new Event(`${_AccentRendererConfig.EVENT_PREFIX}dom-ready`),
};

/**
 * Potential errors for AccentRenderer
 */
  const _AccentRendererErrors = {
  AccentLibraryName: `Accent.js Renderer`,
  EXECUTION_ERROR: (...params) => {
    return `${_AccentRendererErrors.AccentLibraryName}: An error ocurred while resolving expression: \`${params[0]}\`. Verify syntax and retry.`;
  },
  INVALID_CONTEXT: (...params) => {
    return `${_AccentRendererErrors.AccentLibraryName}: Provided context is invalid. Verify syntax and retry.`;
  },
  BASE_ERROR: (e) => {
    return `${_AccentRendererErrors.AccentLibraryName}: ${e}`;
  },
};

const Renderer = {
  directives: {
    context: new AccentDirective("context", _context),
    ref: new AccentDirective("ref", _ref),
    bind: new AccentDirective("bind", _bind),
    model: new AccentDirective("model", _model),
    if: new AccentDirective("if", _if),
    show: new AccentDirective("show", _show),
    for: new AccentDirective("for", _for),
    on: new AccentDirective("on", _on),
    click: new AccentDirective("click", _click),
    submit: new AccentDirective("submit", _submit),
  },
  compiler: {
    render() {
      document.addEventListener(
        `${_AccentRendererConfig.EVENT_PREFIX}dom-ready`,
        () => {
          Renderer.setState("loaded");
        }
      );
      this.transpile(document.documentElement, true).then(async () => {
        document.dispatchEvent(_AccentRendererEvents.DOM_READY);
      });
    },
    async transpile(element) {
      if (Renderer.state.paused) return; // If the Renderer is paused, do not transpile.
      const directives = AccentDirective.directives;
      return await new Promise((res, rej) => {
        let iterated = 0;
        Object.keys(directives).forEach((directive) => {
          const selector = `${directives[directive].prefix}${directive}`;
          element.querySelectorAll(`[${selector}]`).forEach((el) => {
            AccentDirective.exec(directive, el, el.getAttribute(selector));
          });
          iterated++;
          if (iterated == Object.keys(directives).length) res();
        });
      })
        .then(async () => {
          this._resolveInterpolation(
            element,
            undefined,
            [],
            [],
            undefined,
            (el) => !AccentIterator._findInScope(el) && !el.closest("component")
            // Ignore iterable units and components
          );
          this.clean(AccentContext.contexts, "element");
          return true;
        })
        .catch((e) => {
          console.error(e);
          return false;
        });
    },
    clean(map, elementProp) {
      map.forEach((item) => {
        if (!document.documentElement.contains(item[elementProp]))
          map.delete(item[elementProp]);
      });
    },
    _resolveInterpolation(
      content,
      context,
      argumentNames,
      argumentValues,
      scopeElement,
      ignoreFunction
    ) {
      content =
        typeof content === "string"
          ? (() => {
              const el = document.createElement("span");
              el.innerHTML = content;
              return el;
            })()
          : content;
      content
        .querySelectorAll(
          `${_AccentRendererConfig.INTERPOLATION_TAG}, [${_AccentRendererConfig.INTERPOLATION_TAG}]`
        )
        .forEach((el) => {
          if (typeof ignoreFunction === "function" && !ignoreFunction(el))
            return;
          const template = el.innerHTML;
          const set = (sub, dat) => {
            context = context || AccentContext.find(el);
            const compiledContent = Renderer.compiler._executeInContext(
              `return ${template}`,
              context,
              argumentNames,
              argumentValues,
              scopeElement
            );
            el.innerHTML = compiledContent ?? "";
          };
          set();
          !this._resolveSubscriptions(el, context, set);
        });
      return content.body ? content.body.innerHTML : content.innerHTML;
    },
    _resolveSubscriptions(el, context, handler) {
      const subscription = el
        .getAttribute(`${AccentDirective.helperPrefix}subscribe`)
        ?.split(_AccentRendererConfig.DUAL_SEPARATOR)
        .map((e) => e.trim());
      if (subscription) {
        subscription.forEach((s) => {
          const key = s.split(_AccentRendererConfig.CHILD_PARENT_SEPARATOR)[1];
          context.scope.$subscribe(key ?? s, handler, { _AccentElement: el });
        });
        return true;
      }
      return false;
    },
    _executeInContext(
      expression,
      context,
      argumentNames = [],
      argumentValues = [],
      element
    ) {
      // Sanitize and decode expression
      expression = (() => {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = expression;
        return textArea.value;
      })()
        .trim()
        .replace(/\r?\n|\r/g, " ")
        .replace(/\s\s+/g, " ");
      // Execute and return the value
      const forGroup = AccentIterator._findInScope(element);
      if (forGroup) {
        argumentNames.push(...Object.keys(forGroup));
        argumentValues.push(...Object.values(forGroup));
      }
      try {
        return Function(...argumentNames, expression).call(
          context?.scope,
          ...argumentValues
        );
      } catch (e) {
        throw _AccentRendererErrors.EXECUTION_ERROR(expression);
      }
    },
    _bExpressionRefersToContext(exp, context) {
      // ¯\_(ツ)_/¯
      const objectInScope = exp.replace(/this\.?/g, "");
      return context && typeof context.scope[objectInScope] !== "undefined";
    },
  },
  state: {
    loaded: false,
    paused: false,
    reactive: true,
  },
  setState: (state, value) => {
    Renderer.state[state] = value;
  },
};

window.addEventListener("load", () => {
  if (typeof ComponentsLibrary !== "undefined") {
    Renderer.compiler.render();
  }
});

// Detects and renders changes in the DOM automatically
class RendererChangeDetector {
  // Listens for changes to the DOM and reloads the necessary AccentUnits.
  static MutationObserver = new MutationObserver((mutationsList, observer) => {
    const transpile = (node, directive) => {
      AccentDirective.exec(
        directive.replaceAll(AccentDirective.prefix, ""),
        node,
        node.getAttribute(directive)
      );
    };

    if (!Renderer.state.loaded) return;
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          let n = node;
          while (n) {
            const directives = Object.keys(AccentDirective.directives).map(
              (d) => AccentDirective.prefix + d
            );
            directives.push(...(n.attributes ? n.getAttributeNames() : []));
            const dupes = directives.filter(
              (value, index, self) => self.indexOf(value) !== index
            );

            if (dupes.length > 0) {
              dupes.forEach((directive, i) => {
                transpile(n, directive);
              });
            }
            n = n.firstElementChild;
          }
        });
      } else if (
        mutation.type === "attributes" &&
        Object.keys(Renderer.directives)
          .map((d) => AccentDirective.prefix + d)
          .includes(mutation.attributeName)
      ) {
        transpile(n, directive);
      }
    }
  }).observe(document, { attributes: true, childList: true, subtree: true });
}

window.RendererLibrary = true;

export default {
  RendererChangeDetector,
  AccentObservable,
  AccentContext,
  AccentDirective,
  AccentIterator,
  $context,
  $ctx,
  $directive,
  $observable,
  Renderer,
};
