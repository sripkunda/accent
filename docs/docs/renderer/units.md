---
sidebar_position: 4
---

# Units

## Introduction to Units

Units in Accent are scoped groups defined in the HTML DOM. Any element in the group can interact with and access behavior defined in the local unit. Accent uses units to define the range of access for interpolated elements or built-in directives.

Accent uses units to define context groups and for groups. See the examples below for more information.

## The Accent Context

An Accent Context is a scoped group that stores an object accessible by every element inside of that scoped group. This is useful for defining custom access scopes in your HTML. Most Accent directives rely on contexts to maintain consistency and organization throughout your application.

### Creating an Accent Context

There are two ways to create an Accent Context.

**1. Using the `ac-context` directive**

```html
<body ac-context="{ foo: 'bar' }">
  <!-- This is your context group. Here, you can access all of the variables 
    defined in the local context group (such as the 'foo' variable defined above). -->
</body>
```

**2. Using the `$context` (aka. `$ctx`) method**

```js
Accent.$context(document.body, {
  foo: "bar",
});
```

### Accessing an Accent Context

To access a context group, use a HTML element reference or context ID. To define the ID of a context group, use the `@id` helper directive or pass an additional parameter to the context constructor.

**1. Using the `ac-context` directive**

```html
<body ac-context="{ foo: 'bar' }" @id="myId">
  <!-- This is your context group. Here, you can access all of the variables 
    defined in the local context group (such as the 'foo' variable defined above). -->
</body>
```

**2. Using the `$context` (aka. `$ctx`) method**

```js
Accent.$context(
  document.body,
  {
    foo: "bar",
  },
  "myId"
);

Accent.$context(document.body); // { foo: 'bar' } (Accessing via. HTML element reference)
Accent.$context("myId"); // { foo: 'bar' } (Accessing via. context ID)
```

### Calling Functions Inside Contexts

To call functions inside contexts, you can call the function as usual. However, the function will be called at a global scope. To access a context inside of a function, you must pass the context data into the function as a parameter.

```html
<body
  ac-context="{ 
    foo: 'bar', 
    myFunc: (ctx) => {
        console.log(ctx.foo) // bar
    }
}"
>
  <button ac-click="this.myFunc(this);">Click Me</button>
</body>
```

### Nested Contexts

Elements inside context groups can **only** read members that are in the local group. Therefore, nested contexts (contexts inside of each other) can only access members in the closest nested context.

For example:

```html
<body ac-context="{ foo: 'bar' }" @id="myId">
  <div ac-context="{ bar: 'foo' }">
    <!-- Anything inside here is now in the <div> scope, 
        meaning that the 'foo' variable cannot be accessed. -->
  </div>
</body>
```

In this example, elements in the `<div>` context group can only access the `bar` variable. The `foo` variable, deriving from the `<body>` context, cannot be accessed (along with any other additional variables declared in this context).

### Context Inheritance

Contexts can also be inherited, meaning you can create multiple contexts that share a similar structure. In context inheritence, all members of the parent context is copied over to the child and combined with the child's unique members.

Context inheritence is represented by the helper directive `@extends`. The value of the attribute should be set to the ID of the context you are trying to inherit. For example:

> **Note:** Currently, contexts can only be inherited through the `ac-context` directive.

```html
<div ac-context="{ foo: 'bar' }" @id="myId">
  <!-- Parent Context -->
</div>
<div ac-context="{ bar: 'foo' }" @extends="myId">
  <!-- Parent Context -->
  <!-- Now this context is: { foo: 'bar', bar: 'foo' } -->
</div>
```

For more information about contexts, see the [reference for `ac-context` and `$context`](reference/ac-context).

## For Groups

For groups are another example of units. They create a small scoped group for the `ac-for` directive. The example below covers this briefly. For more information, see the [reference for the `ac-for` directive](reference/ac-for).

```html
<div ac-for="const myVar in [0,1,2]">
  <li><ac>myVar</ac></li>
</div>
```

In the example above, the `myVar` variable will be accessible inside of the `<div>` element. The element is a scoped group (or unit) that stores the value and index of the `ac-for` action.
