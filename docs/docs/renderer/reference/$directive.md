---
sidebar_position: 5
---

Create a unique directive to add custom behavior to your page. 

> **Important:** Accent will only detect and store elements with custom directives **at runtime**. This means that directives declared after the current page has loaded will not be re-executed. 

## Parameters 

| Parameter            | Type       | Description                                                                                |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| id                   | `string`   | The identifier of the directive. This will affect how you access it in your view.          |
| instructions         | `function` | The custom behavior of your directive.                                                     |
| prefix               | `prefix`   | The prefix of your directive. Omit this parameter if you do not want a prefix.             |

The `instructions` function is called with the following parameters: 

| Parameter            | Type            | Description                                       |
| -------------------- | --------------- | ------------------------------------------------- |
| element              | `HTMLElement`   | The element that the directive was used on        |
| value                | `string`        | The value of your directive.                      |

