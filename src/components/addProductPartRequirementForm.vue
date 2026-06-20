<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ProductPartAPI from 'src/repositories/productPart'
import Portlet from 'src/components/cards/portlet.vue'
import SelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'

const emit = defineEmits(['add'])

const props = defineProps<{
  productPartId: number
}>()

const productPartAPI = new ProductPartAPI()
const requirementType = ref<'App\\Models\\Fabric'>('App\\Models\\Fabric')
const requirementTypeOptions = ref([
  {
    label: 'پارچه',
    value: 'App\\Models\\Fabric'
  }
])
const selectedFabric = ref(undefined)
const quantity = ref<number>(0)
const unit = ref<string>('')
const loading = ref(false)

const requiredItemId = computed<number>(()=> {
  if (requirementType.value === 'App\\Models\\Fabric') {
    return selectedFabric.value ?? 0
  }

  return selectedFabric.value ?? 0
})

function isValidForm () {
  if (!requirementType.value) {
    return false
  }

  if (
    requirementType.value === 'App\\Models\\Fabric' &&
    !selectedFabric.value
  ) {
    return false
  }

  return !(!quantity.value || !unit.value)
}

function clearForm () {
  selectedFabric.value = undefined
  quantity.value = 0
  unit.value = ''
}

async function addRequirement () {
  if (!isValidForm()) {
    return
  }

  try {
    loading.value = true
    await productPartAPI.addRequirement(props.productPartId, {
      required_item_type: requirementType.value,
      required_item_id: requiredItemId.value,
      quantity: quantity.value,
      unit: unit.value
    })
    clearForm()
    emit('add')
  } finally {
    loading.value = false
  }
}

watch(requirementType, ()=>{
  clearForm()
})
</script>

<template>
  <portlet title="افزودن نیازمندی جدید">
    <template #actions>
      <q-btn
        flat
        icon="add"
        class="add-btn"
        :loading="loading"
        @click="addRequirement" />
    </template>
    <div class="row q-col-gutter-md full-width">
      <div class="col-md-3">
        <div>
          نوع نیازمندی
        </div>
        <q-select
          v-model="requirementType"
          :options="requirementTypeOptions"
          label=""
          emit-value
          map-options />
      </div>
      <div
        v-if="requirementType === 'App\\Models\\Fabric'"
        class="col-md-3">
        <select-fabric v-model:value="selectedFabric" />
      </div>
      <div
        v-if="selectedFabric"
        class="col-md-3">
        <div>
          تعداد
        </div>
        <q-input
          v-model="quantity"
          :loading="loading"
          type="number" />
      </div>
      <div
        v-if="selectedFabric"
        class="col-md-3">
        <div>
          واحد
        </div>
        <q-input
          v-model="unit"
          :loading="loading" />
      </div>
    </div>
  </portlet>
</template>
