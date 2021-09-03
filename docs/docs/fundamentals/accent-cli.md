---
sidebar_position: 3
---

# Accent CLI

The Accent CLI is a set of tools for creating and developing Accent applications.

## Installation

You can install Accent CLI with NPM.

```shell
npm install @accent/cli
```

## Usage

The command prefix for Accent CLI is `accent`, often abbreviated as `ac`.

**Example (Help Command):**

```shell
ac --help
```

**Example (View Version Number):**

```shell
ac --version
```

## Creating an Accent Project

Accent does not have any rules for how you structure your application. However, if you want to get started with a pre-defined structure, you can do so with the CLI's `create` command.

To create a project, use the following command:

```shell
ac create [project-name]
```

This will create a new directory with the following file structure:

```shell
├── components
    ├── shared
├── pages
    ├── shared
├── index.html
├── app.js
├── ac.config.json # Used to indicate the root of an Accent project.
```

This structure can be altered in any way you see fit.

## Creating a Development Server (Accent Router)

This development server is to be used with the Accent Router library. See the [documentation](/docs/renderer) for more information.

To start your development server, run the `serve` command in the directory with your `index.html` file:

```shell
ac serve
```

This will create a localhost server on port `5000` configured for Accent's Single Page Application (SPA) structure.

### Custom Path

To add a custom path for your server, use the following syntax:

```shell
ac serve ./path/to/index.html
```

### Custom Server Port

To add a custom port for your server, use the following syntax:

```shell
ac serve --port=[port-number]
```
