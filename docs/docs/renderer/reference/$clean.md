---
sidebar_position: 3
---

# $clean

Clean all subscribers to an Observable that contain references to non-existant HTML references.

> **Note:** `$clean` is a member of an AccentObservable object. Refer to [the documentation for observables]($observable) for more information.

## Parameters

The `$clean()` method does need any parameters.

## Example

Let's clean the `foo` member of a pre-defined Accent context group.

**Our Context Group:**

```html
<div ac-context="{ foo: 'bar' }" @id="myContext">
  <!-- ... -->
</div>
```

**Cleaning:**

```js
Accent.$context("myContext").$clean(); // Cleans the entire context for 'dead' subscriptions
```
