import eslintConfigCityssm, { tseslint } from 'eslint-config-cityssm';
const config = tseslint.config(eslintConfigCityssm, {
    files: ['**/*.ts'],
    rules: {
        '@typescript-eslint/no-magic-numbers': 'off'
    }
});
export default config;
