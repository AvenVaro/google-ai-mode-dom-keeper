import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintJson from '@eslint/json';
import jsoncPlugin from 'eslint-plugin-jsonc';
import ymlPlugin from 'eslint-plugin-yml';

import * as yamlParser from 'yaml-eslint-parser';

const jsonc = jsoncPlugin.default || jsoncPlugin;
const yml = ymlPlugin.default || ymlPlugin;

/** @type {Required<import('eslint').Linter.Config>['rules']} */
const rules = {
  '@stylistic/indent': [
    'error',
    2,
    {
      SwitchCase: 1,
      VariableDeclarator: {
        var: 1,
        let: 1,
        const: 1,
        using: 1
      },
      assignmentOperator: undefined,
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: {
        parameters: 1,
        body: 1
      },
      FunctionExpression: {
        parameters: 1,
        body: 1
      },
      StaticBlock: {
        body: 1
      },
      CallExpression: {
        arguments: 1
      },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      offsetTernaryExpressions: {
        CallExpression: false,
        AwaitExpression: false,
        NewExpression: false
      },
      ignoreComments: false,
      ignoredNodes: [],
      tabLength: undefined
    }
  ],
  '@stylistic/quotes': [
    'error',
    'single'
  ],
  '@stylistic/semi': [
    'error',
    'always'
  ],
  '@stylistic/comma-spacing': 'error',
  '@stylistic/comma-dangle': [
    'error',
    {
      arrays: 'never',
      objects: 'never',
      imports: 'never',
      exports: 'never',
      functions: 'never'
    }
  ],
  '@stylistic/keyword-spacing': 'error',
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/object-curly-spacing': [
    'error',
    'always'
  ],
  '@stylistic/brace-style': [
    'error',
    'stroustrup',
    {
      allowSingleLine: false
    }
  ],
  '@stylistic/array-bracket-spacing': [
    'error',
    'always'
  ],
  '@stylistic/block-spacing': [
    'error',
    'always'
  ],
  '@stylistic/eol-last': [
    'error',
    'always'
  ],
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': [
    'error',
    {
      max: 1,
      maxEOF: 0
    }
  ],
  '@stylistic/function-paren-newline': [
    'error',
    'multiline-arguments'
  ],
  '@stylistic/function-call-argument-newline': [
    'error',
    'consistent'
  ],
  '@stylistic/object-curly-newline': [
    'error',
    {
      multiline: true,
      consistent: true
    }
  ],
  '@stylistic/no-extra-semi': 'error',
  'curly': [
    'error',
    'all'
  ],
  'func-names': [
    'error',
    'always'
  ],
  'arrow-parens': [
    'error',
    'always'
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'Program > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
      message: 'Arrow functions are only allowed locally within other functions. At the top level, use named functions.'
    },
    {
      selector: 'Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
      message: 'You can\'t export an arrow function directly. Use a named function.'
    },
    {
      selector: 'ArrowFunctionExpression[body.type="BlockStatement"]',
      message: 'Arrow functions are not allowed to have their bodies enclosed in curly braces {}. Use implicit return. If you need complex logic with a code block, write a full-fledged named function.'
    },
    {
      selector: 'FunctionDeclaration FunctionDeclaration',
      message: 'Declaring local functions within other functions is prohibited. Move it to the top level of the file.'
    },
    {
      selector: 'FunctionDeclaration VariableDeclarator > FunctionExpression',
      message: 'Creating local functional expressions within functions is prohibited. Move the logic to the top level.'
    }
  ]
};

export default defineConfig(
  {
    ignores: [
      'LICENSE',
      'NOTICE'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.ts',
      '**/*.mts',
      '**/*.cts'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: rules
  },
  {
    files: [
      'google-ai-mode-dom-keeper/src/*.js',
      'google-ai-mode-dom-keeper/src/*.mjs',
      'google-ai-mode-dom-keeper/src/*.cjs',
      'google-ai-mode-dom-keeper/src/*.ts',
      'google-ai-mode-dom-keeper/src/*.mts',
      'google-ai-mode-dom-keeper/src/*.cts'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: rules
  },
  {
    files: [
      '**/*.json',
      '**/*.jsonc',
      '**/*.code-workspace'
    ],
    language: 'json/json',
    plugins: {
      'json': eslintJson,
      'jsonc': jsonc
    },
    languageOptions: {
      parser: eslintJson.parser
    },
    rules: {
      'no-irregular-whitespace': 'off',
      'json/no-duplicate-keys': 'error',
      'jsonc/indent': [
        'error',
        2
      ],
      'jsonc/object-curly-spacing': [
        'error',
        'always'
      ],
      'jsonc/array-bracket-spacing': [
        'error',
        'always'
      ]
    }
  },
  {
    files: [
      '**/*.yaml',
      '**/*.yml'
    ],
    plugins: {
      yml: yml
    },
    languageOptions: {
      parser: yamlParser
    },
    rules: {
      ...yml.configs['flat/standard'].rules,
      'yml/indent': [
        'error',
        2
      ],
      'yml/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 0
        }
      ],
      'yml/key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true
        }
      ]
    }
  }
);
