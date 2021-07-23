/**
 * Accent Templates: Create and reuse HTML code with reactive template-specific scopes.
 */

"use strict";

/* The class that controls and houses AccentTemplates. */
class AccentTemplate {
  static templates = new Map();
  id;
  template;

  constructor(id, temp) {
    this.id = id;
    this.template = temp;
    this.compile();
    AccentTemplate.templates.set(id, this);
  }

  /**
   * Compile a certain node in accordance with the template value
   * @param {HTMLElement} node - The node to compile
   */
  compile(node) {
    const fill = (instance) => {
      instance.innerHTML = this.template;
      // If there is an AccentContext, fill the data points.
      const data = instance.getAttribute(
        `${_AccentTemplatesConfig.HELPER_ATTRIBUTE_PREFIX}data`
      );
      if (typeof Renderer !== "undefined" && data) {
        _context(instance, data);
      }
    };
    if (node) return fill(node);

    const template = document.getElementsByTagName(this.id);
    for (const instance of template[Symbol.iterator]()) fill(instance);
  }
}

const Templates = {
  compiler: {
    render() {
      document.addEventListener(
        `${_AccentTemplatesConfig.EVENT_PREFIX}dom-ready`,
        () => {
          Templates.setState("loaded", true);
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
          `${_AccentTemplatesConfig.HELPER_ATTRIBUTE_PREFIX}id`
        );
        if (!id) throw Error(_AccentTemplatesErrors.UNIDENTIFIED_TEMPLATE());
        AccentTemplate.templates.get(id)?.compile() ??
          new AccentTemplate(id, template.innerHTML);
      }
    },
  },
  state: {
    loaded: false,
  },
  setState: (state, value) => {
    Templates.state[state] = value;
  },
};

/* --- Data and Configuration --- */

const _AccentTemplatesConfig = {
  EVENT_PREFIX: `templates:`,
  HELPER_ATTRIBUTE_PREFIX:
    typeof Renderer === "undefined" ? `@` : AccentDirective.helperPrefix,
  TEMPLATE_TAGNAME: "template",
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

Templates.compiler.render();

if (typeof Renderer === "undefined") {
  TemplateChangeDetector = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          let n = node;
          while (n) {
            const tagName = n.tagName?.toLowerCase();
            if (AccentTemplate.templates.has(tagName)) {
              AccentTemplate.templates.get(tagName).compile();
            }
            n = n.firstElementChild;
          }
        });
      }
    }
  }).observe(document, { attributes: false, childList: true, subtree: true });
}
