<template>
  <div
    class="image-stacker"
    dir="rtl">
    <div class="stacker-header">
      <div class="header-icon">
        <q-icon
          name="collections"
          size="27px" />
      </div>

      <div class="header-copy">
        <div class="header-title">عکس‌های پاسخ</div>
        <div class="header-subtitle">
          عکس‌ها را انتخاب کنید؛ تصویر نهایی به همان ترتیب ساخته می‌شود.
        </div>
      </div>
    </div>

    <div class="picker-panel">
      <div class="picker-copy">
        <q-icon
          name="add_photo_alternate"
          size="30px" />
        <strong>{{ multiple ? 'عکس‌هایت را اینجا اضافه کن' : 'عکست را اینجا اضافه کن' }}</strong>
        <span>JPG، PNG، WebP و HEIC/HEIF</span>
      </div>

      <q-btn
        class="pick-btn"
        unelevated
        no-caps
        icon="add"
        :label="multiple ? 'انتخاب عکس‌ها' : 'انتخاب عکس'"
        :disable="processing"
        @click="openFilePicker" />
    </div>

    <input
      ref="fileInput"
      class="file-input"
      type="file"
      accept="image/*,.heic,.heif"
      :multiple="multiple"
      :aria-label="multiple ? 'انتخاب عکس‌ها' : 'انتخاب عکس'"
      @change="addImages">

    <div
      v-if="processing || rendering"
      class="status status-working"
      role="status"
      aria-live="polite">
      <q-spinner-dots
        color="primary"
        size="24px" />
      <span>
        {{ processing
          ? `در حال آماده‌سازی عکس ${processingIndex} از ${processingTotal}...`
          : 'در حال ساخت تصویر یکپارچه...' }}
      </span>
    </div>

    <div
      v-if="warning"
      class="status status-warning"
      role="alert">
      <q-icon
        name="info_outline"
        size="20px" />
      <span>{{ warning }}</span>
    </div>

    <div
      v-if="error"
      class="status status-error"
      role="alert">
      <q-icon
        name="error_outline"
        size="20px" />
      <span>{{ error }}</span>
    </div>

    <div
      v-if="images.length"
      class="images-section">
      <div class="section-heading">
        <strong>عکس‌های انتخاب‌شده</strong>
        <span class="count-badge">{{ images.length }} عکس</span>
      </div>

      <div class="image-list">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="image-row">
          <span class="image-order">{{ index + 1 }}</span>

          <img
            class="image-thumbnail"
            :src="image.url"
            :alt="`پیش‌نمایش ${image.originalName}`">

          <div class="image-details">
            <span
              class="image-name"
              dir="auto"
              :title="image.originalName">{{ image.originalName }}</span>
            <span
              v-if="image.converted"
              class="converted-label">
              HEIC تبدیل شد به JPG
            </span>
            <span
              v-else
              class="ready-label">آمادهٔ اتصال</span>
          </div>

          <q-btn
            class="remove-btn"
            flat
            round
            dense
            icon="close"
            :disable="processing"
            :aria-label="`حذف ${image.originalName}`"
            @click="removeImage(image.id)" />
        </div>
      </div>
    </div>

    <div
      v-else-if="!processing"
      class="empty-state">
      <q-icon
        name="photo_library"
        size="34px" />
      <strong>هنوز عکسی اضافه نشده</strong>
      <span>از دکمهٔ بالا شروع کن ✨</span>
    </div>

    <q-btn
      class="preview-btn"
      unelevated
      no-caps
      icon="visibility"
      :label="rendering ? 'در حال آماده‌سازی پیش‌نمایش...' : 'نمایش عکس یکپارچه'"
      :disable="!images.length || processing"
      @click="openPreview" />

    <q-dialog v-model="previewOpen">
      <q-card
        class="preview-card"
        dir="rtl">
        <q-card-section class="preview-header">
          <div>
            <div class="text-h6">پیش‌نمایش عکس یکپارچه</div>
            <div class="text-caption text-grey-7">
              {{ images.length }} عکس، به ترتیب نمایش داده‌شده
            </div>
          </div>

          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            aria-label="بستن پیش‌نمایش" />
        </q-card-section>

        <q-separator />

        <q-card-section class="preview-content">
          <div
            v-if="rendering"
            class="preview-message">
            <q-spinner
              color="primary"
              size="36px" />
            <span>داریم عکس‌ها را به هم وصل می‌کنیم...</span>
          </div>

          <div
            v-else-if="error"
            class="preview-message text-negative"
            role="alert">
            {{ error }}
          </div>

          <img
            v-else-if="previewUrl"
            class="combined-image"
            :src="previewUrl"
            alt="تصویر یکپارچهٔ عکس‌های انتخاب‌شده از بالا به پایین">
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import heic2any from 'heic2any'
import { onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{ multiple?: boolean }>(),
  { multiple: false }
)

const emit = defineEmits<{
  (event: 'file-change', file: File | null): void
}>()

interface SelectedImage {
  id: number
  file: File
  originalName: string
  converted: boolean
  url: string
}

const images = ref<SelectedImage[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const previewOpen = ref(false)
const processing = ref(false)
const processingIndex = ref(0)
const processingTotal = ref(0)
const rendering = ref(false)
const previewUrl = ref('')
const error = ref('')
const warning = ref('')

let nextId = 0
let renderId = 0
let disposed = false

function openFilePicker () {
  if (!processing.value) fileInput.value?.click()
}

function isHeic (file: File): boolean {
  return /\.(heic|heif)$/i.test(file.name) ||
    /^image\/hei[cf](?:-sequence)?$/i.test(file.type)
}

function isSupportedSelection (file: File): boolean {
  return isHeic(file) ||
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(file.name)
}

function clearPreview () {
  renderId++
  rendering.value = false

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  error.value = ''
}

async function normalizeFile (file: File): Promise<File> {
  if (!isHeic(file)) return file

  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.85
  })

  // A HEIF container can have multiple frames; use its first image.
  const blob = Array.isArray(result) ? result[0] : result
  if (!blob) throw new Error('تبدیل HEIC خروجی معتبری نداشت.')

  return new File(
    [blob],
    `${file.name.replace(/\.(heic|heif)$/i, '')}.jpg`,
    { type: 'image/jpeg' }
  )
}

function loadImage (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('عکس قابل خواندن نیست.'))
    image.src = url
  })
}

function canvasToJpeg (canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob?.type === 'image/jpeg') resolve(blob)
      else reject(new Error('ساخت فایل JPEG ممکن نشد.'))
    }, 'image/jpeg', 0.82)
  })
}

async function addImages (event: Event) {
  const input = event.target as HTMLInputElement
  const picked = Array.from(input.files ?? [])
  input.value = '' // انتخاب دوبارهٔ همان فایل هم باید کار کند.

  if (!picked.length || processing.value) return

  const valid = picked.filter(isSupportedSelection)
  const skipped = picked.length - valid.length

  if (!valid.length) {
    warning.value = ''
    error.value = 'فایل انتخاب‌شده تصویر قابل پشتیبانی نیست.'
    return
  }

  clearPreview()
  emit('file-change', null)
  previewOpen.value = false
  warning.value = ''
  processing.value = true
  processingTotal.value = valid.length
  processingIndex.value = 1

  const staged: SelectedImage[] = []
  let failed = 0
  let shouldBuild = false

  try {
    for (const [index, original] of valid.entries()) {
      processingIndex.value = index + 1

      try {
        const file = await normalizeFile(original)
        if (disposed) break

        const url = URL.createObjectURL(file)

        try {
          // Before displaying or combining, verify that the browser can decode it.
          const decoded = await loadImage(url)
          if (!decoded.naturalWidth || !decoded.naturalHeight) {
            throw new Error('ابعاد عکس معتبر نیست.')
          }

          if (disposed) {
            URL.revokeObjectURL(url)
            break
          }

          staged.push({
            id: nextId++,
            file,
            originalName: original.name,
            converted: isHeic(original),
            url
          })
        } catch {
          URL.revokeObjectURL(url)
          if (!disposed) failed++
        }
      } catch {
        if (!disposed) failed++
      }
    }

    if (disposed) return

    if (staged.length) {
      if (!props.multiple) {
        images.value.forEach((image) => URL.revokeObjectURL(image.url))
        images.value = []
      }

      images.value.push(...staged)
      staged.length = 0 // مالکیت URLها به images منتقل شد.
    }

    if (failed || skipped) {
      warning.value =
        `${failed + skipped} عکس اضافه نشد. ` +
        'اگر فایل HEIC است، تبدیل آن در این مرورگر انجام نشده؛ ' +
        'لطفاً نسخهٔ JPG آن را انتخاب کنید.'
    }

    if (!images.value.length) {
      error.value = 'هیچ‌کدام از عکس‌ها قابل خواندن نبودند.'
    } else {
      shouldBuild = true
    }
  } catch {
    if (!disposed) {
      error.value = 'آماده‌سازی عکس‌ها انجام نشد. دوباره تلاش کنید.'
      shouldBuild = images.value.length > 0
    }
  } finally {
    staged.forEach((image) => URL.revokeObjectURL(image.url))

    if (!disposed) {
      processing.value = false
      if (shouldBuild) void buildImage()
    }
  }
}

function removeImage (id: number) {
  if (processing.value) return

  const index = images.value.findIndex((image) => image.id === id)
  if (index < 0) return

  clearPreview()
  emit('file-change', null)
  previewOpen.value = false
  warning.value = ''

  URL.revokeObjectURL(images.value[index].url)
  images.value.splice(index, 1)

  if (images.value.length) void buildImage()
}

function openPreview () {
  if (images.value.length && !processing.value) {
    previewOpen.value = true
  }
}

async function buildImage () {
  if (!images.value.length) return

  const currentRender = renderId
  const selected = [...images.value]
  rendering.value = true

  let canvas: HTMLCanvasElement | null = null

  try {
    const decoded: HTMLImageElement[] = []
    const ratios: number[] = []
    let totalRatio = 0
    let largestWidth = 0

    for (const item of selected) {
      const image = await loadImage(item.url)
      if (currentRender !== renderId || disposed) return

      if (!image.naturalWidth || !image.naturalHeight) {
        throw new Error('یکی از عکس‌ها ابعاد معتبری ندارد.')
      }

      decoded.push(image)
      const ratio = image.naturalHeight / image.naturalWidth
      ratios.push(ratio)
      totalRatio += ratio
      largestWidth = Math.max(largestWidth, image.naturalWidth)
    }

    // Keep the result within the original component's canvas limits.
    const maximumWidth = Math.floor(Math.min(
      1600,
      largestWidth,
      16000 / totalRatio,
      Math.sqrt(24000000 / totalRatio)
    ))

    const rowHeights = (width: number) =>
      ratios.map((ratio) => Math.max(1, Math.round(width * ratio)))

    let low = 1
    let high = maximumWidth
    let width = 0

    while (low <= high) {
      const candidate = Math.floor((low + high) / 2)
      const height = rowHeights(candidate).reduce((sum, row) => sum + row, 0)

      if (height <= 16000 && candidate * height <= 24000000) {
        width = candidate
        low = candidate + 1
      } else {
        high = candidate - 1
      }
    }

    if (!width) {
      throw new Error('تعداد یا ابعاد عکس‌ها برای ساخت یک تصویر بیش از حد زیاد است.')
    }

    const heights = rowHeights(width)
    const height = heights.reduce((sum, row) => sum + row, 0)

    canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('مرورگر امکان ساخت تصویر را ندارد.')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    let top = 0
    decoded.forEach((image, index) => {
      context.drawImage(image, 0, top, width, heights[index])
      top += heights[index]
    })

    const blob = await canvasToJpeg(canvas)
    if (currentRender !== renderId || disposed) return

    previewUrl.value = URL.createObjectURL(blob)
    emit(
      'file-change',
      new File([blob], 'stacked-images.jpg', { type: 'image/jpeg' })
    )
  } catch (cause) {
    if (currentRender === renderId && !disposed) {
      error.value = cause instanceof Error
        ? cause.message
        : 'ساخت عکس یکپارچه ممکن نشد.'
    }
  } finally {
    // Release the large canvas backing store after encoding.
    if (canvas) {
      canvas.width = 0
      canvas.height = 0
    }
    if (currentRender === renderId && !disposed) rendering.value = false
  }
}

onBeforeUnmount(() => {
  disposed = true
  clearPreview()
  images.value.forEach((image) => URL.revokeObjectURL(image.url))
})
</script>

<style scoped lang="scss">
.image-stacker {
  --purple: #7864ce;
  --purple-dark: #6550bd;
  color: #322c47;
  background: linear-gradient(155deg, #fff 0%, #fbfaff 70%, #f6f3ff 100%);
  border: 1px solid #eee9fa;
  border-radius: 22px;
  padding: clamp(16px, 4vw, 26px);
  box-shadow: 0 12px 36px rgb(86 65 156 / 8%);
}

.stacker-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.header-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex: none;
  color: var(--purple-dark);
  background: #eee9ff;
  border-radius: 15px;
}

.header-copy,
.image-details {
  min-width: 0;
}

.header-title {
  font-size: 17px;
  font-weight: 700;
}

.header-subtitle {
  margin-top: 3px;
  color: #817b91;
  font-size: 12px;
  line-height: 1.7;
}

.picker-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  border: 1px dashed #bcaef1;
  border-radius: 18px;
  background: #f8f5ff;
}

.picker-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;

  .q-icon {
    color: var(--purple);
  }

  strong {
    font-size: 13px;
  }

  span {
    color: #89839a;
    font-size: 11px;
  }
}

.pick-btn {
  flex: none;
  min-height: 43px;
  padding: 0 15px;
  border-radius: 13px;
  background: linear-gradient(135deg, #9379e2, #7059c7) !important;
  color: white !important;
  box-shadow: 0 6px 16px rgb(112 89 199 / 20%);
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.status {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 13px;
  padding: 11px 13px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.7;
}

.status-working {
  color: #6451ad;
  background: #f1edff;
}

.status-warning {
  color: #805d17;
  background: #fff6df;
}

.status-error {
  color: #b5334a;
  background: #fff0f2;
}

.images-section {
  margin-top: 22px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 11px;
  font-size: 13px;
}

.count-badge {
  padding: 3px 9px;
  border-radius: 20px;
  background: #eee9ff;
  color: #6955bb;
  font-size: 11px;
}

.image-list {
  display: grid;
  gap: 9px;
}

.image-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 9px;
  border: 1px solid #eeeaf7;
  border-radius: 14px;
  background: white;
}

.image-order {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  flex: none;
  border-radius: 9px;
  color: #6c58be;
  background: #f1edff;
  font-size: 12px;
  font-weight: 700;
}

.image-thumbnail {
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 10px;
  object-fit: cover;
  background: #f1edff;
}

.image-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.image-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
}

.converted-label,
.ready-label {
  font-size: 10px;
}

.converted-label {
  color: #725bc1;
}

.ready-label {
  color: #5a9b72;
}

.remove-btn {
  flex: none;
  color: #c8576e;
  background: #fff0f2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 22px 12px;
  border: 1px solid #f0edf7;
  border-radius: 14px;
  color: #9891a9;
  font-size: 12px;

  strong {
    color: #696175;
  }
}

.preview-btn {
  width: 100%;
  min-height: 47px;
  margin-top: 18px;
  border: 1px solid #d6cafa;
  border-radius: 13px;
  color: #7059c7 !important;
  background: #f1ecff !important;
  font-weight: 600;
}

.preview-card {
  width: min(95vw, 920px);
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 18px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.preview-content {
  max-height: calc(90vh - 85px);
  overflow: auto;
  text-align: center;
}

.preview-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 8px;
}

.combined-image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .picker-panel {
    align-items: stretch;
    flex-direction: column;
  }

  .pick-btn {
    width: 100%;
  }

  .image-row {
    gap: 7px;
  }

  .image-thumbnail {
    width: 45px;
    height: 45px;
  }
}
</style>
