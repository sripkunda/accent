---
sidebar_position: 8
---

# ac-model

Create a two-way binding to an element in the local context.

## Usage

### What is a Two-Way Binding? 

Simply put, a two-way binding creates an equally dependent relationship between an element in the DOM and a variable in the local context group. Unlike `ac-bind`, which is a one-way binding, `ac-model` ensures that when the content of your DOM changes, the variable in the context also changes. When the variable in the context changes, the value of the attributed element changes. The data is in-sync at all times.

> **Note:** It is important to keep in mind that `ac-model` is only activated by user input. Changing an element's value dynamically will not trigger the binding. Currently, the only elements with the `oninput` event are supported. 

### Creating a Two-Way Binding

**Usage:** `<element ac-model="name of variable in context..."></element>`

Let's use the `ac-model` 

```html
<div ac-context="{ name: '' }">
    <input type="text" ac-model="name"/>
    Hello <p ac-bind="name"></p>!
</div>
```

In the example above, we are displaying `Hello [name]` reactively, meaning that every time the `name` variable in the context changes (in this case because of the `ac-model`), the `<p>` tag's content will also be changed. 