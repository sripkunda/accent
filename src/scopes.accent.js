'use strict';

// accent DOM properties
class AccentDOMController {
    static observerCallback = (mutationsList) => {
        // loop through the mutations list
        mutationsList.forEach((mutation) => {
            // if it is a child list change, then check if the attributes have a directive in them
            if (mutation.type == "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.attributes) {
                        const bTranspile = (node) => {
                            const attrs = node.getAttributeNames();
                            const attrArray = Object.keys(AccentDirectives).map(e => AccentScopes.DIRECTIVE_PREFIX + e).concat(attrs);
                            if (attrArray.some((val, i) => attrArray.indexOf(val) !== i)) {
                                AccentScopes._transpile(node.parentElement ?? node); // if so call transpile() on the parentElement (or the element itself, assuming that there is no parent element).
                            }
                        }
                        bTranspile(node);
                    }
                });
            } else if (mutation.type == "attributes") {
                if (Object.keys(mutation.attributeName).map(e => AccentScopes.DIRECTIVE_PREFIX + e).includes(mutation.attributeName));  // check if the attribute is a directive 
                AccentScopes._transpile(mutation.target.parentElement ?? mutation.target); // if so then transpile() 
            }
        });
    }

    static observer = new MutationObserver(AccentDOMController.observerCallback); // the static observer object

    constructor(opts) {
        AccentDOMController.observer.observe(document.body, opts); // create a new observer with those options 
    }

    static findLocalContext(el) {
        while (el)
            if (el.getAttributeNames().includes(`${AccentScopes.DIRECTIVE_PREFIX}context`) || AccentContext.contexts.get(el))
                return el;
            else
                el = el.parentElement;
    }
}

class AccentElement {
    static elements = new Map();
    element;
    data;

    constructor(el, dat) {
        this.element = el;
        this.data = dat ?? {}; // push dat if defined, otherwise make an element with an empty context
        AccentElement.elements.set(el, this);
    }

    for(iterator, iterable) {
        const loop = this.data.loop.value; // get the loop
        if (!loop) return; // if the loop does not exist, then return 
        let template = loop.template // the stored template for the loop
        iterator = iterator || loop.iterator, iterable = iterable || loop.iterable; // get the loop data
        this.element.innerHTML = "";
        if (!iterator || !Array.isArray(iterator)) return;
        iterator.forEach((prop, i) => {
            let out = template; // create a variable for the HTML output of the element
            let temp; // variable that stores the regex matches 
            const regex = /{{(.*?)}}/g; // the regex that gets the {{ values }}
            // loop through matches of the regex
            while ((temp = regex.exec(template)) !== null) {
                try {
                    temp[1] = temp[1].replaceAll("this.", "").trim();
                    let value = AccentScopes._compile(temp[1], JSON.parse(`{ "${iterable}": ${typeof prop == 'string' ? `"${prop}"` : prop}, "index": ${i} }`), true); // get the value of the variable 
                    let matchIndex = template == out ? temp.index : temp.index + (out.length - template.length); // get the index of the match
                    out = out.substr(0, matchIndex) + value + out.substr(matchIndex + temp[0].length, out.length); // replace the {{value}} with the real value without disrupting the rest of the items
                } catch {
                    throw Error(`accent.js: An error occurred while executing the for loop.`)
                }
            }
            this.element.innerHTML += out; // add to the innerHTML
        });
    }

    static from(el) {
        return AccentElement.elements.get(el) ?? new AccentElement(el);
    }
}

class AccentContext extends AccentElement {
    static contexts = new Map();
    element;
    data;
    objects;
    callback;

    constructor(el, dat, cb) {
        super(el);
        this.element = el;
        this.data = {}, this.objects = {};
        if (dat)
            Object.keys(dat).forEach((d, i) => {
                const obj = new AccentObservable(d, dat[d], true);
                this.data[d] = obj.proxy;
                this.objects[d] = obj;
            });
        AccentContext.contexts.set(el, this);
        if (cb) {
            this.callback = cb;
            this.callback(this);
        }
    }

    set(prop, val) {
        if (val) {
            if (this.objects[prop]) {
                this.objects[prop].set(val);
            } else {
                this.objects[prop] = new AccentObservable(prop, val, true);
            }
        } else {
            AccentDirectives.context(this.element, prop);
        }
    }

    get(prop) { return prop ? this.objects[prop].value : Object.keys(this.objects).map(o => this.objects[o].value); }

    static from(el, dat, callback) {
        return AccentContext.contexts.get(el) ?? AccentContext.contexts.get(AccentDOMController.findLocalContext(el)) ?? new AccentContext(el, dat, callback);;
    }
}

// artificial proxification of data binding
class AccentObservable {
    static objects = {}; // the objects that accent stores
    name; // the name of the object
    bindings; // the bindings that the object has
    value; // the value of the object

    constructor(name, val, standalone, bindings) {
        // create a new binding
        this.bindings = bindings || [];
        this.value = val;
        this.name = name;
        this.proxy = AccentObservable.proxify(this);
        if (!standalone) AccentObservable.objects[name] = this;
    }

    bind(element, property, event, callback) {
        /* bind value */
        // prevent duplicate bindings
        const bindingIndex = this.bindings.findIndex(b => b.el == element);
        if (bindingIndex > -1) {
            this.removeBind(this.bindings[bindingIndex].el);
        }
        const bind = {
            el: element,
            prop: property,
            event: event,
            callback: callback
        } // create a new object for that binding
        const listener = (e) => {
            if (!e)
                bind.el[bind.prop] = this.value;
            else
                this.set(bind.el[bind.prop]); // set() the value if the property is defined
        }
        if (event) {
            element.addEventListener(event, listener); // add the event listener for the binding if the event is specified, making this binding a two-way binding. 
        }
        // add the binding to the array of bindings
        this.bindings.push(bind);
        listener();

        /* clean up */
        // clean up bindings that no longer have live references
        this.bindings.filter(b => !document.documentElement.contains(b.el)).forEach(b => {
            this.removeBind(b.el);
        });

        return this.value;
    }

    set(prop, value) {
        typeof value !== 'undefined' ? this.value[prop] = value : this.value = prop; // set the value of the AccentObservable
        // apply property change to all bindings 
        this.bindings.forEach((b) => {
            if (b.el)
                b.el[b.prop] = prop;
            if (b.callback)
                b.callback(b.el);
        });
        this.proxy = AccentObservable.proxify(this); // reset proxy
    }

    get() {
        return this.value;
    }

    removeBind(el) {
        let obj = this.bindings.findIndex(e => e.el == el); // get the index of the binding to the specified element 
        if (obj < 0) throw Error(`accent.js: Binding of element '${el}' cannot be found on object '${this.name}'`); // if the index is -1, throw an error because the binding cannot be found
        el.removeEventListener(this.bindings[obj].event, this.bindings[obj].listener); // remove the event listener for that element (assuming that it is a text box that it is bound to)
        this.bindings.splice(obj, 1); // remove the binding from the array
    }


    static proxify(object) {
        let target = object.value;
        if (typeof target !== 'object')
            target = {
                ObservableValue: target,
                AccentObservableObject: true
            };
        const handler = {
            get: (obj, prop) => {
                return prop in obj ? obj[prop] : obj.value;
            },
            set: (target, prop, value) => {
                if (typeof value !== 'undefined' && typeof prop !== 'undefined')
                    if (target.AccentObservableObject && prop == 'ObservableValue')
                        object.set(value);
                    else prop ? object.set(prop, value) : object.set(value);
                return true;
            }
        }
        return new Proxy(target, handler);
    }

    static create(el, val, ev, prop) {
        // multi-dimensional binding
        const cg = AccentDOMController.findLocalContext(el);
        prop = prop || typeof el.value !== 'undefined' ? 'value' : 'innerHTML'; // set value if value property exists, otherwise choose innerHTML
        let obj;
        if (cg) {
            const ctx = AccentContext.contexts.get(cg);
            if (ctx) {
                obj = ctx.objects[val]; // if there is a control grou p with that object, then set the value to that control group
            }
        }
        obj = obj ?? AccentObservable.objects[val] ?? (ev ? new AccentObservable(val, el[prop]) : null); // if there is an event, two way bind, otherwise one way bind
        if (!obj) throw Error(`accent.js: '${val}' is not defined.`); // throw an error if the object does not exist
        return obj.bind(el, prop, ev); // create a binding to the object
    }
}

// accent directives and their corresponding functions
const AccentDirectives = {
    // find and ignore elements with ignore directive
    ignore: (el) => {
        const attr = `${AccentScopes.DIRECTIVE_PREFIX}ignore`;
        if (el?.hasAttribute(attr)) {
            if (el.getAttribute(attr) == "recursive") {
                while (el) {
                    Array.from(el.children).forEach(c => {
                        c.setAttribute(attr, "true");
                    });
                    el = el.firstElementChild;
                }
            }
            return true;
        }
        return false;
    },
    // define context of an element
    context: (el, val) => {
        if (AccentDirectives.ignore(el) || AccentContext.contexts.get(el)) return;
        try {
            val = typeof val === 'object' ? val : JSON.parse(val.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')); // fix the "bad" json 
            new AccentContext(el, val); // define a new element with data of object provided in the context group 
        } catch {
            throw Error(`accent.js: error while parsing object data of element ${el}. '${val}' is not a valid context.`); // throw an error if the json cannot be parsed
        }
    },
    // renders "template" html for each value in a given object
    for: (el, val, template) => {
        if (AccentDirectives.ignore(el))
            return;
        const cg = AccentDOMController.findLocalContext(el); // get the local context
        const args = val.split(" in ");
        const elem = AccentContext.contexts.get(cg); // get the args and define the element 
        if (!elem) throw Error(
            `accent.js: Local context could not be found for ${AccentScopes.DIRECTIVE_PREFIX}for. ${AccentScopes.DIRECTIVE_PREFIX}for elements must be localized to a context.`
        );
        const iterator = elem.data[args[1]]; // if element exists, then get the context value from it, otherwise get it by compiling.
        const loop = AccentElement.elements.get(el) ? AccentElement.elements.get(el) : new AccentElement(el, {
            loop: new AccentObservable("loop", {
                template: template || el.innerHTML.trim(),
                iterable: args[0],
                iterator: iterator
            }, true)
        }); // create a new accent element that stores the loop data
        const accentObject = elem.objects[args[1]];
        accentObject.bind(el, null, null, element => {
            const obj = AccentElement.elements.get(element);
            obj.element.innerHTML = obj.data.loop.value.template;
            AccentDirectives.for(element, val);
        }); // bind the loop data so that changes in the object also refect in the for directive DOM element

        loop.for(); // initiate the for loop
    },
    // two-way binding of an element
    model: (el, val, prop) => {
        if (AccentDirectives.ignore(el)) return;
        AccentObservable.create(el, val, "input", prop); // two-way binding to global accent object
    },
    // one-way binding of an element
    bind: (el, val, prop) => {
        if (AccentDirectives.ignore(el)) return;
        AccentObservable.create(el, val, null, prop); // one-way binding to global AccentObservable
    },
    // execute a code segment 
    set: (el, val, prop) => {
        if (AccentDirectives.ignore(el)) return;
        const cg = AccentDOMController.findLocalContext(el);
        const context = AccentContext.contexts.get(cg);
        const params = context ? (context.objects || {}) : {};
        const cont = AccentScopes._compile(val, params, true, true, el);
        el[prop] = cont ?? "";
    },
    // set textContent with an expression
    text: (el, val) => {
        AccentDirectives.set(el, val, "textContent");
    },
    // set html with an expression
    html: (el, val) => {
        AccentDirectives.set(el, val, "innerHTML");
    },
    // set class with an expression
    class: (el, val) => {
        AccentDirectives.set(el, val, "class");
    },
    // set style with an expression
    style: (el, val) => {
        AccentDirectives.set(el, val, "style");
    },
    // reactive event handler (context-aware event handling)
    on: (el, val, ev) => {
        if (AccentDirectives.ignore(el)) return;
        const accentEl = AccentElement.elements.get(el) ?? new AccentElement(el, {
            handler: (event) => {
                try {
                    AccentScopes._compile(val, AccentContext.contexts.get(AccentDOMController.findLocalContext(el)).objects, false, true);
                } catch { throw Error(`accent.js: An error occurred while executing ${AccentCore.DIRECTIVE_PREFIX}on. The local context could not be found.`) }
            }
        });
        el.removeEventListener(ev, accentEl.data?.handler);
        el.addEventListener(ev, accentEl.data?.handler);
    },
    // accent click event
    click: (el, val) => {
        AccentDirectives.on(el, val, "click");
    }
};

// public accent object
const AccentScopes = {
    DIRECTIVE_PREFIX: "ac-",
    _el: (sel, forceArr) => {
        const obj = document.querySelectorAll(sel);
        return obj.length <= 1 && !forceArr ? obj[0] : obj;
    },
    _render: () => {
        // configure mutation observer on body 
        new AccentDOMController({ attributes: true, childList: true, subtree: true });
        AccentScopes._transpile(document);
    },
    _transpile: (el) => {
        // configure directives
        Object.keys(AccentDirectives).forEach((di, i) => {
            const selector = `${AccentScopes.DIRECTIVE_PREFIX}${di}`;
            const nodes = el.querySelectorAll(`[${selector}]`);
            nodes.forEach(node => {
                AccentDirectives[di](node, node.getAttribute(selector));
            });
        });
    },
    _compile: (arg, params, bReturn, bRaw, el) => {
        try {
            let args = {}; // instantiate an empty object for the arguments 
            Object.keys(params).forEach((p) => {
                let par = params[p]; // reference the current element of params
                if (par instanceof AccentObservable) {
                    // if the current element is an AccentObservable, then set args[p] to the value of that AccentObservable and bind the object to the current element
                    args[p] = par.proxy;
                    if (el) {
                        par.bind(el, null, null, (elem) => {
                            const cg = AccentDOMController.findLocalContext(elem);
                            const context = cg ? AccentContext.contexts.get(cg) : undefined;
                            if (context?.callback) {
                                context.callback(context);
                            }
                            AccentScopes._transpile(elem.parentElement ?? elem);
                        });
                    }
                } else {
                    args[p] = par; // otherwise keep par as is and push it to args[p]
                }
            }); // loop through the params and add the values to the args array to exclude accent objects 
            let exp = arg.replaceAll(/this./g, "params.");
            return AccentObservable.objects[arg]  // return the requested AccentObservable if applicable
                ?? AccentElement.elements.get(arg) // return the requested AccentElement if applicable
                ?? (bRaw
                    ? Function('params', `${bReturn ? "return " : ""}${exp};`)(args) // execute raw if specified
                    : Function('params', `${bReturn ? "return " : ""}typeof ${exp} !== 'undefined' ? ${exp} : params['${exp}'];`)(args)); // otherwise execute with awareness 
        } catch {}
    }
}

// HTML DOM
if (typeof $el === 'undefined') {
    var $el = AccentScopes._el;
}

const $els = (sel) => { return AccentScopes._el(sel, true); };

// Directives
const $for = AccentDirectives.for;
const $event = AccentDirectives.on;
const $attr = AccentDirectives.set;
const $bind = AccentDirectives.bind;
const $model = AccentDirectives.model;

// Accent Objects 
const $object = (name) => { return AccentObservable.objects[name].value; };
const $set = (obj, prop, value) => { obj.set(prop, value); }
const $get = (obj, prop) => { obj.get(prop); }

// Accent DOM
const $context = AccentContext.from;
const $element = AccentElement.from;
const $render = AccentScopes._transpile;

AccentScopes._render(); // render page
