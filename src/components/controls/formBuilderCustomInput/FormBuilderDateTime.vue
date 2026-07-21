<template>
  <div
    class="form-builder-date-time"
    :class="customClass">
    <div class="outsideLabel">
      {{ placeholder ? label : null }}
    </div>
    <!--    $t(localErrorData.message, localErrorData.namedValue)-->
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
      :autofocus="false"
      @clear="onClear"
      @keydown="onKeydown">
      <template #append>
        <q-icon
          v-if="clearable"
          v-show="showClearAble"
          name="oms:close-circle"
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
        :bordered="false"
        :options="daysOptions"
        @update:model-value="onChangeDate">
        <q-form class="time-picker">
          <q-input
            ref="inputSecond"
            v-model="dateTime.seconds"
            mask="##"
            :label="$t('fieldName.second')"
            :fill-mask="fillMask"
            :reverse-fill-mask="reverseFillMask"
            dir="ltr"
            :autofocus="false"
            @keydown="onKeydownSecond"
            @update:model-value="onMenuSecondInputUpdate" />
          <div class="time-separator">:</div>
          <q-input
            ref="inputMinute"
            v-model="dateTime.minutes"
            mask="##"
            :label="$t('fieldName.minute')"
            :fill-mask="fillMask"
            :reverse-fill-mask="reverseFillMask"
            dir="ltr"
            :autofocus="false"
            @keydown="onKeydownMinute"
            @update:model-value="onMenuMinuteInputUpdate" />
          <div class="time-separator">:</div>
          <q-input
            ref="inputHour"
            v-model="dateTime.hours"
            mask="##"
            :label="$t('fieldName.hour')"
            :fill-mask="fillMask"
            :reverse-fill-mask="reverseFillMask"
            dir="ltr"
            :autofocus="false"
            @keydown="onKeydownHour"
            @update:model-value="onMenuHourInputUpdate" />
        </q-form>
        <div class="row items-center justify-end">
          <q-btn
            ref="closeBtnRef"
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
import { FormBuilderInputType } from 'src/types'
import type { LocalErrorDataType } from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import { type ComponentPublicInstance, computed, type ModelRef, nextTick, reactive, ref, type Ref, watch } from 'vue'

defineOptions({
  name: 'FormBuilderDateTime'
})

const { t: rawT } = useI18n()
const dateManager = useDate()


interface DateTimeObject {
  date: string
  time: string
  hours: string
  minutes: string
  seconds: string
}


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
  loading: false,
  limitFuture: false,
  limitPast: false,
  convertToZone: false
})

const mask = ref('####/##/## ##:##:##')
const displayDateTime: Ref<string> = ref('')
const displayDate: Ref<string> = ref('')
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

const value: ModelRef<string | null> = defineModel('value', {
  type: String,
  default: null
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

const localRules = computed(() => (props.rules as ValidationRule[]).map((rule: any) => {
  if (rule.ruleName === 'required') {
    const ruleName = rule.ruleName
    const ruleParams = rule.ruleParams
    rule = (): boolean | string => {
      if (displayDateTime.value === '____/__/__ __:__:__') {
        return rawT('error.validation.required', { field: props.label })
      } else return !localErrorMessage.value
    }

    rule.ruleName = ruleName
    rule.ruleParams = ruleParams
  }

  return rule
}))

function onChangeInputDateTime () {
  const [date, time] = displayDateTime.value.split(' ')
  dateTime.date = date
  dateTime.time = time

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
function updateDateTime (newValue: string, type: 'date' | 'time',isEdit?:false|true) {
  const systemDate = dateManager.now('YYYY-MM-DD')
  // const systemTime = dateManager.now('HH:mm:ss')

  const displayTime = `${dateTime.hours}:${dateTime.minutes}:${dateTime.seconds}`
  const analysedShamsiDate = dateManager.validationShamsiDate(dateTime.date)
  const analysedTime = dateManager.validationTime(displayTime)
  // TODO: should fix this for calender != persian
  const defaultDate = analysedShamsiDate.isValid
    ? dateManager.shamsiToMiladi(dateTime.date)
    : systemDate
  // const defaultTime = analysedTime.isValid ? displayTime : systemTime
  const defaultTime = analysedTime.isValid ? displayTime : '__:__:__'

  const finalDate = newValue && type === 'date' ? newValue : defaultDate
  const finalTime = newValue && type === 'time' ? newValue : defaultTime

  // const inputData = value.value ? value.value.replace('T', ' ') : `${finalDate} ${finalTime}`
  const date = isEdit ? value.value: `${finalDate}T${finalTime}`

  const iso8601DateString = dateManager.getDateTimeFromIso8601DateString(date)
  const normalizedDateTime = (typeof iso8601DateString === 'object') ? iso8601DateString : {
    date: finalDate,
    time: finalTime
  }
  const inputData = `${normalizedDateTime.date} ${normalizedDateTime.time}`

  const arrValue = inputData.trim().split(' ')
  const timeValue = arrValue[1]
  displayDate.value =
    props.calendar === 'persian' ? dateManager.miladiToShamsi(arrValue[0]) : arrValue[0]

  if (type === 'date') {
    arrValue[0] = newValue.toString()
  } else if (type === 'time') {
    const parsedTime = dateManager.parseTime(timeValue)
    dateTime.hours = parsedTime.formattedHour
    dateTime.minutes = parsedTime.formattedMinute
    dateTime.seconds = parsedTime.formattedSecond
    arrValue[1] = newValue
  }

  const delimiter = props.iso8601 ? 'T' : ' '
  displayDateTime.value = [displayDate.value, timeValue].join(' ')
  const generatedDate = arrValue.join(delimiter).replace(',', ' ')
  value.value = props.convertToZone ?  toUTCISOString(generatedDate) : generatedDate
}

function toUTCISOString (dateString:string) {
  const date = new Date(dateString) 
  if (isNaN(date.getTime())) {
    return
  }
  return date.toISOString() 
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

function onMenuTimeInputUpdate () {
  // ____/__/__ __:__:__
  const defaultDate = dateManager.now('jYYYY/jMM/jDD')

  if (!value.value) {
    displayDateTime.value = defaultDate + displayDateTime.value.slice(10, 19)
  }
  displayDateTime.value =
    displayDateTime.value.slice(0, 11) +
    dateTime.hours +
    displayDateTime.value.slice(13, 14) +
    dateTime.minutes +
    displayDateTime.value.slice(16, 17) +
    dateTime.seconds +
    displayDateTime.value.slice(19)
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

watch(
  () => value.value,
  (newValue) => {
    if (!newValue) {
      displayDateTime.value = '____/__/__ __:__:__'
      return
    }
    const iso8601DateString = dateManager.getDateTimeFromIso8601DateString(newValue)
    const displayDateMiladi = dateManager.shamsiToMiladi(displayDate.value)
    const gd = (
      typeof iso8601DateString === 'object' ?
        iso8601DateString.date :
        dateManager.isValidDate(displayDateMiladi) ?
          displayDateMiladi :
          '2020-01-01'
    )
    const gt = (typeof iso8601DateString === 'object' ? iso8601DateString.time : '__:__:__')
    const newDate = gd.toString()
    const newTime = gt.toString()
    updateDateTime(newDate, 'date',true)
    updateDateTime(newTime, 'time', true)
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

watch(displayDateTime, onChangeInputDateTime)
</script>
