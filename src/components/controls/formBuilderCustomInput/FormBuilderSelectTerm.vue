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
    <template #no-option>
      <q-item v-show="showNoOption">
        <q-item-section class="text-grey"> موردی یافت نشد </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEntitySelector } from 'src/composables/useEntitySelector'
import AcademicTermAPI, { type AcademicTermType } from 'src/repositories/academicTerm'
import type { ExamCategoryType } from 'src/repositories/examCategory'

defineOptions({
  name: 'FormBuilderSelectTerm'
})

const props = defineProps({
  label: { default: 'ترم', type: String },
  name: { default: '', type: String },
  value: { default: () => [], type: [Array, Object, String, Number, Boolean] },
  useChips: { default: false, type: Boolean },
  options: { default: () => [], type: Array },
  optionDisable: { default: 'disable', type: String },
  clearable: { default: true, type: Boolean },
  hideDropdownIcon: { default: false, type: Boolean },
  dropdownIcon: { default: 'arrow_drop_down', type: String },
  showNoOption: { default: true, type: Boolean },
  filled: { default: false, type: Boolean },
  rounded: { default: false, type: Boolean },
  outlined: { default: false, type: Boolean },
  multiple: { default: false, type: Boolean },
  placeholder: { default: '', type: String },
  disable: { default: false, type: Boolean },
  readonly: { default: false, type: Boolean },
  schoolId: { default: null, type: [Number, String, Object] },
  activeOnly: { default: false, type: Boolean }
})

const emit = defineEmits(['update:value', 'input', 'click', 'keydown', 'keypress', 'submit'])

const localValue = computed({
  get () { return props.value },
  set (newValue) { emit('update:value', newValue) }
})

const placeholderSetter = computed(() => {
  if (localValue.value === null) return props.placeholder
  if (props.multiple && Array.isArray(localValue.value)) {
    return localValue.value.length === 0 ? props.placeholder : ''
  }
  if (Object.keys(localValue.value).length === 0) return props.placeholder
  return ''
})

const errorMessage = ref<string | undefined>(undefined)
const filteredOptions = ref<AcademicTermType[]>([])
const optionValue = ref('id')
const optionLabel = ref('name')

function getSchoolId (): number | null {
  const school = props.schoolId

  if (typeof school === 'number') return school
  if (typeof school === 'string' && school.trim() !== '') return Number(school)
  if (school && typeof school === 'object' && 'id' in school) {
    const id = (school as { id?: unknown }).id
    if (typeof id === 'number') return id
    if (typeof id === 'string' && id.trim() !== '') return Number(id)
  }

  return null
}

async function getTerms (name: string | null) {
  const payload: any = { length: 100 }
  const schoolId = getSchoolId()
  if (name) payload.name = name
  if (schoolId) payload.school_id = schoolId
  if (props.activeOnly) payload.is_active = true
  const academicTermAPI = new AcademicTermAPI(schoolId as number)
  const list = await academicTermAPI.index(payload)
  return list.data
}

function filterFn (value: string, update: (callback: () => Promise<void>) => void) {
  update(async () => {
    filteredOptions.value = await getTerms(value || null)
  })
}

useEntitySelector<AcademicTermType>({
  value: () => props.value,
  schoolId: getSchoolId,
  filteredOptions,
  entityName: 'academic terms',
  fetchByIds: async (params) => {
    const schoolId = getSchoolId()
    if (!schoolId) return []
    return new AcademicTermAPI(schoolId).index(params)
  }
})
</script>

<style scoped></style>
