module.exports = [
  {
    ignores: ['node_modules/', '.env', 'dist/', 'coverage/'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        es2021: true,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'func-names': 'off',
      'no-plusplus': 'off',
      'no-process-exit': 'off',
    },
  },
];
