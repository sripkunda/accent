---
sidebar_position: 1
---

# Modularity

Accent.js is made to be modular, meaning that, unlike other frameworks, it has no true "core." It is made up of many different standalone libraries that, when put together, work together as a framework.

If you wish to only use a certain set of features for your application, you can do so by only including those libaries in your application.

## List of Libraries

[**Renderer:**](/docs/renderer/intro) Implement reactive, state-based (also called contexts) JavaScript logic in your application. The Renderer library also provides built-in directives (custom HTML attributes) that allow for complex JavaScript logic in your HTML code.

[**Router:**](/docs/router/intro) Add client-side routing to your application to create fast single-page-applications.

[**Components:**](/docs/components/intro) Create reusable components in your HTML code (compartmentalization).

[**Animations:**](/docs/animations/intro) Add state-based CSS transitions in your HTML code.

## Adding Libraries

### Using One Library

Here, we are adding only the **router** library into our application.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Accent App</title>
  </head>

  <body>
    ...
    <script src="https://unpkg.com/@accent/router"></script>
  </body>
</html>
```

### Adding Multiple Libraries

Here, we are adding both the **router** and **renderer** libraries into our application.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Accent App</title>
  </head>

  <body>
    ...
    <script src="https://unpkg.com/@accent/router"></script>
    <script src="https://unpkg.com/@accent/renderer"></script>
  </body>
</html>
```

### Usage Through Modules

Accent creates one global object for all functionality across all libraries to maintain consistency and simplicity. Because of this, importing specific exports from each each library is currently not supported.

To use Accent in the browser, import each library globally as shown below.

```js
import "@accent/renderer";
import "@accent/router";
import "@accent/components";
```

To access specific methods and functionality, use the global `Accent` object.

```js
import "@accent/renderer";
import "@accent/router";
import "@accent/components";

Accent.$context(document.body, {
  foo: "bar",
});

// More code ...
```
