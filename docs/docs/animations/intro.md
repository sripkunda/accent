---
sidebar_position: 1
---

# Introduction

## Getting Started

### What is an Accent Animate?

Accent animations can be used to create state-based CSS logic for a set of elements. This means that CSS properties of multiple elements can be managed at once to create a manageable set of stylistic attributes for your web elements. 

```html
<p id="p1">make me red</p>
<p id="p2">and me too!</p>
```

```js
// ... 

const p1 = document.getElementById("p1"); 
const p2 = document.getElementById("p2")

const Red = Accent.$animate(p1, "red", {
    red: {
        color: "red"
    }, 
    none: {
        color: "",
    }
}); 

Red.apply(p2);
```

The library integrates seamlessly with all other Accent modules. 

## Installation

Install the animate library with NPM or by CDN:

```shell
npm install @accent/animate
```

```html
<script src="https://unpkg.com/@accent/animate"></script>
```