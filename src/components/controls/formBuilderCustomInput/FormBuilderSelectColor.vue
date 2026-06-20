<template>
  <div class="form-builder-select-color">
    <div class="outsideLabel">{{ label }}</div>
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
      :label="' '"
      :stack-label="!!placeholder"
      :placeholder="placeholderSetter"
      :multiple="multiple"
      :use-chips="useChips"
      use-input
      input-debounce="500"
      :disable="disable"
      :readonly="readonly"
      :emit-value="emitValue"
      :map-options="mapOptions"
      :hide-dropdown-icon="hideDropdownIcon"
      :dropdown-icon="dropdownIcon"
      :clearable="clearable"
      @filter="filterFn">
      <template #option="{opt, toggleOption}">
        <q-item
          clickable
          @click="toggleOption(opt)">
          <q-item-section avatar>
            <span :style="{ backgroundColor: opt.color_hex, width: '10px', height:'10px', display: 'inline-block', marginLeft: '5px' }" />
          </q-item-section>
          <q-item-section>
            {{ opt.name }}
          </q-item-section>
        </q-item>
      </template>
      <template #no-option>
        <q-item v-show="showNoOption">
          <q-item-section class="text-grey"> موردی یافت نشد </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref } from 'vue'
import ColorAPI, { type ColorType } from 'src/repositories/color'

defineOptions({
  name: 'FormBuilderSelectColor'
})

const props = defineProps({
  label: {
    default: 'رنگ',
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
  emitValue: {
    default: true,
    type: Boolean
  },
  mapOptions: {
    default: true,
    type: Boolean
  },
  readonly: {
    default: false,
    type: Boolean
  }
})

const emits = defineEmits(['update:value', 'input', 'click', 'keydown', 'keypress', 'submit'])

const colorAPI = new ColorAPI()

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
  // in single select after setting value,
  // v-model type changes to string

  // in the multiple scenario, inputData type changes to Array!
  if (props.multiple && Array.isArray(localValue.value)) {
    if (localValue.value.length === 0) {
      return props.placeholder
    }
    return ''
  }
  // be an object
  if (Object.keys(localValue.value).length === 0) {
    return props.placeholder
  }
  return ''
})

const errorMessage = ref<string | undefined>(undefined)
const filteredOptions = ref<ColorType[]>([])
const optionValue = ref('id')
const optionLabel = ref('name')

async function getColors (name: string | null) {
  const colorsList = await colorAPI.index({ name })
  return colorsList.data
}

function filterFn (val: string, update: (cb: ()=>Promise<void>)=>void) {
  if (val === '') {
    update(async () => {
      filteredOptions.value = await getColors(null)
    })
    return
  }

  update(async () => {
    filteredOptions.value = await getColors(val)
  })
}

</script>

<style scoped></style>
