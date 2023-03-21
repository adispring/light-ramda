/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },

  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },

  rules: {
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false, argsIgnorePattern: '^_' },
    ],
  },

  overrides: [
    {
      files: ['**/*rc.js', '**/*.config.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['test/**/*.js'],
      parserOptions: {
        ecmaVersion: 2018,
      },
      rules: {
        'no-restricted-properties': [
          'error',
          {
            object: 'describe',
            property: 'only',
          },
        ],
        'no-restricted-modules': ['error', '..'],
      },
    },
  ],
};
