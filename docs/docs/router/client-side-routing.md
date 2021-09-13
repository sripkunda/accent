---
sidebar_position: 2
---

# Client-Side Routing

## Understanding Client-Side Routing

Client-side routing is a method of routing the user to different areas in your application within your application rather than through the browser. Accent takes care of client-side routing in the router library, in addition to a powerful standalone API for implementing dynamic, nested, and protected routes.

## What is a Route? 

A route is a destination within an application. It is a unique path within your application that serves a purpose in the grand scheme of your app. A route in Accent is made up of two parts: the source file and the path. 

The path is the part of the URL after your full hostname: <code>https://example.com<b>/this/is/the/full/path</b></code>.

The source file is the external HTML makeup of your application that will be fetched through a `GET` request upon page load.

## Creating an Accent Router Application 

> **Note:** The Accent Router works best with the [Accent CLI](/docs/fundamentals/accent-cli)

### The `index.html` File

The `index.html` is generally treated as the root file for your routing application. However, you can configure this to be whatever you need.

Use the `<router-pane>` tag to define the scope of your application. All routes will be loaded inside of this element.  

Below is an example of an Accent routing application. 

```html
<body>
    <router-target></router-target>
    <script src="./app.js"></script>
</body>
```

### The `Accent.$router` Method

All client-side routing actions in Accent begin with the `Accent.$router` identifier. An object or path to a `JSON` file with the list of routes is the only required parameter. 

`./app.js/`

```js
import "https://unpkg.com/@accent/router";

Accent.$router("/config/routes.json")
```

`./config/routes.json/`

```json
{
    "home": {
        "src": "/components/home.html",
        "path": "/"
    }
}
```

This can also be rewritten as: 

`./app.js/`

```js
import "https://unpkg.com/@accent/router";

Accent.$router({
    home: {
        src: "/components/home.html",
        path: "/"
    }
});
```

### Running an Accent Router Application

To run our development server, we will use the Accent CLI. To create your own development server, see the docs on [how to configure a server to work with Accent](server-configuration).


> **Note:** Paths when using the routing module vary greatly. You can learn more about this [here](paths).

In the root directory of your Accent project (where your `index.html` is located), use the `serve` command in the Accent CLI: 

```shell
ac serve ./path/to/index.html --port=[port]
```

or simply, 

```shell
ac serve
```