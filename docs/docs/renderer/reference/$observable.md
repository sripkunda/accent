---
sidebar_position: 1
---

# $observable

## Parameters

Creates an Accent observable from a given object.

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| value     | `Object` | The object to create an observable from. |

## Example

Creating an observable from the object `{ name: 'foo', description: 'bar' }`

```js
let obj = Accent.$observable({
  name: "foo",
  description: "bar",
});
```

This returns a `Proxy` object, from which you can modify and read members of the observable and use observable-specific functionality.
