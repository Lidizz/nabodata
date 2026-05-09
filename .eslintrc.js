/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    '*.js',
    '*.mjs',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
  ],
};
