import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['build/']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }]
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off'
    }
  }
);
