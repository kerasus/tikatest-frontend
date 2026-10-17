<template>
  <div class="content-editor-glass">
    <!-- بخش ویرایش (در صورت editable بودن) -->
    <div
      v-if="editable"
      class="editor-toolbar q-pa-sm rounded-borders q-mb-md">
      <div class="row q-col-gutter-sm items-center">
        <!-- سلکتور نوع -->
        <div class="col-xs-12 col-sm-auto">
          <q-select
            v-model="currentType"
            :options="typeOptions"
            label="نوع محتوا"
            outlined
            dense
            rounded
            emit-value
            map-options
            class="glass-input"
            style="min-width: 140px">
            <template #prepend>
              <q-icon
                :name="currentType === 'image' ? 'photo_camera' : currentType === 'pdf' ? 'picture_as_pdf' : 'notes'"
                color="primary"
                size="20px" />
            </template>
          </q-select>
        </div>

        <!-- فیلدهای متناسب با نوع انتخابی -->
        <div class="col-xs-12 col-sm">
          <!-- انتخاب تصویر -->
          <template v-if="currentType === 'image'">
            <div class="row q-col-gutter-sm items-center">
              <div class="col-auto">
                <q-btn
                  label="انتخاب تصویر"
                  icon="add_photo_alternate"
                  dense
                  unelevated
                  class="glass-action-btn primary-glow"
                  @click="openFilePicker" />
                <input
                  ref="imageFileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onFileChange">
              </div>
              <div
                v-if="currentFile"
                class="col file-chip-badge text-truncate">
                <q-icon
                  name="image"
                  size="18px"
                  class="q-mr-xs text-primary" />
                <span>{{ currentFile.name }}</span>
              </div>
              <div
                v-else-if="modelValue?.path"
                class="col file-chip-badge text-truncate">
                <q-icon
                  name="cloud_done"
                  size="18px"
                  class="q-mr-xs text-secondary" />
                <span>{{ modelValue.path }}</span>
              </div>
            </div>
          </template>

          <!-- انتخاب PDF -->
          <template v-else-if="currentType === 'pdf'">
            <div class="row q-col-gutter-sm items-center">
              <div class="col-auto">
                <q-btn
                  label="انتخاب PDF"
                  icon="upload_file"
                  dense
                  unelevated
                  class="glass-action-btn secondary-glow"
                  @click="openPdfPicker" />
                <input
                  ref="pdfFileInput"
                  type="file"
                  accept="application/pdf"
                  style="display: none"
                  @change="onPdfChange">
              </div>
              <div
                v-if="currentFile"
                class="col file-chip-badge text-truncate">
                <q-icon
                  name="picture_as_pdf"
                  size="18px"
                  class="q-mr-xs text-red-4" />
                <span>{{ currentFile.name }}</span>
              </div>
              <div
                v-else-if="modelValue?.path"
                class="col file-chip-badge text-truncate">
                <q-icon
                  name="cloud_done"
                  size="18px"
                  class="q-mr-xs text-secondary" />
                <span>{{ modelValue.path }}</span>
              </div>
            </div>
          </template>

          <!-- فیلد متنی -->
          <q-input
            v-else
            v-model="currentBody"
            label="متن سوال یا محتوا"
            outlined
            dense
            type="textarea"
            rows="2"
            class="glass-input"
            placeholder="<p>متن سوال...</p>" />
        </div>
      </div>
    </div>

    <!-- نمایش زنده آیتم ثبت‌شده / پیش‌نمایش کارت -->
    <div
      v-if="currentItem"
      class="preview-card q-pa-sm rounded-borders">
      <!-- پیش‌نمایش تصویر -->
      <template v-if="currentItem.type === 'image' && (previewSrc || currentItem.file)">
        <div class="row items-center q-gutter-md">
          <div class="col-auto relative-position image-frame">
            <q-img
              :src="previewSrc"
              alt="پیش‌نمایش تصویر"
              class="rounded-borders thumbnail-glow"
              style="width: 130px; height: 85px; cursor: pointer; object-fit: cover"
              @click="openPreview">
              <div class="absolute-bottom text-center preview-hint">
                <q-icon
                  name="zoom_in"
                  size="16px" /> بزرگ‌نمایی
              </div>
            </q-img>
          </div>

          <div class="col">
            <div class="text-caption text-grey-5 q-mb-xs">فایل تصویری بارگذاری‌شده</div>
            <div class="row q-gutter-x-sm">
              <q-btn
                unelevated
                dense
                size="sm"
                icon="download"
                label="دانلود تصویر"
                class="glass-btn download-btn"
                @click="downloadImage" />
              <q-btn
                flat
                dense
                size="sm"
                icon="fullscreen"
                label="مشاهده کامل"
                color="primary"
                @click="openPreview" />
            </div>
          </div>
        </div>
      </template>

      <!-- پیش‌نمایش PDF -->
      <template v-else-if="currentItem.type === 'pdf' && (currentItem.path || currentItem.file)">
        <div class="row items-center q-gutter-md">
          <div class="col-auto">
            <div class="pdf-icon-box flex flex-center">
              <q-icon
                name="picture_as_pdf"
                size="36px"
                color="red-4" />
            </div>
          </div>
          <div class="col">
            <div class="text-caption text-grey-5 q-mb-xs">سند PDF پیوست‌شده</div>
            <div class="row q-gutter-x-sm">
              <q-btn
                unelevated
                dense
                size="sm"
                icon="visibility"
                label="پیش‌نمایش PDF"
                class="glass-btn view-btn"
                @click="openPdfPreview" />
              <q-btn
                unelevated
                dense
                size="sm"
                icon="download"
                label="دانلود PDF"
                class="glass-btn download-btn"
                @click="downloadPdf" />
            </div>
          </div>
        </div>
      </template>

      <!-- پیش‌نمایش متن -->
      <div
        v-else-if="currentItem.type === 'text' && currentItem.body"
        class="row items-center q-col-gutter-sm">
        <div class="col ellipsis-3-lines text-body2 text-grey-3">
          {{ currentItem.body }}
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            rounded
            color="primary"
            icon="visibility"
            label="نمایش متن"
            class="glass-btn"
            @click="openTextPreview" />
        </div>
      </div>

      <!-- اگر نوع تصویر یا پی دی اف انتخاب شده ولی هنوز فایلی آپلود نشده -->
      <div
        v-else
        class="text-center q-pa-sm text-grey-5 text-caption">
        فایلی هنوز انتخاب نشده است.
      </div>
    </div>

    <!-- حالت خالی -->
    <div
      v-else
      class="text-center q-pa-md empty-box rounded-borders">
      <q-icon
        name="folder_open"
        size="32px"
        color="grey-6"
        class="q-mb-xs" />
      <div>محتوایی ثبت نشده است.</div>
    </div>

    <!-- مودال پیش‌نمایش تصویر -->
    <q-dialog v-model="previewDialog">
      <q-card
        class="glass-dialog"
        style="width: 95vw; max-width: 95vw; min-width: 80vw; max-height: 95vh">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-x-xs">
              <q-icon
                name="image"
                color="primary" />
              <span>پیش‌نمایش تصویر</span>
            </div>
          </div>
          <div class="col-auto row q-gutter-x-xs">
            <q-btn
              flat
              round
              dense
              icon="download"
              color="positive"
              @click="downloadImage" />
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey-4" />
          </div>
        </q-card-section>
        <q-card-section class="flex flex-center q-pa-md">
          <img
            :src="previewSrc"
            alt="پیش‌نمایش تصویر"
            class="rounded-borders shadow-10"
            style="width: 100%; max-width: 100%;">
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- مودال نمایش متن -->
    <q-dialog v-model="textPreviewDialog">
      <q-card
        class="glass-dialog"
        style="width: 95vw; max-width: 95vw; min-width: 80vw; max-height: 95vh; display: flex; flex-direction: column;">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-x-xs">
              <q-icon
                name="subject"
                color="primary" />
              <span>نمایش کامل متن</span>
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey-4" />
          </div>
        </q-card-section>
        <q-card-section class="col scroll q-pa-lg">
          <div
            class="text-body1"
            style="white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.8">
            {{ currentItem?.body }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- مودال پیش‌نمایش PDF -->
    <q-dialog v-model="pdfPreviewDialog">
      <q-card
        class="glass-dialog"
        style="width: 95vw; max-width: 95vw; min-width: 80vw; max-height: 95vh; display: flex; flex-direction: column;">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-x-xs">
              <q-icon
                name="picture_as_pdf"
                color="red-4" />
              <span>پیش‌نمایش سند PDF</span>
            </div>
          </div>
          <div class="col-auto row q-gutter-x-xs">
            <q-btn
              flat
              round
              dense
              icon="download"
              color="positive"
              @click="downloadPdf" />
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey-4" />
          </div>
        </q-card-section>
        <q-card-section class="col q-pa-sm scroll">
          <vue-pdf-embed
            :source="pdfPreviewSrc"
            class="shadow-5 rounded-borders" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from 'src/components/VuePdfEmbed.vue'
import { ref, watch, computed, onUnmounted } from 'vue'
import type { ContentType } from 'src/repositories/exam'

defineProps<{
  editable?: boolean;
}>()

const modelValue = defineModel<ContentType | null>('value')

const typeOptions = [
  { label: 'تصویر', value: 'image' },
  { label: 'متن', value: 'text' },
  { label: 'PDF', value: 'pdf' }
]

const currentType = ref<'text' | 'image' | 'pdf'>(modelValue.value?.type || 'text')
const currentBody = ref(modelValue.value?.body || '')
const currentFile = ref<File | null>(null)
const objectUrl = ref<string | null>(null)

const imageFileInput = ref<HTMLInputElement | null>(null)
const pdfFileInput = ref<HTMLInputElement | null>(null)
const previewDialog = ref(false)
const textPreviewDialog = ref(false)
const pdfPreviewDialog = ref(false)
const pdfPreviewSrc = ref('')

// مدیریت و آزاد‌سازی آبجکت URL جهت عدم نشتی حافظه
function clearObjectUrl () {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = null
  }
}

function setObjectUrl (file: File | null) {
  clearObjectUrl()
  if (file) {
    objectUrl.value = URL.createObjectURL(file)
  }
}

onUnmounted(() => {
  clearObjectUrl()
})

const currentItem = computed(() => {
  const item: { type: 'text' | 'image' | 'pdf'; body?: string; path?: string; file?: File } = {
    type: currentType.value
  }

  if (currentType.value === 'image') {
    item.file = currentFile.value || undefined
    item.path = modelValue.value?.path || undefined
  } else if (currentType.value === 'pdf') {
    item.file = currentFile.value || undefined
    item.path = modelValue.value?.path || undefined
  } else {
    item.body = currentBody.value.trim()
  }

  return item
})

const canSave = computed(() => {
  if (!currentType.value) return false
  if (currentType.value === 'image' || currentType.value === 'pdf') {
    return !!currentFile.value || !!modelValue.value?.path
  }
  return !!currentBody.value.trim()
})

// کاملاً خالص (Pure) و بدون کوچک‌ترین ساید افکت برای عبور از ESLint
const previewSrc = computed(() => {
  const item = currentItem.value
  if (!item || item.type !== 'image') return ''

  if (item.file) {
    return objectUrl.value || ''
  }

  if (item.path) {
    return item.path
  }

  return ''
})

function openFilePicker () {
  imageFileInput.value?.click()
}

function onFileChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    currentFile.value = file
    setObjectUrl(file)
    emitChange()
  }
}

function openPdfPicker () {
  pdfFileInput.value?.click()
}

function onPdfChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    currentFile.value = file
    setObjectUrl(file)
    emitChange()
  }
}

function openPreview () {
  if (previewSrc.value) {
    previewDialog.value = true
  }
}

function openTextPreview () {
  textPreviewDialog.value = true
}

function openPdfPreview () {
  const targetSource = objectUrl.value || modelValue.value?.path || currentItem.value?.path
  if (targetSource) {
    pdfPreviewSrc.value = targetSource
    pdfPreviewDialog.value = true
  }
}

// توابع دانلود فایل تصویر و PDF
function triggerDownload (url: string, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

function downloadImage () {
  if (previewSrc.value) {
    const fileName = currentFile.value?.name || modelValue.value?.path?.split('/').pop() || 'image-preview.jpg'
    triggerDownload(previewSrc.value, fileName)
  }
}

function downloadPdf () {
  const pdfSource = objectUrl.value || modelValue.value?.path || currentItem.value?.path
  if (pdfSource) {
    const fileName = currentFile.value?.name || modelValue.value?.path?.split('/').pop() || 'document.pdf'
    triggerDownload(pdfSource, fileName)
  }
}

watch(currentBody, (newVal) => {
  if (currentType.value === 'text' && newVal) {
    emitChange()
  }
})

watch(modelValue, (newVal) => {
  if (newVal) {
    currentType.value = newVal.type
    if (newVal.type === 'text') {
      currentBody.value = newVal.body || ''
      clearObjectUrl()
    } else {
      currentFile.value = newVal.file || null
      setObjectUrl(newVal.file || null)
    }
  } else {
    currentType.value = 'text'
    currentBody.value = ''
    currentFile.value = null
    clearObjectUrl()
  }
})

function emitChange () {
  if (!canSave.value) return

  const item: { type: 'text' | 'image' | 'pdf'; body?: string; path?: string; file?: File } = {
    type: currentType.value
  }

  if (currentType.value === 'image' || currentType.value === 'pdf') {
    item.file = currentFile.value || undefined
    item.path = modelValue.value?.path || undefined
  } else {
    item.body = currentBody.value.trim()
  }

  modelValue.value = item
}
</script>

<style scoped>
.content-editor-glass {
  width: 100%;
  font-family: inherit;
}

/* پنل نوار ابزار شیشه‌ای روشن */
.editor-toolbar {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

/* کارت شیشه‌ای نمایش محتوا - سازگار با زمینه روشن */
.preview-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 247, 250, 0.75) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  color: #1e293b; /* رنگ متن تیره و کاملاً خوانا */
}

.preview-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 12px 36px rgba(99, 102, 241, 0.12);
}

/* بج شیشه‌ای نام فایل */
.file-chip-badge {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #334155;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

/* دکمه‌های شیشه‌ای مدرن در حالت روشن */
.glass-action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #1e293b;
  border-radius: 8px;
  font-weight: 500;
  padding: 4px 14px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.primary-glow:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
  color: #4f46e5;
  transform: translateY(-1px);
}

.secondary-glow:hover {
  background: rgba(236, 72, 153, 0.15);
  border-color: #ec4899;
  color: #db2777;
  transform: translateY(-1px);
}

/* استایل دکمه‌های دانلود و پیش‌نمایش برای زمینه روشن */
.glass-btn {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  color: #1e293b !important;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.glass-btn :deep(.q-icon),
.glass-btn :deep(.q-btn__content) {
  color: #1e293b;
}

.glass-btn.download-btn {
  background: rgba(34, 197, 94, 0.1) !important;
  border-color: rgba(34, 197, 94, 0.3) !important;
  color: #15803d !important;
}
.glass-btn.download-btn :deep(.q-icon) {
  color: #16a34a;
}
.glass-btn.download-btn:hover {
  background: rgba(34, 197, 94, 0.2) !important;
  border-color: #22c55e !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  transform: translateY(-1px);
}

.glass-btn.view-btn {
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
  color: #1d4ed8 !important;
}
.glass-btn.view-btn :deep(.q-icon) {
  color: #2563eb;
}
.glass-btn.view-btn:hover {
  background: rgba(59, 130, 246, 0.2) !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

/* قاب تصویر بندانگشتی */
.image-frame {
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
}

.thumbnail-glow {
  transition: transform 0.3s ease;
}

.image-frame:hover .thumbnail-glow {
  transform: scale(1.05);
}

.preview-hint {
  background: rgba(0, 0, 0, 0.7);
  font-size: 11px;
  padding: 2px 0;
  color: #fff;
}

/* آیکون باکس PDF */
.pdf-icon-box {
  width: 60px;
  height: 60px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
}

/* مودال‌های دیالوگ */
.glass-dialog {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 16px !important;
  color: #0f172a !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.empty-box {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.5);
  color: #64748b;
}
</style>
