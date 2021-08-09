---
sidebar_position: 2
---

# Observables

## Introduction to Reactivity

Many of Accent's features are based on the concept of **reactivity**. This means that when the state of your application is changed, the change will be reflected appropriately in the view (or in the DOM).

An observable in Accent is just any variable that triggers another event whenever it is set, whether that is a miscellaneous JavaScript option, or a reactive element that changes in relation to the HTML DOM.

## Structure of Observables

Observables in Accent are always stored as objects with properties. Subscriptions to an observable are used to listen to changes in observable properties. Multiple subscriptions can be made to a single key in an observable.

Subscriptions on observables are currently one-dimensional, meaning that the keys of nested objects cannot have observable listeners linked to the parent object.

## Working With Observables

### Creating an Observable

To create an observable, use the `$observable` method.

```js
const myObservable = Accent.$observable({
  foo: "bar",
  bar: "foo",
});
```

We can now access our observable using the `myObservable` identifier.

### Subscribing to Observable Changes

To subscribe to changes on an observable, we need to use the `$subscribe` method. Specify the key that you want to subscribe to, followed by a function that is to be called every time the value of the specified key changes.

```js
myObservable.$subscribe("foo", (value) => {
  console.log(value); // The new value of "foo"
});
```

In the example above, every time the value of `foo` in `myObservable` changes, the new value of `foo` will be logged to the console.

You can also add custom data specific to each subscriber. This data can be accessed using the second parameter in your callback function.

```js
myObservable.$subscribe(
  "bar",
  (value, data) => {
    console.log(data); // { myVariable: true }
  },
  {
    myVariable: true,
  }
);
```

Many of Accent's features, such as bindings and contexts, use observables for reactivity. However, they can also be used by themselves to implement custom logic.