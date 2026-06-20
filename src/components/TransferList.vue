<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, shallowRef } from 'vue'
import { useUser } from 'src/stores/user'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import TransferAPI, { type TransferType } from 'src/repositories/transfer'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

const $q = useQuasar()
const dateManager = useDate()
const userManager = useUser()
const transferAPI = new TransferAPI()

const FormBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)

const entityIndexRef = ref()
const managerFilters = [
  {
    type: FormBuilderSelectUserComponent,
    name: 'from_user_id',
    label: 'از',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectUserComponent,
    name: 'to_user_id',
    label: 'به',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectUserComponent,
    name: 'creator_user_id',
    label: 'سازنده',
    col: 'col-md-3 col-12'
  },
  {
    type: 'date',
    name: 'transfer_date',
    outsideLabel: 'تاریخ حواله',
    clearable: true,
    col: 'col-md-3 col-12'
  }
]

const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})
const table = ref({
  columns: [
    {
      name: 'from_user',
      label: 'از',
      align: 'left',
      field: (row: TransferType) => row.from_user ? row.from_user?.firstname + ' ' + row.from_user?.lastname : '-'
    },
    {
      name: 'to_user',
      label: 'به',
      align: 'left',
      field: (row: TransferType) => row.to_user ? row.to_user?.firstname + ' ' + row.to_user?.lastname : '-'
    },
    {
      name: 'transfer_date',
      required: true,
      label: 'تاریخ حواله',
      align: 'left',
      field: (row: TransferType) =>
        row.transfer_date ? dateManager.miladiToShamsi(row.transfer_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'status',
      required: true,
      label: 'وضعیت',
      align: 'left',
      field: (row: TransferType) => row.status_label
    },
    {
      name: 'creator',
      label: 'سازنده',
      align: 'left',
      field: (row: TransferType) => row.creator ? row.creator?.firstname + ' ' + row.creator?.lastname : '-'
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => ''
    }
  ]
})
const api = ref(transferAPI.endpoints.base)
const listLabel = ref('حواله ها')
const showRouteName = ref('Panel.Transfer.Show')

const listInputs = ref(getFilterInputs())

function getFilterInputs () {
  return managerFilters
  // if (userManager.isManager || userManager.isAccountant) {
  //   return managerFilters
  // }
  //
  // return workerFilters
}

function afterRemove () {
  reloadList()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

function reloadList () {
  entityIndexRef.value.reload()
}

function getTransferStatusColor (status: string) {
  if (status === 'pending') {
    return 'warning'
  } else if (status === 'approved') {
    return 'green'
  } else if (status === 'rejected') {
    return 'red'
  }

  return 'info'
}

defineExpose({
  reloadList
})
</script>

<template>
  <entity-index
    ref="entityIndexRef"
    :value="listInputs"
    :title="listLabel"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn
            v-if="userManager.isManager || true"
            :row="inputData.props.row"
            :api="transferAPI"
            @delete="afterRemove" />
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'status'">
        <q-badge :color="getTransferStatusColor(inputData.props.row.status)">
          {{ inputData.props.row.status_label }}
        </q-badge>
        <span v-if="inputData.props.row.status !== 'pending'">
          در
        </span>
        <span v-if="inputData.props.row.status === 'approved'">
          {{ dateManager.miladiToShamsi(inputData.props.row.approved_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') }}
        </span>
        <span v-if="inputData.props.row.status === 'rejected'">
          {{ dateManager.miladiToShamsi(inputData.props.row.rejected_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') }}
        </span>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>
