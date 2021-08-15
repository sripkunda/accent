---
sidebar_position: 6
---

# ac-context

Create Accent contexts on an HTML element using markup. 

## Usage

### Basic Usage

`<element ac-context="{ your data... }"></element>`

Let's make an Accent context with the data `{ foo: 'bar' }`

```html
<body ac-context="{ foo: 'bar' }">
 <!-- ... -->
</body>
```

### Helper Directives

| Directive  | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `@id`      | The ID of the context                                                  |
| `@extends` | The parent context for the newly created context (context inheritance) |

Below is an example of context inheritance with an assigned context ID. This can be done with the helper directives above. 

```html
<body ac-context="{ foo: 'bar' }" @id="bodyContext">
    <div ac-context="{ bar: 'baz' }" @extends="bodyContext" @id="secondContext">
        <!-- ... -->
    </div>
</body>
```

In the example above, `secondContext` inherits all properties of `bodyContext`, meaning that the context scope of `secondContext` is now `{ foo: 'bar', bar: 'baz' }`.

