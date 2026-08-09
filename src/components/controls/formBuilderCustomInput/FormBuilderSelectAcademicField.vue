<template>
  <q-select
    ref="input"
    v-model="localValue"
    transition-show="jump-down"
    transition-hide="jump-up"
    :name="name"
    :filled="filled"
    :rounded="rounded"
    :outlined="outlined"
    :error-message="errorMessage"
    :option-value="optionValue"
    :option-label="optionLabel"
    :option-disable="optionDisable"
    :options="filteredOptions"
    :label="label"
    :stack-label="!!placeholder"
    :placeholder="placeholderSetter"
    :multiple="multiple"
    :use-chips="useChips"
    use-input
    input-debounce="500"
    :disable="disable"
    :readonly="readonly"
    emit-value
    map-options
    :hide-dropdown-icon="hideDropdownIcon"
    :dropdown-icon="dropdownIcon"
    :clearable="clearable"
    @filter="filterFn">
    <template #option="{ opt, toggleOption }">
      <q-item
        clickable
        @click="toggleOption(opt)">
        <q-item-section>
          <q-item-label>{{ opt.name }}</q-item-label>
          <q-item-label caption>
            {{ opt.school?.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #no-option>
      <q-item v-show="showNoOption">
        <q-item-section class="text-grey"> موردی یافت نشد </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AcademicFieldAPI, { type AcademicFieldType } from 'src/repositories/academicField'

defineOptions({
  name: 'FormBuilderSelectAcademicField'
})

const props = defineProps({
  label: {
    default: 'رشته تحصیلی',
    type: String
  },
  name: {
    default: '',
    type: String
  },
  value: {
    default: () => [],
    type: [Array, Object, String, Number, Boolean]
  },
  useChips: {
    default: false,
    type: Boolean
  },
  options: {
    default: () => [],
    type: Array
  },
  optionDisable: {
    default: 'disable',
    type: String
  },
  clearable: {
    default: true,
    type: Boolean
  },
  hideDropdownIcon: {
    default: false,
    type: Boolean
  },
  dropdownIcon: {
    default: 'arrow_drop_down',
    type: String
  },
  showNoOption: {
    default: true,
    type: Boolean
  },
  filled: {
    default: false,
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
  multiple: {
    default: false,
    type: Boolean
  },
  placeholder: {
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
  schoolId: {
    default: null,
    type: Number
  }
})

const emits = defineEmits(['update:value', 'input', 'click', 'keydown', 'keypress', 'submit'])

const academicFieldAPI = new AcademicFieldAPI()

const localValue = computed({
  get () {
    return props.value
  },
  set (newValue) {
    emits('update:value', newValue)
  }
})
const placeholderSetter = computed(() => {
  if (localValue.value === null) {
    return props.placeholder
  }
  if (props.multiple && Array.isArray(localValue.value)) {
    return localValue.value.length === 0 ? props.placeholder : ''
  }
  if (Object.keys(localValue.value).length === 0) {
    return props.placeholder
  }
  return ''
})

const errorMessage = ref<string | undefined>(undefined)
const filteredOptions = ref<AcademicFieldType[]>([])
const optionValue = ref('id')
const optionLabel = ref('name')

async function getAcademicFields (name: string | null) {
  const params: any = { name }
  if (props.schoolId) {
    params.school_id = props.schoolId
  }
  const academicFieldsList = await academicFieldAPI.index(params)
  return academicFieldsList.data
}

function filterFn (value: string, update: (callback: () => Promise<void>) => void) {
  update(async () => {
    filteredOptions.value = await getAcademicFields(value || null)
  })
}
</script>

<style scoped></style>
