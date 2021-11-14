---
sidebar_position: 4
---

# Dynamic Routes

Dynamic routes allow you add "wildcard" inputs to your routes that can be later interpreted as variable values. A good example of this is a user profile system. 

Let's take the URL: <code>https://github.com/<b>sripkunda</b></code>. In this case, the `sripkunda` portion of the URL will interpreted as a variable. This variable can then be accessed at runtime to render the content accordingly. 

## Syntax

## Multiple Dynamic Parameters

## Protected Routes

Protected routes allow you to fallback to a different route in the case that a certain routing parameter is not provided. 

## A Quick Look Behind the Scenes

Knowing how Accent's routing works behind the scenes helps you better use and understand dynamic routes in Accent. 

Whenever a URL or path is given to the Accent router, it searches the JSON data of possible routes to find the best match to route to. This search is done **in order**, meaning that the first match is always taken as the best match. 

Why is this important? Well, let's take a look at the example below. 

If we want to go to GitHub's landing page, we can get there using two URLs:  <code>https://github.com/home</code> and <code>https://github.com/</code>. However, <code>https://github.com/</code> is still a parent route for a link to a user profile, <code>https://github.com/sripkunda</code>. Whenever the username is not provided, we automatically go to <code>https://github.com/</code>. 

Let's implement this in Accent: 

In our router initialization, let's give an additional route for the `home` route and use a dynamic route on the `user` route: 

```js
Accent.$router({
    home: {
        path: ["/", "/home"]
        src: "home.html"
    },
    user: {
        path: "/:username", 
        src: "user.html"
    }
});
```