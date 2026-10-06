<template>
  <div
    class="form-builder-time"
    :class="customClass">
    <!--    :error-message="-->
    <!--    localErrorData ? $t(localErrorData.message, localErrorData.namedValue) : undefined-->
    <!--    "-->
    <q-input
      v-model="localDisplayDateTime"
      :name="name"
      :loading="loading"
      :filled="filled"
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
      autofocus
      @clear="onClear"
      @update:model-value="onChangeInputTime"
      @keydown="onKeydown">
      <template #append>
        <q-icon
          v-if="clearable"
          v-show="showClearAble"
          name="close"
          class="cursor-pointer"
          @click="onClear" />
        <q-icon
          name="watch"
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
const localDisplayDateTime: Ref<string> = ref('')
const pickerTime = ref<string | null>(null)
const popupTime = ref(false)
const localPersistentMenu = ref(false)
const localErrorMessage: Ref<string | null> = ref(null)

const customClass = computed(() => props.class)
const showClearAble = computed(() => localDisplayDateTime.value !== '__:__')

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
        if (localDisplayDateTime.value === '__:__') {
          return rawT('error.validation.required', { field: props.label })
        } else return !localErrorMessage.value
      }

      rule.ruleName = ruleName
      rule.ruleParams = ruleParams
    }

    return rule
  })
)

watch(
  () => localValue.value,
  (newValue) => {
    if (!newValue) {
      localDisplayDateTime.value = '__:__'
      pickerTime.value = null
      return
    }
    onChangeTime(newValue)
  },
  { immediate: true }
)

function onChangeInputTime (newValue: string | number | null) {
  if (typeof newValue !== 'string') {
    return
  }
  if (newValue === '__:__') {
    localErrorMessage.value = null
    localValue.value = null
    return
  }

  const analysedShamsiTime = dateManager.validationTime(`${newValue}:00`)

  if (analysedShamsiTime.isValid && analysedShamsiTime.validTime) {
    localErrorMessage.value = null
    onChangeTime(analysedShamsiTime.validTime)
  } else {
    localErrorMessage.value = analysedShamsiTime.message
  }
}

function onChangeTime (newValue: string) {
  const [hour = '', minute = ''] = newValue.split(':')
  const normalizedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
  pickerTime.value = normalizedTime
  updateDateTime(normalizedTime)
}

function updateDateTime (newValue: string) {
  localDisplayDateTime.value = newValue || ''
  localValue.value = newValue ? newValue.toString() : newValue
}
function onClear () {
  localDisplayDateTime.value = '__:__'
  pickerTime.value = null
  localErrorMessage.value = null
  localValue.value = null
}

function openMenu () {
  if (props.disable || props.readonly) return
  localPersistentMenu.value = true
  popupTime.value = true
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

function onPickerTimeChange (newValue: string | null) {
  if (!newValue) return
  localErrorMessage.value = null
  onChangeTime(newValue)
}

function toggleMenuFn () {
  if (popupTime.value) {
    popupTime.value = false
    return
  }
  openMenu()
}

watch(
  () => props.errorMessage,
  () => {
    localErrorMessage.value = props.errorMessage
  },
  { immediate: true }
)
</script>
