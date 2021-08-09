---
sidebar_position: 2
---

# $subscribe

Subscribe to changes on a specific value in an observable.

> **Note:** `$subscribe` is a member of an AccentObservable object. Refer to [the documentation for observables]($observable) for more information.

## Parameters

| Parameter            | Type       | Description                                                            |
| -------------------- | ---------- | ---------------------------------------------------------------------- |
| key                  | `string`   | The key of the member in the observable to subscribe to.               |
| instructions         | `function` | The function to execute every time the value of the given key changes. |
| data                 | `any`      | Custom data to be passed to the instructions                           |

The `instructions` function is called with the following parameters: 

| Parameter            | Type            | Description                                                  |
| -------------------- | --------------- | ------------------------------------------------------------ |
| value                | `HTMLElement`   | The new value of the member that has been subscribed to      |
| data                 | `string`        | The data that was stored in the subscriber.                  |

## Example

Let's subscribe to the `foo` member such that the new value of `foo` and the stored data value of `bar` are printed out every time the value is changed.

```js
let obj = Accent.$observable({
    foo: 'bar'
});

obj.$subscribe("foo", (value, data) => {
    console.log(`'foo' is ${value}, 'bar' is ${data.bar}`);
}, { bar: true }); 

obj.foo = "baz"; // 'foo' is baz, 'bar' is true
```