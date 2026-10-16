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
      <div class="row no-wrap items-stretch bg-white shadow-2 rounded-borders overflow-hidden">
        <!-- بخش تقویم -->
        <q-date
          v-model="displayDate"
          :calendar="calendar"
          flat
          square
          mask="YYYY/MM/DD"
          :range="range"
          :multiple="multiple"
          :title="title || label || undefined"
          :today-btn="todayBtn"
          @update:model-value="onChangeDate" />

        <q-separator vertical />

        <!-- بخش ساعت استاندارد کوازار -->
        <div class="column justify-between bg-grey-1">
          <q-time
            v-model="displayTimeHoursMinutes"
            flat
            square
            format24h
            mask="HH:mm"
            @update:model-value="onChangeTime" />

          <div class="row items-center justify-end q-pa-sm bg-white border-top">
            <q-btn
              v-close-popup
              label="تأیید و بستن"
              :color="closeColorBtn"
              flat
              dense />
          </div>
        </div>

      </div>
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
  computed,
  type ModelRef
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

/**
 * زمان کامل داخلی:
 * HH:mm:ss
 *
 * ثانیه در این مقدار نگهداری می‌شود،
 * اما در q-time فقط ساعت و دقیقه نمایش داده می‌شود.
 */
const displayTime: Ref<string> = ref('00:00:00')

/**
 * مدل مخصوص q-time:
 * فقط HH:mm
 */
const displayTimeHoursMinutes: Ref<string> = ref('00:00')

const popupDate = ref(false)
const persistentMenu = ref(false)
const input = ref<HTMLInputElement | null>(null)
const localErrorMessage: Ref<string | null> = ref(null)

const customClass = computed(() => props.class)
const showClearAble = computed(() => displayDateTime.value && displayDateTime.value !== '____/__/__ __:__:__')

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
        if (!displayDateTime.value || displayDateTime.value === '____/__/__ __:__:__') {
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
  if (!displayDateTime.value || displayDateTime.value.includes('_')) {
    return
  }

  const [date, rawTime = '00:00:00'] = displayDateTime.value.split(' ')

  /**
   * اگر کاربر یا مقدار ورودی ثانیه نداشت،
   * آن را صفر در نظر می‌گیریم.
   */
  const time = rawTime.split(':').length === 2
    ? `${rawTime}:00`
    : rawTime

  const analysedShamsiDate = dateManager.validationShamsiDate(date)
  const analysedTime = dateManager.validationTime(time)

  if (!analysedShamsiDate.isValid || !analysedTime.isValid) {
    localErrorMessage.value =
      analysedShamsiDate.message || analysedTime.message

    return
  }

  localErrorMessage.value = null

  const validDate = analysedShamsiDate.shamsiDate || date
  const validTime = normalizeTime(analysedTime.validTime || time)

  const gregorianDate = props.calendar === 'persian'
    ? dateManager.shamsiToMiladi(validDate)
    : validDate

  updateDateTime(gregorianDate, validTime)
}

function onChangeDate (newValue: string | null) {
  if (!newValue) {
    onClear()
    return
  }

  const gregorianDate = props.calendar === 'persian'
    ? dateManager.shamsiToMiladi(newValue)
    : newValue

  /**
   * با تغییر تاریخ، ثانیه‌ی قبلی حفظ می‌شود.
   */
  const currentTime = normalizeTime(displayTime.value)

  updateDateTime(gregorianDate, currentTime)
}

function onChangeTime (newTime: string | null) {
  const hoursMinutes = newTime || '00:00'

  /**
   * ثانیه‌ی ورودی قبلی حفظ می‌شود.
   * اگر ورودی نداشته باشیم، مقدار آن 00 است.
   */
  const seconds = getCurrentSeconds()
  const fullTime = `${hoursMinutes}:${seconds}`

  const gregorianDate = getCurrentGregorianDate()

  updateDateTime(gregorianDate, fullTime)
}

function updateDateTime (
  gregorianDate: string,
  time: string
) {
  const parsedTime = dateManager.parseTime(time)

  const localTime = parsedTime
    ? normalizeTime(
      `${parsedTime.formattedHour}:` +
        `${parsedTime.formattedMinute}:` +
        `${parsedTime.formattedSecond || '00'}`
    )
    : normalizeTime(time)

  const displayDateValue = props.calendar === 'persian'
    ? dateManager.miladiToShamsi(gregorianDate)
    : gregorianDate

  /**
   * زمان کامل داخلی با ثانیه حفظ می‌شود.
   */
  displayTime.value = localTime

  /**
   * q-time فقط ساعت و دقیقه را دریافت می‌کند.
   */
  displayTimeHoursMinutes.value = toHoursMinutes(localTime)

  displayDate.value = displayDateValue
  displayDateTime.value = `${displayDateValue} ${localTime}`

  emitValue(gregorianDate, localTime)
}

function emitValue (gregorianDate: string, localTime: string) {
  if (props.iso8601) {
    value.value = localGregorianDateTimeToUtcIso(gregorianDate, localTime)
  } else {
    value.value = `${gregorianDate} ${localTime}`
  }
}

function onClear () {
  displayDateTime.value = '____/__/__ __:__:__'
  displayDate.value = ''

  /**
   * مقدار پیش‌فرض ثانیه صفر است.
   */
  displayTime.value = '00:00:00'
  displayTimeHoursMinutes.value = '00:00'

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

function localGregorianDateTimeToUtcIso (gregorianDate: string, time: string): string {
  const [year, month, day] = gregorianDate.split('-').map(Number)
  const [hour = 0, minute = 0, second = 0] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, second).toISOString()
}

function utcIsoToLocalGregorianDateTime (isoDateTime: string): {
  date: string;
  time: string;
} {
  let normalized = isoDateTime.trim()

  if (!normalized.includes('T') && normalized.includes(' ')) {
    normalized = normalized.replace(' ', 'T')
  }

  /**
   * اگر timezone مشخص نشده باشد،
   * مقدار ورودی را UTC فرض می‌کنیم.
   */
  if (
    !normalized.endsWith('Z') &&
    !normalized.includes('+') &&
    !/[+-]\d{2}:\d{2}$/.test(normalized)
  ) {
    normalized += 'Z'
  }

  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    return {
      date: dateManager.now('YYYY-MM-DD'),
      time: '00:00:00'
    }
  }

  return {
    date: [
      date.getFullYear(),
      pad2(date.getMonth() + 1),
      pad2(date.getDate())
    ].join('-'),

    time: [
      pad2(date.getHours()),
      pad2(date.getMinutes()),
      pad2(date.getSeconds())
    ].join(':')
  }
}

function pad2 (value: number): string {
  return String(value).padStart(2, '0')
}

function toSafeNumber (value: string | undefined, fallback = 0): number {
  const numberValue = Number(value)

  return Number.isFinite(numberValue)
    ? numberValue
    : fallback
}

/**
 * تبدیل هر زمان ممکن به فرمت کامل HH:mm:ss
 *
 * 10:20     => 10:20:00
 * 10:20:35  => 10:20:35
 * خالی       => 00:00:00
 */
function normalizeTime (time?: string | null): string {
  if (!time || time.includes('_')) {
    return '00:00:00'
  }

  const [hour, minute, second] = time
    .trim()
    .split(':')
    .map((value) => value.trim())

  return [
    pad2(toSafeNumber(hour)),
    pad2(toSafeNumber(minute)),
    pad2(toSafeNumber(second))
  ].join(':')
}

/**
 * تبدیل زمان کامل به مدل مورد نیاز q-time
 */
function toHoursMinutes (time?: string | null): string {
  const normalizedTime = normalizeTime(time)
  return normalizedTime.substring(0, 5)
}

/**
 * دریافت ثانیه‌ی فعلی.
 *
 * این مقدار از زمان ورودی یا زمان فعلی داخلی حفظ می‌شود.
 */
function getCurrentSeconds (): string {
  return normalizeTime(displayTime.value).split(':')[2] || '00'
}

/**
 * تاریخ میلادی محلی فعلی کامپوننت
 */
function getCurrentGregorianDate (): string {
  if (displayDate.value) {
    return props.calendar === 'persian'
      ? dateManager.shamsiToMiladi(displayDate.value)
      : displayDate.value
  }

  return dateManager.now('YYYY-MM-DD')
}

watch(
  () => value.value,
  (newValue) => {
    if (!newValue) {
      displayDateTime.value = '____/__/__ __:__:__'
      displayDate.value = ''

      /**
       * وقتی ورودی نداریم، ثانیه صفر است.
       */
      displayTime.value = '00:00:00'
      displayTimeHoursMinutes.value = '00:00'

      return
    }

    let gregorianDate: string
    let timeValue: string

    if (props.iso8601) {
      /**
       * ورودی API:
       * UTC Gregorian
       *
       * خروجی این تابع:
       * زمان محلی مرورگر به‌صورت Gregorian
       */
      const localDateTime = utcIsoToLocalGregorianDateTime(newValue)

      gregorianDate = localDateTime.date
      timeValue = normalizeTime(localDateTime.time)
    } else {
      const [
        date,
        time = '00:00:00'
      ] = newValue
        .trim()
        .replace('T', ' ')
        .split(/\s+/)

      gregorianDate = date
      timeValue = normalizeTime(time)
    }

    const displayDateValue = props.calendar === 'persian'
      ? dateManager.miladiToShamsi(gregorianDate)
      : gregorianDate

    displayDate.value = displayDateValue

    /**
     * ثانیه‌ی ورودی حفظ می‌شود.
     */
    displayTime.value = timeValue
    displayTimeHoursMinutes.value = toHoursMinutes(timeValue)

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

<style scoped>
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
