<template>
  <div
    v-if="loading"
    class="text-center q-pa-lg">
    <q-spinner
      color="primary"
      size="100px" />
  </div>

  <div
    v-else-if="error"
    class="text-center q-pa-lg">
    <q-icon
      name="error"
      size="100px"
      color="negative" />
    <p class="text-subtitle1 q-mt-md">{{ error }}</p>
    <q-btn
      label="بازگشت"
      icon="arrow_back"
      @click="goBack" />
  </div>

  <q-card
    v-else
    flat
    bordered
    class="exam-result-card">
    <div
      class="exam-result-tabs-sticky"
      :style="{ top: stickyTabsTop }">
      <q-tabs
        v-model="activeTab"
        dense
        align="justify"
        active-color="primary"
        indicator-color="primary"
        class="exam-result-tabs">
        <q-tab
          name="content"
          icon="description"
          label="محتوای آزمون" />
        <q-tab
          name="solution"
          icon="fact_check"
          label="پاسخنامه"
          :disable="!solutionContent" />
      </q-tabs>
      <q-separator />
    </div>

    <q-tab-panels
      v-model="activeTab"
      animated
      class="exam-result-panels">
      <q-tab-panel
        name="content"
        class="q-pa-md">
        <div
          v-if="examContent"
          class="exam-content-body">
          <template v-if="examContent.type === 'text'">
            <div v-html="examContent.body || ''" />
          </template>
          <template v-else-if="examContent.type === 'image'">
            <q-img
              :src="examContent.path ? `storage/${examContent.path}` : ''"
              alt="تصویر آزمون"
              style="max-width: 100%; display: block" />
          </template>
          <template v-else-if="examContent.type === 'pdf'">
            <iframe
              v-if="examContent.path"
              :src="`storage/${examContent.path}`"
              style="width: 100%; height: 600px; border: none;" />
          </template>
        </div>
        <div
          v-else
          class="text-grey text-center q-pa-lg">
          محتوای آزمون بارگذاری نشد.
        </div>
      </q-tab-panel>

      <q-tab-panel
        name="solution"
        class="q-pa-md">
        <div
          v-if="solutionContent"
          class="exam-content-body">
          <template v-if="solutionContent.type === 'text'">
            <div v-html="solutionContent.body || ''" />
          </template>
          <template v-else-if="solutionContent.type === 'image'">
            <q-img
              :src="solutionContent.path ? `storage/${solutionContent.path}` : ''"
              alt="پاسخنامه آزمون"
              style="max-width: 100%; display: block" />
          </template>
          <template v-else-if="solutionContent.type === 'pdf'">
            <iframe
              v-if="solutionContent.path"
              :src="`storage/${solutionContent.path}`"
              style="width: 100%; height: 600px; border: none;" />
          </template>
        </div>
        <div
          v-else
          class="text-grey text-center q-pa-lg">
          پاسخنامه‌ای برای این آزمون ثبت نشده است.
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useOnlineExamSession } from 'src/stores/onlineExamSession'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const sessionAPI = new OnlineExamSessionAPI()
const onlineExamStore = useOnlineExamSession()

const activeTab = ref<'content' | 'solution'>('content')
const stickyTabsTop = ref('0px')

let headerResizeObserver: ResizeObserver | null = null

function updateStickyTabsOffset () {
  const headerEl = document.querySelector('.q-layout .q-header') as HTMLElement | null
  stickyTabsTop.value = headerEl ? `${headerEl.getBoundingClientRect().height}px` : '0px'
}

function bindHeaderResizeObserver () {
  headerResizeObserver?.disconnect()

  const headerEl = document.querySelector('.q-layout .q-header')
  if (!headerEl) return

  headerResizeObserver = new ResizeObserver(() => {
    updateStickyTabsOffset()
  })
  headerResizeObserver.observe(headerEl)
}

const loading = computed({
  get: () => onlineExamStore.loading,
  set: (value) => onlineExamStore.setLoading(value)
})
const error = computed({
  get: () => onlineExamStore.error,
  set: (value) => {
    onlineExamStore.error = value
  }
})
const sessionId = computed(() => parseInt(route.params.sessionId as string))
const examContent = computed(() => onlineExamStore.onlineDetail?.content || null)
const solutionContent = computed(() => onlineExamStore.onlineDetail?.solution || null)

const loadResult = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await sessionAPI.getResultBySessionId(sessionId.value)
    onlineExamStore.setSession(result)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'خطا در بارگذاری نتایج'
    $q.notify({ type: 'negative', message: error.value })
  } finally {
    loading.value = false
    await nextTick()
    updateStickyTabsOffset()
    bindHeaderResizeObserver()
  }
}

const goBack = () => {
  router.push({ name: 'Student.Exam.List' })
}

watch(
  () => onlineExamStore.sessionData,
  async () => {
    await nextTick()
    updateStickyTabsOffset()
  }
)

onMounted(() => {
  loadResult()
  window.addEventListener('resize', updateStickyTabsOffset)
})

onUnmounted(() => {
  headerResizeObserver?.disconnect()
  window.removeEventListener('resize', updateStickyTabsOffset)
  onlineExamStore.clearSession()
})
</script>

<style lang="scss" scoped>
  .exam-result-card {
    overflow: visible;
  }

  .exam-result-tabs-sticky {
    position: sticky;
    z-index: 100;
    background: #fff;
    border-radius: inherit;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .exam-result-tabs {
    background: #fff;
  }

  .exam-result-panels {
    background: transparent;
  }

  .exam-content-body {
    :deep(img) {
      max-width: 100%;
    }
  }
</style>
