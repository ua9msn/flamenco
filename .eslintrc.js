module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['import', '@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        'disallowTypeAnnotations': false,
        'fixStyle': 'inline-type-imports',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '(^React$|^_$)',
        args: 'after-used',
        argsIgnorePattern: '^_$',
      },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-use-before-define': ['warn', { functions: false }],
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/prefer-interface': 'off',
    'array-callback-return': 'warn',
    'camelcase': 'warn',
    'class-methods-use-this': 'warn',
    'consistent-return': 'off',
    'curly': 'error',
    'global-require': 'warn',
    'import/extensions': ['error', { ts: 'never', tsx: 'never', json: 'always' }],
    'import/named': 'off',
    'import/newline-after-import': 'warn',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'warn',
    'import/no-unresolved': [2, { commonjs: true, amd: true, ignore: ['\\mf_1488_core'] }],
    'import/no-unused-modules': [1, { missingExports: true }],
    'import/no-useless-path-segments': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'unknown', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '@vtb/**',
            group: 'unknown',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'import/prefer-default-export': 'off',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-quotes': ['warn', 'prefer-double'],
    'max-params': ['warn', 4],
    'max-classes-per-file': 'warn',
    'no-bitwise': 'warn',
    'no-case-declarations': 'warn',
    'no-continue': 'warn',
    'no-dupe-class-members': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
      },
    ],
    'no-param-reassign': 'warn',
    'no-plusplus': 'warn',
    'no-prototype-builtins': 'warn',
    'no-restricted-globals': 'warn',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'styled-components',
            message: 'Please import from styled-components/macro.',
          },
          {
            name: 'reflexbox',
            message: 'Please import from reflexbox/styled-components.',
          },
          {
            name: 'lodash',
            message: 'Please import from lodash/some_module',
          },
        ],
        patterns: ['!styled-components/macro', '!reflexbox/styled-components', '!lodash/*'],
      },
    ],
    'no-restricted-syntax': 'warn',
    'no-return-assign': 'warn',
    'no-shadow': 'off',
    'no-template-curly-in-string': 'warn',
    'no-underscore-dangle': [
      'warn',
      {
        'allow': ['_VTB', '_coreSettings'],
        'allowAfterThis': false,
        'allowAfterSuper': false,
        'enforceInMethodNames': false
      }
    ],
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'no-useless-escape': 'warn',
    'no-useless-return': 'warn',
    'operator-assignment': 'warn',

    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: ['const', 'let', 'if', 'for', 'try'], next: 'return' },
    ],
    'prefer-destructuring': 'warn',
    'prefer-promise-reject-errors': 'off',
    'react/destructuring-assignment': 'warn',
    'react/display-name': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-props-no-spreading': 'warn',
    'react/no-array-index-key': 'warn',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/sort-comp': 'warn',
    'react/jsx-sort-props': [
      'error',
      {
        'callbacksLast': false,
        'reservedFirst': false,
        'shorthandFirst': false,
      },
    ],
    'react/static-property-placement': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'semi': 'error',
  },
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
