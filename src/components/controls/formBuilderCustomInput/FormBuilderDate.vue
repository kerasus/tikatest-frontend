<template>
  <div
    class="form-builder-date"
    :class="customClass">
    <q-input
      ref="input"
      v-model="displayDateTime"
      :name="name"
      :loading="loading"
      :filled="filled"
      :mask="mask"
      :dense="dense"
      :fill-mask="fillMask"
      :disable="disable"
      :readonly="readonly"
      :rounded="rounded"
      :reverse-fill-mask="reverseFillMask"
      dir="ltr"
      :label="label"
      :stack-label="!!placeholder"
      :placeholder="placeholder"
      :rules="localRules"
      :lazy-rules="lazyRules"
      :outlined="outlined"
      :class="customClass"
      :input-class="customClass"
      :error="!!localErrorMessage"
      :error-message="
        localErrorData ? $t(localErrorData.message, localErrorData.namedValue) : undefined
      "
      @clear="onClear"
      @keydown="onKeydown">
      <template #append>
        <q-icon
          v-if="clearable"
          v-show="showClearAble"
          name="cancel"
          class="cursor-pointer"
          @click="onClear" />
        <q-icon
          :name="calendarIcon"
          class="cursor-pointer"
          @click="toggleDate" />
      </template>
    </q-input>

    <q-menu
      v-model="popupDate"
      :persistent="persistentMenu"
      no-parent-event
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up">
      <div class="column bg-white shadow-2 rounded-borders overflow-hidden">
        <!-- بخش تقویم کوآزار -->
        <q-date
          v-model="displayDate"
          :calendar="calendar"
          flat
          square
          mask="YYYY/MM/DD"
          :range="range"
          :multiple="multiple"
          :disable="disable"
          :title="title || label || undefined"
          :today-btn="todayBtn"
          :options="daysOptions"
          @update:model-value="onChangeDate" />

        <div class="row items-center justify-end q-pa-sm bg-grey-1 border-top">
          <q-btn
            v-close-popup
            label="تأیید و بستن"
            :color="closeColorBtn"
            flat
            dense />
        </div>
      </div>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ValidationRule } from 'quasar'
import { useDate } from 'src/composables/Date'
import type { PropType, ComputedRef } from 'vue'
import {
  ref,
  watch,
  type Ref,
  computed,
  type ModelRef
} from 'vue'

export interface LocalErrorDataType {
  message: string;
  namedValue: Record<string, unknown>;
}

defineOptions({
  name: 'FormBuilderDate'
})

const props = defineProps({
  name: {
    default: '',
    type: String
  },
  calendar: {
    type: String as PropType<'gregorian' | 'persian' | undefined>,
    default: 'persian'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  calendarIcon: {
    type: String,
    default: 'calendar_month'
  },
  title: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  closeColorBtn: {
    default: 'primary',
    type: String
  },
  multiple: {
    type: Boolean,
    default: false
  },
  range: {
    type: Boolean,
    default: false
  },
  iso8601: {
    type: Boolean,
    default: true
  },
  todayBtn: {
    type: Boolean,
    default: true
  },
  fillMask: {
    type: String,
    default: undefined
  },
  reverseFillMask: {
    type: Boolean,
    default: undefined
  },
  mask: {
    type: String,
    default: '####/##/##'
  },
  label: {
    default: '',
    type: String || null
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
  filled: {
    default: false,
    type: Boolean
  },
  dense: {
    default: true,
    type: Boolean
  },
  rounded: {
    default: false,
    type: Boolean
  },
  outlined: {
    default: false,
    type: Boolean
  },
  rules: {
    default: () => [] as ValidationRule[],
    type: Array as PropType<ValidationRule[]>
  },
  lazyRules: {
    default: false,
    type: Boolean
  },
  loading: {
    default: false,
    type: Boolean
  },
  limitFuture: {
    default: false,
    type: [Boolean, String]
  }
})

const value: ModelRef<string | null> = defineModel('value', {
  type: String,
  default: null
})

const i18n = useI18n()
const dateManager = useDate()

const displayDateTime: Ref<string> = ref('')
const displayDate: Ref<string | undefined> = ref('')

const popupDate = ref(false)
const persistentMenu = ref(false)
const input = ref<HTMLInputElement | null>(null)
const localErrorMessage: Ref<string | null> = ref(null)

const customClass = computed(() => props.class)
const showClearAble = computed(() => displayDateTime.value && displayDateTime.value !== '____/__/__')

const localErrorData: ComputedRef<LocalErrorDataType | undefined> = computed(() => {
  if (!localErrorMessage.value) {
    return undefined
  }
  const errorData: LocalErrorDataType = { message: localErrorMessage.value, namedValue: {} }
  if (errorData.message === 'error.validation.required') {
    errorData.namedValue = { field: props.label }
  }

  return errorData
})

const localRules = computed(() =>
  props.rules.map((rule: any) => {
    if (rule.ruleName === 'required') {
      const ruleName = rule.ruleName
      const ruleParams = rule.ruleParams
      rule = (): boolean | string => {
        if (!displayDateTime.value || displayDateTime.value === '____/__/__') {
          return i18n.t('error.validation.required', { field: props.label })
        } else if (localErrorMessage.value) {
          return false
        } else {
          return true
        }
      }

      rule.ruleName = ruleName
      rule.ruleParams = ruleParams
    }

    return rule
  })
)

function onChangeInputDate () {
  if (!displayDateTime.value || displayDateTime.value.includes('_')) {
    return
  }

  const rawDate = displayDateTime.value.trim()
  const analysedShamsiDate = dateManager.validationShamsiDate(rawDate)

  if (!analysedShamsiDate.isValid) {
    localErrorMessage.value = analysedShamsiDate.message
    return
  }

  localErrorMessage.value = null
  const validShamsi = analysedShamsiDate.shamsiDate || rawDate

  const gregorianDate = props.calendar === 'persian'
    ? dateManager.shamsiToMiladi(validShamsi)
    : validShamsi

  updateDate(gregorianDate, validShamsi)
}

function onChangeDate (newValue: string | null) {
  if (!newValue) {
    onClear()
    return
  }

  const gregorianDate = props.calendar === 'persian'
    ? dateManager.shamsiToMiladi(newValue)
    : newValue

  updateDate(gregorianDate, newValue)
}

function updateDate (gregorianDate: string, shamsiOrDisplayDate: string) {
  displayDate.value = shamsiOrDisplayDate
  displayDateTime.value = shamsiOrDisplayDate

  emitValue(gregorianDate)
}

function emitValue (gregorianDate: string) {
  if (props.iso8601) {
    // تبدیل تاریخ میلادی YYYY-MM-DD به فرمت کامل شروع روز ISO 8601 UTC
    const [year, month, day] = gregorianDate.split('-').map(Number)
    value.value = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString()
  } else {
    value.value = gregorianDate
  }
}

function onClear () {
  displayDateTime.value = '____/__/__'
  displayDate.value = ''
  value.value = null
  localErrorMessage.value = null
}

function toggleDate () {
  popupDate.value = !popupDate.value
}

function openMenu () {
  persistentMenu.value = true
  popupDate.value = true
  input.value?.focus()
}

function onKeydown (e: KeyboardEvent) {
  const allowedKeys = [
    'Backspace',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'Tab',
    'Shift',
    'Control',
    'Alt',
    'Escape',
    'End',
    'Home',
    'Delete'
  ]
  if (e.key === 'ArrowDown') {
    openMenu()
    input.value?.focus()
    return
  }
  if (e.key === ' ') {
    e.preventDefault()
  }

  const isModifierCombination =
    (e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'z', 'y'].includes(e.key.toLowerCase())

  if (
    Number.isNaN(Number(e.key)) &&
    !e.ctrlKey &&
    !e.altKey &&
    !isModifierCombination &&
    !allowedKeys.includes(e.key)
  ) {
    e.preventDefault()
  }
}

function daysOptions (date: string) {
  if (!props.limitFuture) {
    return true
  }
  const limitFutureDate =
    typeof props.limitFuture === 'boolean' ? new Date() : new Date(props.limitFuture)
  const dateMiladi = props.calendar === 'persian'
    ? dateManager.shamsiToMiladi(date)
    : date

  const dateDate = new Date(dateMiladi)

  return dateDate <= limitFutureDate
}

function extractGregorianDate (val: string): string {
  let normalized = val.trim()
  if (normalized.includes('T')) {
    normalized = normalized.split('T')[0]
  } else if (normalized.includes(' ')) {
    normalized = normalized.split(' ')[0]
  }
  return normalized
}

watch(
  () => value.value,
  (newValue) => {
    if (!newValue) {
      displayDateTime.value = '____/__/__'
      displayDate.value = ''
      return
    }

    const gregorianDate = extractGregorianDate(newValue)

    const displayDateValue = props.calendar === 'persian'
      ? dateManager.miladiToShamsi(gregorianDate)
      : gregorianDate

    displayDate.value = displayDateValue
    displayDateTime.value = displayDateValue
  },
  { immediate: true }
)

watch(
  () => props.errorMessage,
  () => {
    localErrorMessage.value = props.errorMessage
  },
  { immediate: true }
)

watch(displayDateTime, () => {
  if (!input.value) return
  onChangeInputDate()
})
</script>

<style scoped>
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
