module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'airbnb'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'no-param-reassign': [2, { props: false }],
    'no-underscore-dangle': 'off',
    'linebreak-style': 0,
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': ['off'],
    'no-return-assign': 2,
    'object-curly-newline': 'off',
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // 개발환경 의존패키지 사용 허용
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: [
          'i18n', // for vue-i18n fucntional component
        ],
        registeredComponentsOnly: false,
      },
    ],
  },
};
