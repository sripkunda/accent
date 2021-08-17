---
sidebar_position: 14
---

# ac-show

`ac-show` allows for reactive rendering of DOM elements based on boolean values in the local context group.

## Usage

**Syntax:** `<element ac-show="name of variable in context..."></element>`

```html
<div ac-context="{ foo: true }" @id="myContext">
  <span ac-show="foo"> Foo is true! </span>
</div>
```

The result of the example above is `Foo is true!`

Now, the `<span>` element is bound to the boolean value of the `foo` variable in the local context, meaning that whenever the context changes, the view is automatically updated along with it.

```js
Accent.$context("myContext").foo = false;
```

The code above will result in the `<span>` element hiding itself in the DOM.
