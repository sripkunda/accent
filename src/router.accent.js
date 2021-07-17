"use strict";

/** Class that represents the AccentRouter **/
class Router {
  static app = undefined;
  routes; // The routes that are to be stored
  currentRoute; // The current route of the system
  defaultPane; // The default pane for this router
  #routerCache = {}; // The cached pages that the router loads

  params = {}; // The dynamic link data from the router

  /**
   *
   * @constructor
   * @param {(Object|string)} routes - The list of routes that the router will store
   * @param {Object} args - The options/arguments for the router
   */
  constructor(routes, args = {}) {
    if (Router.app) throw Error(_AccentRouterErrors.ROUTER_ALREADY_RUNNING());
    const pane = args.pane;
    const async = args.loadPagesAsync;

    // Asynchronously execute code to use await in context
    (async () => {
      // Find routes
      this.routes =
        typeof routes === "object"
          ? routes
          : await Router.#fetch(routes, "json").then((routes) => {
              document.dispatchEvent(_AccentRouterEvents.ROUTES_RECOGNIZED); // After routes are recognized,
              return routes; // Return the routes to assign the value
            });
      this.defaultPane = pane; // Assign the default pane for this router
      await Router.route(this, location.pathname, true, pane); // Route to the new path based on the pathname
      this.#beginNavigation(); // Start the navigation (popstate event)

      // Load pages in the background to the router cache
      if (!(async == false)) {
        this.#cachePagesAsync().then((v) => {
          document.dispatchEvent(v); // Dispatch the event for caching all of the pages asynchronously
        });
      }

      document.dispatchEvent(_AccentRouterEvents.ROUTER_INIT);
    })();
    Router.app = this;
  }

  /**
   * Add a popstate listener for browser forward and back to ensure that routing is being used.
   */
  async #beginNavigation() {
    window.addEventListener("popstate", (event) => {
      Router.route(this, window.location.pathname, true);
    });
  }

  /**
   * Caches the pages on the routes in the background as the page loads.
   */
  async #cachePagesAsync() {
    return await new Promise((res, rej) => {
      const routes = Object.keys(this.routes);
      routes.forEach(async (r, i) => {
        if (
          this.routes[r].load == _AccentRouteLoadTypes.LOAD_LAZY ||
          this.routes[r].load == _AccentRouteLoadTypes.LOAD_UNCACHED
        )
          return;
        this.#routerCache[r] = {
          name: r,
          html: await this.#fetchPageAsync(r),
        };
        if (routes.length == i + 1)
          res(_AccentRouterEvents.ROUTES_LOADED_ASYNC);
      });
    }).then((v) => {
      return v;
    });
  }

  /**
   * Loads content for a specific route onto a given pane.
   * @param  {string} destination
   * @param  {boolean} isRoot
   * @param  {Object} parameters
   * @param  {HTMLElement} targetPane
   */
  async fillPane(destination, isRoot, parameters, targetPane) {
    // Get the routing information
    targetPane =
      targetPane ||
      document.querySelector(`${_AccentRouterConfig.ROUTER_PANE_TAGNAME}`) ||
      document.documentElement; // Get the pane to insert elements onto
    this.defaultPane = targetPane;
    const cache = this.#routerCache
      ? this.#routerCache[destination]
      : undefined; // Get document data from routerCache
    const route = cache?.html
      ? cache
      : await this.#fetchPage(destination ?? this.routes); // Get the page data for the destination
    const doc = new DOMParser().parseFromString(route.html, "text/html"); // Parse the document data as HTML

    // Get the final path that needs to be pushed to the history
    let path = Array.isArray(this.routes[route.name]["path"])
      ? this.routes[route.name]["path"][0] // If the path is an array, then get the 0th element of the paths array
      : this.routes[route.name]["path"]; // Otherwise, get the path normally

    // Replace all instances of ':param' in the path with the appropriate parameter.
    path = path.replace(_AccentRouterConfig.ROUTER_DYNAMIC_LINK, (_a, b) => {
      return `${parameters ? (parameters[b] ? `${parameters[b]}/` : "") : ""}`;
    });

    this.params = parameters || {}; // Set the routing parameters for this route.

    // Replace browser state
    const content = { content: "", title: doc.title }; // The content of the history state
    isRoot
      ? window.history.replaceState(content, doc.title, path)
      : window.history.pushState(content, doc.title, path); // Replace browser history with the new state

    if (doc.title) document.title = doc.title;

    // Append the innerHTML
    targetPane.innerHTML = ""; // Clear the existing page content of the pane

    // Find the content to append on the document
    const toAppend =
      targetPane == document.documentElement
        ? doc.documentElement
        : doc.querySelector(`${_AccentRouterConfig.ROUTER_TARGET_TAGNAME}`);

    // If the target cannot be found, then throw an error
    if (!toAppend) {
      throw _AccentRouterErrors.TARGET_NOT_FOUND(route.name);
    }

    // Configuration for protected routes
    const prot = toAppend.getAttribute(
      _AccentRouterConfig.ROUTER_PROTECT_DIRECTIVE
    );
    const fallback = toAppend.getAttribute(
      _AccentRouterConfig.ROUTER_FALLBACK_DIRECTIVE
    );

    // If this route is protected and a required parameter is missing, route to the fallback
    if (prot && (!this.params || !this.params[prot])) {
      if (fallback) return Router.route(this, fallback);
      else throw _AccentRouterErrors.UNPROTECTED_ROUTE(route.name);
    }

    targetPane.append(toAppend);

    // Execute javascript, load css, configure routing links
    doc
      .querySelectorAll("link[rel=stylesheet], style")
      .forEach((s) => targetPane.append(s));
    this.currentRoute = route.name; // Change the current route for developers to use
    this.#executeScripts(doc, route.name); // Execute javascript on the doc before adding it to the pane (make sure that external script tags are captured)
    this.#executeScripts(targetPane, route.name); // Execute javascript on the pane
    this.#configureRoutingLinks(); // Detect routing links and add appropriate event listeners

    // If the AccentRenderer module is attached, transpile the page again to account for the changes
    if (typeof Renderer !== "undefined") {
      Renderer.compiler.transpile(targetPane);
    }
    return;
  }

  /**
   * @param  {(Object|string)} routes - The route(s) that are to be fetched
   */
  async #fetchPage(routes) {
    // Create a new promise, wait for it to finished, and return the result
    return await new Promise((res, rej) => {
      // If routes is an object, then loop through it and find the entry point.
      if (typeof routes === "object") {
        Object.keys(routes).forEach(async (route, i) => {
          const path = routes[route]["path"];
          // Look for '/' in the path to determine if it is the entry point
          if (path == "/" || (Array.isArray(path) && path.includes("/"))) {
            res(route);
          } // Resolve the promise as soon as the entry point is found
        });
        res(); // Resolve the promise if the '/' was not found
      } else {
        res(routes); // If routes is a certain destination, then resolve the promise
      }
    }).then(async (data) => {
      if (!data) data = Object.keys(this.routes)[0]; // If the destination is still undefined, take the first route given as the entry point.
      const json = {
        name: data,
        html: await this.#fetchPageAsync(data),
      };
      if (!(this.routes[data].load == _AccentRouteLoadTypes.LOAD_UNCACHED))
        this.#routerCache[data] = json; // Update the routerCache with the newly fetched page.
      return json; // Return the routerCache for this route
    });
  }

  /**
   * Returns the HTML content of the 'src' for a specified route
   * @param  {string} route - The route that is being fetched
   */
  async #fetchPageAsync(route) {
    try {
      const path = this.#formatPath(`${this.routes[route]["src"]}`); // Get the formatted path from the route
      return await Router.#fetch(path, "html"); // Return the HTML
    } catch {
      throw _AccentRouterErrors.SOURCE_NOT_FOUND(route);
    }
  }

  /**
   * Executes scripts on a specified document and route
   * @param  {Document} doc - The document where the scripts are
   * @param  {string} route - The route that is being executed from (to load from routerCache if possible)
   */
  async #executeScripts(doc, route) {
    doc.querySelectorAll("script").forEach(async (el) => {
      const src = el.getAttribute("src");
      const path = src ? this.#formatPath(src) : undefined;
      try {
        let content;
        if (path?.trim()) {
          content =
            this.#routerCache[route][path] ??
            (await (await fetch(path)).text());
          if (!(this.routes[route].load == _AccentRouteLoadTypes.LOAD_UNCACHED))
            this.#routerCache[route][path] = content;
        } else {
          content = el.innerHTML;
        }
        if (content) Function(content)();
      } catch (err) {
        throw _AccentRouterErrors.BASE_ERROR(
          `${path || this.routes[route]["src"]}: ${err}`
        );
      }
    });
  }

  /**
   * Adds onclick events to links identified as routerLinks
   */
  #configureRoutingLinks() {
    // Loop through the router links using the router link directive
    document
      .querySelectorAll(`[${_AccentRouterConfig.ROUTER_LINK_DIRECTIVE}]`)
      .forEach((el) => {
        const href = el.getAttribute(
          `${_AccentRouterConfig.ROUTER_LINK_DIRECTIVE}`
        ); // Get the destination
        if (!href) return; // Exit if the href does not exist

        // Add the onclick event
        el.onclick = (event) => {
          event.preventDefault();
          Router.route(this, href, false, this.defaultPane); // Route on clicked to the destination
        };
      });
  }

  /**
   * Returns a formatted path from the lowest path of the webpage to normalize paths.
   * @param  {string} path - The path that needs to be formatted.
   * @return {string} - The formatted path
   */
  #formatPath(path) {
    return `//${window.location.host.replace(/\/$/, "")}/${path}`;
  }

  /**
   * Fetches data from an external source
   * @param  {string} path - The path that needs to be fetched
   * @param  {string} type - The response type (JSON or HTML)
   */
  static async #fetch(path, type) {
    // Fetch from the path and return the appropriate type
    return await fetch(path)
      .then(async (response) => {
        if (!response.ok) {
          throw Error();
        }
        // Return the data for the appropriate data type
        switch (type.toLowerCase()) {
          case "json":
            return response.json(); // Return the JSON
          case "html":
            const html = await response.text();
            // Convert the HTML string into a document object
            return html; // Return the HTML
        }
      })
      .catch((err) => {
        throw _AccentRouterErrors.SOURCE_NOT_FOUND(path);
      });
  }

  /**
   * Alias of static AccentRouter.route function
   * @param {...any} args - The arguments for the specific routing operation
   */
  async route(...args) {
    Router.route(this, ...args);
  }

  /**
   *
   * Route pane to a certain destination.
   * @param {Router} router - The AccentRouter instance that is being used for the routing operation.
   * @param {string} destination - The destination of the routing operation.
   * @param {boolean} root - Is the route to be executed as root (mimic initial routing operation)?
   * @param {HTMLElement} pane - The element inside of which content will be loaded.
   */
  static async route(router, destination, root, pane) {
    document.dispatchEvent(_AccentRouterEvents.ROUTING_STARTED); // Dispatch event for routing started
    const route = Router._getRouteFromInput(router, destination); // Get the route from the given input
    // Fill the pane with the new page
    await router
      .fillPane(route.destination, root, route.dynamics, pane)
      .then((v) => {
        document.dispatchEvent(_AccentRouterEvents.ROUTING_ENDED); // After routing ended, dispatch the appropriate event.
      })
      .catch((e) => {
        document.dispatchEvent(_AccentRouterEvents.ROUTING_FAILED); // If the routing failed, dispatch the appropriate event.
        throw e;
      });
  }

  /**
   * Get the routing information for a specified route.
   * @param {Router} router - The router that the operation is executed upon
   * @param {(Array|string)} destination - The destination (or "target") route
   * @return {Object} - The final routing data
   */
  static _getRouteFromInput(router, destination) {
    destination = destination.replace(/\/$/, "");
    if (router.routes[destination]) {
      return { destination: destination };
    } else {
      try {
        const destinationFrags = destination.split("/");
        let p;
        let dynamics;
        Object.keys(router.routes).every((r) => {
          dynamics = {};
          const frags = [...destinationFrags];
          const path = router.routes[r].path;
          const pathFrags = Array.isArray(path)
            ? path.map((d) => d.split("/"))
            : path.split("/");
          return pathFrags.every((exec, i) => {
            let exp;

            const cleanFrags = (exec, pathIndex) => {
              while (
                (exp =
                  _AccentRouterConfig.ROUTER_DYNAMIC_LINK_ISOLATED.exec(exec))
              ) {
                const index =
                  pathIndex - (destinationFrags.length - frags.length);
                if (frags[index]) dynamics[exp[1]] = decodeURI(frags[index]);
                frags.splice(index, 1);
              }
            };

            if (Array.isArray(exec)) {
              exec.forEach((e, i) => {
                cleanFrags(e, i);
              });
            } else {
              cleanFrags(exec, i);
            }

            let formattedPath = Router.#formatDynamicRouterPath(path);
            formattedPath = Array.isArray(formattedPath)
              ? formattedPath.map((p) => p.replace(/\/$/, ""))
              : formattedPath.replace(/\/$/, "");
            const formattedDestination = frags.join("/").replace(/\/$/, "");
            if (
              formattedPath == formattedDestination ||
              (Array.isArray(formattedPath) &&
                formattedPath.includes(formattedDestination))
            ) {
              p = r;
              return false;
            }
            return true;
          });
        });
        return { destination: p, dynamics: dynamics };
      } catch {
        throw _AccentRouterErrors.ROUTE_NOT_DETERMINED();
      }
    }
  }

  /**
   * Format a dynamic path source using regular expressions to return a raw path.
   * @param {string} path - The path that is to be formatted
   * @return {string} - The formatted path
   */
  static #formatDynamicRouterPath(path) {
    return Array.isArray(path)
      ? path.map((p) => p.replace(_AccentRouterConfig.ROUTER_DYNAMIC_LINK, ""))
      : path.replace(_AccentRouterConfig.ROUTER_DYNAMIC_LINK, "");
  }
}

/** Global Utility Variables **/
const $route = Router.route;
const $link = (router, el, destination) => {
  el.onclick = (e) => {
    e.preventDefault();
    Router.route(router, destination);
  };
};

/**
 * Configuration for router directives, expressions, and settings.
 * @namespace
 */
const _AccentRouterConfig = {
  ROUTER_DYNAMIC_LINK: /:(.+?)\//g,
  ROUTER_DYNAMIC_LINK_ISOLATED: /:(.+)/g,
  ROUTER_PANE_TAGNAME: `router-pane`,
  ROUTER_TARGET_TAGNAME: `router-target`,
  ROUTER_LINK_DIRECTIVE: `router-to`,
  ROUTER_PROTECT_DIRECTIVE: `router-protect`,
  ROUTER_FALLBACK_DIRECTIVE: `router-fallback`,
  EVENT_PREFIX: `router:`,
};

/**
 * Custom events for the AccentRouter module.
 * @namespace
 */
const _AccentRouterEvents = {
  ROUTES_RECOGNIZED: new Event(
    `${_AccentRouterConfig.EVENT_PREFIX}routes-recognized`
  ),
  ROUTER_INIT: new Event(`${_AccentRouterConfig.EVENT_PREFIX}router-init`),
  ROUTING_STARTED: new Event(
    `${_AccentRouterConfig.EVENT_PREFIX}routing-started`
  ),
  ROUTING_ENDED: new Event(`${_AccentRouterConfig.EVENT_PREFIX}routing-ended`),
  ROUTES_LOADED_ASYNC: new Event(
    `${_AccentRouterConfig.EVENT_PREFIX}routes-loaded-async`
  ),
  ROUTING_FAILED: new Event(
    `${_AccentRouterConfig.EVENT_PREFIX}routing-failed`
  ),
};

/**
 * The different load types for AccentRouter routes
 * @namespace
 */
const _AccentRouteLoadTypes = {
  LOAD_LAZY: "lazy",
  LOAD_UNCACHED: "uncached",
  LOAD_ASYNC: "async",
};

/**
 * Potential errors for AccentRouter
 */
const _AccentRouterErrors = {
  AccentLibraryName: `Accent.js Router`,
  ROUTE_NOT_FOUND: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) The specified route ('${params[0]}') was not found.`;
  },
  TARGET_NOT_FOUND: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) A router target could not be found for route '${params[0]}'.`;
  },
  UNPROTECTED_ROUTE: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) The fallback for protected route '${params[0]}' was not found.`;
  },
  JSON_PARSE: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) The provided JSON input could not be parsed from ${params[0]}.`;
  },
  ROUTE_NOT_DETERMINED: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) A route could not be determined from the destination '${params[0]}'. Please ensure that the initial routes data and destination are properly formatted.`;
  },
  SOURCE_NOT_FOUND: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) An error occurred while fetching the source for ${params[0]}.`;
  },
  ROUTER_ALREADY_RUNNING: (...params) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) The main router for this app is already running. Use Accent.js Templates for "child" routes`;
  },
  BASE_ERROR: (e) => {
    return `(${_AccentRouterErrors.AccentLibraryName}) ${e}`;
  },
};

const $router = (...args) => {
  return new Router(...args);
}; // AccentRouter initialization function
