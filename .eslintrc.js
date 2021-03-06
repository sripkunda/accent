module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["google", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  parser: "babel-eslint",
  rules: {
    "capitalized-comments": [
      "error",
      "always",
      {
        ignorePattern: "pragma|ignored",
        ignoreInlineComments: false,
      },
    ],
  },
};
