"use strict";

/**
 * Class that stores animations and style states in the AccentAnimate library
 */
class AccentAnimation {
  #elements = new Map(); // The elements that the animation is applied to
  #speed; // The execution speed for the animation
  states; // The states of the animation
  currentState; // The current state of the animation

  /**
   * Create a new AccentAnimation
   * @param {string} state - The starting state of the animation
   * @param {Object} states - The states of the animation
   * @param {number} speed - The speed in seconds of the animation
   */
  constructor(state, states, speed) {
    if (!(typeof states === "object" && states[state]))
      throw Error(_AccentAnimationErrors.STATE_NOT_FOUND());
    this.states = states; // Set the states of the animation
    this.#speed = speed; // Set the speed of the animation
    this.currentState = state; // Set the current state
  }

  /**
   * Apply an animation to a specific element
   * @param {(string|HTMLElement)} selector - The selector of the element to apply the animation to
   * @param {function} callback - The function to be called after the animation is applied
   * @return {AccentAnimation} - This AccentAnimation instance
   */
  apply(selector, callback) {
    selector = AccentAnimation.#getObjectFromSelector(selector);
    if (!selector)
      throw new Error(_AccentAnimationErrors.ELEMENT_NOT_FOUND(selector));
    selector.style.transition = `all ${this.#speed}s`;
    this.#updateState(this.currentState, selector, callback);
    return this;
  }

  /**
   * Set a new speed for the animation
   * @param {number} speed - The new speed to be set in seconds
   */
  setSpeed(speed) {
    this.speed = speed;
    this.#elements.forEach((e) => (e.style.transition = `all ${speed}s`));
  }

  /**
   * Set the state of the AccentAnimation
   * @param {string} state - The new state to go to
   * @param {function} callback - The callback to be executed after the state is changed
   */
  state(state, callback) {
    if (state == _AccentAnimationConfig.TOGGLE_IDENTIFIER) {
      const st = Object.keys(this.states);
      state = st.indexOf(this.currentState) > 0 ? st[0] : st[1];
    }
    this.#updateState(state, null, callback);
  }

  /**
   * Add a state to the AccentAnimation
   * @param {string} name - The name of the state
   * @param {Object} properties - The properties of the state
   */
  addState(name, properties) {
    this.states[name] = properties;
  }

  #updateState(state, el, callback) {
    this.currentState = state;
    if (el) this.#elements.set(el, this.currentState);
    this.#animate(callback, el);
    return this;
  }

  /**
   * Execute an AccentAnimation
   * @param {function} callback - The callback that is to be executed after the animation
   * @param {HTMLElement} el - The element to update (updates all bound elements if left blank)
   * @return {*} - The return value of the callback or the AccentAnimation instance
   */
  #animate(callback, el) {
    const state = this.currentState;
    const update = (el) => {
      const props = this.states[state];
      if (!props)
        throw new Error(_AccentAnimationErrors.STATE_NOT_FOUND(state));
      Object.keys(props).forEach((prop) => {
        el.style[prop] = props[prop];
      });
    };
    el ? update(el) : this.#elements.forEach((st, el) => update(el));
    return callback ? callback(this) : this;
  }

  /**
   * Create a fade animation
   * @param {*} fadeState - Start at faded "in" or "out"
   * @param {(string|HTMLElement)} selector - The element (or element selector) of the element to apply the animation to.
   * @param {number} speed - The speed of the fade animation
   * @param {function} callback - The function to be executed (once) after the animation is applied.
   * @return {AccentAnimation} - The AccentAnimation that was created
   */
  static fade(fadeState, selector, speed, callback) {
    return new AccentAnimation(
      fadeState,
      {
        out: {
          opacity: 0,
        },
        in: {
          opacity: 1,
        },
      },
      speed
    ).apply(selector, callback);
  }

  /**
   * Find an element in the HMTL
   * @param {(string|HTMLElement)} selector - The selector that is used to search the DOM .
   * @return {Object} - The element object that is found from the selector
   */
  static #getObjectFromSelector(selector) {
    return typeof selector === "object"
      ? selector
      : document.querySelector(selector);
  }
}

/**
 * Apply an animation to an element.
 * @param {(string|HTMLElement)} selector - Selector of element to apply animation to.
 * @param  {...any} args - AccentAnimation initialization arguments
 */
const $anim = (selector, ...args) => {
  const anim = new AccentAnimation(...args);
  anim.apply(selector).state(anim.currentState);
};

const $fade = AccentAnimation.fade; // Create a fade in/out animation using preset states.

/**
 * Potential errors for the AccentAnimation library
 */
const _AccentAnimationErrors = {
  AccentLibraryName: `Accent.js Animate`,
  ELEMENT_NOT_FOUND: (...params) => {
    return `${_AccentAnimationErrors.AccentLibraryName}: Element ${params[0]} was not found.`;
  },
  STATE_NOT_FOUND: (...params) => {
    return `${_AccentAnimationErrors.AccentLibraryName}: State ${params[0]} was not found in animation.`;
  },
};

/**
 * Configuration for AccentAnimation library
 */
const _AccentAnimationConfig = {
  TOGGLE_IDENTIFIER: `$toggle`,
};
