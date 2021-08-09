---
sidebar_position: 3
---

# Directives

Directives are HTML attributes that allow you to control the behavior of the DOM with underlying JavaScript logic. 

Accent comes with pre-made directives that solve common problems of web applications, but custom directives with custom prefixes, behavior, and logic can be created to suit your use case.

## Accent Directives

Accent currently comes with a total of 10 directives. A brief overview of each directive can be found below.

| Directive            | Description                                        |
| -------------------- | -------------------------------------------------- |
| [`ac-context`](reference/ac-context) | Create a context group from the attributed element |
| [`ac-ref`](reference/ac-ref)         | Add a reference to the attributed element in the local context group |
| [`ac-bind`](reference/ac-bind)       | Create a one-way binding between the attributed element and a key in the local context group. |
| [`ac-model`](reference/ac-model)     | Create a two-way binding between the attributed element and a key in the local context group. |
| [`ac-if`](reference/ac-if)           | Hide/show the attributed element based on a boolean expression |
| [`ac-show`](reference/ac-show)       | Hide/show the attributed element based on a boolean key in the local context group |
| [`ac-for`](reference/ac-for)         | Render the inner content of the attributed element reactively for every key in a given iterable. |
| [`ac-on`](reference/ac-on)           | Add an event listener to an element with awareness of the local context. |
| [`ac-click`](reference/ac-click)     | Add an `onclick` event listener to an element with awareness of the local context. |
| [`ac-submit`](reference/ac-submit)   | Add an `onsubmit` event listener to an element with awareness of the local context.|

Click on any directive in the table above for a full reference of its functionality and syntax.

## Using Directives

### Basic Usage 

Directives are to be used on an element in your HTML code as shown below. 

```html
<body ac-context="{ foo: 'bar' }">
    <h1 ac-bind="foo"></h1>
</body>
```

In the example above, the `ac-context` and `ac-bind` directives were used to modify the behavior of the `<body>` and `<div>` tags. 

### The Secondary Prefix 

Some directives in Accent may have a secondary prefix. These are additional attributes added to your HTML element that affects the behavior of the parent directive. A good example of this is the `ac-bind` directive. 

```html
<body ac-context="{ myStyle: `background-color: 'red';` }">
    <h1 ac-bind :style="foo"></h1>
</body>
```

In the above example, the `:` functions as a secondary prefix for the `ac-bind` directive. 

### Helper Directives

Helper directives add specific functionality to particular HTML elements.

A good example of this is the `@subscribe` directive. (The example below uses text interpolation, which you can read more about [here](text-interpolation).)

**Note:** The prefix for helper directives is `@`.

```html
<body ac-context="{ foo: 'bar' }">
    <ac @subscribe="foo">this.foo</ac>
</body>
```

Here, the `@subscribe` helper directive indicates that this `<ac>` tag should be recompiled by Accent every time the value of `foo` in the local context changes.

Many directives require a conceptual understanding of [units](units) in Accent. For more information about a specific directive, see the reference.