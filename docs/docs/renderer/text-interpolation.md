---
sidebar_position: 5
---

# Text Interpolation

Text interpolation allows you to execute JavaScript logic in your HTML with access to local units (contexts, for groups, etc.). You can use this to enable reactivity in your DOM, or to conveniently execute inline JavaScript logic.

## Displaying Values 

### Introduction

Interpolation will automatically execute content inside of the `<ac>` and `</ac>` delimiters. Text interpolation accepts any type of JavaScript expression. In the example below, we are evaluating the sum of `1 + 2` in our expression.

```html
<h3>One plus two is <ac>1 + 2</ac></h3>
```

Accent will replace `<ac>1 + 2</ac>` with `<ac>3</ac>` when the interpolation is resolved. 

### Displaying Values From Contexts

Accent ensures that you have full control over your interpolation, including when it is executed or re-executed. This means that you can manually decide whether or not interpolation is reactive. 

When accessing members in the local context, use the `this` keyword.

```html
<body ac-context="{ foo: 'bar' }">
    <ac>this.foo</ac>
</body>
```

In the example above, Accent will replace `<ac>this.foo</ac>` with `<ac>bar</ac>`.

### Displaying Values From `ac-for`

Displaying values from `ac-for` loops is similar to displaying values from local contexts, except that the `this` keyword can be omitted. 

### Using `@subscribe` to Listen for Changes

By default, interpolation will be executed once and ignored by the compiler forever. To add reactivity to your logic, you can use the `@subscribe` helper directive. `@subscribe` accepts any variables in the local context and re-executes the content in your interpolation every time one of those variables change. 

Let's say we have a context defined with the below variables:

```js
{ first: 1, second: 2 }
```

Now, let's try to find the sum of the two numbers. Every time the value of `first` or `second` changes, we need to re-execute the interpolation to display the updated sum.

```html
<ac @subscribe="first, second">this.first + this.second</ac>
```

Here, we separated each variable in the `@subscribe` helper directive with a `,`. To only include one variable, we would simply do:

```html
<ac @subscribe="first">this.first + this.second</ac>
```

Now, the interpolation will only be re-executed every time the value of `first` changes. A change in the value of `second` will not be reflected in the DOM.
