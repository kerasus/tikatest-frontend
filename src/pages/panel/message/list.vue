<template>
  <div class="message-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در موضوع پیام"
              outlined
              dense
              clearable
              @update:model-value="loadMessages" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.sender_id"
              :options="userOptions"
              option-value="id"
              option-label="full_name"
              label="فرستنده"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadMessages" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="send"
              label="ارسال پیام جدید"
              :to="{ name: 'Panel.Message.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="messages"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-sender="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar
                  size="32px"
                  class="q-ml-sm">
                  <q-img :src="'/images/blankProfile.png'" />
                </q-avatar>
                <span>{{ props.row.sender?.full_name || '-' }}</span>
              </div>
            </q-td>
          </template>
          <template #body-cell-subject="props">
            <q-td :props="props">
              <q-btn
                flat
                :to="{ name: 'Panel.Message.Show', params: { id: props.row.id } }"
                class="text-left">
                {{ props.row.subject || '(بدون موضوع)' }}
              </q-btn>
            </q-td>
          </template>
          <template #body-cell-body="props">
            <q-td :props="props">
              <span class="text-grey-7">{{ props.row.body }}</span>
            </q-td>
          </template>
          <template #body-cell-sent_at="props">
            <q-td :props="props">
              {{ formatDate(props.row.sent_at) }}
            </q-td>
          </template>
          <template #body-cell-is_read="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.owners?.some((o: any) => !o.is_read) ? 'orange' : 'green'"
                text-color="white"
                dense>
                {{ props.row.owners?.some((o: any) => !o.is_read) ? 'جدید' : 'خوانده شده' }}
              </q-chip>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                icon="visibility"
                color="primary"
                :to="{ name: 'Panel.Message.Show', params: { id: props.row.id } }" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import MessageAPI from 'src/repositories/message'
import UserAPI from 'src/repositories/user'
import type { ListType } from 'src/repositories/BaseAPI'
import type { MessageType } from 'src/repositories/message'

const messageApi = new MessageAPI()
const userApi = new UserAPI()

const $q = useQuasar()

const messages = ref<MessageType[]>([])
const userOptions = ref<any[]>([])
const loading = ref(false)

const filters = reactive({
  search: '',
  subject: '',
  sender_id: null,
  receiver_id: null,
  length: 20,
  page: 1
})

const pagination = ref({
  sortBy: 'sent_at',
  descending: true,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'sender', label: 'فرستنده', align: 'right' as const, field: 'sender' },
  { name: 'subject', label: 'موضوع', align: 'right' as const, field: 'subject' },
  { name: 'body', label: 'متن', align: 'right' as const, field: 'body' },
  { name: 'sent_at', label: 'تاریخ', align: 'center' as const, field: 'sent_at' },
  { name: 'is_read', label: 'وضعیت', align: 'center' as const, field: 'is_read' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

function formatDate (date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fa-IR')
}

async function loadMessages () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.sender_id) params.sender_ids = [filters.sender_id]
    if (filters.receiver_id) params.receiver_ids = [filters.receiver_id]
    if (filters.search) params.subject = filters.search

    const result = await messageApi.index(params)
    messages.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری پیام‌ها.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  pagination.value.sortBy = props.pagination.sortBy
  pagination.value.descending = props.pagination.descending
  loadMessages()
}

async function loadUsers () {
  try {
    const result = await userApi.index({ length: 100 })
    userOptions.value = result.data.map((item: any) => ({
      id: item.id,
      full_name: item.full_name || `${item.first_name} ${item.last_name}`,
      ...item
    }))
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

onMounted(() => {
  loadUsers()
  loadMessages()
})
</script>

<style lang="scss" scoped>
.message-list-page {
}
</style>
