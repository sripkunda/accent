---
sidebar_position: 13
---

# ac-if

Render an element in the DOM based on the result of a specified boolean expression.

## Usage

**Syntax:** `<element ac-if="your expression..."></element>`

Let's say we have the following variables:

```js
const show = true;
const foo = true;
const bar = false;
```

```html
The output is <span ac-if="show && foo">foo</span
><span ac-if="show && bar">bar</span>
```

This would result in: `The output is foo`.

If we had provided the following variables instead:

```js
const show = false;
const foo = false;
const bar = true;
```

We would get, `The output is bar`.

### The `@subscribe` Helper Directive

To create reactive `ac-if` sections, we can use the `@subscribe` helper directive. You can read more about this directive [here](docs/renderer/text-interpolation#using-subscribe-to-listen-for-changes)

Let's transfer the `foo`, `bar`, and `show` variables to a local context group and create a subscription on the `<span>` elements to the variables that we are using. Remember to use the `this` keyword when referring to items in context.

```html
<div ac-context="{ show: true, foo: true, bar: false }" @id="myContext">
  The output is
  <span ac-if="this.show && this.foo" @subscribe="foo, show">foo</span
  ><span ac-if="this.show && this.bar" @subscribe="bar, show">bar</span>
</div>
```

This results in `The output is foo`.

Now, if we change a particular variable in the context, the view will automatically update.

```js
Accent.$context("myContext").show = false;
```

Now, the DOM is automatically updated to `The output is`.
