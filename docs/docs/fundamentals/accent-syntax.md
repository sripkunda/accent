---
sidebar_position: 2
---

# Accent Syntax

Accent tries to be as simple as possible by using familiar, predictable, and consistent syntax styles throughout all libraries. The syntax style for different parts of Accent.js is outlined below.

## Directives

Directives are custom attributes that can be added to HTML elements for adding complex JavaScript functionality with less code.

### Prefix

A directive prefix is the first half of an Accent directive. To avoid conflicting keywords and confusion, some libraries have different prefixes.

Usually, the prefix for Accent is `ac-`, with the exception of the Accent Router, which uses the `router-` prefix.

Here is an example of an element that uses a directive. You can see the `ac-` prefix in the `ac-bind` directive that is being used.

```html
<h1 ac-bind="title"></h1>
```

### Secondary Prefix

A helper prefix adds functionality to existing directives. The prefix for secondary prefixes may vary, but usually are `:` or `*`. An example of this is provided below.

```html
<button ac-on *onmouseover="doSomething();" *onclick="doSomething();">
  Click Me
</button>
```

or:

```html
<span ac-bind :style="myStyles" :class="myClassNames">...</button>
```

### Helper Directive

Helper directives add functionality to certain elements specific to Accent.js. An example of this is the `@subscribe` directive, which you can read more about [here](/docs/renderer/directives).

The helper prefix for Accent is `@`. This is generally consistent throughout all libraries.

Example:

```html
<ac @subscribe="myVar">...</ac>
```

## JavaScript Logic

Accent's JavaScript always uses the `$` identifier to denote the start of an accent-related action. Some examples of this include `$router`, `$context`, `$anim`, `$directive`, etc.

**Example:**

```js
// Initialize Accent Router
Accent.$router({
  home: {
    path: "/",
    src: "/pages/home.html",
  },
});

// Set a variable in the body's context.
Accent.$context(document.body).foo = "bar";
console.log(Accent.$context(document.body).foo); // bar;
```

## Custom HTML Tags

The syntax for Accent's custom tags maintain consistency relative to each library. For example, all Accent Components are to be denoted with `<component>` and router-related tags begin with `router-`.

**Example:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Accent App</title>
  </head>

  <body>
    <my-component></my-component>
    <router-target></router-target>
    <!-- <router-[something]> -->
    <component ref="my-component">This is Accent!</component>
    <!-- <component>- -->

    <!-- Accent.js -->
    <script src="https://unpkg.com/@accent/router"></script>
    <script src="https://unpkg.com/@accent/components"></script>
    <script src="https://unpkg.com/@accent/renderer"></script>
  </body>
</html>
```
