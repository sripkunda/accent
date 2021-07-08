'use strict';

/** Class that represents the AccentRouter **/
class AccentRouter {
    routes; // the routes that are to be stored
    currentRoute; // the current route of the system
    defaultPane; // the default pane for this router
    #routerCache = {}; // the cached pages that the router loads

    params = {}; // the dynamic link data from the router

    /**
     * Constructor for the AccentRouter class.
     * Initializes the routing for the application
     * @constructor
     * @param  {Object, string} routes - The list of routes that the router will store
     * @param  {Object} [args={}] - The options/arguments for the router
     */
    constructor(routes, args = {}) {
        const pane = args.pane;
        const async = args.loadPagesAsync;

        // Asynchronously execute code to use await in context
        (async () => {
            // FInd routes
            this.routes = typeof routes === "object" ? routes : await AccentRouter.#fetch(routes, "json").then(routes => {
                document.dispatchEvent(AccentRouterEvents.ROUTES_RECOGNIZED); // After routes are recognized, 
                return routes; // Return the routes to assign the value
            });
            this.defaultPane = pane; // Assign the default pane for this router
            await AccentRouter.route(this, location.pathname, true, pane); // Route to the new path based on the pathname
            this.#beginNavigation(); // Start the navigation (popstate event)

            // Load pages in the background to the router cache
            if (!(async == false)) this.#cachePagesAsync().then(v => {
                document.dispatchEvent(v); // Dispatch the event for caching all of the pages asynchronously
            });
        })();
    }


    /**
     * Add a popstate listener for browser forward and back to ensure that routing is being used.
     */
    async #beginNavigation() {
        window.addEventListener('popstate', (event) => {
            AccentRouter.route(this, window.location.pathname, true);
        });
    }

    /**
     * Caches the pages on the routes in the background as the page loads. 
     */
    async #cachePagesAsync() {
        return await new Promise((res, rej) => {
            const routes = Object.keys(this.routes);
            routes.forEach(async (r, i) => {
                this.#routerCache[r] = {
                    name: r,
                    html: await this.#fetchPageAsync(r)
                };
                if (routes.length == i + 1) res(AccentRouterEvents.ROUTES_LOADED_ASYNC)
            });
        }).then(v => {
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
        targetPane = targetPane || document.querySelector(`[${AccentRouterConfig.ROUTER_PANE_DIRECTIVE}`) || document.documentElement; // Get the pane to insert elements onto
        const cache = this.#routerCache ? this.#routerCache[destination] : undefined; // Get document data from routerCache
        const route = cache?.html ? cache : (await this.#fetchPage(destination ?? this.routes)); // Get the page data for the destination
        const doc = new DOMParser().parseFromString(route.html, 'text/html'); // Parse the document data as HTML

        // Get the final path that needs to be pushed to the history
        let path = Array.isArray(this.routes[route.name]['path'])
            ? this.routes[route.name]['path'][0]  // If the path is an array, then get the 0th element of the paths array
            : this.routes[route.name]['path']; // Otherwise, get the path normally

        // Replace all instances of ':param' in the path with the appropriate parameter.
        path = path.replace(AccentRouterConfig.ROUTER_DYNAMIC_LINK, (_a, b) => {
            return `${parameters ? (parameters[b] ? `${parameters[b]}/` : '') : ''}`;
        });

        this.params = parameters; // Set the routing parameters for this route. 

        // Replace browser state
        const content = { 'content': '', 'title': doc.title }; // the content of the history state
        isRoot ?
            window.history.replaceState(content, doc.title, path) :
            window.history.pushState(content, doc.title, path); // replace browser history with the new state

        if (doc.title) document.title = doc.title;

        // append the innerHTML
        targetPane.innerHTML = ''; // clear the existing page content of the pane

        // Find the pane that needs to be appended on to
        const toAppend = targetPane == document.documentElement ? doc.documentElement : doc.querySelector(`[${AccentRouterConfig.ROUTER_TARGET_DIRECTIVE}]`);

        // If the pane cannot be found, then throw an error
        if (!toAppend)
            throw Error(`Accent.js: '${AccentRouterConfig.ROUTER_TARGET_DIRECTIVE}' is not found in page '${destination}.' If the routing pane is explicitly defined, a ${AccentRouterConfig.ROUTER_TARGET_DIRECTIVE} must be set for all routed pages.`);

        // Configuration for protected routes
        const prot = toAppend.getAttribute(AccentRouterConfig.ROUTER_PROTECT_DIRECTIVE);
        const fallback = toAppend.getAttribute(AccentRouterConfig.ROUTER_FALLBACK_DIRECTIVE);

        // If this route is protected and a required parameter is missing, route to the fallback 
        if (prot && (!this.params || !this.params[prot])) {
            if (fallback) {
                return AccentRouter.route(this, fallback); // If there is a fallback, route to the fallback
            } else {
                throw Error(`Accent.js: Protected routes must have a router fallback.`); // Otherwise throw an error
            }
        }

        targetPane.append(toAppend);

        // Execute javascript, load css, configure routing links 
        doc.querySelectorAll('link[rel=stylesheet], style').forEach((s) => targetPane.append(s));
        this.currentRoute = route.id; // Change the current route for developers to use
        this.#executeScripts(doc, route.name); // Execute javascript on the doc before adding it to the pane (make sure that external script tags are captured)
        this.#executeScripts(targetPane, route.name); // Execute javascript on the pane
        this.#configureRoutingLinks(); // Detect routing links and add appropriate event listeners

        // If the AccentMarkup module is attached, transpile the page again to account for the changes
        if (typeof AccentMarkup !== 'undefined') AccentMarkup._transpile(targetPane);

        return;
    }


    /**
     * @param  {Object, string} routes - The route(s) that are to be fetched
     */
    async #fetchPage(routes) {
        // Create a new promise, wait for it to finished, and return the result
        return await new Promise((res, rej) => {
            // If routes is an object, then loop through it and find the entry point.
            if (typeof routes === 'object') {
                Object.keys(routes).forEach(async (route, i) => {
                    const path = routes[route]['path'];
                    // Look for '/' in the path to determine if it is the entry point
                    if (path == '/' || Array.isArray(path) && path.includes('/')) res(route); // Resolve the promise as soon as the entry point is found
                });
                res(); // Resolve the promise if the '/' was not found
            } else {
                res(routes); // If routes is a certain destination, then resolve the promise
            }
        }).then(async (data) => {
            if (!data) data = Object.keys(this.routes)[0]; // If the destination is still undefined, take the first route given as the entry point. 
            this.#routerCache[data] = { name: data, html: await this.#fetchPageAsync(data) }; // Update the routerCache with the newly fetched page. 
            return this.#routerCache[data];  // Return the routerCache for this route
        });;
    }

    /**
     * Returns the HTML content of the 'src' for a specified route
     * @param  {string} route - The route that is being fetched
     */
    async #fetchPageAsync(route) {
        try {
            const path = this.#formatPath(`${this.routes[route]['src']}`); // Get the formatted path from the route
            return await AccentRouter.#fetch(path, 'html'); // Return the HTML
        } catch {
            throw Error(`Accent.js: router could not load source for ${route} (src: ${this.routes[route]['src']})`); // Throw an error if a certain page could not be loaded.
        }
    };

    /**
     * Executes scripts on a specified document and route
     * @param  {Document} doc - The document where the scripts are
     * @param  {string} route - The route that is being executed from (to load from routerCache if possible)
     */
    async #executeScripts(doc, route) {
        doc.querySelectorAll('script').forEach(async (el) => {
            const src = el.getAttribute('src');
            const path = src ? this.#formatPath(src) : undefined;
            try {
                if (path && path.trim() != '') {
                    const content = this.#routerCache[route][path] ?? (await (await fetch(path)).text());
                    this.#routerCache[route][path] = content;
                    if (content) Function(content)();
                } else {
                    Function(el.innerHTML)();
                }
            } catch (err) {
                throw Error(`${path} (via Accent.js) ${err}`);
            }
        });
    }
    
    /**
     * Adds onclick events to links identified as routerLinks. 
     */
    #configureRoutingLinks() {
        // Loop through the router links using the router link directive
        document.querySelectorAll(`[${AccentRouterConfig.ROUTER_LINK_DIRECTIVE}]`).forEach((el) => {
            const href = el.getAttribute(`${AccentRouterConfig.ROUTER_LINK_DIRECTIVE}`); // Get the destination
            if (!href) return; // Exit if the href does not exist

            // Add the onclick event
            el.onclick = (event) => {
                event.preventDefault();
                AccentRouter.route(this, href, false, this.defaultPane); // Route on clicked to the destination
            };
        });
    }

    /**
     * Returns a formatted path from the lowest path of the webpage to normalize paths. 
     * @param  {string} path - The path that needs to be formatted
     */
    #formatPath(path) {
        return `//${window.location.host.replace(/\/$/, '')}/${path}`;
    }

    /**
     * Fetches data from an external source
     * @param  {string} path - The path that needs to be fetched
     * @param  {string} type - The response type (JSON or HTML)
     */
    static async #fetch(path, type) {
        return await fetch(path)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                switch (type.toLowerCase()) {
                    case 'json':
                        return response.json();
                    case 'html':
                        const html = await response.text();
                        // Convert the HTML string into a document object
                        return html;
                }
            })
            .catch((err) => {
                throw Error(`Accent.js: There was a problem while getting ${type} from ${path}`);
            });
    }

    static async route(router, destination, root, pane) {
        document.dispatchEvent(AccentRouterEvents.ROUTING_STARTED); // Dispatch event for routing started
        const route = AccentRouter._getRouteFromInput(router, destination); // Get the route from the given input

        // Fill the pane with the new page
        await router.fillPane(route.destination, root, route.dynamics, pane).then(v => {
            document.dispatchEvent(AccentRouterEvents.ROUTING_ENDED); // After routing ended, dispatch the appropriate event. 
        }).catch(e => {
            document.dispatchEvent(AccentRouterEvents.ROUTING_FAILED); // If the routing failed, dispatch the appropriate event. 
        });
    }

    static _getRouteFromInput(router, destination) {
        if (router.routes[destination]) {
            return { destination: destination };
        } else {
            const destinationFrags = destination.split('/');
            let p;
            let dynamics = {};
            Object.keys(router.routes).every((r) => {
                dynamics = {};
                const frags = [...destinationFrags];
                const path = router.routes[r].path;
                const pathFrags = Array.isArray(path) ? path.map((d) => d.split('/')) : path.split('/');

                return pathFrags.every((f, i) => {
                    const exec = Array.isArray(f) ? f[0] : f;
                    let exp;
                    while (exp = AccentRouterConfig.ROUTER_DYNAMIC_LINK_ISOLATED.exec(exec)) {
                        const index = i - (destinationFrags.length - frags.length);
                        if (frags[index]) dynamics[exp[1]] = decodeURI(frags[index]);
                        frags.splice(index, 1);
                    }
                    let formattedPath = AccentRouter.#formatDynamicRouterPath(path);
                    formattedPath = Array.isArray(formattedPath) ? formattedPath.map((p) => p.replace(/\/$/, '')) : formattedPath.replace(/\/$/, '');
                    const formattedDestination = frags.join('/').replace(/\/$/, '');
                    if (formattedPath == formattedDestination || Array.isArray(formattedPath) && formattedPath.includes(formattedDestination)) {
                        p = r;
                        return false;
                    }
                    return true;
                });
            });
            return { destination: p, dynamics: dynamics };
        }
    }

    static #formatDynamicRouterPath(path) {
        return Array.isArray(path) ?
            path.map((p) => p.replace(AccentRouterConfig.ROUTER_DYNAMIC_LINK, '')) :
            path.replace(AccentRouterConfig.ROUTER_DYNAMIC_LINK, '');
    }
}

/** Global Utility Variables **/
const $route = AccentRouter.route;
const $link = (router, el, destination) => {
    el.onclick = (e) => {
        e.preventDefault();
        AccentRouter.route(router, destination);
    };
};

const $router = AccentRouter; // Alias for AccentRouter

/**
 * Configuration for router directives, expressions, and settings.
 * @namespace
 */
const AccentRouterConfig = {
    ROUTER_DYNAMIC_LINK: /:(.+?)\//g,
    ROUTER_DYNAMIC_LINK_ISOLATED: /:(.+)/g,
    ROUTER_PANE_DIRECTIVE: `router-pane`,
    ROUTER_TARGET_DIRECTIVE: `router-target`,
    ROUTER_LINK_DIRECTIVE: `router-to`,
    ROUTER_PROTECT_DIRECTIVE: `router-protect`,
    ROUTER_FALLBACK_DIRECTIVE: `router-fallback`,
};

/**
 * Custom events for the AccentRouter module.
 * @namespace
 */
const AccentRouterEvents = {
    ROUTES_RECOGNIZED: new Event('router:routes-recognized'),
    ROUTING_STARTED: new Event('router:routing-started'),
    ROUTING_ENDED: new Event('router:routing-ended'),
    ROUTES_LOADED_ASYNC: new Event('router:routes-loaded-async'),
    ROUTING_FAILED: new Event('router:routing-failed')
}
