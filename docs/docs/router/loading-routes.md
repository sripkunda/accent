---
sidebar_position: 3
---

# Loading Routes

## Creating a `router-to` link

### Introduction

Let's say that we have defined the following routes: 

```json
{
    "home": {
        "src": "/pages/home.html",
        "path": "/"
    },
    "registerroute": {
        "src": "/pages/register.html",
        "path": "/register"
    },
    "loginroute": {
        "src": "/pages/login.html",
        "path": "/login"
    }
}
```

We can use the `router-to` directive on an element to navigate to another route.

### Creating Links

Attach the `router-to` directive to any element to create an `onclick` event that triggers navigation to a new route. 

In our `/pages/home.html` file: 

```html
<router-target>
    <button router-to="loginroute"></button> <!-- Clicking this will route us to the "loginroute" route (aka. "/login")-->
</router-target>
```

### Literal Paths

Sometimes, it is useful to specify a literal path when creating a link. A good example of this is when routing to specific [dynamic routes](dynamic-routes). To do this, prepend a `/` to the `router-to` path. 

In our `/pages/home.html` file: 

```html
<router-target>
    <button router-to="/login"></button> <!-- Clicking this will route us to "/login." What route this pertains to does not matter. -->
</router-target>
```

## Configuring How Routes Are Loaded

By default, all specified routes and loaded and cached asynchronously by Accent. This allows for a faster routing experience for the user. However, Accent allows you to configure how you want routes to be loaded in your application. 

There are three different types of route loading in the Accent router: 

| Type         | Identifier | Description                                                                                                          |
| ------------ | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Asynchronous | `async`    | Caches pages asyncrhonously after the first route has been loaded (default).                                         |
| Lazy         | `lazy`     | Caches and loads pages only when they are requested and does not send a request next time it is needed.              |
| Uncached     | `uncached` | not cache pages at all and sends a new request every time a page is needed, even if it has been visited before. |

To change the route load options, use an additional argument in your routes JSON data:

```json
{
    "home": {
        "src": "/pages/home.html",
        "path": "/",
        "load": "async"
    },
    "registerroute": {
        "src": "/pages/register.html",
        "path": "/register",
        "load": "async"
    },
    "loginroute": {
        "src": "/pages/login.html",
        "path": "/login",
        "load": "async"
    }
}
```