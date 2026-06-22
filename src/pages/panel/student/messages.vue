<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">پیام‌ها</h4>

    <q-card class="q-mb-md">
      <q-card-section>
        <q-btn-toggle
          v-model="currentTab"
          :options="[
            { label: 'مشاهده پیام‌ها', value: 'inbox' },
            { label: 'ارسال پیام', value: 'compose' }
          ]"
          color="primary"
          toggle-color="primary"
          glossy
          class="q-mb-md"
        />
      </q-card-section>
    </q-card>

    <!-- Inbox -->
    <template v-if="currentTab === 'inbox'">
      <q-card>
        <q-card-section>
          <div v-if="loading" class="text-center q-pa-lg">
            <q-spinner color="primary" size="100px" />
          </div>

          <q-table
            v-else-if="messages.length > 0"
            :rows="messages"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-subject="{ props }">
              <q-td :props="props">
                <q-btn flat no-caps :label="props.row.subject || '(بدون موضوع)'" @click="showMessage(props.row)" />
              </q-td>
            </template>
            <template #body-cell-sender="{ props }">
              <q-td :props="props">
                {{ props.row.sender?.full_name || '-' }}
              </q-td>
            </template>
          </q-table>
          <div v-else class="text-center q-pa-lg">
            <q-icon name="sms" size="100px" color="primary" />
            <p class="text-subtitle1 q-mt-md">پیامی ندارید</p>
          </div>
        </q-card-section>
      </q-card>
    </template>

    <!-- Compose -->
    <template v-else>
      <q-card style="max-width: 700px; margin: 0 auto;">
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="form.receiver_id"
                  :options="userOptions"
                  option-value="id"
                  option-label="full_name"
                  label="گیرنده *"
                  outlined
                  use-input
                  emit-value
                  map-options
                  :rules="[val => !!val || 'گیرنده را انتخاب کنید']"
                  @filter="filterUsers"
                />
              </div>
              <div class="col-12">
                <q-input v-model="form.subject" label="موضوع" outlined />
              </div>
              <div class="col-12">
                <q-input v-model="form.body" label="متن پیام *" outlined type="textarea" :rules="[val => !!val || 'متن را وارد کنید']" />
              </div>
            </div>

            <div class="q-mt-lg">
              <q-btn type="submit" color="primary" label="ارسال پیام" :loading="sending" class="q-ml-sm" />
              <q-btn flat label="انصراف" @click="currentTab = 'inbox'" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </template>

    <!-- Message Detail Dialog -->
    <q-dialog v-model="showDetail">
      <q-card style="min-width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ selectedMessage?.subject || '(بدون موضوع)' }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-subtitle2">از: {{ selectedMessage?.sender?.full_name || '-' }}</div>
          <div class="text-caption text-grey q-mt-sm">{{ selectedMessage?.sent_at }}</div>
          <div class="q-mt-md text-body1">{{ selectedMessage?.body }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="بستن" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUser } from 'src/stores/user'
import { student } from 'src/repositories/student'
import { appApi } from 'src/boot/axios'

const $q = useQuasar()
const userManager = useUser()
const currentTab = ref('inbox')
const loading = ref(false)
const sending = ref(false)
const messages = ref<any[]>([])
const users = ref<any[]>([])
const userOptions = ref<any[]>([])

const showDetail = ref(false)
const selectedMessage = ref<any>(null)

const form = reactive({
  receiver_id: null as number | null,
  subject: null as string | null,
  body: null as string | null,
})

const columns = [
  { name: 'subject', label: 'موضوع', field: 'subject', align: 'right' as const },
  { name: 'sender', label: 'فرستنده', field: 'sender', align: 'center' as const },
  { name: 'sent_at', label: 'تاریخ', field: 'sent_at', align: 'center' as const },
]

const filterUsers = (val: string, update: any) => {
  if (val === '') {
    update(() => { userOptions.value = users.value })
    return
  }
  update(() => {
    userOptions.value = users.value.filter((u: any) =>
      u.full_name.toLowerCase().includes(val.toLowerCase())
    )
  })
}

const showMessage = (msg: any) => {
  selectedMessage.value = msg
  showDetail.value = true
}

const loadMessages = async () => {
  loading.value = true
  try {
    const response = await appApi.get('/student-portal/messages')
    messages.value = response.data.data || response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری پیام‌ها' })
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await appApi.get('/users')
    const allUsers = response.data.data || response.data
    const currentUserId = userManager.me?.id
    users.value = allUsers.filter((u: any) => u.id !== currentUserId)
    userOptions.value = users.value
  } catch (error: any) {
    console.error('Error loading users:', error)
  }
}

const onSubmit = async () => {
  sending.value = true
  try {
    await appApi.post('/student-portal/messages', form)
    $q.notify({
      icon: 'check',
      message: 'پیام با موفقیت ارسال شد.',
      color: 'positive'
    })
    form.receiver_id = null
    form.subject = null
    form.body = null
    currentTab.value = 'inbox'
    loadMessages()
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ارسال پیام.',
      color: 'negative'
    })
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadMessages()
  loadUsers()
})
</script>
