'use strict';

// utility object
const AccentUtil = {
    _get: (sel, num) => {
        let els = typeof sel === "object" ? sel : document.querySelectorAll(sel);
        if (!(els instanceof NodeList)) {
            els = [els];
        }
        if (els.length > 0) return new AccentNodeList(els[num] ?? els);
    },
    _onReady: (r, e) => {
        r.onreadystatechange = (ev) => {
            if (r.readyState == "interactive") {
                e(ev);
            }
        };
    },
    _err: (msg) => {
        console.warn(msg);
    }
};

class AccentUtilObject extends Object {

    constructor(obj) {
        super();
        AccentUtilObject.assign(this, obj);
    }

    each(callback) {
        console.log(this);
        Object.keys(this).forEach((mem, ind, arr) => {
            callback(this[mem], mem, ind, arr);
        });
    }

    toMap() {
        return new Map(Object.entries(this));
    }

    keyOf(key, val, last) {
        let i = undefined;
        Object.keys(this).every((k) => {
            if (this[k][key] == val) {
                i = k;
                if (!last) return false;
                return true;
            }
            return true;
        });
        return i;
    }

    lastKeyOf(key, val) { this.keyOf(key, val, true); }

    filter(callback, first) {
        var res = {};
        Object.keys(this).every((key) => {
            if (first) {
                res = this[key];
                return false;
            }
            if (callback(this[key]))
                res[key] = this[key];
            return true;
        });
        return res;
    }

    find(callback) { return this.filter(callback, true); }
}
// An AccentNodeList that stores HTML elements for use
class AccentNodeList extends Array {

    constructor(el) {
        super();
        (el instanceof NodeList || el instanceof HTMLCollection || Array.isArray(el) ? Array.from(el) : [el]).forEach((e) => {
            this.push(e);
        });
    }

    /* element maping to plain es6 */

    children() {
        return this.getDOM("children");
    }

    child() {
        return this.getDOM("firstElementChild", true);
    }

    lastChild() {
        return this.getDOM("lastElementChild", true);
    }

    parents() {
        return this.getDOM("parentElement");
    }

    parent() {
        return this.getDOM("parentElement", true);
    }

    getDOM(at, first) {
        // TODO refactor this, by far the ugliest code in existence
        let obj = {};
        Array.from(this).every((e, i) => {
            if (first) {
                obj[i] = e[at];
                return true;
            }
            obj[i] = [];
            e = e[at];
            while (e) {
                obj[i].push(e);
                e = e[at];
            }
            return true;
        });
        if (!obj) return new AccentNodeList([]);
        const keys = Object.keys(obj);
        if (keys.length > 0) {
            if (keys.length > 1) {
                return AccentNodeCollection.from(keys.map(e => new AccentNodeList(obj[e] ? (obj[e][0] ? obj[e][0] : obj[e]) : [])));
            } else {
                if (obj[0] && obj[0][0]) {
                    if (obj[0][0].length > 1)
                        return AccentNodeList(obj[0][0]);
                    else
                        return AccentNodeList(obj[0][0][0]);
                } else {
                    return new AccentNodeList(obj[0] ?? []);
                }
            }

        } else
            return new AccentNodeList([]);
    }

    /* working with the DOM */

    append(val) {
        if (!val) return AccentUtil._err("accent.js: $el(...).append() was used without any parameters");
        return this.set("innerHTML", val, true);
    }

    prepend(val) {
        if (!val) return AccentUtil._err("accent.js: $el(...).prepend() was used without any parameters");
        this.forEach(e => {
            e.insertAdjacentHTML("afterbegin", val);
        });
    }

    html(val, concat) {
        return this.get("innerHTML", val) ?? this.set("innerHTML", val, concat);
    }

    text(val, concat) {
        return this.get("textContent", val) ?? this.set("textContent", val, concat);
    }

    val(val, concat) {
        return this.get("value", val) ?? this.set("value", val, concat);
    }

    style(val) {
        return this.get("style", val) ?? this.set("style", val, false);
    }

    get(attr, val) {
        var vals = Array.from(this).map(e => e[attr]);
        if (!val) return vals.length > 1 ? vals : vals[0];
    }

    class(val, action) {
        const chng = (e, c) => {
            action || action == "add" ? e["classList"].add(c) : action == false || action == "remove" ? e["classList"].remove(c) : e["classList"] = val;
        }

        return this.get("classList", val) ?? this.set("classList", val, false, (e) => {
            if (typeof val === "object")
                Object.keys(val).forEach(c => {
                    chng(e, val[c]);
                });
            else
                chng(e, val);
        });
    }

    attr(attr, val) {
        if (!val) {
            var arr = Array.from(this).map(e => e.getAttribute(attr));
            return arr.length > 1 ? arr : arr[0];
        } else {
            this.forEach(e => {
                e.setAttribute(attr, val);
            });
        }
    }

    set(attr, val, concat, callback) {
        this.forEach((e) => {
            callback = callback || function (e, v) {
                e[attr][v] = val[v];
            };
            if (typeof val === "object") {
                Object.keys(val).forEach(v => {
                    this.forEach((e) => { callback(e, v) });
                });
            } else e[attr] = concat ? e[attr] + val : val;
        });
    }

    /* events */

    on(ev, callback) {
        this.forEach((e) => {
            e.addEventListener(ev, callback);
        });
    }

    click(callback) {
        this.on("click", callback);
    }

    mouseup(callback) {
        this.on("mouseup", callback);
    }

    mousedown(callback) {
        this.on("mousedown", callback);
    }

    keyup(callback) {
        this.on("mousedown", callback);
    }

    keydown(callback) {
        this.on("keydown", callback);
    }

    keypress(callback) {
        this.on("keypress", callback);
    }

    input(callback) {
        this.on("input", callback);
    }

    change(callback) {
        this.on("change", callback);
    }

    load(callback) {
        this.on("load", callback);
    }

    /* logic and overriden functions */

    each(callback) {
        this.forEach(callback);
    }

    forEach(callback) {
        super.forEach((e, i) => callback(new AccentNodeList(e), i));
    }
}

// A collection of AccentNodeLists
class AccentNodeCollection extends AccentNodeList {
    each(callback) {
        this.forEach(callback);
    }

    on(ev, callback) {
        this.forEach((e) => {
            e.on(ev, callback);
        });
    }

    set(attr, val, concat, callback) {
        this.forEach((e) => {
            e.set(attr, val, concat, callback);
        });
    }

    get(attr, val) {
        this.forEach((e) => {
            e.get(attr, val);
        });
    }
}

// Util
const Ac = {
    /* dom */
    doc: document,
    docEl: document.documentElement,
    body: document.body,
    parseHTML: (html) => {
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    }
};

// DOM 
var $el = AccentUtil._get;
var $ready = (e) => AccentUtil._onReady(document, e);

// Objects
const $obj = AccentUtilObject;

// Debugging 
const $log = console.log;
const $warn = console.warn;
const $err = console.error;
