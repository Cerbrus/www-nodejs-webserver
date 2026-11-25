import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';

export default [
    { ignores: ['dist/', 'node_modules/'] },
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended'],
    prettier,
    {
        files: ['**/*.ts'],
        plugins: { 'import-x': importX },
        settings: {
            'import-x/resolver': { node: true, typescript: { project: './tsconfig.json' } },
        },
        rules: {
            'prefer-object-spread': 'warn',
            'max-lines-per-function': ['warn', 75],
            'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: [
                        'static-field',
                        'instance-field',
                        'public-constructor',
                        'protected-constructor',
                        'private-constructor',
                        'public-instance-method',
                        'protected-instance-method',
                        'private-instance-method',
                        'public-static-method',
                        'protected-static-method',
                        'private-static-method',
                    ],
                },
            ],
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit',
                    overrides: {
                        accessors: 'explicit',
                        constructors: 'no-public',
                        methods: 'explicit',
                        properties: 'explicit',
                        parameterProperties: 'explicit',
                    },
                },
            ],
            '@typescript-eslint/array-type': ['error', { default: 'generic' }],
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', args: 'after-used' }],
            '@typescript-eslint/no-empty-function': ['error', { allow: ['overrideMethods'] }],
            '@typescript-eslint/no-explicit-any': 'error',
            'sort-imports': [
                'error',
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                    allowSeparatedGroups: false,
                },
            ],
            'import-x/no-duplicates': 'error',
            'import-x/no-unresolved': 'error',
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },
    {
        files: ['**/*.mjs'],
        languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
    },
];
