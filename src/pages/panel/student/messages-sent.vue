<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">پیام‌های ارسال شده</h4>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="messages.length === 0" class="text-center q-pa-lg">
      <q-icon name="send" size="100px" color="primary" />
      <p class="text-subtitle1 q-mt-md">هنوز پیامی ارسال نکرده‌اید</p>
    </div>

    <!-- Messages List -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="msg in messages" :key="msg.id" class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-start q-col-gutter-md">
              <div class="col">
                <h6 class="q-ma-none q-mb-sm">{{ msg.subject || '(بدون موضوع)' }}</h6>
                <p class="q-ma-none q-mb-md text-caption text-grey">
                  {{ msg.body }}
                </p>
                <div class="row q-col-gutter-md">
                  <div class="col-auto">
                    <strong>گیرنده:</strong> {{ getReceiverNames(msg.owners) }}
                  </div>
                  <div class="col-auto">
                    <strong>تاریخ:</strong> {{ formatDate(msg.sent_at) }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { message } from 'src/repositories/message'

const $q = useQuasar()

const messages = ref<any[]>([])
const loading = ref(true)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getReceiverNames = (owners: any[] = []): string => {
  return owners.map((o: any) => o.user?.full_name || '-').join('، ') || '-'
}

const loadMessages = async () => {
  loading.value = true
  try {
    const response = await message.sentMessages({ length: 100 })
    messages.value = response.data?.data || response.data || []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری پیام‌های ارسال شده'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMessages()
})
</script>

<style lang="scss" scoped>
</style>
