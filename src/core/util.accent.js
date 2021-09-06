/**
 * Accent Util: A set of "helper" or "utility" functions for interacting with the HTML DOM and/or manipulating JavaScript Objects.
  ** DEPRECATED AND NOT INCLUDED IN RELEASE **
 */

"use strict";

/**
 * Public utility object with helper methods and elements
 */
const Util = {
  /* Dom */
  doc: document,
  docEl: document.documentElement,
  body: document.body,
  parseHTML: (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  },
};

/**
 * Accent's internal utility object with global accessor functions
 */
const _AccentUtil = {
  /**
   * Create an AccentNodeList from an HTMLElement or selector
   * @param {(string|HTMLElement|NodeList)} sel - Selector or object to create AccentNodeList from
   * @param {number} num - The index of the NodeList to create the object from
   * @return {AccentNodeList} - The newly created NodeList
   */
  _get: (sel, num) => {
    let els = typeof sel === "object" ? sel : document.querySelectorAll(sel);
    if (!(els instanceof NodeList)) {
      els = [els];
    }
    if (els.length > 0) return new AccentNodeList(els[num] ?? els);
  },
  /**
   * Add a readyState event handler to a given element.
   * @param {HTMLElement} element - The element to add the event listener to.
   * @param {function} action - The function that is to be executed when ready.
   */
  _onReady: (element, action) => {
    element.onreadystatechange = (ev) => {
      if (element.readyState == "interactive") {
        action(ev);
      }
    };
  },
  /**
   * Log a new warning into the console
   * @param {string} msg - The content of the warning
   */
  _err: (msg) => {
    console.warn(msg);
  },
};

/**
 * The extension of the JavaScript Object with attached utility functions.
 */
class AccentUtilObject extends Object {
  /**
   * Instantiate a new AccentUtilObject
   * @param {Object} obj - The object content of the object.
   */
  constructor(obj) {
    super();
    AccentUtilObject.assign(this, obj);
  }

  /**
   * Loops through the keys of an Object.
   * @param {function} callback - The callback to be executed for each key of the object
   */
  each(callback) {
    Object.keys(this).forEach((mem, ind, arr) => {
      callback(this[mem], mem, ind, arr);
    });
  }

  /**
   * Converts an Object to a Map
   * @return {Map} - The newly created Map.
   */
  toMap() {
    return new Map(Object.entries(this));
  }

  /**
   * Find the key of an element in an object
   * @param {string} key - The key to look for in the Object
   * @param {*} val - The value to look for in the Object
   * @param {boolean} bLast - Take the last found element of the Object (lastKeyOf)?
   * @return {string} - The key that was found with the given parameters.
   */
  keyOf(key, val, bLast) {
    let i = undefined;
    Object.keys(this).every((k) => {
      if (this[k][key] == val) {
        i = k;
        if (!bLast) return false;
        return true;
      }
      return true;
    });
    return i;
  }

  /**
   * Find the last key of an element in an Object.
   * @param {string} key - The key to look for in the Object
   * @param {*} val - The value to look for in the Object
   * @return {string} - The last key that was found with the given parameters.
   */
  lastKeyOf(key, val) {
    return this.keyOf(key, val, true);
  }

  /**
   * Filter an Object with a callback function
   * @param {function} callback - A filtering determiner that
   * @param {boolean} bFirst - Take the first element of the object (find)?
   * @return {Object} - The resulting object of the filter
   */
  filter(callback, bFirst) {
    let res = {};
    Object.keys(this).every((key) => {
      if (callback(this[key])) {
        if (bFirst) {
          res = this[key];
          return false;
        }
        res[key] = this[key];
      }
      return true;
    });
    return res;
  }

  /**
   * Find the first element that returns true for a given callback
   * @param {function} callback - The callback that is to be evaluated
   * @returns
   */
  find(callback) {
    return this.filter(callback, true);
  }
}

/**
 * A stored Array of HTMLElements that can be manipulated using utility functions
 */
class AccentNodeList extends Array {
  /**
   * Instantiate a new AccentNodeList
   * @param {(NodeList|Array|HTMLCollection)} el - The collection of elements to create the AccentNodeList out of
   */
  constructor(el) {
    super();
    (el instanceof NodeList || el instanceof HTMLCollection || Array.isArray(el)
      ? Array.from(el)
      : [el]
    ).forEach((e) => {
      this.push(e);
    });
  }

  /* DOM Manipulation */

  /**
   * Get the children of each element in an AccentNodeList
   * @return {(AccentNodeCollection|AccentNodeList)} - The list(s) of children
   */
  children() {
    return this.getDOM("children");
  }

  /**
   * Get the first child of each element in an AccentNodeList
   * @return {(AccentNodeCollection|AccentNodeList)} - The list of the first child elements for each element in the AccentNodeList
   */
  child() {
    return this.getDOM("firstElementChild", true);
  }

  /**
   * Get the last child of each element in an AccentNodeList
   * @return {(AccentNodeCollection|AccentNodeList)} - The list of the last child elements for each element in the AccentNodeList
   */
  lastChild() {
    return this.getDOM("lastElementChild", true);
  }

  /**
   * Get the parent elements of each element in an AccentNodeList
   * @return {(AccentNodeCollection|AccentNodeList)} - The list of the parent elements for each element in the AccentNodeList
   */
  parents() {
    return this.getDOM("parentElement");
  }

  /**
   * Get the first parent element of each element in an AccentNodeList
   * @return {(AccentNodeCollection|AccentNodeList)} - The list of the first parent elements for each element in the AccentNodeList
   */
  parent() {
    return this.getDOM("parentElement", true);
  }

  /**
   * Gets a certain attribute of each element in an AccentNodeList and returns it
   * @param {string} at - The attribute to get for each element
   * @param {boolean} bFirst - Whether or not to take the "first" found element for each attribute
   * @return {(AccentNodeCollection|AccentNodeList)} - An appropriate collection of the found elements
   */
  getDOM(at, bFirst) {
    // TODO refactor this, by far the ugliest code in existence
    const obj = {};
    Array.from(this).every((e, i) => {
      if (bFirst) {
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
        return AccentNodeCollection.from(
          keys.map(
            (e) =>
              new AccentNodeList(obj[e] ? (obj[e][0] ? obj[e][0] : obj[e]) : [])
          )
        );
      } else if (obj[0] && obj[0][0]) {
        if (obj[0][0].length > 1) return new AccentNodeList(obj[0][0]);
        else return new AccentNodeList(obj[0][0][0]);
      } else {
        return new AccentNodeList(obj[0] ?? []);
      }
    } else return new AccentNodeList([]);
  }

  /* Working with the DOM */

  /**
   * Appends HTML text to each element in an AccentNodeList
   * @param {string} val - The HTML content to append
   */
  append(val) {
    if (!val)
      return _AccentUtil._err(
        "accent.js: $el(...).append() was used without any parameters"
      );
    this.set("innerHTML", val, true);
  }

  /**
   * Prepends HTML text to each element in an AccentNodeList
   * @param {*} val - The HTML content to prepend
   */
  prepend(val) {
    if (!val)
      return _AccentUtil._err(
        "accent.js: $el(...).prepend() was used without any parameters"
      );
    super.forEach.call(this, (e) => {
      e.insertAdjacentHTML("afterbegin", val);
    });
  }

  /**
   * Change/get the HTML of each element in an AccentNodeList
   * @param {*} val - The new HTML
   * @param {boolean} concat - Whether or not to concatinate the HTML with the existing value
   * @return {(string|string[])} - The HTML of each element in the AccentNodeList
   */
  html(val, concat) {
    return this.get("innerHTML", val) ?? this.set("innerHTML", val, concat);
  }

  /**
   * Change/get the textContent of each element in an AccentNodeList
   * @param {*} val - The new textContent
   * @param {boolean} concat - Whether or not to concatinate the textContent with the existing value
   * @return {(string|string[])} - The textContent of each element in the AccentNodeList
   */
  text(val, concat) {
    return this.get("textContent", val) ?? this.set("textContent", val, concat);
  }

  /**
   * Change/get the value of each element in an AccentNodeList
   * @param {*} val - The new value
   * @param {boolean} concat - Whether or not to concatinate the value with the existing value
   * @return {(string|string[])} - The value of each element in the AccentNodeList
   */
  val(val, concat) {
    return this.get("value", val) ?? this.set("value", val, concat);
  }

  /**
   * Change/get the style of each element in an AccentNodeList
   * @param {*} val - The new style
   * @return {(string|string[])} - The style of each element in the AccentNodeList
   */
  style(val) {
    return this.get("style", val) ?? this.set("style", val, false);
  }

  /**
   * Get a certain attribute of each element in an AccentNodeList
   * @param {string} attr - The attribute to get
   * @param {*} val - The value of the element passed to the setter functxion
   * @return {(string|string[])} - The attribute of each element in the AccentNodeList if the value given to the setter is falsish
   */
  get(attr, val) {
    const vals = Array.from(this).map((e) => e[attr]);
    if (!val) return vals.length > 1 ? vals : vals[0];
  }

  /**
   * Add/remove a class for each element in the AccentNodeList
   * @param {*} val - The class to perform the action on
   * @param {(string|boolean)} action - Whether to add/remove the class. (true = add, false = remove, 'add' = add, 'remove' = remove)
   */
  class(val, action) {
    const chng = (e, c) => {
      action || action == "add"
        ? e["classList"].add(c)
        : action == false || action == "remove"
        ? e["classList"].remove(c)
        : (e["classList"] = val);
    };

    return (
      this.get("classList", val) ??
      this.set("classList", val, false, (e) => {
        if (typeof val === "object")
          Object.keys(val).forEach((c) => {
            chng(e, val[c]);
          });
        else chng(e, val);
      })
    );
  }

  /**
   * Change/get a specific attribute for every
   * @param {*} attr - The attribute to set/change
   * @param {*} val - The value of the attribute
   * @return {(string|string[])} - The reqeusted attribute of each element in the AccentNodeList if the value given is falsish
   */
  attr(attr, val) {
    if (!val) {
      const arr = Array.from(this).map((e) => e.getAttribute(attr));
      return arr.length > 1 ? arr : arr[0];
    } else {
      super.forEach.call(this, (e) => {
        e.setAttribute(attr, val);
      });
    }
  }

  /**
   * Sets the value of a certain attribute for each element in an AccentNodeList
   * @param {*} attr
   * @param {*} val
   * @param {*} concat
   * @param {*} callback - The
   */
  set(attr, val, concat, callback) {
    super.forEach.call(this, (e) => {
      callback =
        callback ||
        ((e, v) => {
          e[attr][v] = val[v];
        });
      if (typeof val === "object") {
        Object.keys(val).forEach((v) => {
          super.forEach.call(this, (e) => {
            callback(e, v);
          });
        });
      } else e[attr] = concat ? e[attr] + val : val;
    });
  }

  /* Events */

  /**
   * Add an event listener to each element in an AccentNodeList
   * @param {string} ev - The event to add
   * @param {*} callback - The handler of the event
   */
  on(ev, callback) {
    super.forEach.call(this, (e) => {
      e.addEventListener(ev, callback);
    });
  }

  click(...callback) {
    this.on("click", callback);
  }

  mouseup(...callback) {
    this.on("mouseup", callback);
  }

  mousedown(...callback) {
    this.on("mousedown", callback);
  }

  keyup(...callback) {
    this.on("mousedown", callback);
  }

  keydown(...callback) {
    this.on("keydown", callback);
  }

  keypress(...callback) {
    this.on("keypress", callback);
  }

  input(...callback) {
    this.on("input", callback);
  }

  change(...callback) {
    this.on("change", callback);
  }

  load(...callback) {
    this.on("load", callback);
  }

  /* Logic and overriden functions */

  each(callback) {
    this.forEach(callback);
  }

  /**
   * Execute a function for each element in an AccentNodeList
   * @param {callback} callback - The function that will be executed for each element in the AccentNodeList
   */
  forEach(callback) {
    super.forEach((e, i) => callback(new AccentNodeList(e), i));
  }
}

// A collection of AccentNodeLists
class AccentNodeCollection extends AccentNodeList {
  each(callback) {
    this.forEach(callback);
  }

  /**
   * Add an event listener to each element of the AccentNodeList in an AccentNodeCollection
   * @param {*} ev - The event to add
   * @param {*} callback - The event handler
   */
  on(ev, callback) {
    this.forEach((e) => {
      e.on(ev, callback);
    });
  }

  /**
   * Set a certain attribute of all stored elements in this AccentNodeCollection
   */
  set(attr, val, concat, callback) {
    this.forEach((e) => {
      e.set(attr, val, concat, callback);
    });
  }

  /**
   * Get a certain attribute of all stored elements in this AccentNodeCollection
   */
  get(attr, val) {
    this.forEach((e) => {
      e.get(attr, val);
    });
  }
}

// DOM
const $el = _AccentUtil._get;
const $ready = (e) => _AccentUtil._onReady(document, e);

// Objects
const $obj = AccentUtilObject;

// Debugging
const $log = console.log;
const $warn = console.warn;
const $err = console.error;
