---
sidebar_position: 4
---

# $context

Create and access Accent Contexts through JavaScript.

## Parameters

| Parameter            | Type       | Description                                                                                                 |
| -------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| selector             | `HTMLElement` `string` | The ID of an existing Accent context or an HTML element reference of a new or existing context. |
| scope                | `Object`               | The data that will be stored in the new Accent context.                                         |
| id                   | `string`               | The ID of the new Accent context.                                                               |

## Example 

### Creating Accent Contexts

Let's create an Accent context on the `<body>` element with the data `{ foo: 'bar' }`. We will call this context. 

> **Note:** The `id` parameter is optional, even while creating Accent contexts.

```js
Accent.$context(document.body, {
    foo: 'bar'
}, "bodyContext");
```

### Accessing Accent Contexts

To access existing Accent contexts, we will omit the `scope` and `id` parameters. Once accessed, the data of the context will be returned. 

```js
Accent.$context(document.body); // { foo: 'bar' }
Accent.$context("bodyContext"); // { foo: 'bar' }
```