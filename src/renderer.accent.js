"use strict";

/* --- Core Components --- */

class RendererChangeDetector {
  // Listens for changes to the DOM and reloads the necessary AccentComponents. 
  static MutationObserver = new MutationObserver((mutationsList, observer) => {
    if (!Renderer.state.loaded) return;
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          let n = node;
          while (n) {
            const directives = Object.keys(AccentDirective.directives)
              .map((d) => AccentDirective.prefix + d)
              .concat(n.attributes ? n.getAttributeNames() : []);
            const dupes = directives.filter(
              (value, index, self) => self.indexOf(value) !== index
            );
            if (dupes.length > 0) {
              dupes.forEach((directive, i) => {
                AccentDirective.exec(
                  directive.replaceAll(AccentDirective.prefix, ""),
                  n,
                  n.getAttribute(directive)
                );
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
        AccentDirective.exec(
          mutation.attributeName.replaceAll(AccentDirective.prefix, ""),
          n,
          n.getAttribute(mutation.attributeName)
        );
      }
    }
  }).observe(document, { attributes: true, childList: true, subtree: true });
}

/**
 * Class for Accent's reactive objects. 
 */
class AccentObservable extends Object {
  ObservableSubscribers = [];

  /**
   * Initialize a new AccentObservable
   * @param {Object} value - The value to initialize the observable from
   * @returns 
   */
  constructor(value) {
    super(value);
    for (const k in value) {
      this[k] = value[k];
    }
    const handler = () => {
      return {
        set: (target, prop, value) => {
          const areDifferent = (arr1, arr2) => {
            let different = true;
            const differences = [];
            const shorter = arr1.length - arr2.length <= 0 ? arr1 : arr2;
            const longer = arr1.length - arr2.length > 0 ? arr1 : arr2;

            longer.forEach((element, index) => {
              if (element !== shorter[index]) {
                different = true;
                differences.push({ index: index, value: arr2[index] });
              }
            });
            return {
              different: arr1.length != arr2.length && different,
              differences: differences,
            };
          };

          const getMutation = () => {
            return target.includes(undefined)
              ? undefined
              : [{ index: value, mutation: true }];
          };

          const isArray = Array.isArray(target[prop]) && Array.isArray(value);
          const arrayMutation = prop == "length";
          const diffs = isArray
            ? areDifferent(target[prop], value)
            : {
                different: true,
                differences: arrayMutation ? getMutation() : [],
              };

          if (!arrayMutation && (target[prop] == value || !diffs.different)) return true; // If there are no changes then return here

          target[prop] = value; // Set the value
          // Loop through observers and play the callbacks
          if (Renderer.state.reactive) {
            this.ObservableSubscribers.forEach(
              (subscriber, subscriberIndex, subscribers) => {
                if (subscriber.key == prop) {
                  subscriber?.instructions(
                    target[prop],
                    subscriber.data,
                    target,
                    prop,
                    subscriber,
                    subscriberIndex,
                    subscribers,
                    diffs?.differences
                  );
                }
                this.$clean(subscriber, subscriberIndex);
              }
            );
          }
          return true;
        },
        get: (obj, prop, receiver) => {
          return ["[object Object]", "[object Array]"].indexOf(
            Object.prototype.toString.call(obj[prop])
          ) > -1 && prop != "ObservableSubscribers"
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
   */
  $clean(subscriber, subscriberIndex) {
    const snip = (s, i) => {
      if (s.data?._AccentElement && !document.documentElement.contains(s.data._AccentElement))
      this.ObservableSubscribers.splice(i ?? this.ObservableSubscribers.indexOf(s), 1);
    }
    const clean = (s, i) => {
      console.log(s.key);
      if (typeof this[s.key] === 'object') {
        const subs = this[s.key].ObservableSubscribers;
        if (subs)
          subs.forEach((s, i) => {
            snip(s, i);
          });
      } else {
        snip(s, i);
      }
    }
    if (!subscriber) {
      this.ObservableSubscribers.forEach((s, i) => {
        clean(s, i); 
      })
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
    const obj = typeof this[key] === 'object' ? this[key] : this; 
    obj.ObservableSubscribers = obj.ObservableSubscribers || []; 
    obj.ObservableSubscribers.push({
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
      typeof element[prop] !== 'undefined'
          ? element[prop] = this[key]
          : element.setAttribute(prop, this[key]); // Change the property of the element accordingly
    }
    change();
    this.$subscribe(
      key,
      change,
      { _AccentElement: element }
    );
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

class AccentComponent {
  static components = new Map();
  id;
  template;
  scope = new AccentObservable({});
  instructions;

  constructor(scope, instructions) {
    this.scope = new AccentObservable(scope);
    this.instructions = instructions;
    if (instructions && typeof instructions === "function")
      instructions.call(scope, this);
  }
}

class AccentContext extends AccentComponent {
  static contexts = new Map();
  element;
  constructor(element, scope, instructions) {
    super(scope, instructions);
    this.element = element;
    AccentContext.contexts.set(element, this);
  }

  /**
   * Find the local context of an HTMLElement 
   * @param {HTMLElement} el - Element used as starting point for search. 
   * @returns 
   */
  static find(el) {
    while (el) {
      if (
        AccentContext.contexts.get(el) ||
        el.tagName == `${AccentDirective.prefix}context`
      )
        return AccentContext.contexts.get(el) || el;
      el = el.parentElement;
    }
  }

  /**
   * Get or create a new AccentContext
   * @param  {...any} args - The arguments to be passed to create or get the context. 
   * @returns 
   */
  static get(...args) {
    return (
      AccentContext.contexts.get(
        typeof args[0] === "object" ? args[0] : document.querySelector(args[0])
      ) ?? $new(AccentContext, ...args)
    ).scope;
  }
}

/* --- Directives --- */

class AccentDirective {
  static prefix = `ac-`;
  static helperPrefix = "@";
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

const _context = (el, data, instructions) => {
  data = typeof data === "string" ? Function(`return ${data}`)() : data;
  return new AccentContext(el, data, instructions);
};

const _ref = (el, value) => {
  const context = AccentContext.find(el); 
  context.scope[value] = el; 
}

const _bind = (el, observable, attribute) => {
  attribute = attribute ?? el.getAttribute(`${AccentDirective.helperPrefix}attr`) ?? "innerHTML";
  const attrs = attribute.split(_AccentRendererConfig.DUAL_SEPARATOR).map(a => a.trim());
  const context = AccentContext.find(el);
  attrs.forEach(a => {
    context.scope.$bind(el, a, observable);
  });
};

const _model = (el, observable) => {
  const context = AccentContext.find(el);
  if (context) context.scope.$model(el, "value", "oninput", observable);
};

// Events
const _on = (el, value, trigger) => {
  trigger = trigger || el.getAttribute(`${AccentDirective.helperPrefix}trigger`);
  el[trigger] = (e) => {
    e.preventDefault();
    Renderer.compiler._executeInContext(value, AccentContext.find(el) ?? {});
  };
};

const _click = (el, value) => {
  _on(el, value, "onclick");
};
const _submit = (el, value) => {
  _on(el, value, "onsubmit");
};

const _if = (el, value) => {
  return Renderer.compiler._executeInContext(
    `return ${value}`,
    AccentContext.find(el) ?? {}
  )
    ? (el.style.display = "auto")
    : (el.style.display = "none");
};

const _for = (el, value, iterator, iterable, template, subscribed) => {
  const acForContent = `${AccentDirective.prefix}for-content`;

  const sides = value.split(" in ").map((s) => {
    const side = s.trim().split(" ");
    return side[side.length - 1];
  });

  iterator = iterator ?? sides[0];
  iterable = iterable ?? sides[1];
  template = template ?? el.innerHTML;

  const iterate = async (el, iterator, iterable, template, context, diffs) => {
    const forVariables = {
      index: '$index',
      first: '$first',
      last: '$last', 
      even: '$even',
      iterable: '$iterable'
    }

    const fillGreedy = () => {
      el.innerHTML = "";
      const html = document.createDocumentFragment();
      object.forEach((value, i) => {
        const append = document.createElement(acForContent);
        append.innerHTML = Renderer.compiler._resolveInterpolation(
          template,
          AccentContext.find(el),
          [iterator, ...Object.values(forVariables)],
          [value, i, i == 0, i == object.length - 1, i % 2 == 0, object]
        );
        html.appendChild(append); 
      });
      el.append(html);
    };

    const fillLazy = () => {
      const nl = el.querySelectorAll(acForContent);
      if (nl.length < 1) return fillGreedy();
      const addedHTML = document.createDocumentFragment(); 
      diffs.forEach(async (diff) => {
        const length = diff.mutation;
        const index = length ? diff.index - 1 : diff.index;
        const objIndex = length ? index + 1 : index;
        const value = length ? object[index] : diff.value;
        if (typeof value === "undefined") {
           return nl[objIndex].remove();
        }
        const content = Renderer.compiler._resolveInterpolation(
          template,
          AccentContext.find(el),
          [iterator, ...Object.values(forVariables)],
          [value, index, index == 0, index == object.length - 1, index % 2 == 0, object]
        );
        nl[objIndex] ? (nl[objIndex].innerHTML = content) : (() => {
          const append = document.createElement(acForContent);
          append.innerHTML = content; 
          addedHTML.appendChild(append);
        })();
      });
      el.append(addedHTML);
    };

    const object = Renderer.compiler._executeInContext(
      `return ${iterable}`,
      context
    );
    diffs ? fillLazy() : fillGreedy();
  };

  const context = AccentContext.find(el);
  iterate(el, iterator, iterable, template, context);

  if (
    Renderer.compiler._bExpressionRefersToContext(iterable, context) &&
    !subscribed
  ) {
    const handler = async (...args) => {
      iterate(el, iterator, iterable, template, context, args[args.length - 1]);
    };

    const data = { _AccentElement: el }; 
    context.scope.$subscribe("length", handler, data);
    context.scope.$subscribe(iterable.replaceAll(/this\.?/g, ""), handler, data);
  }
};

/* --- Access Variables --- */

const $new = (object, ...args) => {
  return new object(...args);
};
const $component = (...args) => $new(AccentComponent, ...args);
const $context = AccentContext.get;
const $directive = (...args) => $new(AccentDirective, ...args);
const $observable = (...args) => $new(AccentObservable, ...args);

/* --- Data and Configuration --- */

const _AccentRendererConfig = {
  EVENT_PREFIX: `renderer:`,
  INTERPOLATION_TAG: `${AccentDirective.prefix.replace(/-/g, "")}`,
  DUAL_SEPARATOR: ",",
  CHILD_PARENT_SEPARATOR: ":"
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
  SUBSCRIPTION_KEY_NOT_FOUND: (...params) => {
    return `${_AccentRendererErrors.AccentLibraryName}: Could not subscribe to '${params[0]}'. Key was not found.`;
  },
  BASE_ERROR: (e) => {
    return `${_AccentRendererErrors.AccentLibraryName}: ${e}`;
  },
};

const Renderer = {
  directives: {
    context:
      (new AccentDirective("context", _context),
      (...args) => {
        AccentDirective.exec("context", ...args);
      }),
    ref:
      (new AccentDirective("ref", _ref),
      (...args) => {
        AccentDirective.exec("ref", ...args);
      }),
    bind:
      (new AccentDirective("bind", _bind),
      (...args) => {
        AccentDirective.exec("bind", ...args);
      }),
    model:
      (new AccentDirective("model", _model),
      (...args) => {
        AccentDirective.exec("model", ...args);
      }),
    on:
      (new AccentDirective("on", _on),
      (...args) => {
        AccentDirective.exec("on", ...args);
      }),
    click:
      (new AccentDirective("click", _click),
      (...args) => {
        AccentDirective.exec("click", ...args);
      }),
    submit:
      (new AccentDirective("submit", _submit),
      (...args) => {
        AccentDirective.exec("submit", ...args);
      }),
    if:
      (new AccentDirective("if", _if),
      (...args) => {
        AccentDirective.exec("if", ...args);
      }),
    for:
      (new AccentDirective("for", _for),
      (...args) => {
        AccentDirective.exec("for", ...args);
      }),
  },
  compiler: {
    render() {
      document.addEventListener(
        `${_AccentRendererConfig.EVENT_PREFIX}dom-ready`,
        () => {
          Renderer.setState("loaded", true);
        }
      );
      this.transpile(document.documentElement).then(async () => {
        document.dispatchEvent(_AccentRendererEvents.DOM_READY);
      });
    },
    async transpile(element) {
      if (Renderer.state.paused) return; // If the Renderer is paused, do not transpile.
      const directives = AccentDirective.directives;
      return await new Promise((res, rej) => {
        let iterated = 0;
        for (const directive in directives) {
          const selector = `${directives[directive].prefix}${directive}`;
          element.querySelectorAll(`[${selector}]`).forEach((el) => {
            AccentDirective.exec(directive, el, el.getAttribute(selector));
          });
          iterated++;
          if (iterated == Object.keys(directives).length) res();
        }
      })
        .then(async () => {
          this._resolveInterpolation(element);
          this.clean(AccentContext.contexts, "element"); 
          return true;
        })
        .catch((e) => {
          return false;
        });
    },
    clean(map, elementProp) {
      map.forEach(item => {
        if (!document.documentElement.contains(item[elementProp]))
          map.delete(item);
      });
    },
    _resolveInterpolation(content, context, argumentNames, argumentValues) {
      content =
        typeof content === "string"
          ? new DOMParser().parseFromString(content, "text/html")
          : content;
      content
        .querySelectorAll(_AccentRendererConfig.INTERPOLATION_TAG)
        .forEach((el) => {
          const template = el.innerHTML; 
          const set = (sub, dat) => {
            context = context || AccentContext.find(el);
            const compiledContent = Renderer.compiler._executeInContext(
              `return ${template}`,
              context,
              argumentNames,
              argumentValues
            );
            el.innerHTML = compiledContent ?? "";
          }
          set();
          const subscription = el.getAttribute(`${AccentDirective.helperPrefix}subscribe`)?.split(_AccentRendererConfig.DUAL_SEPARATOR).map(e => e.trim()); 
          if (subscription) {
            subscription.forEach(s => {
              const key = s.split(_AccentRendererConfig.CHILD_PARENT_SEPARATOR)[1];
              context.scope.$subscribe(key ?? s, set, { _AccentElement: el });
            });
          }
        });
      return content.body ? content.body.innerHTML : content.innerHTML;
    },
    _executeInContext(
      expression,
      context,
      argumentNames = [],
      argumentValues = []
    ) {
      return Function(...argumentNames, expression).call(
        context?.scope,
        ...argumentValues
      );
    },
    _bExpressionRefersToContext(exp, context) {
      // ¯\_(ツ)_/¯
      const objectInScope = exp.replace(/this\.?/g, "");
      return context && context.scope[objectInScope];
    }
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

Renderer.compiler.render();
