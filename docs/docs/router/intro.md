---
sidebar_position: 1
---

# Introduction

## Getting Started

### What is the Accent Router?

The Accent Router allows for the implementation of client-side routing in accordance with Accent's Renderer, Components, and Animations library. The three work well together and sync to form a full-fledged framework, but the router can be used by itself if you do not wish to use any other Accent modules. 

## Installation

```shell
npm install @accent/router
```

```html
<script src="https://unpkg.com/@accent/router"></script>
```

### Example Page

`index.html`

```html
<body>
    <router-pane></router-pane>
    <script type="module">
        import 'https://unpkg.com/@accent/router';
        const App = Accent.$router({
            mypage: {
                src: "/components/mypage.html",
                path: "/mypage"
            }
        });
    </script>
</body>
```

`/components/mypage.html`

```html
<body>
    <router-target>
        This is my page!
    </router-target>
</body>
```