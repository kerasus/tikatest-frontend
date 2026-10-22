<template>
  <q-card
    flat
    bordered
    class="q-mt-lg">
    <q-card-section class="row items-center justify-between q-gutter-sm">
      <div>
        <div class="text-subtitle1 text-weight-bold">اتصال به بله</div>
        <div class="text-caption text-grey-7">
          {{ connected ? `متصل${user?.bale_username ? ` (@${user.bale_username})` : ''}` : 'برای دریافت اعلان‌ها حساب بله خود را متصل کنید.' }}
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          v-if="connected"
          outline
          color="negative"
          label="قطع اتصال"
          :loading="loading"
          @click="disconnect" />
        <q-btn
          v-else
          color="primary"
          icon="link"
          label="اتصال به بله"
          :loading="loading"
          @click="connect" />
      </div>
    </q-card-section>
    <q-card-section
      v-if="waiting"
      class="q-pt-none text-body2 text-grey-8">
      بعد از باز شدن بله، Start را بزنید تا اتصال کامل شود. وضعیت اتصال به‌صورت خودکار بررسی می‌شود.
      <q-btn
        v-if="pendingDeepLink"
        flat
        color="primary"
        label="باز کردن بله"
        :href="pendingDeepLink"
        target="_blank"
        rel="noopener noreferrer" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import BaleAPI from 'src/repositories/bale'
import UserAPI from 'src/repositories/user'
import { useUser } from 'src/stores/user'

const $q = useQuasar()
const store = useUser()
const api = new BaleAPI()
const userApi = new UserAPI()
const user = computed(() => store.me)
const connected = computed(() => Boolean(user.value?.bale_chat_id))
const loading = ref(false)
const waiting = ref(false)
const pendingDeepLink = ref<string | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null
let expiryTimer: ReturnType<typeof setTimeout> | null = null

function stopPolling () {
  if (pollTimer) clearInterval(pollTimer)
  if (expiryTimer) clearTimeout(expiryTimer)
  pollTimer = null
  expiryTimer = null
  waiting.value = false
  pendingDeepLink.value = null
}

async function refresh () {
  try {
    store.setUser(await userApi.me())
    if (connected.value) stopPolling()
  } catch {
    return
  }
}

async function connect () {
  const tab = window.open('', '_blank')
  loading.value = true

  try {
    const result = await api.link()
    if (result.connected || !result.deep_link) {
      tab?.close()
      await refresh()
      return
    }

    if (tab) {
      tab.opener = null
      tab.location.href = result.deep_link
    }

    stopPolling()
    pendingDeepLink.value = result.deep_link
    waiting.value = true
    pollTimer = setInterval(() => { void refresh() }, 5000)
    expiryTimer = setTimeout(stopPolling, (result.expires_in ?? 300) * 1000)
    $q.notify({ type: 'info', message: 'بعد از باز شدن بله، Start را بزنید تا اتصال کامل شود.' })
  } catch {
    tab?.close()
    $q.notify({ type: 'negative', message: 'ساخت لینک اتصال بله ناموفق بود.' })
  } finally {
    loading.value = false
  }
}

async function disconnect () {
  loading.value = true
  try {
    await api.disconnect()
    stopPolling()
    await refresh()
    $q.notify({ type: 'positive', message: 'اتصال بله قطع شد.' })
  } catch {
    $q.notify({ type: 'negative', message: 'قطع اتصال بله ناموفق بود.' })
  } finally {
    loading.value = false
  }
}

onMounted(() => { void refresh() })
onUnmounted(stopPolling)
</script>
