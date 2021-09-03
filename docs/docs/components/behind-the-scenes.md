---
sidebar_position: 3
---

# Behind The Scenes

## How Components Are Interpreted

An Accent Component has two primary components: it's unique identifier and its template (also called content). For example, the component below will be interpreted by Accent as:

```html
<component ref="my-component">
  <p>My Component</p>
</component>
```

| ID             | Template              |
| -------------- | --------------------- |
| `my-component` | `<p>My Component</p>` |

Once found, Accent will autofill all components related to the ID that come up.

It is important to note that the components library will **always** execute before any other Accent library. This means that additional dependencies can be used inside of Accent components without interfering with the functionality of the page. More of this is described below. This concept is fundamental to understanding how Accent components can be used in applications.

## Accent Renderer Integration

Let's say that we want to use Accent Components to render in elements of a loop that we may want to reuse elsewhere. We will use the [`ac-for`](/docs/renderer/reference/ac-for) and [`ac-context`](/docs/renderer/reference/ac-context) directives from the Accent Renderer library.

We would integrate this by writing the component as if it is **meant** to be inserted into specific places. This means that references to `this` using the local context and text-interpolation will automatically be executed in the appropriate scope.

```html
<body
  ac-context="{ 
    tasks: [
        {
            title: 'Trash',
            description: 'Take out the trash',
        },
        {
            title: 'Learn Accent.js',
            description: 'Learn more about Accent.js',
        }
    ]
  }"
>
  <ul ac-for="let task in this.tasks">
    <todo-task></todo-task>
  </ul>
  <component ref="todo-task">
    <h1 ac>task.title</h1>
    <div class="todo-description">
      <p ac>task.description</p>
    </div>
  </component>
</body>
```

This concept can be extended to create complex combinations of functionality in both libraries.
