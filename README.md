# Accent

![CLI Version](https://img.shields.io/npm/v/@accent/cli?style=flat-square)

A modern, modular, and lightweight JavaScript library built for speed. All in less than 10kb.

# Getting Started

**Looking for documentation? Look [here](https://accent.js.org/docs).**

Accent is broken up into different standalone modules. Once combined, these modules work together as a single, full-fledged library.

You can install a module through NPM or a simple script tag in your HTML.

```shell
npm install @accent/[library-name]
```

```html
<script src="https://unpkg.com/@accent/[library-name]"></script>
```

Here's an example page of a contact list using the [Accent Renderer](https://accent.js.org/docs/renderer/intro) ibrary:

```html
<input type="text" ac-model="name" placeholder="Name" />
<input type="text" ac-model="email" placeholder="Email" />
<button ac-click="this.addContact(this, this.name, this.email)">Add</button>
<ul ac-for="let contact in this.contacts">
  <li>
    <strong>Name: </strong><ac>contact.name</ac><br />
    <strong>Email: </strong><ac>contact.email</ac>
  </li>
</ul>
<script type="module">
  import "https://unpkg.com/@accent/renderer";
  Accent.$context(document.body, {
    contacts: [],
    name: "",
    email: "",
    addContact(ctx, name, email) {
      ctx.contacts.push({
        name: name,
        email: email,
      });
    },
  });
</script>
```

<a href="https://codepen.io/sripkunda/pen/XWRwwgz" target="_blank">View the demo live on CodePen</a>

# License

Copyright © 2019-2020 Sri Pranav Kunda and contributors. Contributions are greatly appreciated.

Licensed under the MIT license. See [LICENSE.md](LICENSE.md) for details.

# Acknowledgements

Accent's syntax and concepts are heavily inspired by Vue and Angular. Feel free to check them out, they may be a better fit for your use case.

Many of Accent's features utilize the functionality defined in these frameworks and split them into modules. This means that concepts such as client-side routing, data-binding, components, etc. can be used without dependency on other parts of the framework. This is described in more detail in the [documentation](https://accent.js.org/docs).

# Links

- [Documentation](https://accent.js.org/docs/intro)
- [Website](https://accent.js.org)
- [Issue Tracker](https://github.com/sripkunda/accent/issues)
- [Source Code](https://github.com/sripkunda/accent)
