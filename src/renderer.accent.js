"use strict";

/* --- Core Components --- */

class RendererChangeDetector {
  static MutationObserver = new MutationObserver((mutationsList, observer) => {
    if (!Renderer.state.loaded) return;
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          let n = node;
          while (n) {
            const directives = Object.keys(AccentDirective.directives).map(d => AccentDirective.prefix + d).concat(n.attributes ? n.getAttributeNames() : []);
            let dupes = directives.filter((value, index, self) => self.indexOf(value) !== index);
            if (dupes.length > 0) {
              dupes.forEach((directive, i) => {
                AccentDirective.exec(directive.replaceAll(AccentDirective.prefix, ""), n, n.getAttribute(directive));
              });
            }
            n = n.firstElementChild;
          }
        });
      }
      else if (mutation.type === "attributes" && Object.keys(Renderer.directives).map(d => AccentDirective.prefix + d).includes(mutation.attributeName)) {
        AccentDirective.exec(mutation.attributeName.replaceAll(AccentDirective.prefix, ""), n, n.getAttribute(mutation.attributeName));
      }
    }
  }).observe(document, { attributes: true, childList: true, subtree: true });
}

class AccentObservable extends Object {
  ObservableSubscribers = [];

  constructor(value) {
    super(value);
    for (const k in value) {
      this[k] = value[k];
    }
    const handler = () => {
      return {
        set: (target, prop, value) => {
          target[prop] = value; // Set the value
          // Loop through observers and play the callbacks
          if (Renderer.state.reactive) {
            this.ObservableSubscribers.forEach((subscriber, subscriberIndex, subscribers) => {
              if (subscriber.key == prop) {
                subscriber?.instructions(target[prop], subscriber.data, subscriber, subscriberIndex, subscribers, target);
              }
              this.#cleanDeadSubscribers(subscriber, subscriberIndex);
            });
          }
          return true;
        },
        get: (obj, prop, receiver) => {
          return ['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(obj[prop])) > -1 && prop != "ObservableSubscribers" ? new Proxy(obj[prop], handler()) : obj[prop];
        }
      }
    }
    return new Proxy(this, handler());
  }

  #cleanDeadSubscribers(subscriber, subscriberIndex) {
    if (subscriber.data && !(document.documentElement.contains(subscriber.data?.AccentBindingElement))) {
      this.ObservableSubscribers.splice(subscriberIndex, 1);
    }
  }

  subscribe(key, instructions, dat) {
    this.ObservableSubscribers.push({ key: key, instructions: instructions, data: dat });
  }

  bind(element, prop, key) {
    this.subscribe(key, () => {
      element[prop] = this[key]; // Change the property of the element accordingly
    }, { AccentBindingElement: element });
    element[prop] = this[key];
  }

  model(element, prop, trigger, key) {
    this.bind(element, prop, key);
    element.addEventListener(trigger, () => {
      this[key] = element[prop];
    });
  }
}

class AccentComponent {
  static components = new Map();
  id;
  template;
  element;
  scope = new AccentObservable({});
  instructions;

  constructor(element, scope, instructions) {
    this.scope = new AccentObservable(scope);
    this.instructions = instructions;
    this.element = element;
    if (instructions && typeof instructions === 'function') instructions.call(scope, this);
    AccentComponent.components.set(element, this);
  }
}

class AccentContext extends AccentComponent {
  static contexts = new Map();

  constructor(element, scope, instructions) {
    super(element, scope, instructions);
    AccentContext.contexts.set(element, this);
  }

  static find(el) {
    while (el) {
      if (AccentContext.contexts.get(el) || el.tagName == `${AccentDirective.prefix}context`)
        return AccentContext.contexts.get(el) || el;
      el = el.parentElement;
    }
  }

  static get(...args) {
    return (AccentContext.contexts.get(typeof args[0] === 'object' ? args[0] : document.querySelector(args[0])) ?? $new(AccentContext, ...args)).scope;
  }

}

/* --- Directives --- */

class AccentDirective {
  static prefix = `ac-`;
  static directives = {};
  id;
  instructions;

  constructor(id, instructions) {
    this.id = id;
    this.instructions = instructions || (() => { });
    AccentDirective.directives[id] = this;
  }

  static exec(id, ...args) {
    AccentDirective.directives[id].instructions(...args);
  }
}

const _context = (el, data, instructions) => {
  data = typeof data === 'string' ? Function(`return ${data}`)() : data;
  return new AccentContext(el, data, instructions);
}

const _bind = (el, observable, attribute) => {
  const context = AccentContext.find(el);
  if (context)
    context.scope.bind(el, attribute || "innerHTML", observable);
}

const _model = (el, observable) => {
  const context = AccentContext.find(el);
  if (context)
    context.scope.model(el, "value", "input", observable);
}

// Events
const _on = (el, value, trigger) => {
  el[trigger] = (e) => {
    Renderer.compiler._executeInContext(value, AccentContext.find(el) ?? {});
  };
}

const _click = (el, value) => { _on(el, value, "onclick"); }
const _submit = (el, value) => { _on(el, value, "onsubmit"); }

const _if = (el, value) => {
  return Renderer.compiler._executeInContext(`return ${value}`, AccentContext.find(el) ?? {}) ? el.style.display = 'auto' : el.style.display = 'none';
}

const _for = (el, value, iterator, iterable, template, subscribed) => {
  const sides = value.split(" in ").map(s => {
    const side = s.trim().split(" ");
    return side[side.length - 1];
  });

  iterator = iterator ?? sides[0];
  iterable = iterable ?? sides[1];
  template = template ?? el.innerHTML;

  const ctx = AccentContext.find(el);
  if (Renderer.compiler._bExpressionRefersToContext(iterable, ctx) && !subscribed) {
    ctx.scope.subscribe("length", (val, data) => {
      _for(el, value, iterator, iterable, template, true);
    });
  }

  const object = Renderer.compiler._executeInContext(`return ${iterable}`, ctx);
  el.innerHTML = "";
  object.forEach((value, i) => {
    el.innerHTML += Renderer.compiler._resolveInterpolation(template, AccentContext.find(el), [iterator, "index"], [value, i]);
  });
}

/* --- Access Variables --- */

const $new = (object, ...args) => { return new object(...args); }
const $component = (...args) => $new(AccentComponent, ...args);
const $context = AccentContext.get;
const $directive = (...args) => $new(AccentDirective, ...args);
const $observable = (...args) => $new(AccentObservable, ...args);

/* --- Data and Configuration --- */

const _AccentRendererConfig = {
  EVENT_PREFIX: `renderer:`,
  INTERPOLATION_REGEXP: /{{(.+?)}}/gim
}

/**
 * AccentRenderer events
 */
const _AccentRendererEvents = {
  DOM_READY: new Event(`${_AccentRendererConfig.EVENT_PREFIX}dom-ready`)
}

/**
 * Potential errors for AccentRenderer
 */
const _AccentRendererErrors = {
  AccentLibraryName: `Accent.js Renderer`,
  BASE_ERROR: (e) => {
    return `${_AccentRendererErrors.AccentLibraryName}: ${e}`;
  }
}

const Renderer = {
  directives: {
    context: (new AccentDirective("context", _context), (...args) => { AccentDirective.exec("context", ...args) }),
    bind: (new AccentDirective("bind", _bind), (...args) => { AccentDirective.exec("bind", ...args) }),
    model: (new AccentDirective("model", _model), (...args) => { AccentDirective.exec("model", ...args) }),
    on: (new AccentDirective("on", _on), (...args) => { AccentDirective.exec("on", ...args) }),
    click: (new AccentDirective("click", _click), (...args) => { AccentDirective.exec("click", ...args) }),
    submit: (new AccentDirective("submit", _submit), (...args) => { AccentDirective.exec("submit", ...args) }),
    if: (new AccentDirective("if", _if), (...args) => { AccentDirective.exec("if", ...args) }),
    for: (new AccentDirective("for", _for), (...args) => { AccentDirective.exec("for", ...args) })
  },
  compiler: {
    render() {
      document.addEventListener(`${_AccentRendererConfig.EVENT_PREFIX}dom-ready`, () => {
        Renderer.setState("loaded", true);
      });
      Renderer.compiler.transpile(document.documentElement).then(async () => {
        document.dispatchEvent(_AccentRendererEvents.DOM_READY);
      });
    },
    async transpile(element) {
      if (Renderer.state.paused) return; // If the Renderer is paused, do not transpile.
      const directives = Renderer.directives;
      return await new Promise((res, rej) => {
        let iterated = 0;
        for (const directive in directives) {
          const selector = `${AccentDirective.prefix}${directive}`;
          element.querySelectorAll(`[${selector}]`).forEach(el => {
            directives[directive](el, el.getAttribute(selector));
          });
          iterated++;
          if (iterated == Object.keys(directives).length) res();
        }
      }).then(async () => {
        return true;
      }).catch((e) => {
        console.error(e);
        return false;
      });
    },
    _resolveInterpolation(content, context, argumentNames, argumentValues) {
      let out = content;
      let match;
      while (match = _AccentRendererConfig.INTERPOLATION_REGEXP.exec(content)) {
        const interpolation = match[1].trim();
        const compiledContent = Renderer.compiler._executeInContext(`return ${interpolation}`, context, argumentNames, argumentValues);
        const matchIndex =
          content == out
            ? match.index
            : match.index + (out.length - content.length); // Get the index of the match
        out = out.substr(0, matchIndex) + compiledContent + out.substr(matchIndex + match[0].length, out.length);
      }
      return out;
    },
    _executeInContext(expression, context, argumentNames = [], argumentValues = []) {
      return Function(...argumentNames, expression).call(context.scope, ...argumentValues);
    },
    _bExpressionRefersToContext(exp, context) {
      // ¯\_(ツ)_/¯
      const objectInScope = exp.replaceAll(/this\.?/g, "");
      return context && context.scope[objectInScope]; 
    }
  },
  state: {
    loaded: false,
    paused: false,
    reactive: true
  },
  setState: (state, value) => {
    Renderer.state[state] = value;
  }
};

Renderer.compiler.render();
