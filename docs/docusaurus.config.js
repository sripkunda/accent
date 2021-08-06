const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Accent.js",
  tagline:
    "A fully modular, functional, and easy to use framework - all in less than 10kb",
  url: "https://accent.js.org",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "sripkunda", // Usually your GitHub org/user name.
  projectName: "accent.js", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Accent.js",
      logo: {
        alt: "Accent.js",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/intro",
          position: "left",
          label: "Get Started",
        },
        {
          to: "docs/renderer/intro",
          position: "left",
          label: "Renderer",
        },
        {
          to: "docs/components/intro",
          position: "left",
          label: "Components",
        },
        {
          to: "docs/router/intro",
          position: "left",
          label: "Router",
        },
        {
          to: "docs/animations/intro",
          position: "left",
          label: "Animations",
        },
        {
          href: "https://github.com/sripkunda/accent.js/stargazers",
          label: "GitHub",
          position: "left",
          label: "Star on GitHub",
        },
        {
          href: "https://github.com/sripkunda/accent.js",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      copyright: `Copyright © ${new Date().getFullYear()} Sri Pranav Kunda`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/sripkunda/accent.js/tree/master/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
