<template>
  <div
    class="content-editor-wrapper"
    dir="rtl">
    <!-- نوار ابزار و کنترل ورودی (حالت ویرایش) -->
    <div
      v-if="editable"
      class="editor-glass-card q-mb-md">
      <!-- تب‌های جذاب و فانتزی انتخاب نوع محتوا -->
      <div class="type-segmented-control q-mb-md">
        <button
          v-for="opt in typeOptions"
          :key="opt.value"
          type="button"
          class="segment-btn"
          :class="{ active: currentType === opt.value }"
          @click="selectType(opt.value)">
          <q-icon
            :name="opt.icon"
            size="20px"
            class="q-ml-xs" />
          <span>{{ opt.label }}</span>
        </button>
      </div>

      <!-- محتوای وابسته به تب انتخاب شده -->
      <div class="editor-input-area">
        <!-- 1. بخش تصویر -->
        <div
          v-if="currentType === 'image'"
          class="type-panel">
          <!-- حالت چند تصویری (Image Stacker) -->
          <div
            v-if="multipleImages"
            class="multi-image-container">
            <image-stacker
              multiple
              @file-change="onStackedImageChange" />
            <div
              v-if="!currentFile && modelValue?.path"
              class="saved-file-pill q-mt-sm">
              <q-icon
                name="cloud_done"
                size="18px"
                color="positive" />
              <span
                class="ellipsis"
                :title="modelValue.path">{{ modelValue.path }}</span>
            </div>
          </div>

          <!-- حالت تک تصویر -->
          <div
            v-else
            class="single-dropzone-box">
            <div class="dropzone-inner">
              <div class="dropzone-icon-circle image-circle">
                <q-icon
                  name="add_photo_alternate"
                  size="28px" />
              </div>

              <div class="dropzone-text">
                <div class="dropzone-title">انتخاب تصویر تک‌صفحه‌ای</div>
                <div class="dropzone-hint">فرمت‌های JPG، PNG و عکس‌های آیفون (HEIC)</div>
              </div>

              <q-btn
                unelevated
                no-caps
                class="fantasy-btn image-action-btn"
                icon="photo_camera"
                label="انتخاب عکس"
                :loading="convertingHeic"
                @click="openFilePicker" />

              <input
                ref="imageFileInput"
                type="file"
                accept="image/*,.heic,.heif"
                class="hidden-file-input"
                @change="onFileChange">
            </div>

            <!-- وضعیت فایل انتخاب شده یا موجود روی سرور -->
            <div
              v-if="currentFile || modelValue?.path"
              class="current-file-badge q-mt-sm">
              <q-icon
                :name="currentFile ? 'check_circle' : 'cloud_done'"
                size="18px"
                :color="currentFile ? 'primary' : 'teal'" />
              <span class="ellipsis">{{ currentFile ? currentFile.name : modelValue?.path }}</span>
              <q-btn
                v-if="currentFile"
                flat
                round
                dense
                size="sm"
                icon="close"
                class="q-mr-auto remove-pill-btn"
                @click="clearSelectedFile" />
            </div>
          </div>
        </div>

        <!-- 2. بخش PDF -->
        <div
          v-else-if="currentType === 'pdf'"
          class="type-panel">
          <div class="single-dropzone-box pdf-theme">
            <div class="dropzone-inner">
              <div class="dropzone-icon-circle pdf-circle">
                <q-icon
                  name="picture_as_pdf"
                  size="28px" />
              </div>

              <div class="dropzone-text">
                <div class="dropzone-title">بارگذاری فایل PDF پیوست</div>
                <div class="dropzone-hint">فایل‌های استاندارد PDF و اسناد درسی</div>
              </div>

              <q-btn
                unelevated
                no-caps
                class="fantasy-btn pdf-action-btn"
                icon="upload_file"
                label="انتخاب فایل PDF"
                @click="openPdfPicker" />

              <input
                ref="pdfFileInput"
                type="file"
                accept="application/pdf"
                class="hidden-file-input"
                @change="onPdfChange">
            </div>

            <!-- نمایش وضعیت فایل PDF -->
            <div
              v-if="currentFile || modelValue?.path"
              class="current-file-badge q-mt-sm">
              <q-icon
                :name="currentFile ? 'picture_as_pdf' : 'cloud_done'"
                size="18px"
                color="red-5" />
              <span class="ellipsis">{{ currentFile ? currentFile.name : modelValue?.path }}</span>
              <q-btn
                v-if="currentFile"
                flat
                round
                dense
                size="sm"
                icon="close"
                class="q-mr-auto remove-pill-btn"
                @click="clearSelectedFile" />
            </div>
          </div>
        </div>

        <!-- 3. بخش متن -->
        <div
          v-else
          class="type-panel">
          <div class="fantasy-textarea-wrapper">
            <q-input
              v-model="currentBody"
              outlined
              dense
              type="textarea"
              rows="3"
              class="fantasy-input"
              placeholder="متن سوال، پاسخ تشریحی یا توضیحات محتوا را اینجا بنویسید...">
              <template #prepend>
                <q-icon
                  name="edit_note"
                  color="primary"
                  class="q-mt-xs" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>

    <!-- بخش پیش‌نمایش محتوای ذخیره/انتخاب شده -->
    <div
      v-if="hasContent"
      class="preview-fantasy-card">
      <div class="preview-card-header">
        <div class="header-indicator" />
        <span class="header-title">پیش‌نمایش محتوای نهایی</span>
      </div>

      <!-- پیش‌نمایش حالت تصویر -->
      <div
        v-if="currentItem.type === 'image' && (previewSrc || currentItem.file)"
        class="preview-body row items-center q-gutter-md">
        <div class="col-auto">
          <div
            class="fantasy-thumb-frame"
            @click="openPreview">
            <q-img
              :src="previewSrc"
              alt="پیش‌نمایش تصویر"
              class="fantasy-thumb-img">
              <div class="absolute-full flex flex-center thumb-hover-overlay">
                <q-icon
                  name="zoom_in"
                  size="24px"
                  color="white" />
              </div>
            </q-img>
          </div>
        </div>

        <div class="col details-col">
          <div class="preview-meta-title">تصویر پاسخ / محتوا آماده است</div>
          <div class="preview-meta-subtitle ellipsis">
            {{ currentFile?.name || modelValue?.path || 'تصویر یکپارچه' }}
          </div>
          <div class="actions-row q-mt-sm">
            <q-btn
              unelevated
              no-caps
              size="sm"
              icon="fullscreen"
              label="مشاهده تصویر کامل"
              class="action-pill-btn view-pill"
              @click="openPreview" />
            <q-btn
              unelevated
              no-caps
              size="sm"
              icon="download"
              label="دانلود"
              class="action-pill-btn download-pill"
              @click="downloadImage" />
          </div>
        </div>
      </div>

      <!-- پیش‌نمایش حالت PDF -->
      <div
        v-else-if="currentItem.type === 'pdf' && (currentItem.path || currentItem.file)"
        class="preview-body row items-center q-gutter-md">
        <div class="col-auto">
          <div class="fantasy-pdf-frame">
            <q-icon
              name="picture_as_pdf"
              size="38px"
              color="red-5" />
          </div>
        </div>

        <div class="col details-col">
          <div class="preview-meta-title">سند PDF ضمیمه‌شده</div>
          <div class="preview-meta-subtitle ellipsis">
            {{ currentFile?.name || modelValue?.path || 'document.pdf' }}
          </div>
          <div class="actions-row q-mt-sm">
            <q-btn
              unelevated
              no-caps
              size="sm"
              icon="visibility"
              label="پیش‌نمایش سند"
              class="action-pill-btn view-pill"
              @click="openPdfPreview" />
            <q-btn
              unelevated
              no-caps
              size="sm"
              icon="download"
              label="دانلود PDF"
              class="action-pill-btn download-pill"
              @click="downloadPdf" />
          </div>
        </div>
      </div>

      <!-- پیش‌نمایش حالت متن -->
      <div
        v-else-if="currentItem.type === 'text' && currentItem.body"
        class="preview-body row items-center justify-between">
        <div class="col text-content-summary ellipsis-2-lines">
          {{ currentItem.body }}
        </div>
        <div class="col-auto q-mr-sm">
          <q-btn
            unelevated
            no-caps
            size="sm"
            icon="menu_book"
            label="مشاهده کامل متن"
            class="action-pill-btn view-pill"
            @click="openTextPreview" />
        </div>
      </div>

      <!-- حالت انتظار انتخاب فایل بعد از انتخاب تب -->
      <div
        v-else
        class="preview-body empty-placeholder">
        <q-icon
          name="hourglass_empty"
          size="22px"
          color="grey-6" />
        <span>گزینه انتخاب شده، اما هنوز فایلی آپلود نشده است.</span>
      </div>
    </div>

    <!-- حالت خالی بودن کل محتوا -->
    <div
      v-else
      class="empty-fantasy-box">
      <div class="empty-icon-wrap">
        <q-icon
          name="drafts"
          size="36px" />
      </div>
      <strong>محتوایی ایجاد یا ثبت نشده است</strong>
      <span>از نوار ابزار بالا برای اضافه کردن تصویر، PDF یا متن استفاده کنید.</span>
    </div>

    <!-- ================== دیالوگ‌های پیش‌نمایش مدرن ================== -->

    <!-- مودال تصویر -->
    <q-dialog v-model="previewDialog">
      <q-card class="modern-dialog column">
        <q-card-section class="dialog-header-sticky row items-center justify-between">
          <div class="row items-center q-gutter-x-sm">
            <div class="dialog-icon-circle"><q-icon
              name="image"
              size="20px" /></div>
            <div class="text-subtitle1 text-weight-bold">پیش‌نمایش تصویر کامل</div>
          </div>
          <div class="row q-gutter-x-xs">
            <q-btn
              flat
              round
              dense
              icon="download"
              color="primary"
              @click="downloadImage" />
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey-7" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="col scroll flex flex-center q-pa-md bg-grey-1">
          <img
            :src="previewSrc"
            alt="پیش‌نمایش تصویر کامل"
            class="modal-full-img">
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- مودال PDF -->
    <q-dialog v-model="pdfPreviewDialog">
      <q-card class="modern-dialog column">
        <q-card-section class="dialog-header-sticky row items-center justify-between">
          <div class="row items-center q-gutter-x-sm">
            <div class="dialog-icon-circle pdf"><q-icon
              name="picture_as_pdf"
              size="20px" /></div>
            <div class="text-subtitle1 text-weight-bold">پیش‌نمایش سند PDF</div>
          </div>
          <div class="row q-gutter-x-xs">
            <q-btn
              flat
              round
              dense
              icon="download"
              color="primary"
              @click="downloadPdf" />
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey-7" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="col q-pa-md scroll bg-grey-1">
          <vue-pdf-embed
            :source="pdfPreviewSrc"
            class="pdf-embed-wrapper shadow-4" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- مودال متن -->
    <q-dialog v-model="textPreviewDialog">
      <q-card class="modern-dialog modal-text-dialog">
        <q-card-section class="dialog-header-sticky row items-center justify-between">
          <div class="row items-center q-gutter-x-sm">
            <div class="dialog-icon-circle text"><q-icon
              name="notes"
              size="20px" /></div>
            <div class="text-subtitle1 text-weight-bold">متن کامل محتوا</div>
          </div>
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            color="grey-7" />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-lg text-body-container scroll">
          <div class="rendered-full-text">{{ currentItem.body }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import heic2any from 'heic2any'
import VuePdfEmbed from 'src/components/VuePdfEmbed.vue'
import ImageStacker from 'src/components/controls/ImageStacker.vue'
import { ref, watch, computed, onUnmounted } from 'vue'
import type { ContentType } from 'src/repositories/exam'

const props = withDefaults(defineProps<{
  editable?: boolean
  multipleImages?: boolean
}>(), {
  editable: true,
  multipleImages: false
})

const modelValue = defineModel<ContentType | null>('value')

const typeOptions = [
  { label: 'عکس و تصویر', value: 'image' as const, icon: 'photo_camera' },
  { label: 'سند PDF', value: 'pdf' as const, icon: 'picture_as_pdf' },
  { label: 'متن و نوشته', value: 'text' as const, icon: 'notes' }
]

const currentType = ref<'text' | 'image' | 'pdf'>(modelValue.value?.type || 'image')
const currentBody = ref(modelValue.value?.body || '')
const currentFile = ref<File | null>(null)
const objectUrl = ref<string | null>(null)
const convertingHeic = ref(false)

const imageFileInput = ref<HTMLInputElement | null>(null)
const pdfFileInput = ref<HTMLInputElement | null>(null)

const previewDialog = ref(false)
const textPreviewDialog = ref(false)
const pdfPreviewDialog = ref(false)
const pdfPreviewSrc = ref('')

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

  if (currentType.value === 'image' || currentType.value === 'pdf') {
    item.file = currentFile.value || undefined
    item.path = modelValue.value?.path || undefined
  } else {
    item.body = currentBody.value.trim()
  }

  return item
})

const hasContent = computed(() => {
  if (currentType.value === 'image' || currentType.value === 'pdf') {
    return !!currentFile.value || !!modelValue.value?.path
  }
  return !!currentBody.value.trim()
})

const previewSrc = computed(() => {
  const item = currentItem.value
  if (!item || item.type !== 'image') return ''
  if (item.file) return objectUrl.value || ''
  return item.path || ''
})

function selectType (type: 'image' | 'pdf' | 'text') {
  if (currentType.value === type) return
  currentType.value = type
  clearSelectedFile()
}

function clearSelectedFile () {
  currentFile.value = null
  clearObjectUrl()
  if (imageFileInput.value) imageFileInput.value.value = ''
  if (pdfFileInput.value) pdfFileInput.value.value = ''
  emitChange()
}

function openFilePicker () {
  imageFileInput.value?.click()
}

// تبدیل خودکار فایل HEIC در حالت تک عکسی
async function normalizeSingleFile (file: File): Promise<File> {
  const isHeic =
    /\.(heic|heif)$/i.test(file.name) ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'

  if (!isHeic) return file

  convertingHeic.value = true
  try {
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85
    })
    const blob = Array.isArray(result) ? result[0] : result
    const newName = file.name.replace(/\.(heic|heif)$/i, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } finally {
    convertingHeic.value = false
  }
}

async function onFileChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    try {
      const processed = await normalizeSingleFile(target.files[0])
      currentFile.value = processed
      setObjectUrl(processed)
      emitChange()
    } catch (err) {
      console.error('File load failed:', err)
    }
  }
}

function onStackedImageChange (file: File | null) {
  currentFile.value = file
  setObjectUrl(file)
  modelValue.value = {
    type: 'image',
    path: modelValue.value?.type === 'image' ? modelValue.value.path : undefined,
    file: file || undefined
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
  const target = objectUrl.value || modelValue.value?.path || currentItem.value?.path
  if (target) {
    pdfPreviewSrc.value = target
    pdfPreviewDialog.value = true
  }
}

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
  if (currentType.value === 'text' && newVal !== undefined) {
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
    currentType.value = 'image'
    currentBody.value = ''
    currentFile.value = null
    clearObjectUrl()
  }
}, { immediate: true })

function emitChange () {
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

<style scoped lang="scss">
.content-editor-wrapper {
  --primary-accent: #7864ce;
  --primary-gradient: linear-gradient(135deg, #8c73e9, #6d54cf);
  --pdf-accent: #f43f5e;
  --pdf-gradient: linear-gradient(135deg, #fb7185, #e11d48);
  --bg-soft: #fcfbfe;
  font-family: inherit;
  width: 100%;
}

/* کارت اصلی بخش ویرایش */
.editor-glass-card {
  background: white;
  border: 1px solid #ebe6f7;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(120, 100, 206, 0.05);
}

/* تب‌های سگمنتد مدرن */
.type-segmented-control {
  display: flex;
  background: #f4f1fa;
  padding: 5px;
  border-radius: 14px;
  gap: 6px;
}

.segment-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #6d6682;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: var(--primary-accent);
    background: rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: white;
    color: var(--primary-accent);
    box-shadow: 0 4px 12px rgba(120, 100, 206, 0.15);
  }
}

/* Dropzone تک تصویر و تک PDF */
.single-dropzone-box {
  background: linear-gradient(135deg, #faf8ff 0%, #f6f3ff 100%);
  border: 1.5px dashed #cfc2f6;
  border-radius: 16px;
  padding: 18px;
  transition: border-color 0.2s;

  &.pdf-theme {
    background: linear-gradient(135deg, #fffafa 0%, #fff1f2 100%);
    border-color: #fecdd3;
  }
}

.dropzone-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.dropzone-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  &.image-circle {
    background: #ede8ff;
    color: var(--primary-accent);
  }

  &.pdf-circle {
    background: #ffe4e6;
    color: var(--pdf-accent);
  }
}

.dropzone-text {
  flex: 1;
  min-width: 180px;

  .dropzone-title {
    font-size: 14px;
    font-weight: 700;
    color: #2e2644;
  }

  .dropzone-hint {
    font-size: 11.5px;
    color: #8c859d;
    margin-top: 2px;
  }
}

/* دکمه‌های فانتزی */
.fantasy-btn {
  border-radius: 12px;
  padding: 6px 16px;
  font-weight: 600;
  font-size: 12.5px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &.image-action-btn {
    background: var(--primary-gradient) !important;
    color: white !important;
    box-shadow: 0 6px 16px rgba(109, 84, 207, 0.28);
  }

  &.pdf-action-btn {
    background: var(--pdf-gradient) !important;
    color: white !important;
    box-shadow: 0 6px 16px rgba(225, 29, 72, 0.28);
  }
}

.hidden-file-input {
  display: none;
}

/* تگ فایل انتخاب شده */
.current-file-badge,
.saved-file-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e7e2f5;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  color: #4b4458;
  max-width: 100%;
}

.remove-pill-btn {
  color: #c25368;
}

/* فیلد متنی فانتزی */
.fantasy-textarea-wrapper {
  :deep(.q-field__control) {
    border-radius: 14px;
    background: #faf9fd;
  }
}

/* کارت پیش‌نمایش محتوا */
.preview-fantasy-card {
  background: white;
  border: 1px solid #ebe6f7;
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 10px 28px rgba(120, 100, 206, 0.06);
}

.preview-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .header-indicator {
    width: 6px;
    height: 14px;
    border-radius: 3px;
    background: var(--primary-accent);
  }

  .header-title {
    font-size: 12px;
    font-weight: 700;
    color: #6c6382;
  }
}

.fantasy-thumb-frame {
  width: 90px;
  height: 68px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 1px solid #e2dbf7;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  .fantasy-thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb-hover-overlay {
    background: rgba(56, 43, 99, 0.45);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover .thumb-hover-overlay {
    opacity: 1;
  }
}

.fantasy-pdf-frame {
  width: 70px;
  height: 68px;
  border-radius: 12px;
  background: #fff1f2;
  border: 1px solid #fed7aa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-meta-title {
  font-size: 13px;
  font-weight: 700;
  color: #272134;
}

.preview-meta-subtitle {
  font-size: 11.5px;
  color: #8c859d;
  margin-top: 2px;
}

.action-pill-btn {
  border-radius: 8px;
  font-size: 11px;
  padding: 3px 10px;
  margin-left: 6px;

  &.view-pill {
    background: #eeeaff !important;
    color: var(--primary-accent) !important;
  }

  &.download-pill {
    background: #f1f4f9 !important;
    color: #475569 !important;
  }
}

.text-content-summary {
  font-size: 13px;
  line-height: 1.7;
  color: #3f394d;
}

.empty-placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #928b9f;
  font-size: 12px;
}

/* استایل حالت خالی کامل */
.empty-fantasy-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #faf9fe;
  border: 1.5px dashed #e3ddf2;
  border-radius: 18px;
  text-align: center;
  color: #8d859e;

  .empty-icon-wrap {
    color: #b9aee0;
    margin-bottom: 6px;
  }

  strong {
    font-size: 13.5px;
    color: #514963;
  }

  span {
    font-size: 11px;
    margin-top: 4px;
  }
}

/* دیالوگ‌ها و مودال‌های تمام صفحه */
.modern-dialog {
  width: min(94vw, 980px);
  max-width: 94vw;
  height: 88vh;
  border-radius: 20px !important;
  overflow: hidden;

  &.modal-text-dialog {
    height: auto;
    max-height: 80vh;
  }
}

.dialog-header-sticky {
  background: white;
  padding: 14px 18px;
}

.dialog-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #eeeaff;
  color: var(--primary-accent);
  display: flex;
  align-items: center;
  justify-content: center;

  &.pdf {
    background: #ffe4e6;
    color: var(--pdf-accent);
  }

  &.text {
    background: #e0f2fe;
    color: #0284c7;
  }
}

.modal-full-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  object-fit: contain;
}

.pdf-embed-wrapper {
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.rendered-full-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.9;
  font-size: 14px;
  color: #272134;
}

@media (max-width: 520px) {
  .dropzone-inner {
    justify-content: center;
    text-align: center;
  }

  .dropzone-text {
    width: 100%;
  }

  .fantasy-btn {
    width: 100%;
  }

  .preview-body {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .fantasy-thumb-frame {
    width: 100%;
    height: 140px;
  }
}
</style>
