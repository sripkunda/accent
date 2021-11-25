---
sidebar_position: 4
---

# Paths

Paths in the Accent router are managed separately to facilitate consistency across applications. Below are Accent's loosely defined rules for paths within the router module.

## Absolute Paths

External files that are stored locally and use an **absolute path** (such as your app.js file) should contain a leading `/` in the file path to avoid errors with routing. 

**Correct:** `<script src="/app.js"></script>`

**Incorrect:** `<script src="./app.js"></script>`

**Incorrect:** `<script src="app.js"></script>`

> Note that all router link paths (within your routing config) should also be formatted as absolute paths. 

## Dynamic Paths

Dynamic paths must start and end with a `/` to be treated as dynamic routes. Dynamic routes that do not end in `/` will be treated as literal absolute paths.

**Correct:** `/dynamic/:path/`

**Incorrect:** `/dynamic/:path` (or correct, if you are looking for a path that is literally `www.yoursite.com/dynamic/:path/`)

**Incorrect:** `dynamic/:path`

**Incorrect:** `dynamic/:path/`

## Router Link Paths

Router links can attach to either the route name or the path of the route. Note that router names **cannot have `/`s**. Router links that contain literal paths shoud be formatted as absolute paths. 

For the route with name `page` and a path `/pages/somepage`:

**Correct:** `<a router-to="page">`

**Correct:** `<a router-to="/pages/somepage">`

**Incorrect:** `<a router-to="pages/somepage">`

**Incorrect:** `<a router-to="/page">`
