<template>
  <div
    class="form-builder-date"
    :class="customClass">
    <div class="outsideLabel">
      {{ placeholder ? label : null }}
    </div>
    <!--    :error-message="-->
    <!--    localErrorData ? $t(localErrorData.message, localErrorData.namedValue) : undefined-->
    <!--    "-->
    <q-input
      ref="input"
      v-model="displayDateTime"
      :name="name"
      :loading="loading"
      :filled="filled"
      :mask="mask"
      :disable="disable"
      :fill-mask="fillMask"
      :reverse-fill-mask="reverseFillMask"
      dir="ltr"
      :label="placeholder ? undefined : label"
      :stack-label="!!placeholder"
      :placeholder="placeholder"
      :rules="localRules"
      :lazy-rules="lazyRules"
      :outlined="outlined"
      :class="customClass"
      :input-class="customClass"
      :readonly="readonly"
      :error="!!localErrorMessage"
      :error-message="localErrorData ? localErrorData.message : undefined"
      :autofocus="false"
      @clear="onClear"
      @update:model-value="onChangeInputDate"
      @keydown="onKeydown">
      <template #append>
        <q-icon
          v-if="clearable"
          v-show="showClearAble"
          name="oms:close-circle"
          class="cursor-pointer"
          @click="onClear" />
        <q-icon
          name="oms:calendar"
          class="cursor-pointer"
          @click="toggleMenu" />
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
      <q-date
        v-model="displayDateTime"
        :calendar="calendar"
        :range="range"
        :multiple="multiple"
        :disable="disable"
        :default-year-month="defaultYearMonth"
        :today-btn="todayBtn"
        :options="daysOptions"
        minimal
        :bordered="false"
        @update:model-value="onChangeDate">
        <div class="row items-center justify-end">
          <q-btn
            v-close-popup
            :label="$t('general.close')"
            :color="closeColorBtn"
            flat />
        </div>
      </q-date>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ComputedRef } from 'vue'
import type { ValidationRule } from 'quasar'
import { useDate } from 'src/composables/Date'
import { createPrefixedT } from 'src/services/i18nWrapper'
import { computed, type ModelRef, type Ref, ref, watch } from 'vue'
import { FormBuilderInputType } from 'src/types'

export interface LocalErrorDataType {
  message: string
  namedValue: Record<string, unknown>
}

defineOptions({
  name: 'FormBuilderDate'
})

const { t: rawT } = useI18n()
const i18nPrefixedT = createPrefixedT(rawT)
const dateManager = useDate(i18nPrefixedT)


const props = withDefaults(defineProps<FormBuilderInputType>(), {
  name: '',
  calendar: 'persian',
  clearable: true,
  calendarIcon: 'oms:calendar',
  clockIcon: 'oms:clock',
  title: '',
  placeholder: '',
  closeColorBtn: 'primary',
  multiple: false,
  range: false,
  iso8601: true,
  todayBtn: false,
  fillMask: undefined,
  reverseFillMask: undefined,
  withTime: false,
  label: '',
  class: '',
  error: false,
  errorMessage: '',
  disable: false,
  defaultYearMonth: undefined,
  readonly: false,
  filled: false,
  dense: true,
  rounded: false,
  outlined: false,
  rules: () => [],
  lazyRules: false,
  loading: false,
  limitFuture: false,
  limitPast: false
})

// const popupTime = ref(false)
const popupDate = ref(false)
const mask = ref('####/##/##')
const persistentMenu = ref(false)
const displayDateTime: Ref<string> = ref('')
const input = ref<HTMLInputElement | null>(null)
const localErrorMessage: Ref<string | null> = ref(null)

const value: ModelRef<string | null> = defineModel('value', {
  type: String,
  default: null
})

const localRules = computed(() =>
  (props.rules as ValidationRule[]).map((rule: any) => {
    if (rule.ruleName === 'required') {
      const ruleName = rule.ruleName
      const ruleParams = rule.ruleParams
      rule = (): boolean | string => {
        if (displayDateTime.value === '____/__/__') {
          return i18nPrefixedT('error.validation.required', { field: props.label })
        } else return !localErrorMessage.value
      }

      rule.ruleName = ruleName
      rule.ruleParams = ruleParams
    }

    return rule
  })
)
const customClass = computed(() => props.class)
const showClearAble = computed(() => displayDateTime.value !== '____/__/__')
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

watch(
  () => value.value,
  (newValue) => {
    if (!newValue || isNaN((new Date(newValue)).getTime())) {
      displayDateTime.value = '____/__/__'
      return
    }
    let gregorianDate: null | string
    const iso8601DateString = dateManager.getDateTimeFromIso8601DateString(newValue)
    const gd = (typeof iso8601DateString === 'object' ? iso8601DateString.date : '2020-01-01')
    if (props.withTime) {
      gregorianDate = gd + 'T00:00:00'
    } else {
      gregorianDate = gd
    }
    value.value = gregorianDate
    displayDateTime.value = dateManager.miladiToShamsi(newValue.toString())
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

function onChangeInputDate () {
  if(displayDateTime.value === '____/__/__') {
    value.value = null
  }
  const analysedShamsiDate = dateManager.validationShamsiDate(displayDateTime.value)

  if (analysedShamsiDate.isValid) {
    localErrorMessage.value = null
    if (analysedShamsiDate.shamsiDate) {
      onChangeDate(analysedShamsiDate.shamsiDate)
    }
  } else {
    localErrorMessage.value = analysedShamsiDate.message
  }
}

// newValue can be miladi or shamsi
function onChangeDate (newValue: string) {
  if (!newValue) {
    onClear()
    return
  }
  let gregorianDate = newValue
  if (props.calendar === 'persian') {
    if (props.withTime) {
      gregorianDate = dateManager.shamsiToMiladi(
        newValue.toString(),
        'jYYYY/jMM/jDD',
        'YYYY-MM-DDT00:00:00'
      )
    } else {
      gregorianDate = dateManager.shamsiToMiladi(newValue.toString())
    }
  }
  displayDateTime.value = newValue.toString()
  value.value = gregorianDate
}

function onClear () {
  displayDateTime.value = '____/__/__'
  value.value = null
}

function toggleMenu () {
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
    !e.metaKey &&
    !isModifierCombination &&
    !allowedKeys.includes(e.key)
  ) {
    e.preventDefault()
  }
}

function daysOptions (date: string) {
  if (!props.limitFuture && !props.limitPast) {
    return true
  }
  if(props.limitFuture){
    const limitFutureDate =
    typeof props.limitFuture === 'boolean' ? new Date() : new Date(props.limitFuture)
    const dateDate = new Date(dateManager.shamsiToMiladi(date))

    if (typeof props.limitFuture === 'string') {
      return dateDate <= limitFutureDate
    }
    return dateDate <= limitFutureDate

  }else if(props.limitPast){
    const limitPastDate =  typeof props.limitPast === 'boolean' ? new Date() : new Date(props.limitPast)
    limitPastDate.setDate(limitPastDate.getDate() - 1)
    const dateDate = new Date(dateManager.shamsiToMiladi(date))
    if (typeof props.limitPast === 'string') {
      return dateDate >= limitPastDate
    }
    return dateDate >= limitPastDate

  }
}

watch(displayDateTime, onChangeInputDate)
</script>
