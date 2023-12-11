const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "ericlint"
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  rules: {
    "@typescript-eslint/await-thenable": "off",
    "quotes": ["error", "double"],
    "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
  }
}
