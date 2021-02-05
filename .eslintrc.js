module.exports = {
  extends: 'eslint-config-airbnb-base',
  rules: {
    semi: [2, 'always'],
    indent: ['error', 2],
    'no-return-await': 0,
    'space-before-function-paren': [2, {
      named: 'never',
      anonymous: 'never',
      asyncArrow: 'always',
    }],
    'template-curly-spacing': [2, 'always'],
    'linebreak-style': 0,
    'class-methods-use-this': 0,
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    curly: [
      'error',
      'multi-or-nest',
    ],
    'no-plusplus': 'off',
    'default-case': 'off',
  },
  env: {
    es2020: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
  },
};
