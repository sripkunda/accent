/**
 * Accent Components: Create and reuse HTML code with compartmentalization.
 */

"use strict";

/* The class that controls and houses AccentTemplates. */
class AccentComponent {
  static components = new Map();
  id;
  template;

  constructor(id, temp) {
    this.id = id;
    this.template = temp;
    this.$compile();
    AccentComponent.components.set(id, this);
  }

  /**
   * Compile a certain node in accordance with the template value
   * @param {HTMLElement} node - The node to compile
   */
  async $compile(node, data) {
    const fill = (instance) => {
      instance.innerHTML = this.template;
      // If there is an AccentContext, fill the data points.
      const dat = data || instance.getAttribute(`data`);
      if (typeof Renderer !== "undefined" && dat) {
        AccentContext.contexts.has(instance) && data ? (() => {
          const scope = AccentContext.contexts.get(instance).scope; 
          Object.keys(data).forEach((key) => {
            const val = data[key];
            scope[key] = val;
          });
        })() : _context(instance, dat); 
        Renderer.compiler.transpile(instance);
      }
    };
    if (node) return fill(node);
    const template = document.getElementsByTagName(this.id);
    for (const instance of template[Symbol.iterator]()) fill(instance);
  }
}

const Components = {
  compiler: {
    render() {
      document.addEventListener(
        `${_AccentTemplatesConfig.EVENT_PREFIX}dom-ready`,
        () => {
          Components.setState("loaded", true);
        }
      );
      this.transpile(document.documentElement).then(async () => {
        document.dispatchEvent(_AccentTemplatesEvents.DOM_READY);
      });
    },
    async transpile(element) {
      for (const template of element
        .getElementsByTagName(_AccentTemplatesConfig.TEMPLATE_TAGNAME)
        [Symbol.iterator]()) {
        template.style.display = "none";
        const id = template.getAttribute(
          `ref`
        );
        if (!id) throw Error(_AccentTemplatesErrors.UNIDENTIFIED_TEMPLATE());
        const content = await (async () => {
          const src = template.getAttribute("src");
          if (!src)
            return;
          return await fetch(`//${window.location.host.replace(/\/$/, "")}/${src}`).then(async (res) => {
            const html = await res.text();
            const content = new DOMParser().parseFromString(html, 'text/html');
            const template = content.querySelector(_AccentTemplatesConfig.TEMPLATE_TAGNAME);
            return template ? template.innerHTML : (content.body ? content.body.innerHTML : html);
          });
        })() ?? template.innerHTML; 
        AccentComponent.components.get(id)?.compile() ?? new AccentComponent(id, content);
      }
    },
  },
  state: {
    loaded: false,
  },
  setState: (state, value) => {
    Components.state[state] = value;
  },
};

/* --- Data and Configuration --- */

const _AccentTemplatesConfig = {
  EVENT_PREFIX: `components:`,
  HELPER_ATTRIBUTE_PREFIX:
    typeof Renderer === "undefined" ? `@` : AccentDirective.helperPrefix,
  TEMPLATE_TAGNAME: "component",
};

/**
 * AccentTemplates events
 */
const _AccentTemplatesEvents = {
  DOM_READY: new Event(`${_AccentTemplatesConfig.EVENT_PREFIX}dom-ready`),
};

/**
 * Potential errors for AccentTemplates
 */
const _AccentTemplatesErrors = {
  AccentLibraryName: `Accent.js Templates`,
  UNIDENTIFIED_TEMPLATE: () => {
    return `${_AccentTemplatesErrors.AccentLibraryName}: All templates must have an id.`;
  },
  BASE_ERROR: (e) => {
    return `${_AccentTemplatesErrors.AccentLibraryName}: ${e}`;
  },
};

Components.compiler.render();

if (typeof Renderer === "undefined") {
  ComponentChangeDetector = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          let n = node;
          while (n) {
            const tagName = n.tagName?.toLowerCase();
            if (AccentComponent.components.has(tagName)) {
              AccentComponent.components.get(tagName).compile();
            }
            n = n.firstElementChild;
          }
        });
      }
    }
  }).observe(document, { attributes: false, childList: true, subtree: true });
}

const $component = (...args) => { new AccentComponent(...args); }; 
