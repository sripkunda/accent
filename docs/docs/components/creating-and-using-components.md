---
sidebar_position: 2
---

# Creating and Using Components

## What Are Components?

Components are reusable segments of code that can be implemented anywhere in the scope of the window. In the Accent Components library, components can be created with the `<component>` tag. The syntax is detailed below.

## Usage

### From `innerHTML`

All components use the same general syntax:

```html
<component ref="name of component">
  <!-- Content of component... -->
</component>
```

Let's create a component called `accent-logo` that will display the Accent logo every time it is used. To do so, we would use the format below.

```html
<component ref="accent-logo">
  <!-- SVG Content of Logo -->
</component>
```

The `innerHTML` of the `<component>` element will be the content of the component, while the `ref` attribute denotes the name of the component. Our finished component should look something like this:

```html
<component ref="accent-logo">
  <svg
    version="1.1"
    viewBox="0.0 0.0 256.0 256.0"
    fill="none"
    stroke="none"
    stroke-linecap="square"
    stroke-miterlimit="10"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/2000/svg"
  >
    <clipPath id="p.0">
      <path d="m0 0l256.0 0l0 256.0l-256.0 0l0 -256.0z" clip-rule="nonzero" />
    </clipPath>
    <g clip-path="url(#p.0)">
      <path
        fill="#000000"
        fill-opacity="0.0"
        d="m0 0l256.0 0l0 256.0l-256.0 0z"
        fill-rule="evenodd"
      />
      <path
        fill="#000000"
        fill-opacity="0.0"
        d="m12.04462 127.845146l0 0c0 -64.125916 51.913815 -116.11024 115.95276 -116.11024l0 0c30.752579 0 60.24562 12.233008 81.99098 34.0079c21.745361 21.77489 33.961777 51.307987 33.961777 82.10234l0 0c0 64.12591 -51.91382 116.11024 -115.95276 116.11024l0 0c-64.03894 0 -115.95276 -51.98433 -115.95276 -116.11024z"
        fill-rule="evenodd"
      />
      <path
        stroke="#5bc3eb"
        stroke-width="24.0"
        stroke-linejoin="round"
        stroke-linecap="butt"
        d="m12.04462 127.845146l0 0c0 -64.125916 51.913815 -116.11024 115.95276 -116.11024l0 0c30.752579 0 60.24562 12.233008 81.99098 34.0079c21.745361 21.77489 33.961777 51.307987 33.961777 82.10234l0 0c0 64.12591 -51.91382 116.11024 -115.95276 116.11024l0 0c-64.03894 0 -115.95276 -51.98433 -115.95276 -116.11024z"
        fill-rule="evenodd"
      />
      <path
        fill="#000000"
        fill-opacity="0.0"
        d="m0 -14.086615l256.0 0l0 310.2677l-256.0 0z"
        fill-rule="evenodd"
      />
      <path
        fill="#5bc3eb"
        d="m58.876244 227.23526q-8.390625 0 -12.0 -5.75q-3.59375 -5.765625 0.25 -13.9375l63.359375 -140.39062q3.109375 -6.968746 7.546875 -9.968746q4.453125 -3.0 10.203133 -3.0q5.53125 0 9.96875 3.0q4.4375 3.0 7.5625 9.968746l63.59375 140.39062q3.84375 8.40625 0.484375 14.046875q-3.359375 5.640625 -11.53125 5.640625q-6.71875 0 -10.4375 -3.234375q-3.71875 -3.25 -6.59375 -9.96875l-12.0 -27.84375l-82.56251 0l-11.765625 27.84375q-3.109375 6.96875 -6.46875 10.09375q-3.359375 3.109375 -9.609375 3.109375zm68.890625 -137.76562l-30.484375 72.25001l61.437508 0l-30.484375 -72.25001l-0.46875763 0z"
        fill-rule="nonzero"
      />
    </g>
  </svg>
</component>
```

Now, we can use our component using its custom HTML tag (the `ref` attribute).

```html
<accent-logo></accent-logo>
```

### From an External File

Sometimes, a particular component is too big to be comfortably placed in your HTML file. For this, you can load a component in an external file and load it directly using the `src` attribute.

**logo.svg: **

```html
<svg
  version="1.1"
  viewBox="0.0 0.0 256.0 256.0"
  fill="none"
  stroke="none"
  stroke-linecap="square"
  stroke-miterlimit="10"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns="http://www.w3.org/2000/svg"
>
  <clipPath id="p.0">
    <path d="m0 0l256.0 0l0 256.0l-256.0 0l0 -256.0z" clip-rule="nonzero" />
  </clipPath>
  <g clip-path="url(#p.0)">
    <path
      fill="#000000"
      fill-opacity="0.0"
      d="m0 0l256.0 0l0 256.0l-256.0 0z"
      fill-rule="evenodd"
    />
    <path
      fill="#000000"
      fill-opacity="0.0"
      d="m12.04462 127.845146l0 0c0 -64.125916 51.913815 -116.11024 115.95276 -116.11024l0 0c30.752579 0 60.24562 12.233008 81.99098 34.0079c21.745361 21.77489 33.961777 51.307987 33.961777 82.10234l0 0c0 64.12591 -51.91382 116.11024 -115.95276 116.11024l0 0c-64.03894 0 -115.95276 -51.98433 -115.95276 -116.11024z"
      fill-rule="evenodd"
    />
    <path
      stroke="#5bc3eb"
      stroke-width="24.0"
      stroke-linejoin="round"
      stroke-linecap="butt"
      d="m12.04462 127.845146l0 0c0 -64.125916 51.913815 -116.11024 115.95276 -116.11024l0 0c30.752579 0 60.24562 12.233008 81.99098 34.0079c21.745361 21.77489 33.961777 51.307987 33.961777 82.10234l0 0c0 64.12591 -51.91382 116.11024 -115.95276 116.11024l0 0c-64.03894 0 -115.95276 -51.98433 -115.95276 -116.11024z"
      fill-rule="evenodd"
    />
    <path
      fill="#000000"
      fill-opacity="0.0"
      d="m0 -14.086615l256.0 0l0 310.2677l-256.0 0z"
      fill-rule="evenodd"
    />
    <path
      fill="#5bc3eb"
      d="m58.876244 227.23526q-8.390625 0 -12.0 -5.75q-3.59375 -5.765625 0.25 -13.9375l63.359375 -140.39062q3.109375 -6.968746 7.546875 -9.968746q4.453125 -3.0 10.203133 -3.0q5.53125 0 9.96875 3.0q4.4375 3.0 7.5625 9.968746l63.59375 140.39062q3.84375 8.40625 0.484375 14.046875q-3.359375 5.640625 -11.53125 5.640625q-6.71875 0 -10.4375 -3.234375q-3.71875 -3.25 -6.59375 -9.96875l-12.0 -27.84375l-82.56251 0l-11.765625 27.84375q-3.109375 6.96875 -6.46875 10.09375q-3.359375 3.109375 -9.609375 3.109375zm68.890625 -137.76562l-30.484375 72.25001l61.437508 0l-30.484375 -72.25001l-0.46875763 0z"
      fill-rule="nonzero"
    />
  </g>
</svg>
```

**index.html:**

```html
<component ref="accent-logo" src="/path/to/logo.svg"></component>
```

### Using `$component`

Sometimes, we want to create components on the fly using JavaScript. We can do this using the `$component` method.

**Usage:** `Accent.$component(id, template);` where `id` is equivalent to the `ref` attribute and `template` is the content of the component.

```js
const sayHi = Accent.$component("say-hi", `<p>Hey!</p>`);
```

Now our HTML will automatically compile all related components.

```html
<say-hi></say-hi>
```

becomes:

```html
<p>Hey!</p>
```

### Force Compilations and Recompilations

Similarly, sometimes we need to forcefully recompile a particular component. Although this should be a "last resort," the `$compile` and `$recompile` methods allow you to do this. Let's build off of our previous example.

```js
// Recompile every single component in document.body
Accent.$component().$recompile(document.body);
// Compile a particular component
sayHi.$compile();
```

This concept can be extended to prevent errors and bugs in edge cases.
