"use strict"; 

/**
 * The class that represents an AccentObject instance
 */
class Construct {
  observers = []; // The observers that are attached to the construct
  #object = {};
  value;

  constructor(obj) {
    this.#object = typeof obj === 'object' ? obj : {};  
    this.value = new Proxy(this.#object, {
      set: (target, prop, value) => {
        this.#object[prop] = value; // Set the value
        
        // Loop through observers and play the callbacks
        this.observers
          .filter((o) => o.key == prop)
          .forEach((observer, observerIndex, observers) => {
            observer?.callback(this.#object[prop], observer.data, observer, observerIndex, observers);
          }); 
        return true; 
      }
    }); 
  }

  /**
   * Execute a callback function whenever a certain piece of data in a constructor changes. 
   * @param {*} key - The key of the AccentConstruct that is being observed
   * @param {*} callback - The function that is to be called when the value of the key is changed. 
   * @param {*} dat - Additional data that is passed to the callback function
   * @returns {Object} - The newly added observer
   */
  observe(key, callback, dat) {
    return this.observers[this.observers.push({ key: key, data: dat, callback: callback }) - 1];
  }

  /**
   * Bind a property of an HTMLElement to a value in an AccentConstruct
   * @param {*} el - The element to bind to
   * @param {*} listener - The event to listen to for updates
   * @param {*} prop - The property of the element to read to set the value of the key
   * @param {*} key - The key to change/listen to
   */
  bind(el, listener, prop, key) {
    if (listener)
      el.addEventListener(listener, () => {
        this.value[key] = el[prop];
      });
    el[prop] = this.value[key]; 
    return this.observe(key, () => {
      el[prop] = this.value[key];
    });
  }
}

const $global = new Construct({}); // The default global construct
const $construct = (...args) => { return new Construct(...args) } // Creates a new construct
