---
sidebar_position: 2
---

# Creating Animations

## Understanding Animations 

Animations in accent are simply objects with two primary properties: elements and states. A state is simply a collection of CSS attributes that are applied to elements whenever that state is selected. "Elements" refers to the HTML elements that exist on your webpage. 

To create an animation, we use the `$animate` function (or `$anim` as a shorthand). 

**Usage:** `$anim(selector, initialState, statesObject)`, where `selector` refers to an arbitrary element that the animation should be assigned to, 

`initialState` refers to a starting state such that `typeof statesObject[initialState] !== "undefined"`, 

and `statesObject` is an object with all of the animations' states and their respective properties. 

**Example**

```js
// assume that "mySelector instanceof HTMLElement === true".
const MyAnim = Accent.$anim(mySelector, "hidden", {
    hidden: {
        display: "none"; 
    },
    visible: {
        display: ""; 
    }
});
```

## Managing States

To apply the animation to a new HTML element, use the `AccentAnimation.apply` function: 


```js
// assume that "mySecondSelector instanceof HTMLElement === true".
MyAnim.apply(mySecondSelector, (anim) => {
    // this is some callback function
    // (anim === MyAnim) === true
});
```

To change the state of the animation, we can use the `AccentAnimation.state` function: 

```js
// assume that "mySecondSelector instanceof HTMLElement === true".
MyAnim.state("visible", (anim) => {
    // this is some callback function
    // (anim === MyAnim) 
});
```

To change the state of the animation, we can use the `AccentAnimation.addState` function: 

```js
MyAnim.addState("red", {
    color: "red"
});
```

Here, we have adde a new state called "red" that, when activated, sets the `color` attribute of each applicable element to `"red"`. 
