<template>
  <div class="form-builder-select-transfer-package-item">
    <q-table
      flat
      dense
      :rows="rows"
      :columns="columns"
      row-key="name">
      <template #top>
        {{ label }}
      </template>
      <template #top-row>
        <q-tr v-if="!readonly">
          <q-td>
            <div class="full-width">
              <q-select
                v-model="transferItemType"
                :options="transferItemTypeOptions"
                label=""
                emit-value
                map-options />
            </div>
          </q-td>
          <q-td>
            <div class="full-width">
              <div
                v-if="transferItemType === 'App\\Models\\Product'"
                class="col-md-3">
                <select-product
                  v-model:value="selectedProduct"
                  :emit-value="false"
                  :map-options="false"
                  label="" />
              </div>
              <div
                v-if="transferItemType === 'App\\Models\\ProductPart'"
                class="col-md-3">
                <select-product-part
                  v-model:value="selectedProductPart"
                  :emit-value="false"
                  :map-options="false"
                  label="" />
              </div>
              <div
                v-if="transferItemType === 'App\\Models\\RawMaterial'"
                class="col-md-3">
                <select-raw-material
                  v-model:value="selectedRawMaterial"
                  :emit-value="false"
                  :map-options="false"
                  label="" />
              </div>
            </div>
          </q-td>
          <q-td>
            <div class="full-width">
              <div
                v-if="transferItemType"
                class="col-md-3">
                <select-color
                  v-model:value="selectedColor"
                  :emit-value="false"
                  :map-options="false"
                  label="" />
              </div>
            </div>
          </q-td>
          <q-td>
            <div class="full-width">
              <q-input
                v-model="quantity"
                :disable="!selectedTransferId"
                :loading="loading"
                type="number" />
            </div>
          </q-td>
          <q-td>
            <div class="full-width">
              <q-input
                v-model="notes"
                :disable="!selectedTransferId"
                :loading="loading" />
            </div>
          </q-td>
          <q-td>
            <div class="full-width flex justify-center">
              <q-btn
                color="primary"
                icon="add"
                :disable="!isValidForm"
                class="q-mt-md"
                @click="addItem" />
            </div>
          </q-td>
        </q-tr>
      </template>
      <template #body-cell-color="tblProps">
        <q-td :props="tblProps">
          <template v-if="tblProps.row.color">
            <span :style="{ backgroundColor: tblProps.row.color.color_hex, width: '10px', height:'10px', display: 'inline-block', marginLeft: '5px' }" />
            {{ tblProps.row.color.name }}
          </template>
          <template v-else>
            -
          </template>
        </q-td>
      </template>
      <template #body-cell-action="tblProps">
        <q-td :props="tblProps">
          <q-btn
            icon="close"
            flat
            @click="removeItem(tblProps)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { type TransferItemType } from 'src/repositories/transfer'
import SelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import SelectProduct from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProduct.vue'
import SelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'
import SelectRawMaterial from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectRawMaterial.vue'

defineOptions({
  name: 'FormBuilderSelectTransferPackageItem'
})

const value = defineModel('value', {
  type: Array
})

const props = defineProps({
  label: {
    default: 'آیتم ها',
    type: String
  },
  name: {
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
  }
})

const columns = ref<{
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean | undefined;
  align?: 'left' | 'right' | 'center' | undefined;
    }[]>([
      {
        name: 'item_type',
        required: true,
        label: 'نوع',
        align: 'left',
        field: (row: TransferItemType) => {
          if (row.item_type === 'App\\Models\\ProductPart') {
            return 'زیر محصول'
          } else if (row.item_type === 'App\\Models\\RawMaterial') {
            return 'مواد اولیه'
          } else if (row.item_type === 'App\\Models\\Product') {
            return 'محصول'
          }
        }
      },
      {
        name: 'item.name',
        required: true,
        label: 'نام',
        align: 'left',
        field: (row: TransferItemType) => row.item?.name
      },
      {
        name: 'color',
        required: true,
        label: 'رنگ',
        align: 'left',
        field: (row: TransferItemType) => row.color?.name
      },
      {
        name: 'quantity',
        required: true,
        label: 'تعداد',
        align: 'left',
        field: (row: TransferItemType) => row.quantity
      },
      {
        name: 'notes',
        required: true,
        label: 'توضیحات',
        align: 'left',
        field: (row: TransferItemType) => row.notes
      },
      {
        name: 'action',
        required: true,
        label: 'حذف',
        align: 'left',
        field: (row: TransferItemType) => row.notes
      }
    ])
const rows = ref<TransferItemType[]>([])

const transferItemType = ref<'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial'>('App\\Models\\Product')
const transferItemTypeOptions = ref([
  {
    label: 'محصول',
    value: 'App\\Models\\Product'
  },
  {
    label: 'زیر محصول',
    value: 'App\\Models\\ProductPart'
  },
  {
    label: 'مواد اولیه',
    value: 'App\\Models\\RawMaterial'
  }
])
const selectedColor = ref(undefined)
const selectedProduct = ref(undefined)
const selectedProductPart = ref(undefined)
const selectedRawMaterial = ref(undefined)
const quantity = ref<number | null>(null)
const notes = ref<string>('')
const loading = ref(false)

const isValidForm = computed(() => {
  if (!transferItemType.value) {
    return false
  }

  if (transferItemType.value === 'App\\Models\\Product' && !selectedColor.value) {
    return false
  }

  if (transferItemType.value === 'App\\Models\\ProductPart' && !selectedColor.value) {
    return false
  }

  if (!transferItemType.value) {
    return false
  }

  return !!quantity.value
})
const selectedTransfer = computed(() => {
  if (transferItemType.value === 'App\\Models\\Product') {
    return selectedProduct.value
  }

  if (transferItemType.value === 'App\\Models\\ProductPart') {
    return selectedProductPart.value
  }

  if (transferItemType.value === 'App\\Models\\RawMaterial') {
    return selectedRawMaterial.value
  }

  return null
})
const selectedTransferId = computed(() => {
  if (selectedTransfer.value) {
    // @ts-ignore
    return selectedTransfer.value.id
  }

  return null
})

function clearForm () {
  selectedColor.value = undefined
  selectedProduct.value = undefined
  selectedProductPart.value = undefined
  selectedRawMaterial.value = undefined
  quantity.value = null
  notes.value = ''
}

function addItem () {
  if (!isValidForm.value) {
    return
  }

  // @ts-ignore
  rows.value.push({
    transfer_id: null,
    // @ts-ignore
    color: selectedColor.value,
    // @ts-ignore
    color_id: selectedColor.value?.id,
    // @ts-ignore
    item: selectedTransfer.value,
    // @ts-ignore
    item_id: selectedTransferId.value,
    item_type: transferItemType.value,
    quantity: quantity.value,
    notes: notes.value
  })
  updateValue()
}

function removeItem (props: any) {
  rows.value.splice(props.rowIndex, 1)
  updateValue()
}

function updateValue () {
  value.value = rows.value.map((item) => {
    return {
      color_id: item.color_id,
      color: item.color,
      item_id: item.item_id,
      item: item.item,
      item_type: item.item_type,
      quantity: item.quantity,
      notes: item.notes
    }
  })
}

if (props.readonly) {
  columns.value.splice(columns.value.length - 1, 1)
}

watch(transferItemType, ()=>{
  clearForm()
})

// watch(rows, ()=>{
//   updateValue()
// })

watch(value, ()=>{
  if (!Array.isArray(value.value)) {
    return
  }
  rows.value = value.value.map((item: any)=>{
    return {
      transfer_id: item?.id,
      // @ts-ignore
      color: item.color,
      // @ts-ignore
      color_id: item.color_id,
      // @ts-ignore
      item: item.item,
      // @ts-ignore
      item_id: item.item_id,
      item_type: item.item_type,
      quantity: item.quantity,
      notes: item.notes
    } as TransferItemType
  })
})

</script>

<style scoped></style>
