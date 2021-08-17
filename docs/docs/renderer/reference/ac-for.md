---
sidebar_position: 12
---

# ac-for

Render HTML dynamically for every item in a specified list.

## Usage

### Syntax

`ac-for` simply takes the `innerHTML` of the attributed element and renders it for every item in a specified list.

The list can be any valid iterable, such as a string, object, or array. If the list is a variable in the local context, the list becomes reactive, meaning that when a new key (element) is added to the list, the `ac-for` will automatically update.

`ac-for` uses its own syntax to identify different parts of the loop. This syntax is also very flexible, meaning that it can be changed to fit your style of development.

The basic syntax is: `let foo, bar in iterable`. The `let` keyword can also be replaced with `const` or `var` without changing the functionality of the loop, in addition to the `in` keyword, which can be used interchangeably with `of`.

In the example above, `foo` is the identifier of the current value of the loop, and `bar` is the index of the loop.

The name of the index variable can also be omitted. In that case, the default variable name `index` can be used.

### Scoped Values

Every `ac-for` loop creates an [Accent Unit](/docs/renderer/units), or a scoped group. To access these variables, [text interpolation](/docs/renderer/text-interpolation) must be used.

The scoped group creates two variables that can be used in any place inside of the local scope:

| Variable | Description                        |
| -------- | ---------------------------------- |
| `index`  | The current index of the iteration |
| `key`    | The current key of the iteration   |

In the below example, we are using the `character` variable as an identifier of the key. This will print out `'String'` as is.

> **Note:** `'String'` will be automatically interpreted as `['S', 't', 'r', 'i', 'n', 'g']` before executing.

```html
<div ac-for="let character in 'String'">
  <span ac>character</span>
</div>
```

**Result inside `<div>`:**

```html
<span>S</span>
<span>t</span>
<span>r</span>
<span>i</span>
<span>n</span>
<span>g</span>
```

Now, let's say we want to print the index and character in each string in a list.

```html
<ul ac-for="let character in 'String'">
  <li><strong ac>index + ": "</strong><ac>character</ac></li>
</ul>
```

**Result inside `<ul>`:**

```html
<li><strong>0:</strong> S</li>
<li><strong>1:</strong> t</li>
<li><strong>2:</strong> r</li>
<li><strong>3:</strong> i</li>
<li><strong>4:</strong> n</li>
<li><strong>5:</strong> g</li>
```

### Rendering Reactively

To render a list reactively, we must directly reference an object in the local context.

Let's create a simple list of tasks in our context called `todo` and render it reactively.

> **Note:** Whenever accessing members of the context, remember to use the `this` keyword.

```html
<div
  ac-context="{ todo: ['Go to the gym', 'Learn Accent.js', 'Take out the trash'] }"
  @id="myContext"
>
  <ul ac-for="let task in this.todo">
    <li ac>task</li>
  </ul>
</div>
```

**Result inside `<ul>`:**

```html
<li>Go to the gym</li>
<li>Learn Accent.js</li>
<li>Take out the trash</li>
```

Behind the scenes, Accent has created a relationship between the `todo` array and the `ac-for` loop. This means that if we push a new item to the list as shown below, the list will automatically update.

```js
Accent.$context("myContext").todo.push("New task");
```

**Updated List:**

```html
<li>Go to the gym</li>
<li>Learn Accent.js</li>
<li>Take out the trash</li>
<li>New task</li>
```
