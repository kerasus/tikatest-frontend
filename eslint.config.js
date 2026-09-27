import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslintParser from '@typescript-eslint/parser'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import pluginQuasar from '@quasar/app-vite/eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// گلبول‌های مشترک مرورگر و محیط‌های خاص
const sharedGlobals = {
  ...globals.browser,
  ...globals.node,
  process: 'readonly',
  ga: 'readonly',
  cordova: 'readonly',
  Capacitor: 'readonly',
  chrome: 'readonly',
  browser: 'readonly'
}

// قوانین پایه JS / TS (مشترک بین فایل‌های .ts و .vue)
const baseRules = {
  // 🔥 تایپ ایمپورت اجباری و استاندارد
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports',
      disallowTypeAnnotations: false
    }
  ],
  '@typescript-eslint/no-import-type-side-effects': 'error',

  // فرمتینگ و کد استایل
  'quotes': ['error', 'single', { avoidEscape: true }],
  'semi': ['error', 'never'],
  'comma-dangle': ['error', 'never'],
  'object-curly-spacing': ['error', 'always'],
  'arrow-parens': ['error', 'always'],
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'always',
      named: 'always',
      asyncArrow: 'always'
    }
  ],

  // قوانین غیرفعال یا آزاد
  'generator-star-spacing': 'off',
  'one-var': 'off',
  'no-void': 'off',
  'multiline-ternary': 'off',
  'no-unused-vars': 'off',
  'prefer-promise-reject-errors': 'off',
  'no-undef': 'off',
  '@typescript-eslint/no-undef': 'off',

  // ایمپورت‌ها
  'import/extensions': 'off',
  'import/no-unresolved': 'off',
  'import/no-extraneous-dependencies': 'off',
  'import/named': 'off',

  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
}

export default defineConfigWithVueTs(
  {
    ignores: [
      'src/assets/jalali-moment.browser.js',
      'dist/**',
      '.quasar/**',
      'src-cordova/**',
      'src-capacitor/**'
    ]
  },

  pluginQuasar.configs.recommended(),
  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.disableTypeChecked,

  // کانفیگ اختصاصی برای فایل‌های خالص TypeScript (.ts, .tsx)
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslintPlugin
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: sharedGlobals
    },
    rules: {
      ...baseRules,
      // ایندنت ۲ اسپیس برای فایل‌های ts
      indent: ['error', 2, {
        SwitchCase: 1,
        ignoredNodes: ['TemplateLiteral *'],
        flatTernaryExpressions: false,
        offsetTernaryExpressions: true
      }]
    }
  },

  // کانفیگ اختصاصی برای فایل‌های Vue (.vue)
  {
    files: ['**/*.vue'],
    plugins: {
      '@typescript-eslint': tseslintPlugin
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslintParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue']
      },
      globals: sharedGlobals
    },
    rules: {
      ...baseRules,

      // 🔴 خاموش کردن ایندنت عمومی در vue برای جلوگیری از کانفلیکت با تگ‌های SFC
      indent: 'off',

      // 🟢 مدیریت ایندنت اسکریپت در فایلهای vue (baseIndent: 0 یعنی کدِ داخل script از ستون اول شروع میشه)
      'vue/script-indent': ['error', 2, {
        baseIndent: 0,
        switchCase: 1,
        ignores: []
      }],

      // 🟢 مدیریت ایندنت تمپلیت HTML
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }],

      // ترتیب استاندارد بلاک‌های SFC
      'vue/block-order': ['error', {
        order: ['template', 'script', 'style']
      }],

      // نظم‌دهی به ماکروهای vue 3 در script setup
      'vue/define-macros-order': ['error', {
        order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots', 'defineModel']
      }],

      // قوانین ظاهر کامپوننت و قالب
      'vue/multi-word-component-names': 'off',
      'vue/order-in-components': 'error',
      'vue/max-attributes-per-line': 'error',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/attributes-order': 'error',
      'vue/component-name-in-template-casing': ['error', 'kebab-case', { ignores: [] }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'never'
      }],
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below'
      }],
      'vue/valid-v-slot': ['error', {
        allowModifiers: true
      }]
    }
  },

  // سرویس ورکر PWA
  {
    files: ['src-pwa/custom-service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker
      }
    }
  }
)
