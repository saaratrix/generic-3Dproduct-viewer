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
    "array-bracket-spacing": ["error", "never"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "block-spacing": ["error", "always"],
    "comma-spacing": ["error", { after: true }],
    "computed-property-spacing": ["error", "never"],
    "curly": ["error", "all"],
    "eqeqeq": ["error", "smart"],
    "function-paren-newline": ["error", "multiline-arguments"],
    "key-spacing": ["error", { afterColon: true }],
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "no-irregular-whitespace": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
    "no-multi-spaces": ["error", { ignoreEOLComments: true, exceptions: { ImportDeclaration: true }}],
    "no-prototype-builtins": "off",
    "no-trailing-spaces": ["error", { ignoreComments: true }],
    "no-useless-escape": "off",
    "no-whitespace-before-property": ["error"],
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": ["error",  { allowAllPropertiesOnSameLine: true }],
    "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
    "space-before-blocks": ["error", "always"],
    "space-in-parens": ["error", "never"],
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
        selector: "property",
        format: ["camelCase", "UPPER_CASE"],
      },
      // Should allow a class property to be whatever!
      // PascalCase can be useful when setting a property as an enum for the template.
      {
        selector: "classProperty",
        format: ["camelCase", "PascalCase"],
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
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": ["error", { classes: false, functions: false, ignoreTypeReferences: true, variables: false, }],
    "@typescript-eslint/type-annotation-spacing": ["error",
      {
        before: false,
        after: false,
        overrides: {
          arrow: { before: true, after: true },
          colon: { before: false, after: true },
        },
      },
    ],
    "brace-style": "off",
    "@typescript-eslint/brace-style": [ "error", "1tbs", { allowSingleLine: true } ],
    "comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        enums: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
        generics: "always-multiline",
        imports: "always-multiline",
        objects: "always-multiline",
        tuples: "always-multiline",
      },
    ],
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2, {
      FunctionDeclaration: { parameters: "first" },
      FunctionExpression: { parameters: "off" },
      SwitchCase: 1,
    }],
    "keyword-spacing": "off",
    "@typescript-eslint/keyword-spacing": ["error"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "semi": "off",
    "@typescript-eslint/semi": ["error", "always"],
    "space-before-function-parent": "off",
    "@typescript-eslint/space-before-function-paren": ["error", {
      anonymous: "always",
      named: "never",
      asyncArrow: "always"
    }],
    "space-infix-ops": "off",
    "@typescript-eslint/space-infix-ops": ["error", { int32Hint: true }],
  },
};
