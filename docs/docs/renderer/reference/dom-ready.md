---
sidebar_position: 16
---

# renderer:dom-ready

An event that triggers once the DOM has been fully compiled and loaded, including all directives, units, and text interpolation.

## Adding Listeners

To add a listener, use JavaScript's `addEventListener` method.

```js
document.addEventListener("renderer:dom-ready", () => {
  // Do something...
});
```

## Use Cases

The DOM ready event is mainly used to ensure that a certain action is completed after the full execution of the Accent Renderer compiler.

Let's say that we have some internal JavaScript to execute before fully loading our view, such as an API call or variable declaration, but we want logic that accesses an Accent Context afterwards.

```html
<body ac-context="{}" @id="myContext">
  <h1 @subscribe="foo" ac>this.foo</h1>
</body>
```

**JS (Executes before Accent.js Renderer file):**

```js
const foo = "bar";
```

In such a case, we will use the `renderer:dom-ready` event to ensure that certain logic executes only after the DOM is compiled.

```js
/* Our previous code: */
const foo = "bar";

document.addEventListener("renderer:dom-ready", () => {
  Accent.$context("myContext").foo = foo;
});
```
