---
sidebar_position: 7
---

# ac-bind

Create a one-way binding to an element in the local context.

## Usage

### What is a binding?

A binding is a reactive relationship between an HTML Element and a piece of data, in this case in the local context. For more information about reactivity, read [the documentation on observables](/docs/renderer/observables).

## Creating a Binding

**Usage:** `<element ac-bind="name of variable in context..."></element>`

```html
<div ac-context="{ foo: 'bar' }">
  <h1 ac-bind="foo"></h1>
</div>
```

In this example, the `ac-bind` directive denotes a binding between the `<h1>` tag and the `foo` variable in the local context group. Once loaded, the `<h1>` content will be replaced with `bar`.

## Binding Other Attributes

When the `ac-bind` directive is used, the binding will always be between the specified variable and the `innerHTML` of the attributed element. In some cases, you may want to create bindings between other attributes, such as the `style` or `class` attributes. To do so, use the `:` secondary prefix.

**Usage:** `<element ac-bind :attribute="name of variable in context..."></element>`

Let's bind both the `style` and `class` attributes of an element.

```html
<div
  ac-context="{ myClassNames: 'foo bar', myStyles: 'background-color: red;' }"
>
  <h1 ac-bind :class="myClassNames" :style="myStyles"></h1>
</div>
```
