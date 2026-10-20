<template>
  <div class="image-stacker">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn
        color="primary"
        icon="add_photo_alternate"
        :label="multiple ? 'انتخاب عکس‌ها' : 'انتخاب عکس'"
        @click="openFilePicker" />
      <span
        v-if="multiple"
        class="text-caption text-grey-7">می‌توانید چند عکس را هم‌زمان انتخاب کنید.</span>
    </div>

    <input
      ref="fileInput"
      class="hidden"
      type="file"
      accept="image/*"
      :multiple="multiple"
      aria-label="انتخاب عکس‌ها"
      @change="addImages">

    <div
      v-if="images.length"
      class="image-list q-mb-md">
      <div
        v-for="(image, index) in images"
        :key="image.id"
        class="image-row row items-center no-wrap q-pa-sm">
        <span class="image-order text-weight-medium">{{ index + 1 }}</span>
        <img
          class="image-thumbnail q-mx-sm"
          :src="image.url"
          :alt="`پیش‌نمایش ${image.file.name}`">
        <span
          class="image-name ellipsis"
          :title="image.file.name">{{ image.file.name }}</span>
        <q-btn
          class="q-ml-sm"
          flat
          round
          dense
          color="negative"
          icon="delete"
          :aria-label="`حذف ${image.file.name}`"
          @click="removeImage(image.id)" />
      </div>
    </div>
    <div
      v-else
      class="text-grey-7 q-mb-md">هنوز عکسی انتخاب نشده است.</div>

    <div class="preview-action">
      <q-btn
        outline
        color="primary"
        icon="visibility"
        label="نمایش عکس یکپارچه"
        :disable="!images.length"
        @click="openPreview" />
      <span
        v-if="rendering"
        class="q-mr-sm text-caption">در حال ساخت تصویر...</span>
      <div
        v-else-if="error"
        class="q-mt-sm text-negative"
        role="alert">{{ error }}</div>
    </div>

    <q-dialog v-model="previewOpen">
      <q-card
        class="preview-card"
        dir="rtl">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">پیش‌نمایش عکس یکپارچه</div>
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            aria-label="بستن" />
        </q-card-section>
        <q-separator />
        <q-card-section class="preview-content">
          <div
            v-if="rendering"
            class="column items-center q-pa-lg">
            <q-spinner
              color="primary"
              size="32px" />
            <span class="q-mt-sm">در حال آماده‌سازی عکس‌ها...</span>
          </div>
          <div
            v-else-if="error"
            class="text-negative"
            role="alert">{{ error }}</div>
          <img
            v-else-if="previewUrl"
            class="combined-image"
            :src="previewUrl"
            alt="عکس‌های انتخاب شده به ترتیب از بالا به پایین">
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const props = withDefaults(defineProps<{ multiple?: boolean }>(), { multiple: false })
const emit = defineEmits<{ (event: 'file-change', file: File | null): void }>()

interface SelectedImage {
  id: number
  file: File
  url: string
}

const images = ref<SelectedImage[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const previewOpen = ref(false)
const rendering = ref(false)
const previewUrl = ref('')
const error = ref('')
let nextId = 0
let renderId = 0

function openFilePicker () {
  fileInput.value?.click()
}

function clearPreview () {
  renderId++
  rendering.value = false
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  error.value = ''
}

function addImages (event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? []).filter((file) => file.type.startsWith('image/'))
  if (files.length) {
    clearPreview()
    previewOpen.value = false
    if (!props.multiple) {
      images.value.forEach((image) => URL.revokeObjectURL(image.url))
      images.value = []
    }
    images.value.push(...files.map((file) => ({ id: nextId++, file, url: URL.createObjectURL(file) })))
    void buildImage()
  }
  // Allows choosing the same files again after a removal.
  input.value = ''
}

function removeImage (id: number) {
  const index = images.value.findIndex((image) => image.id === id)
  if (index < 0) return
  clearPreview()
  previewOpen.value = false
  URL.revokeObjectURL(images.value[index].url)
  images.value.splice(index, 1)
  void buildImage()
}

function loadImage (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('یکی از عکس‌ها قابل خواندن نیست.'))
    image.src = url
  })
}

function canvasToJpeg (canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('ساخت عکس یکپارچه ممکن نشد.'))
    }, 'image/jpeg', 0.82)
  })
}

function openPreview () {
  if (images.value.length) previewOpen.value = true
}

async function buildImage () {
  emit('file-change', null)
  if (!images.value.length) return
  rendering.value = true
  const currentRender = renderId
  const selected = [...images.value]

  try {
    // Determine one shared width so every image keeps its aspect ratio.
    let totalHeightPerPixel = 0
    let largestSourceWidth = 0
    const aspectRatios: number[] = []
    for (const item of selected) {
      const image = await loadImage(item.url)
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('یکی از عکس‌ها ابعاد معتبری ندارد.')
      const ratio = image.naturalHeight / image.naturalWidth
      aspectRatios.push(ratio)
      totalHeightPerPixel += ratio
      largestSourceWidth = Math.max(largestSourceWidth, image.naturalWidth)
      if (currentRender !== renderId) return
    }

    // Keep the canvas within practical browser memory and dimension limits.
    const maximumWidth = Math.floor(Math.min(1600, largestSourceWidth, 16000 / totalHeightPerPixel, Math.sqrt(24000000 / totalHeightPerPixel)))
    const rowHeights = (width: number) => aspectRatios.map((ratio) => Math.max(1, Math.round(width * ratio)))
    let low = 1
    let high = maximumWidth
    let width = 0
    while (low <= high) {
      const candidate = Math.floor((low + high) / 2)
      const candidateHeight = rowHeights(candidate).reduce((sum, rowHeight) => sum + rowHeight, 0)
      if (candidateHeight <= 16000 && candidate * candidateHeight <= 24000000) {
        width = candidate
        low = candidate + 1
      } else {
        high = candidate - 1
      }
    }
    if (!width) throw new Error('مجموع ارتفاع عکس‌ها برای ساخت یک تصویر بیش از حد زیاد است.')
    const heights = rowHeights(width)
    const height = heights.reduce((sum, rowHeight) => sum + rowHeight, 0)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('مرورگر امکان ساخت عکس یکپارچه را ندارد.')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    let top = 0
    for (let index = 0; index < selected.length; index++) {
      const image = await loadImage(selected[index].url)
      if (currentRender !== renderId) return
      context.drawImage(image, 0, top, width, heights[index])
      top += heights[index]
    }

    const blob = await canvasToJpeg(canvas)
    if (currentRender !== renderId) return
    previewUrl.value = URL.createObjectURL(blob)
    emit('file-change', new File([blob], 'stacked-images.jpg', { type: 'image/jpeg' }))
  } catch (cause) {
    if (currentRender === renderId) error.value = cause instanceof Error ? cause.message : 'ساخت عکس یکپارچه ممکن نشد.'
  } finally {
    if (currentRender === renderId) rendering.value = false
  }
}

onBeforeUnmount(() => {
  clearPreview()
  images.value.forEach((image) => URL.revokeObjectURL(image.url))
})
</script>

<style scoped lang="scss">
.image-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.image-row + .image-row {
  border-top: 1px solid #eee;
}

.image-order {
  width: 24px;
  text-align: center;
  flex: none;
}

.image-thumbnail {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 4px;
  flex: none;
}

.image-name {
  min-width: 0;
  flex: 1;
}

.preview-card {
  width: min(95vw, 1000px);
  max-width: 95vw;
  max-height: 90vh;
}

.preview-content {
  max-height: calc(90vh - 70px);
  overflow: auto;
  text-align: center;
}

.combined-image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>
