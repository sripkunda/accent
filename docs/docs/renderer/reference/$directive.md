---
sidebar_position: 5
---

# $directive

Create a unique directive to add custom behavior to your page. 

> **Important:** Accent will only detect and store elements with custom directives **at runtime**. This means that directives declared after the current page has loaded will not be re-executed. 

## Parameters 

| Parameter            | Type       | Description                                                                                            |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| id                   | `string`   | The identifier of the directive. This will affect how you access it in your view.                      |
| instructions         | `function` | The custom behavior of your directive.                                                                 |
| prefix               | `prefix`   | The prefix of your directive. The default is `ac-`, but you can use `""` if you do not want a prefix.  |

The `instructions` function is called with the following parameters: 

| Parameter            | Type            | Description                                       |
| -------------------- | --------------- | ------------------------------------------------- |
| element              | `HTMLElement`   | The element that the directive was used on        |
| value                | `string`        | The value of your directive.                      |

## Example 

Let's create a `style-bg` directive that sets the background color of the attributed element to whatever value is given. 

For example, in the below example, the `<p>` tag should have a blue background color. 

**HTML:**

```html
<p style-bg="red">This is red!</p>
<p style-bg="blue">This is blue!</p>
```

**JS:**

```js
Accent.$directive("bg", (el, value) => {
    el.style.backgroundColor = value;
}, "style-");
```

Now, let's create a new directive with the same prefix, but this time we'll change the color of the element. We'll call this directive `style-color`. 

```js
Accent.$directive("color", (el, value) => {
    el.style.color = value;
}, "style-");
```

To make the text of both `<p>` tags white, we can now do:

```html
<p style-bg="red" style-color="white">This is red!</p>
<p style-bg="blue" style-color="white">This is blue!</p>
```