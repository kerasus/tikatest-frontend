<template>
  <div
    class="form-builder-date-time"
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
      <q-date
        v-model="displayDate"
        :calendar="calendar"
        minimal
        mask="YYYY/MM/DD"
        :range="range"
        :multiple="multiple"
        :title="title ? title : label"
        :today-btn="todayBtn"
        @update:model-value="onChangeDate">
        <q-form class="time-picker">
          <q-input
            ref="inputSecond"
            v-model="dateTime.seconds"
            mask="##"
            label="ثانیه"
            :fill-mask="fillMask"
            :reverse-fill-mask="reverseFillMask"
            dir="ltr"
            @keydown="onKeydownSecond"
            @update:model-value="onMenuSecondInputUpdate" />
          <div class="time-separator">:</div>
          <q-input
            ref="inputMinute"
            v-model="dateTime.minutes"
            mask="##"
            label="دقیقه"
            :fill-mask="fillMask"
            :reverse-fill-mask="reverseFillMask"
            dir="ltr"
            @keydown="onKeydownMinute"
            @update:model-value="onMenuMinuteInputUpdate" />
          <div class="time-separator">:</div>
          <q-input
            ref="inputHour"
            v-model="dateTime.hours"
            mask="##"
            label="ساعت"
            :fill-mask="fillMask"
            :reverse-fill-mask="reverseFillMask"
            dir="ltr"
            @keydown="onKeydownHour"
            @update:model-value="onMenuHourInputUpdate" />
        </q-form>
        <div class="row items-center justify-end">
          <q-btn
            ref="closeBtnRef"
            v-close-popup
            label="بستن"
            :color="closeColorBtn"
            flat />
        </div>
      </q-date>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ValidationRule } from 'quasar'
import { useDate } from 'src/composables/Date'
import type { LocalErrorDataType } from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import type { PropType, ComputedRef } from 'vue'
import {
  ref,
  watch,
  type Ref,
  reactive,
  computed,
  nextTick,
  type ModelRef,
  type ComponentPublicInstance
} from 'vue'

defineOptions({
  name: 'FormBuilderDateTime'
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
  clockIcon: {
    type: String,
    default: 'access_time'
  },
  title: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
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
    default: false
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
    // 1405/05/31 10:30:00
    // ####/##/## ##:##:##
    default: '####/##/## ##:##:##'
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
  closeColorBtn: {
    default: 'primary',
    type: String
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
    type: [Boolean]
  },
  rules: {
    default: () => [] as ValidationRule[],
    type: Array as PropType<ValidationRule[]>
  },
  lazyRules: {
    default: false,
    type: [Boolean]
  },
  loading: {
    default: false,
    type: Boolean
  }
})
const value: ModelRef<string | null> = defineModel('value', {
  type: String,
  default: null
})
const i18n = useI18n()
const dateManager = useDate()

interface DateTimeObject {
  date: string;
  time: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const displayDateTime: Ref<string> = ref('')
const displayDate: Ref<string | undefined> = ref('')
const popupDate = ref(false)
// const popupTime = ref(false)
const persistentMenu = ref(false)
const input = ref<HTMLInputElement | null>(null)
const inputHour = ref<any>(null)
const inputMinute = ref<HTMLInputElement | null>(null)
const inputSecond = ref<HTMLInputElement | null>(null)
const closeBtnRef = ref<ComponentPublicInstance | null>(null)
const localErrorMessage: Ref<string | null> = ref(null)

const dateTime = reactive<DateTimeObject>({
  date: '',
  time: '',
  hours: '__',
  minutes: '__',
  seconds: '__'
})

const customClass = computed(() => props.class)
const showClearAble = computed(() => displayDateTime.value !== '____/__/__ __:__:__')

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
        if (displayDateTime.value === '____/__/__ __:__:__') {
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

function onChangeInputDateTime () {
  const [date, time] = displayDateTime.value.split(' ')
  if (date) {
    dateTime.date = date
  }
  if (time) {
    dateTime.time = time
  }

  const analysedShamsiDate = dateManager.validationShamsiDate(date)
  const analysedTime = dateManager.validationTime(time)

  if (analysedShamsiDate.isValid && analysedTime.isValid) {
    localErrorMessage.value = null
    if (analysedShamsiDate.shamsiDate) {
      onChangeDate(analysedShamsiDate.shamsiDate)
    }

    if (analysedTime.validTime) {
      onChangeTime(analysedTime.validTime)
    }
  } else {
    localErrorMessage.value = analysedShamsiDate.message || analysedTime.message
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
    gregorianDate = dateManager.shamsiToMiladi(newValue.toString())
  }
  updateDateTime(gregorianDate, 'date')
}

function onChangeTime (newTime: string) {
  dateTime.time = newTime
  updateDateTime(newTime, 'time')
}

// newValue should be miladi
// newValue should be gregorian date (YYYY-MM-DD) or time (HH:mm:ss)
function updateDateTime (newValue: string, type: 'date' | 'time') {
  const systemDate = dateManager.now('YYYY-MM-DD')
  const systemTime = dateManager.now('HH:mm:ss')

  // ۱. تاریخ و زمان محلی جاری از روی وضعیت فعلی کامپوننت
  let localGregorianDate = systemDate
  if (displayDate.value) {
    localGregorianDate = props.calendar === 'persian'
      ? dateManager.shamsiToMiladi(displayDate.value)
      : displayDate.value
  }

  const h = dateTime.hours.replace(/_/g, '0').padStart(2, '0')
  const m = dateTime.minutes.replace(/_/g, '0').padStart(2, '0')
  const s = dateTime.seconds.replace(/_/g, '0').padStart(2, '0')
  let localTime = `${h}:${m}:${s}`

  if (type === 'date') {
    localGregorianDate = newValue || systemDate
  } else if (type === 'time') {
    localTime = newValue || systemTime
  }

  // ۲. یکدست‌سازی زمان محلی
  const parsedTime = dateManager.parseTime(localTime)
  if (parsedTime) {
    localTime = `${parsedTime.formattedHour}:${parsedTime.formattedMinute}:${parsedTime.formattedSecond}`
    dateTime.hours = parsedTime.formattedHour
    dateTime.minutes = parsedTime.formattedMinute
    dateTime.seconds = parsedTime.formattedSecond
  }

  // ۳. نمایش به کاربر (شمسی یا میلادی طبق تقویم)
  const displayDateValue = props.calendar === 'persian'
    ? dateManager.miladiToShamsi(localGregorianDate)
    : localGregorianDate

  displayDate.value = displayDateValue
  displayDateTime.value = `${displayDateValue} ${localTime}`

  // ۴. انتشار به بیرون: اگر iso8601 فعال باشد قطعا تبدیل به UTC واقعی می‌شود
  if (props.iso8601) {
    value.value = localGregorianDateTimeToUtcIso(localGregorianDate, localTime)
  } else {
    value.value = `${localGregorianDate} ${localTime}`
  }
}

// اصلاح به‌روزرسانی تایم از پاپ‌آپ تقویم
function onMenuTimeInputUpdate () {
  const h = (dateTime.hours || '00').replaceAll('_', '0').padStart(2, '0')
  const m = (dateTime.minutes || '00').replaceAll('_', '0').padStart(2, '0')
  const s = (dateTime.seconds || '00').replaceAll('_', '0').padStart(2, '0')

  updateDateTime(`${h}:${m}:${s}`, 'time')
}

function onClear () {
  displayDateTime.value = '____/__/__ __:__:__'
  value.value = null
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

function onKeydownHour (e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    inputMinute.value?.focus()
  }
  nextTick(() => {
    if (!dateTime.hours.includes('_') && e.key !== 'Backspace' && e.key !== 'Delete') {
      inputMinute.value?.focus()
    }
  })
}

function onKeydownMinute (e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    inputSecond.value?.focus()
  }
  nextTick(() => {
    if (!dateTime.minutes.includes('_') && e.key !== 'Backspace' && e.key !== 'Delete') {
      inputSecond.value?.focus()
    }
    if (dateTime.minutes === '__' && e.key === 'Backspace') {
      inputHour.value?.focus()
    }
  })
}

function onKeydownSecond (e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    closeBtnRef.value?.$el.focus()
  }
  nextTick(() => {
    if (dateTime.seconds === '__' && e.key === 'Backspace') {
      inputMinute.value?.focus()
    }
  })
}

function onMenuHourInputUpdate () {
  onMenuTimeInputUpdate()
}

function onMenuMinuteInputUpdate () {
  dateTime.hours = dateTime.hours.replaceAll('_', '0')
  onMenuTimeInputUpdate()
}

function onMenuSecondInputUpdate () {
  dateTime.hours = dateTime.hours.replaceAll('_', '0')
  dateTime.minutes = dateTime.minutes.replaceAll('_', '0')

  onMenuTimeInputUpdate()
}

function pad2 (value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * دریافت تاریخ و ساعت محلی میلادی و تولید مقدار واقعی UTC/Zulu
 *
 * 2026-08-27 + 19:45:00 (local)
 * => 2026-08-27T16:15:00.000Z (UTC)
 */
function localGregorianDateTimeToUtcIso (gregorianDate: string, time: string): string {
  const [year, month, day] = gregorianDate.split('-').map(Number)
  const [hour = 0, minute = 0, second = 0] = time.split(':').map(Number)

  /*
   * new Date(year, month - 1, ...) تاریخ را به عنوان زمان محلی سیستم می‌سازد.
   * سپس toISOString آن را به UTC تبدیل می‌کند.
   */
  return new Date(year, month - 1, day, hour, minute, second).toISOString()
}

/**
 * تبدیل UTC ISO به تاریخ و ساعت محلی مرورگر.
 *
 * 2026-08-27T16:15:00.000Z
 * => 2026-08-27 / 19:45:00  (برای timezone ایران)
 */
function utcIsoToLocalGregorianDateTime (isoDateTime: string): {
  date: string;
  time: string;
} {
  // پشتیبانی از فرمت‌های با فاصله یا بدون Z
  let normalized = isoDateTime.trim()
  if (!normalized.includes('T') && normalized.includes(' ')) {
    normalized = normalized.replace(' ', 'T')
  }
  if (!normalized.endsWith('Z') && !normalized.includes('+')) {
    normalized += 'Z' // فرض بر این است که رشته دریافتی از سرور UTC است
  }

  const date = new Date(normalized)

  if (isNaN(date.getTime())) {
    return {
      date: dateManager.now('YYYY-MM-DD'),
      time: dateManager.now('HH:mm:ss')
    }
  }

  return {
    date: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`,
    time: `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
  }
}

watch(
  () => value.value,
  (newValue) => {
    if (!newValue) {
      displayDateTime.value = '____/__/__ __:__:__'
      displayDate.value = ''
      dateTime.hours = '__'
      dateTime.minutes = '__'
      dateTime.seconds = '__'
      return
    }

    let gregorianDate: string
    let timeValue: string

    if (props.iso8601) {
      /*
       * مقدار API UTC است؛ باید برای نمایش به ساعت محلی مرورگر تبدیل شود.
       */
      const localDateTime = utcIsoToLocalGregorianDateTime(newValue)

      gregorianDate = localDateTime.date
      timeValue = localDateTime.time
    } else {
      const [date, time = '00:00:00'] = newValue.trim().replace('T', ' ').split(/\s+/)

      gregorianDate = date
      timeValue = time
    }

    const parsedTime = dateManager.parseTime(timeValue)

    if (parsedTime) {
      timeValue =
        `${parsedTime.formattedHour}:` +
        `${parsedTime.formattedMinute}:` +
        `${parsedTime.formattedSecond}`

      dateTime.hours = parsedTime.formattedHour
      dateTime.minutes = parsedTime.formattedMinute
      dateTime.seconds = parsedTime.formattedSecond
    }

    const displayDateValue =
      props.calendar === 'persian' ? dateManager.miladiToShamsi(gregorianDate) : gregorianDate

    displayDate.value = displayDateValue
    displayDateTime.value = `${displayDateValue} ${timeValue}`
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
  onChangeInputDateTime()
})
</script>
