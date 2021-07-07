'use strict';

class AccentRouter {
    routes; // the routes that are to be stored
    currentRoute; // the current route of the system
    defaultPane;
    #routerCache = {};

    links = {};

    constructor(routes, args) {
        this.init(routes, args ?? {});
    }

    async init(routes, args) {
        const pane = args.pane;
        const async = args.loadPagesAsync;

        this.routes = typeof routes === 'object' ? routes : await AccentRouter.#fetch(routes, 'json').then(routes => {
            document.dispatchEvent(AccentRouterEvents.ROUTES_RECOGNIZED);
            return routes;
        });
        this.defaultPane = pane;
        AccentRouter.route(this, location.pathname, true, pane);
        this.#beginNavigation();
    }

    async fillPane(destination, root, dynamics, pane) {
        // get routing information
        pane = pane || document.querySelector(`[${AccentRouterConfig.ROUTER_PANE_DIRECTIVE}`) || document.documentElement; // get the pane to insert elements onto
        const route = this.#routerCache[destination] ?? (await this.#fetchPage(destination ?? this.routes)); // get the page data for the destination
        const doc = new DOMParser().parseFromString(route.html, 'text/html'); // the document that is to be added

        let path = (Array.isArray(this.routes[route.name]['path']) ?
            this.routes[route.name]['path'][0] :
            this.routes[route.name]['path']);

        path = path.replace(AccentRouterConfig.ROUTER_DYNAMIC_LINK, (a, b) => {
            return `${dynamics ? (dynamics[b] ? `${dynamics[b]}/` : '') : ''}`;
        });

        this.links = dynamics;

        // replace browser state
        const content = { 'content': '', 'title': doc.title }; // the content of the history state
        root ?
            window.history.replaceState(content, doc.title, path) :
            window.history.pushState(content, doc.title, path); // replace browser history with the new state

        // append the innerHTML
        pane.innerHTML = ''; // clear the existing page content of the pane

        const toAppend = pane == document.documentElement ? doc.documentElement : doc.querySelector(`[${AccentRouterConfig.ROUTER_TARGET_DIRECTIVE}]`);
        if (!toAppend) throw Error(`Accent.js: '${AccentRouterConfig.ROUTER_TARGET_DIRECTIVE}' is not found in page '${destination}.' If the routing pane is explicitly defined, a ${AccentRouterConfig.ROUTER_TARGET_DIRECTIVE} must be set for all routed pages.`); // add the new content onto the pane

        const prot = toAppend.getAttribute(AccentRouterConfig.ROUTER_PROTECT_DIRECTIVE);
        const fallback = toAppend.getAttribute(AccentRouterConfig.ROUTER_FALLBACK_DIRECTIVE);

        if (prot && (!this.links || !this.links[prot])) {
            if (fallback) {
                return AccentRouter.route(this, fallback);
            } else {
                throw Error(`Accent.js: Protected routes must have a router fallback.`);
            }
        }

        pane.append(toAppend);

        // execute javascript, load css, configure routes
        doc.querySelectorAll('link[rel=stylesheet], style').forEach((s) => pane.append(s));
        this.currentRoute = route.id; // change the current route
        this.#executeScripts(doc, route.name); // execute javascript on the doc that has been loaded
        this.#executeScripts(pane, route.name); // execute javascript on the pane
        this.#configureRoutingLinks(); // execute javascript on the page

        // if there is an accent core attached, transpile the page again to account for the changes
        if (typeof AccentMarkup !== 'undefined') AccentMarkup._transpile(pane);
    }

    async #fetchPage(routes) {
        const fetchPage = async (page) => {
            try {
                const path = this.#formatPath(`${this.routes[page]['src']}`);
                return await AccentRouter.#fetch(path, 'html');
            } catch {
                throw Error(`Accent.js: router could not load source for ${page} (src: ${this.routes[page]['src']})`);
            }
        };
        return await new Promise((res, rej) => {
            if (typeof routes === 'object') {
                Object.keys(routes).forEach(async (route, i) => {
                    const path = routes[route]['path'];
                    if (path == '/' || Array.isArray(path) && path.includes('/')) res(route);
                });
                res();
            } else {
                res(routes);
            }
        }).then(async (data) => {
            if (!data) data = Object.keys(this.routes)[0];
            this.#routerCache[data] = { name: data, html: await fetchPage(data) };
            return this.#routerCache[data];
        });;
    }

    #beginNavigation() {
        window.addEventListener('popstate', (event) => {
            AccentRouter.route(this, window.location.pathname, true);
        });
    }

    #executeScripts(doc, name) {
        doc.querySelectorAll('script').forEach(async (el) => {
            const src = el.getAttribute('src');
            const path = src ? this.#formatPath(src) : undefined;
            try {
                if (path && path.trim() != '') {
                    const content = this.#routerCache[name][path] ?? await (await fetch(path)).text();
                    this.#routerCache[name][path] = content;
                    if (content) Function(content)();
                } else {
                    Function(el.innerHTML)();
                }
            } catch (err) {
                throw Error(`${path} (via Accent.js) ${err}`);
            }
        });
    }

    #configureRoutingLinks() {
        document.querySelectorAll(`[${AccentRouterConfig.ROUTER_LINK_DIRECTIVE}]`).forEach((el) => {
            const href = el.getAttribute(`${AccentRouterConfig.ROUTER_LINK_DIRECTIVE}`);
            if (!href) return;
            el.onclick = (event) => {
                event.preventDefault();
                AccentRouter.route(this, href, false, this.defaultPane);
            };
        });
    }

    #formatPath(path) {
        return `//${window.location.host.replace(/\/$/, '')}/${path}`;
    }

    static async #fetch(path, type) {
        return await fetch(path)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                switch (type) {
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

    static route(router, destination, root, pane) {
        document.dispatchEvent(AccentRouterEvents.ROUTING_STARTED);
        const route = AccentRouter._getRouteFromInput(router, destination);
        router.fillPane(route.destination, root, route.dynamics, pane).then(v => {
            document.dispatchEvent(AccentRouterEvents.ROUTING_ENDED);
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

/* Events */
const AccentRouterEvents = {
    ROUTES_RECOGNIZED: new Event('router:routes-recognized'),
    ROUTING_STARTED: new Event('router:routing-started'),
    ROUTING_ENDED: new Event('router:routing-ended'),
    ROUTING_FAILED: new Event('router:routing-failed')
}

// Functional Variables
const $route = AccentRouter.route;
const $link = (router, el, destination) => {
    el.onclick = (e) => {
        e.preventDefault();
        AccentRouter.route(router, destination);
    };
};

// Global Access Variables
const $router = AccentRouter;

/* Config */

const AccentRouterConfig = {
    ROUTER_DYNAMIC_LINK: /:(.+?)\//g,
    ROUTER_DYNAMIC_LINK_ISOLATED: /:(.+)/g,
    ROUTER_PANE_DIRECTIVE: `router-pane`,
    ROUTER_TARGET_DIRECTIVE: `router-target`,
    ROUTER_LINK_DIRECTIVE: `router-to`,
    ROUTER_PROTECT_DIRECTIVE: `router-protect`,
    ROUTER_FALLBACK_DIRECTIVE: `router-fallback`,
};
