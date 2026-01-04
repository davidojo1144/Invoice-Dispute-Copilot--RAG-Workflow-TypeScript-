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
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: true
      }
    }
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
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ],
  rules: {
    "import/no-unresolved": "off",
    "import/named": "off",
    "import/default": "off",
    "import/namespace": "off",
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
