<template>
  <div
    class="form-builder-time"
    :class="customClass">
    <q-input
      v-model="localDisplayTime"
      :name="name"
      :loading="loading"
      :filled="filled"
      :dense="dense"
      :rounded="rounded"
      :mask="localMask"
      :fill-mask="fillMask"
      :reverse-fill-mask="reverseFillMask"
      dir="ltr"
      :readonly="readonly"
      :disable="disable"
      :label="placeholder ? undefined : label"
      :stack-label="!!placeholder"
      :placeholder="placeholder"
      :rules="localRules"
      :lazy-rules="lazyRules"
      :outlined="outlined"
      :class="customClass"
      :input-class="customClass"
      :error="!!localErrorMessage"
      :error-message="localErrorData ? localErrorData.message : undefined"
      @clear="onClear"
      @update:model-value="onInputTimeChange"
      @keydown="onKeydown">
      <template #append>
        <q-icon
          v-if="clearable"
          v-show="showClearAble"
          name="close"
          class="cursor-pointer"
          @click="onClear" />
        <q-icon
          name="schedule"
          class="cursor-pointer"
          @click="toggleMenuFn" />
      </template>
    </q-input>

    <q-menu
      v-model="popupTime"
      :persistent="localPersistentMenu"
      no-parent-event
      anchor="bottom left"
      self="top left"
      class="form-builder-time"
      transition-show="jump-down"
      transition-hide="jump-up">
      <q-time
        v-model="pickerTime"
        format24h
        :disable="disable || readonly"
        :now-btn="todayBtn"
        @update:model-value="onPickerTimeChange">
        <div class="row items-center justify-end">
          <q-btn
            v-close-popup
            label="بستن"
            :color="closeColorBtn"
            flat />
        </div>
      </q-time>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ComputedRef } from 'vue'
import type { ValidationRule } from 'quasar'
import { useDate } from 'src/composables/Date'
import type { FormBuilderInputType } from 'src/types'
import type { LocalErrorDataType } from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import { computed, type ModelRef, ref, type Ref, watch } from 'vue'

defineOptions({
  name: 'FormBuilderTime'
})

const props = withDefaults(defineProps<FormBuilderInputType>(), {
  name: '',
  calendar: 'persian',
  clearable: true,
  calendarIcon: 'oms:calendar',
  clockIcon: 'oms:clock',
  title: '',
  placeholder: '',
  multiple: false,
  range: false,
  iso8601: true,
  todayBtn: false,
  fillMask: undefined,
  reverseFillMask: undefined,
  label: '',
  class: '',
  error: false,
  errorMessage: '',
  disable: false,
  readonly: false,
  filled: false,
  closeColorBtn: 'primary',
  dense: true,
  rounded: false,
  outlined: false,
  rules: () => [],
  lazyRules: false,
  loading: false
})

const localValue: ModelRef<string | null> = defineModel('value', {
  type: String,
  default: null
})

const { t: rawT } = useI18n()
const dateManager = useDate()

const localMask = ref('##:##')
const localDisplayTime: Ref<string> = ref('')
const pickerTime = ref<string | null>(null)
const popupTime = ref(false)
const localPersistentMenu = ref(false)
const localErrorMessage: Ref<string | null> = ref(null)
let isInternalUpdating = false

const customClass = computed(() => props.class)
const showClearAble = computed(() => localDisplayTime.value !== '__:__' && !!localDisplayTime.value)

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
  (props.rules as ValidationRule[]).map((rule: any) => {
    if (rule.ruleName === 'required') {
      const ruleName = rule.ruleName
      const ruleParams = rule.ruleParams
      rule = (): boolean | string => {
        if (!localDisplayTime.value || localDisplayTime.value === '__:__') {
          return rawT('error.validation.required', { field: props.label })
        } else return !localErrorMessage.value
      }

      rule.ruleName = ruleName
      rule.ruleParams = ruleParams
    }

    return rule
  })
)

function pad2 (val: number): string {
  return String(val).padStart(2, '0')
}

/**
 * تبدیل ساعت محلی (کاربر) به ساعت UTC با فرمت HH:mm:00
 * مثال: "14:30" => "11:00:00"
 */
function localTimeToUtcTime (localTime: string): string {
  const parts = localTime.split(':')
  const hour = Number(parts[0] ?? 0)
  const minute = Number(parts[1] ?? 0)

  const date = new Date(2026, 0, 1, hour, minute, 0)
  return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:00`
}

/**
 * تبدیل ساعت UTC (بک‌اند) به ساعت محلی سیستم جهت نمایش در UI (HH:mm)
 */
function utcTimeToLocalTime (utcTime: string): string {
  let hour = 0
  let minute = 0

  if (utcTime.includes('T')) {
    const d = new Date(utcTime)
    if (!isNaN(d.getTime())) {
      return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
    }
  }

  const cleanTime = utcTime.trim().replace(/[zZ]$/, '')
  const parts = cleanTime.split(':')
  hour = Number(parts[0] ?? 0)
  minute = Number(parts[1] ?? 0)

  const utcDate = new Date(Date.UTC(2026, 0, 1, hour, minute, 0))
  return `${pad2(utcDate.getHours())}:${pad2(utcDate.getMinutes())}`
}

/**
 * دریافت مقدار از بیرون (بک‌اند یا والد) و تنظیم مقدار نمایشی محلی
 */
watch(
  () => localValue.value,
  (newValue) => {
    if (isInternalUpdating) {
      return
    }

    if (!newValue || newValue === '__:__' || newValue === '__:__:__') {
      localDisplayTime.value = '__:__'
      pickerTime.value = null
      return
    }

    // تبدیل مقدار دریافتی به زمان محلی برای نمایش در اینپوت و پیکر
    const localTime = props.iso8601 ? utcTimeToLocalTime(newValue) : newValue
    const [h = '00', m = '00'] = localTime.split(':')
    const formatted = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`

    localDisplayTime.value = formatted
    pickerTime.value = formatted
  },
  { immediate: true }
)

/**
 * ثبت مقدار جدید و امیت کردن خروجی با ثانیه صفر (HH:mm:00)
 */
function emitTimeChange (localTimeString: string) {
  const [h = '00', m = '00'] = localTimeString.split(':')
  const cleanLocal = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`

  localDisplayTime.value = cleanLocal
  pickerTime.value = cleanLocal

  isInternalUpdating = true
  if (props.iso8601) {
    localValue.value = localTimeToUtcTime(cleanLocal)
  } else {
    // حتی در حالت غیر iso هم همیشه ثانیه صفر را به بک‌اند می‌فرستیم
    localValue.value = `${cleanLocal}:00`
  }
  isInternalUpdating = false
}

function onInputTimeChange (newValue: string | number | null) {
  if (typeof newValue !== 'string') return

  if (newValue === '__:__' || !newValue) {
    localErrorMessage.value = null
    isInternalUpdating = true
    localValue.value = null
    pickerTime.value = null
    isInternalUpdating = false
    return
  }

  // تا زمانی که ارقام کامل تایپ نشده‌اند، امیت نکن
  if (newValue.includes('_')) {
    return
  }

  const analysedTime = dateManager.validationTime(`${newValue}:00`)
  if (analysedTime.isValid && analysedTime.validTime) {
    localErrorMessage.value = null
    emitTimeChange(newValue)
  } else {
    localErrorMessage.value = analysedTime.message
  }
}

function onPickerTimeChange (newValue: string | null) {
  if (!newValue) return
  localErrorMessage.value = null
  emitTimeChange(newValue)
}

function onClear () {
  localDisplayTime.value = '__:__'
  pickerTime.value = null
  localErrorMessage.value = null
  isInternalUpdating = true
  localValue.value = null
  isInternalUpdating = false
}

function openMenu () {
  if (props.disable || props.readonly) return
  localPersistentMenu.value = true
  popupTime.value = true
}

function toggleMenuFn () {
  if (popupTime.value) {
    popupTime.value = false
    return
  }
  openMenu()
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

watch(
  () => props.errorMessage,
  (msg) => {
    localErrorMessage.value = msg
  },
  { immediate: true }
)
</script>
