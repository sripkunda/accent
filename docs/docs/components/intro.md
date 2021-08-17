---
sidebar_position: 1
---

# Introduction

## Getting Started

### What is the Accent Renderer?

Accent Components allows for compartmentalization of HTML into components, meaning that a block of reusable code such as:

```html
<p>Reuse me</p>
```

Can be simplified to:

```html
<reuse-me></reuse-me>
```

The library also integrates well with the Accent Renderer, making it the optimal code-reusability library for Accent.js

## Installation

Install the renderer library with NPM or by CDN:

```shell
npm install @accent/components
```

```html
<script src="https://unpkg.com/@accent/components"></script>
```

### Example Page

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Accent Components Todo List</title>
  </head>

  <body>
    <div>
      <task></task>
      <task></task>
      <task></task>
    </div>

    <component ref="task">
      <div class="task-heading">My Task</div>
      <div class="task-description">My task description</div>
      <button>Remove Task</button>
    </component>
    <!-- Accent.js -->
    <script src="https://unpkg.com/@accent/components"></script>
  </body>
</html>
```

### Core Concepts

- [Creating and Using Components](creating-and-using-components)
- [Behind The Scenes](behind-the-scenes)
