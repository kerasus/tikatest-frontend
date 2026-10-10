<template>
  <div
    ref="containerRef"
    class="pdf-viewer-container">
    <div
      v-if="loading"
      class="q-pa-xl flex flex-center column q-gutter-md">
      <q-spinner
        color="primary"
        size="3em" />
      <span class="text-grey-7">در حال پردازش و رندر صفحات PDF...</span>
    </div>

    <div
      v-else
      class="pdf-pages-list">
      <img
        v-for="(src, i) in pageImages"
        :key="i"
        :src="src"
        class="pdf-page-image shadow-2 rounded-borders"
        :alt="`صفحه ${i + 1}`">
    </div>
  </div>
</template>

<script setup lang="ts">
import * as mupdf from 'mupdf'
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  source: string
}

const props = defineProps<Props>()

const loading = ref(true)
const pageImages = ref<string[]>([])
const containerRef = ref<HTMLElement | null>(null)

// برای آزادسازی آبجکت URLها از حافظه
const objectUrls: string[] = []

onMounted(async () => {
  try {
    loading.value = true

    // ۱) دانلود باینری فایل PDF
    const response = await fetch(props.source)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const arrayBuffer = await response.arrayBuffer()

    // ۲) ساخت سند در MuPDF v1.28
    const doc = mupdf.Document.openDocument(arrayBuffer, 'application/pdf')


    const pageCount = doc.countPages()

    const renderedPages: string[] = []

    // ۳) پیمایش صفحات
    for (let i = 0; i < pageCount; i++) {
      const page = doc.loadPage(i)

      // مقیاس ۲ برای رندر شفاف و رتینا
      const scale = mupdf.Matrix.scale(2, 2)
      const pixmap = page.toPixmap(scale, mupdf.ColorSpace.DeviceRGB, false)

      // گرفتن بایت‌های PNG
      const pngBuffer = pixmap.asPNG()
      const blob = new Blob([pngBuffer], { type: 'image/png' })
      const imageUrl = URL.createObjectURL(blob)

      renderedPages.push(imageUrl)
      objectUrls.push(imageUrl)
    }

    pageImages.value = renderedPages
  } catch (error) {
    console.error('❌ خطا در رندر MuPDF:', error)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  // پاکسازی Object URLها برای جلوگیری از نشت حافظه
  objectUrls.forEach((url) => URL.revokeObjectURL(url))
})
</script>

<style lang="scss" scoped>
.pdf-viewer-container {
  width: 100%;
  min-height: 200px;

  .pdf-pages-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;

    .pdf-page-image {
      max-width: 100%;
      width: 100%;
      height: auto;
      background-color: white;
    }
  }
}
</style>
