---
sidebar_position: 4
---

# Dynamic Routes

Dynamic routes allow you add "wildcard" inputs to your routes that can be later interpreted as variable values. A good example of this is a user profile system. 

Let's take the URL: <code>https://github.com/<b>sripkunda</b></code>. In this case, the `sripkunda` portion of the URL will interpreted as a variable. This variable can then be accessed at runtime to render the content accordingly. 

## Syntax

Paths with dynamic routes follow the `/normal/:dynamic` syntax, where in the aforementioned example, `dynamic` is the name of the dynamic parameter. 

Multiple dynamic parameters can be created as well: `/:one/:two/`. **Note that there must be a trailing slash for accent to recognize a route as dynamic.**.

## Protected Routes

Protected routes allow you to fallback to a different route in the case that a certain routing parameter is not provided. On any `<router-target></router-target>` element, use the following syntax: 

```html
<router-target router-protect="[valid javascript boolean logic]" 
               router-fallback="[route to go to in the case that the protection fails]">
...
</router-target>
```

## Putting It All Together

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

Now, in our `user.html` file, we can specify (assume that `App` is the global routing object returned by `Accent.$router`): 

```html
<router-target router-protect="App.params.username" router-fallback="home">
...
</router-target>
```

Now, we get the aforementioned functionality described in the github example.