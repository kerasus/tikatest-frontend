<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">پیام‌های دریافتی</h4>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="ارسال پیام جدید" :to="{ name: 'Panel.Message.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="messages"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-sender="{ props }">
            <q-td :props="props">
              {{ props.row.sender?.full_name || '-' }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { message } from 'src/repositories/message'

const $q = useQuasar()

const messages = ref<any[]>([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'subject', label: 'موضوع', align: 'right' as const, field: 'subject' },
  { name: 'sender', label: 'فرستنده', align: 'center' as const, field: 'sender' },
  { name: 'sent_at', label: 'تاریخ دریافت', align: 'center' as const, field: 'sent_at' }
]

const loadMessages = async () => {
  loading.value = true
  try {
    const result = await message.receivedMessages({
      length: pagination.value.rowsPerPage,
      page: pagination.value.page
    })
    messages.value = result.data || result
    pagination.value.rowsNumber = result.total || result.length
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در بارگذاری پیام‌های دریافتی' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadMessages()
}

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
</style>
