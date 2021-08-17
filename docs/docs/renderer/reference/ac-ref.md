---
sidebar_position: 15
---

# ac-ref

`ac-ref` creates HTMLElement references in the local context to the attributed element.

## Usage

**Syntax:** `<element ac-ref="name of varible to be added to the local context..."></element>`

```html
<div ac-context="{ foo: 'bar' }" @id="myContext">
  <input type="text" ac-ref="firstName" id="one" value="John" />
  <input type="text" ac-ref="lastName" id="two" value="Doe" />
</div>
```

When the above code segment is compiled, the local context group (`myContext`) will be updated to: `{ foo: 'bar', firstName: input#one, lastName: input#two }`

This means that we can access these references from the context as shown below.

```js
console.log(Accent.$context("myContext").firstName.value); // John
console.log(Accent.$context("myContext").lastName.value); // Doe
```
