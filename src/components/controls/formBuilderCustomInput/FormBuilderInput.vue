<template>
  <div
    class="form-builder-input"
    :class="customClass">
    <q-input
      ref="input"
      v-model="inputData"
      :name="name"
      :filled="filled"
      :rules="rules"
      :lazy-rules="lazyRules"
      :label="label"
      :stack-label="!!placeholder"
      :type="localInputType"
      :error="error"
      :hint="computedHint ? $t(computedHint) : undefined"
      :error-message="errorMessage"
      :disable="disable"
      :mask="mask"
      :fill-mask="fillMask"
      :reverse-fill-mask="reverseFillMask"
      :clearable="clearable"
      :loading="loading"
      :input-style="inputStyle"
      :readonly="readonly"
      :rounded="rounded"
      :outlined="outlined"
      :placeholder="placeholder"
      :class="customClass"
      :input-class="customClass"
      :autogrow="autogrow"
      autofocus
      @click="onClick"
      @blur="onBlur"
      @keydown="onKeydown"
      @keypress="onKeyPress">
      <template #prepend>
        <q-icon
          v-if="props.inputType === 'iban'"
          name="oms:Iban" />
        <div
          v-if="props.inputType === 'rangeNumber'"
          class="range-number">
          <div
            class="max"
            @click="onMaxRange">
            {{ props.maxRange ? separateThousandsFn(props.maxRange) : '&#8734;' }}
            <q-icon name="oms:Arrow-Top" />
          </div>
          <div
            class="min"
            @click="onMinRange">
            {{ props.maxRange ? separateThousandsFn(props.minRange) : 1 }}
            <q-icon name="oms:Arrow-Down" />
          </div>
        </div>
      </template>
      <template #append>
        <q-btn
          v-if="props.inputType === 'password'"
          flat
          :icon="passwordVisibility ? 'oms:eye' : 'oms:eye-slash'"
          @click="onClickPasswordVisibility" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ComputedRef } from 'vue'
import { computed, type PropType, ref } from 'vue'
import { useQuasar, type ValidationRule } from 'quasar'
import { createPrefixedT } from 'src/services/i18nWrapper'
import { normalizePersianLetters, normalizeToEnglishNumbers } from 'src/composables/AlphabetUtils'

defineOptions({
  name: 'FormBuilderInput'
})

const props = defineProps({
  name: {
    default: '',
    type: String
  },
  autogrow: {
    type: Boolean,
    default: false
  },
  preventPersian: {
    type: Boolean,
    default: false
  },
  preventEnglish: {
    type: Boolean,
    default: false
  },
  justNumber: {
    type: Boolean,
    default: false
  },
  mask: {
    type: String,
    default: undefined
  },
  fillMask: {
    type: String,
    default: undefined
  },
  reverseFillMask: {
    type: Boolean,
    default: undefined
  },
  inputType: {
    type: String,
    default: 'text',
    validator: (value: any) => {
      return [
        'text',
        'password',
        'textarea',
        'email',
        'search',
        'tel',
        'file',
        'number',
        'url',
        'time',
        'date',
        'datetime-local',
        'number+',
        'number-',
        'int',
        'int+',
        'int-',
        'phone',
        'persian',
        'tradingCode',
        'iban',
        'idNumber'
      ].includes(value)
    }
  },
  maxlength: {
    type: [String, Number],
    default: undefined
  },
  decimalScale: {
    type: Number,
    default: null
  },
  hint: {
    type: String,
    default: undefined
  },
  value: {
    default: '',
    type: [String, Number]
  },
  label: {
    default: '',
    type: String
  },
  class: {
    default: '',
    type: String
  },
  error: {
    default: false,
    type: Boolean
  },
  errorMessage: {
    default: '',
    type: String
  },
  disable: {
    default: false,
    type: Boolean
  },
  readonly: {
    default: false,
    type: Boolean
  },
  inputStyle: {
    default: undefined,
    type: [ String, Object ]
  },
  filled: {
    default: false,
    type: Boolean
  },
  color: {
    default: 'primary',
    type: String
  },
  separateThousands: {
    default: false,
    type: Boolean
  },
  type: {
    default: 'radio', // checkbox-toggle
    // Object type is for custom components
    type: [String, Object]
  },
  dense: {
    default: true,
    type: Boolean
  },
  rounded: {
    default: false,
    type: Boolean
  },
  responseKey: {
    default: () => {
      return {}
    },
    type: [String, Number, Boolean, Array, Boolean, Object]
  },
  outlined: {
    default: false,
    type: [Boolean]
  },
  flat: {
    default: false,
    type: [Boolean]
  },
  placeholder: {
    default: '',
    type: String
  },
  rules: {
    default: () => [] as ValidationRule[],
    type: Array as PropType<ValidationRule[]>
  },
  lazyRules: {
    default: false,
    type: [Boolean]
  },
  col: {
    default: '',
    type: String
  },
  clearable: {
    default: false,
    type: Boolean
  },
  loading: {
    default: false,
    type: Boolean
  },
  minRange: {
    default: null,
    type: Number
  },
  maxRange: {
    default: null,
    type: Number
  }
})

const emits = defineEmits([
  'input',
  'change',
  'onClick',
  'onKeyPress',
  'update:value'
])

type InputValueType = string | number | boolean

const $q = useQuasar()
const { t: rawT } = useI18n()
const i18nPrefixedT = createPrefixedT(rawT)

const passwordVisibility = ref<boolean>(false)

const inputData: any = computed({
  get () {
    return getNormalizedInputValueForGetter(props.inputType, props.value)
  },
  set (newValue) {
    const inputValue = getNormalizedInputValueForSetter(props.inputType, newValue)

    emits('update:value', inputValue)
  }
})
const customClass = computed(() => {
  const preClass = localInputType.value === 'number' || props.separateThousands ? 'ltr ' : ''
  return preClass + props.class
})
const localInputType: any = computed(() => {
  if (
    ['number+', 'number-', 'int', 'int+', 'int-', 'iban', 'rangeNumber', 'idNumber'].includes(props.inputType) &&
    !props.separateThousands
  ) {
    return 'number'
  }

  if (['persian', 'phone', 'mobile', 'tradingCode'].includes(props.inputType)) {
    return 'text'
  }

  if (['password'].includes(props.inputType) && !passwordVisibility.value) {
    return 'password'
  }

  if (['textarea'].includes(props.inputType)) {
    return 'textarea'
  }

  return 'text'
})
const computedHint: ComputedRef<string | undefined> = computed(() => {
  if (props.inputType === 'phone' && !props.hint) {
    return 'inputHints.phone'
  }
  return props.hint
})

function onKeydown (event: KeyboardEvent) {
  // List of functional keys to allow
  const allowedKeys = [
    'Backspace',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Shift',
    'Control',
    'Alt',
    'Escape',
    'End',
    'Home',
    'Delete'
  ]

  // Allow functional keys

  const isShortcutCombination =
    (event.ctrlKey || event.metaKey) &&
    ['c', 'v', 'x', 'a', 'z', 'y'].includes(event.key.toLowerCase())
  if (isShortcutCombination) {
    return
  }

  if (
    allowedKeys.includes(event.key) ||
    event.ctrlKey ||
    event.altKey ||
    isShortcutCombination
    // event.shiftKey
  ) {
    return
  }

  const inputElement = event.target as HTMLInputElement
  const maxLength = Number(props.maxlength)
  const inputValue = inputData.value ? inputData.value.toString() : ''
  const cursorPosition = inputElement.selectionStart ?? inputValue.length
  const newValue =
    inputValue.slice(0, cursorPosition) + (event?.key || '') + inputValue.slice(cursorPosition)
  const normalizedNewValue = getNormalizedInputValueForGetter(props.inputType, newValue)
  // handle maxLength
  if (maxLength && inputValue.length >= maxLength) {
    event?.preventDefault()
    return
  }

  // handle input type strategies
  const isValidKey = isValidInput(props.inputType, normalizedNewValue)

  if (isValidKey) {
    // emits('update:value', normalizedNewValue)
  } else {
    event?.preventDefault()
  }
}

function onClick (event: Event) {
  emits('onClick', event)
}

function onKeyPress (event: Event) {
  emits('onKeyPress', event)
}

function onBlur () {
  if (
    props.decimalScale !== null &&
      ['number', 'number+', 'number-'].includes(props.inputType) &&
      inputData.value !== ''
  ) {
    const numericValue = parseFloat(inputData.value)
    if (!isNaN(numericValue)) {
      inputData.value = parseFloat(numericValue.toFixed(props.decimalScale))
    }
  }
}

const onClickPasswordVisibility = () => {
  passwordVisibility.value = !passwordVisibility.value
}

function isValidInput (strategyType: string, inputValue: InputValueType): boolean {
  const stringValue = inputValue.toString()
  const numberRegexPatterns = {
    number: /^((-\d+\.)|(-)|(\d+\.?))\d*$/,
    //  cursorPosition is null in input type number sp we should can to put . (dot) in first
    'number+': /^\d*\.?\d*$/,
    'number-': /^-\d*\.?\d*$/,
    int: props.separateThousands ? /^-?(\d{1,3}(,\d{3})*)?$/ : /^-?\d*$/,
    'int+': props.separateThousands ? /^(\d{1,3}(,\d{3})*)?$/ : /^\d*$/,
    iban: /^\d*$/,
    // TODO: fix int- input type , where start with - (dash)
    // TODO: set a dash when the type is int -  and dont allow user to enter this dash
    'int-': /^-\d*$/,
    phone: /^\+?\d*$/,
    tradingCode: /^[\u0600-\u06FF]{1,3}[0-9]{0,5}$/
  }

  // number strategies
  if (Object.keys(numberRegexPatterns).includes(strategyType)) {
    const currentRegex = numberRegexPatterns[props.inputType as keyof typeof numberRegexPatterns]

    const regexIsValid = currentRegex ? currentRegex.test(stringValue) : true

    if (!regexIsValid) {
      return false
    }

    if (
      props.decimalScale !== null &&
        ['number', 'number+', 'number-'].includes(strategyType)
    ) {
      const parts = stringValue.split('.')
      if (parts.length === 2) {
        const decimalPart = parts[1]
        if (decimalPart.length > props.decimalScale) {
          return false
        }
      }
    }

    return true
  }

  // force persian
  if (strategyType === 'persian') {
    const englishChars = /[a-zA-Z]/
    if(englishChars.test(stringValue)){
      $q.notify({
        group: 'persian-keyboard-error',
        classes: 'snack--negative snack--inline-action',
        icon: 'oms:info-circle-bold',
        message: i18nPrefixedT('error.validation.changeKeyboardToPersian'),
        timeout: 20000,
        actions: [
          {
            icon: 'oms:close',
            class: 'icon-button',
            handler: () => {
              /* ... */
            }
          }
        ]
      })
      return false
    }
  }

  if (
    props.decimalScale !== null &&
      ['number', 'number+', 'number-'].includes(strategyType)
  ) {
    const parts = stringValue.split('.')
    if (parts.length === 2) {
      const decimalPart = parts[1]
      if (decimalPart.length > props.decimalScale) {
        return false
      }
    }
  }

  return true
}

function getNormalizedInputValueForGetter (
  strategyType: string,
  inputValue: InputValueType
): InputValueType {
  if (
    typeof inputValue === 'string' &&
    ['number', 'number+', 'number-', 'int', 'int+', 'int-', 'phone', 'tradingCode'].includes(
      strategyType
    )
  ) {
    inputValue = normalizeToEnglishNumbers(inputValue)
  }

  if (props.inputType === 'iban') {
    if (typeof inputValue !== 'string') {
      inputValue = inputValue || ''
    }
    if (typeof inputValue !== 'string') {
      inputValue = inputValue.toString()
    }
    inputValue = inputValue.replace(/^IR/, '')
  }

  if (props.separateThousands && inputValue) {
    if (typeof inputValue !== 'string') {
      inputValue = inputValue.toString()
    }
    inputValue = Number(inputValue.replace(/,/g, '')).toLocaleString('en-US')
  }

  return inputValue
}

function getNormalizedInputValueForSetter (
  strategyType: string,
  inputValue: InputValueType
): InputValueType {

  if (props.separateThousands) {
    inputValue = normalizeToEnglishNumbers(inputValue.toString().replace(/٬/g, '').replace(/,/g, ''))
  }

  if (
    typeof inputValue === 'string' &&
    ['number', 'number+', 'number-', 'int', 'int+', 'int-', 'phone', 'tradingCode'].includes(
      strategyType
    )
  ) {
    inputValue = normalizeToEnglishNumbers(inputValue)
    if (['int', 'int+', 'int-'].includes(strategyType)) {
      inputValue = parseInt(inputValue)
    }

    if (
      props.decimalScale !== null &&
        ['number', 'number+', 'number-'].includes(strategyType) &&
        typeof inputValue === 'string' &&
        inputValue !== ''
    ) {
      const numericValue = parseFloat(inputValue || '0')
      if (!isNaN(numericValue)) {
        inputValue = numericValue.toString()
      }
    }
  }

  if (props.inputType === 'iban') {
    inputValue = 'IR' + inputValue
  }

  if (
    typeof inputValue === 'string' &&
      [
        'text',
        'textarea',
        'search',
        'persian',
        'tradingCode'
      ].includes(
        strategyType
      )
  ) {
    inputValue = normalizePersianLetters(inputValue)
  }

  return inputValue
}

function separateThousandsFn (inputValue:any) {
  if(!inputValue){
    return 0
  }
  if (typeof inputValue !== 'string') {
    inputValue = inputValue.toString()
  }
  inputValue = Number(inputValue.replace(/,/g, '')).toLocaleString('en-US')
  return inputValue
}

function onMaxRange () {
  if(props.maxRange){
    inputData.value = props.maxRange
  }
}

function onMinRange () {
  if(props.minRange){
    inputData.value = props.minRange
  } else {
    inputData.value = 1
  }
}

</script>

<style lang="scss" scoped>
  .range-number{
    height: 92.6%;
    background-color: $neutral-90;
    margin-right: - calc($space-2 - 1px);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: $space-1 $space-2;
    border-top-right-radius: $space-2;
    border-bottom-right-radius: $space-2;
    .min , .max {
      width: 100%;
      color: $color-text1;
      display: flex;
      justify-content: space-between;
      gap: $space-2;
      cursor: pointer;
      @include typo-body-5;
      .q-icon{
        font-size: $space-4;
      }
    }
  }
</style>
