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
        <q-list
          bordered
          separator>
          <q-item
            v-for="msg in messages"
            :key="msg.id"
            clickable
            :to="{ name: 'Panel.Message.Show', params: { id: msg.id } }"
            :class="{ 'bg-blue-1': !msg.owners?.some((o: any) => o.is_read) }">
            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white">
                {{ getInitials(msg.sender) }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ msg.subject || '(بدون موضوع)' }}
              </q-item-label>
              <q-item-label
                caption
                lines="2">
                {{ msg.body }}
              </q-item-label>
              <q-item-label
                caption
                class="text-grey-7">
                {{ formatDate(msg.sent_at) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge
                v-if="!msg.owners?.some((o: any) => o.is_read)"
                color="orange"
                label="جدید" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import MessageAPI from 'src/repositories/message'
import UserAPI from 'src/repositories/user'
import type { ListType, MessageType } from 'src/repositories/message'

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

function getInitials (sender: any) {
  if (!sender) return '?'
  const name = sender.firstname || sender.full_name || ''
  return name.charAt(0).toUpperCase()
}

function formatDate (date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fa-IR')
}

async function loadMessages () {
  loading.value = true
  try {
    const params: any = {
      length: filters.length || 20,
      page: (filters.page || 1) - 1
    }
    if (filters.sender_id) params.sender_ids = [filters.sender_id]
    if (filters.receiver_id) params.receiver_ids = [filters.receiver_id]
    if (filters.search) params.subject = filters.search

    const result = await messageApi.index(params)
    messages.value = result.data
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

async function loadUsers () {
  try {
    const result = await userApi.index({ length: 100 })
    userOptions.value = result.data.map((item: any) => ({
      id: item.id,
      full_name: item.full_name || `${item.firstname} ${item.lastname}`,
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
  .q-item {
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
}
</style>
