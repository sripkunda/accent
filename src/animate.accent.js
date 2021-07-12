"use strict"; 

class AccentAnimation {
    #elements = new Map(); 
    #states;
    #speed; 
    currentState; 

    constructor(state, states, speed) {
        this.#states = states; 
        this.#speed = speed; 
        this.currentState = state; 
    }

    apply(selector) {
        selector = AccentAnimation.#getObjectFromSelector(selector); 
        selector.style.transition = `${this.#speed}s`;
        this.#updateState(selector, this.currentState); 
        return this; 
    }

    #animate(state = this.currentState, callback) {
        this.currentState = state; 
        this.#elements.forEach((st, el) => {
            const props = this.#states[state]; 
            Object.keys(props).forEach(prop => {
                el.style[prop] = props[prop]; 
            });
        });
        return callback ? callback(this) : this; 
    }

    speed(s) { this.speed = s; }

    state(state, callback) { this.#animate(state, callback); }
    addState(name, state) { this.#states[name] = state; }

    #updateState(el, state) {
        this.currentState = state; 
        this.#elements.set(el, this.currentState); 
    }

    static fadeIn(selector, speed, callback) { return AccentAnimation.fade("in", ...arguments); }
    static fadeOut(selector, speed, callback) { return AccentAnimation.fade("out", ...arguments); }
    static fade(state, selector, speed, callback) {
        return new AccentAnimation(state, {
            out: {
                opacity: 0,
                display: "none",
            },
            in: {
                opacity: 1, 
                display: "block",
            }
        }, speed).apply(selector).apply(selector).#animate(state, callback);
    }

    static #getObjectFromSelector(selector) {
        return typeof selector === 'object' ? selector : document.querySelector(selector); 
    }

}

const $anim = (selector, ...args) => {
    const anim = new AccentAnimation(...args)
    anim.apply(selector).state(anim.currentState);
}

const $fadeIn = AccentAnimation.fadeIn; // Fading in animation
const $fadeOut = AccentAnimation.fadeOut; // 

/**
 * Potential errors for the AccentAnimation library
 */
const _AccentAnimationErrors = {
    AccentLibraryName: `Accent.js Animate`,
    ELEMENT_NOT_FOUND_ERROR: (...params) => {
        throw Error(`${_AccentAnimationErrors.AccentLibraryName}: Element ${params[0]} was not found.`);
    }
}
