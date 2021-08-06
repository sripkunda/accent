(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      (global.Accent = global.Accent
        ? (() => {
            return Object.assign(global.Accent, factory());
          })()
        : factory()));
})(this, function () {
  "use strict";

  /**
   * Accent Components: Create and reuse HTML code with compartmentalization.
   */

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
      };
      if (node) return fill(node);
      const template = document.getElementsByTagName(this.id);
      for (const instance of template[Symbol.iterator]()) fill(instance);
    }

    /**
     * Recompiles all instances of every component
     */
    static $recompile(el) {
      AccentComponent.components.forEach((c) => {
        if (el) {
          el.querySelectorAll(c.id).forEach((element) => {
            c.$compile(element);
          });
        }
      });
    }
  }

  const Components = {
    compiler: {
      render() {
        document.addEventListener(
          `${_AccentComponentsConfig.EVENT_PREFIX}dom-ready`,
          () => {
            Components.setState("loaded", true);
          }
        );
        this.transpile(document.documentElement).then(async () => {
          document.dispatchEvent(_AccentComponentsEvents.DOM_READY);
        });
      },
      async transpile(element) {
        const elements = element.getElementsByTagName(
          _AccentComponentsConfig.COMPONENT_TAGNAME
        );
        for (const template of elements[Symbol.iterator]()) {
          template.style.display = "none";
          try {
            const id = template.getAttribute(`ref`);
            if (!id)
              throw Error(_AccentComponentsErrors.UNIDENTIFIED_TEMPLATE());
            const content =
              (await (async () => {
                const src = template.getAttribute("src");
                if (!src) return;
                return await fetch(
                  `//${window.location.host.replace(/\/$/, "")}/${src}`
                ).then(async (res) => {
                  const html = await res.text();
                  const content = new DOMParser().parseFromString(
                    html,
                    "text/html"
                  );
                  const template = content.querySelector(
                    _AccentComponentsConfig.COMPONENT_TAGNAME
                  );
                  return template
                    ? template.innerHTML
                    : content.body
                    ? content.body.innerHTML
                    : html;
                });
              })()) ?? template.innerHTML;
            AccentComponent.components.get(id)?.$compile() ??
              new AccentComponent(id, content);
          } catch (e) {
            console.warn(e);
          }
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

  const _AccentComponentsConfig = {
    EVENT_PREFIX: `components:`,
    HELPER_ATTRIBUTE_PREFIX:
      typeof RendererLibrary !== "undefined"
        ? `@`
        : Accent.AccentDirective.helperPrefix,
    COMPONENT_TAGNAME: "component",
  };

  /**
   * AccentTemplates events
   */
  const _AccentComponentsEvents = {
    DOM_READY: new Event(`${_AccentComponentsConfig.EVENT_PREFIX}dom-ready`),
  };

  /**
   * Potential errors for AccentTemplates
   */
  const _AccentComponentsErrors = {
    AccentLibraryName: `Accent.js Templates`,
    UNIDENTIFIED_TEMPLATE: () => {
      return `${_AccentComponentsErrors.AccentLibraryName}: All templates must have an id.`;
    },
    BASE_ERROR: (e) => {
      return `${_AccentComponentsErrors.AccentLibraryName}: ${e}`;
    },
  };

  Components.compiler.render();

  const $component = (...args) => {
    new AccentComponent(...args);
  };

  window.addEventListener("load", () => {
    if (typeof RendererLibrary !== "undefined") {
      new MutationObserver((mutationsList, observer) => {
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
      }).observe(document, {
        attributes: false,
        childList: true,
        subtree: true,
      });
    } else {
      Renderer.compiler.render();
    }
  });

  window.ComponentsLibrary = true;

  var components_accent = {
    AccentComponent,
    $component,
    Components,
  };

  return components_accent;
});
