module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:import/recommended"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      parserOptions: {
        project: null
      },
      extends: [
        "plugin:@typescript-eslint/recommended"
      ],
      rules: {}
    }
  ],
  rules: {
    "import/order": [
      "warn",
      {
        "alphabetize": { "order": "asc", "caseInsensitive": true },
        "newlines-between": "never",
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"]
      }
    ]
  }
};
