module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    'prettier',
    'prettier/vue',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    '@vue/prettier/@typescript-eslint',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        arrowParens: 'always',
        singleQuote: true,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
  },
}
