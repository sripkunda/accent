class AccentRouter {
    routes;
    currentRoute;
    defaultPane;

    constructor(routes, args) {
        this.init(routes, args ?? {});
    }

    async init(routes, args) {
        // if routes contains a path 
        this.routes = typeof routes === 'object' ? routes : await AccentRouter.fetch(routes, "json");
        this.defaultPane = args.pane;
        this.fillPane(this._getCurrentDestination(), args.pane, true);
        this.beginNavigation();
    }

    _getCurrentDestination() {
        return AccentRouter._getRouteFromInput(this, location.pathname);
    }

    async fillPane(destination, name, root) {
        // get routing information 
        const pane = document.querySelector(`[${DirectivePrefix}router-pane${name ? `=${name}` : ``}]`) || document.documentElement; // get the pane to insert elements onto
        const route = (await this.fetchPage(destination ?? this.routes)); // get the page data for the destination 
        const doc = route.html; // the document that is to be added
        const path = Array.isArray(this.routes[route.name]["path"])
            ? this.routes[route.name]["path"][0]
            : this.routes[route.name]["path"];
        // replace browser state
        const content = { "content": "", "title": doc.title }; // the content of the history state
        root
            ? window.history.replaceState(content, doc.title, path)
            : window.history.pushState(content, doc.title, path); // replace browser history with the new state 

        // append the innerHTML
        pane.innerHTML = ""; // clear the existing page content of the pane
        const toAppend = pane == document.documentElement ? doc.documentElement : doc.querySelector("[router-target]");
        if (!toAppend) throw Error(`accent.js: 'router-target' is not found in page '${destination}.' If the routing pane is explicitly defined, a router-target must be set for all routed pages.`); // add the new content onto the pane
        pane.append(toAppend);

        // execute javascript, load css, configure routes
        doc.querySelectorAll("link[rel=stylesheet], style").forEach(s => pane.append(s));
        this.currentRoute = route.id; // change the current route
        this._executeScripts(doc); // execute javascript on the doc that has been loaded
        this._executeScripts(pane); // execute javascript on the pane
        this._configureRoutingLinks(); // execute javascript on the page 

        // if there is an accent core attached, transpile the page again to account for the changes 
        if (typeof AccentScopes !== 'undefined') AccentScopes._transpile(pane);
    }

    async fetchPage(routes) {
        const fetchPage = async (page) => {
            try {
                const path = this._formatPath(`${this.routes[page]["src"]}`); 
                return await AccentRouter.fetch(path, 'html');
            } catch {
                throw Error(`accent.js: router could not load source for ${page} (src: ${this.routes[page]["src"]})`);
            }
        }
        return await new Promise((res, rej) => {
            if (typeof routes === 'object') {
                Object.keys(routes).forEach(async (route, i) => {
                    const path = routes[route]["path"];
                    if (path == "/" || Array.isArray(path) && path.includes("/")) res(route);
                });
                res();
            } else {
                res(routes);
            }
        }).then(async data => {
            if (!data) data = Object.keys(this.routes)[0];
            return { name: data, html: await fetchPage(data) };
        });;
    }

    beginNavigation() {
        window.addEventListener("popstate", (event) => {
            AccentRouter.route(this, window.location.pathname, true);
        });
    }

    _executeScripts(doc) {
        doc.querySelectorAll("script").forEach(async el => {
            const src = el.getAttribute("src");
            const path = src ? this._formatPath(src) : undefined;
            try {
                if (path && path.trim() != "") {
                    const req = await fetch(path);
                    if (req.ok) Function(await req.text())();
                } else
                    Function(el.innerHTML)();
            } catch (err) {
                throw Error(`${path} (via accent.js) ${err}`);
            }
        });
    }

    _configureRoutingLinks() {
        document.querySelectorAll("[router-to]").forEach(el => {
            const href = el.getAttribute("router-to");
            if (el.onclick || !href) return;
            el.addEventListener("click", event => {
                event.preventDefault();
                AccentRouter.route(this, href);
            });
        });
    }

    _formatPath(path) {
        return `//${window.location.host.replace(/\/$/, "")}/${path}`;
    }

    static async fetch(path, type) {
        console.log(path);
        return await fetch(path)
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                switch (type) {
                    case 'json':
                        return response.json();
                    case 'html':
                        let html = await response.text();
                        // Convert the HTML string into a document object
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        return doc;
                }
            })
            .catch(err => {
                throw Error(`accent.js: There was a problem while getting ${type} from ${path}`);
            });
    }

    static route(router, destination, root) {
        router.fillPane(AccentRouter._getRouteFromInput(router, destination), router.defaultPane, root);
    }

    static _getRouteFromInput(router, destination) {
        if (router.routes[destination])
            return destination;
        else {
            let p;
            Object.keys(router.routes).every(r => {
                const path = router.routes[r]["path"];
                if (path == destination || Array.isArray(path) && path.includes(destination)) {
                    p = r;
                    return false;
                }
                return true;
            });
            return p;
        }
    }
}

const $router = AccentRouter;
const DirectivePrefix = typeof AccentScopes === 'undefined' ? 'ac-' : AccentScopes.DIRECTIVE_PREFIX;
