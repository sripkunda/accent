---
sidebar_position: 1
---

# Introduction

## Getting Started

### What is this?

The Accent Renderer provides support for directives, reactive variables, scoped groups, and inline JavaScript logic. The main purpose of the Renderer is to provide a toolkit for organized, clean, and reusable code. It gives you the ability to implement complex JavaScript functionality in your HTML code, along with an extensive API that can be customized to fit your application's needs.

### Installation

Install the renderer library with NPM or by CDN:

```shell
npm install @accent/renderer
```

```html
<script src="https://unpkg.com/@accent/renderer"></script>
```

### Example Page

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Accent Renderer Todo List</title>
  </head>

  <body ac-context="{ foo: 'bar' }">
    <h1 ac-bind="foo"></h1>
    <!-- Outputs Bar -->
    <button ac-click="this.foo = 'baz';">Click Me</button>
    <!-- Changes content of the <h1> tag to 'baz'-->
    <!-- Accent.js -->
    <script src="https://unpkg.com/@accent/renderer"></script>
  </body>
</html>
```

### Core Concepts

- [Observables](observables)
- [Directives](directives)
- [Units (Scoped Groups)](units)
- [Text Interpolation](text-interpolation)
- [Special Scenarios](special-scenarios)
