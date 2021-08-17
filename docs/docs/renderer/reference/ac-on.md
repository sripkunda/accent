---
sidebar_position: 9
---

# ac-on

Create context-aware event listeners on elements.

## Usage

### Creating Event Listeners

The `ac-on` directive uses the `*` secondary prefix to denote specific event listeners. Multiple event listeners can be added by including multiple `:` notations.

**Usage:** `<element ac-on *event="action"></element>`

> **Note:** The `ac-on` directive must be included in order to use the `*` helper prefix.

In the below example, we are adding an onclick event. In this case, it acts similarly to the defualt HTML `onclick` attribute.

```html
<button ac-on *onclick="alert('The button has been clicked')">Click Me</button>
```

### Accessing Members in Context

Unlike the default HTML event listeners, `ac-on` allows for access to the local context through the `this` keyword, where `this` refers to the scope of the context.

```html
<body ac-context="{ foo: 'bar' }">
  <button ac-on *onclick="alert(this.foo);">Click Me</button>
  <!-- Alerts 'bar' -->
</body>
```

In the example above, we are accessing the `foo` variable through the `this` keyword in the `*onclick` event.

### Multiple Event Listeners

Using the concept of the `*` secondary prefix, we can add multiple event listeners on an element.

```html
<body ac-context="{ foo: 'bar' }">
  <button
    ac-on
    *onclick="alert(this.foo);"
    *onmouseover="alert('Your mosue hovered over me!')"
  >
    Click Me
  </button>
  <!-- Alerts 'bar' -->
</body>
```

In the example above, we added both the `*onclick` and `*onmouseover` events to the `<button>` element.
