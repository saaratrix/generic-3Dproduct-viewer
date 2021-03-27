module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    // Nuu-linter rules!
    // ESLint rules: https://eslint.org/docs/rules/
    "arrow-spacing": ["error", { before: true, after: true }],
    "block-spacing": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": ["error", { after: true }],
    "curly": ["error", "all"],
    "eqeqeq": ["error", "smart"],
    "key-spacing": ["error", { afterColon: true }],
    "keyword-spacing": "error",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "no-irregular-whitespace": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
    "no-prototype-builtins": "off",
    "no-useless-escape": "off",
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
    "space-before-blocks": ["error", "always"],
    "space-infix-ops": ["error", { int32Hint: false }],
    // Typescript ESLint rules: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
    // "@typescript-eslint/"
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/explicit-module-boundary-types": ["error"],
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": ["error"],
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-use-before-define": ["error", { ignoreTypeReferences: true }],
    "@typescript-eslint/type-annotation-spacing": ["error",
      {
        before: false,
        after: false,
        overrides: {
          arrow: { before: true, after: true },
          colon: { before: false, after: true },
        }
      }
    ],
    "brace-style": "off",
    "@typescript-eslint/brace-style": [ "error", "1tbs", { allowSingleLine: true } ],
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2, {
      FunctionDeclaration: { parameters: "first" },
      FunctionExpression: { parameters: "off" },
      SwitchCase: 1,
    }],
    "semi": "off",
    "@typescript-eslint/semi": ["error", "always"],
    "space-before-function-parent": "off",
    "@typescript-eslint/space-before-function-paren": ["error", "always"],
  },
};
