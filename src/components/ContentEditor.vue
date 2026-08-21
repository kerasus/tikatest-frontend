<template>
  <div class="content-editor">
    <div
      v-if="editable"
      class="row q-col-gutter-sm">
      <div class="col-auto">
        <q-select
          v-model="currentType"
          :options="typeOptions"
          label="نوع"
          outlined
          dense
          emit-value
          map-options
          style="min-width: 120px" />
      </div>
      <div class="col">
        <template v-if="currentType === 'image'">
          <div class="row q-col-gutter-sm items-center">
            <div class="col-auto">
              <q-btn
                label="انتخاب تصویر"
                icon="attach_file"
                dense
                outlined
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
              class="col text-truncate">
              {{ currentFile.name }}
            </div>
            <div
              v-else-if="modelValue?.path"
              class="col text-truncate">
              {{ modelValue.path }}
            </div>
          </div>
        </template>
        <template v-else-if="currentType === 'pdf'">
          <div class="row q-col-gutter-sm items-center">
            <div class="col-auto">
              <q-btn
                label="انتخاب PDF"
                icon="attach_file"
                dense
                outlined
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
              class="col text-truncate">
              {{ currentFile.name }}
            </div>
            <div
              v-else-if="modelValue?.path"
              class="col text-truncate">
              {{ modelValue.path }}
            </div>
          </div>
        </template>
        <q-input
          v-else
          v-model="currentBody"
          label="متن"
          outlined
          dense
          type="textarea"
          rows="2"
          placeholder="<p>متن سوال...</p>" />
      </div>
    </div>

    <div
      v-if="currentItem"
      class="q-mt-sm">
      <template v-if="currentItem.type === 'image'">
        <q-img
          :src="previewSrc"
          alt="پیش‌نمایش تصویر"
          style="width: 120px; height: 80px; cursor: pointer; border-radius: 4px"
          @click="openPreview" />
        <span class="q-ml-sm text-grey">
          {{ currentItem.file ? currentItem.file.name : currentItem.path || '' }}
        </span>
      </template>
      <template v-else-if="currentItem.type === 'pdf' && currentItem.path">
        <q-btn
          flat
          dense
          color="primary"
          icon="picture_as_pdf"
          label="PDF"
          @click="openPdfPreview" />
        <span class="q-ml-sm text-grey">
          {{ currentItem.file ? currentItem.file.name : currentItem.path }}
        </span>
      </template>
      <span v-else-if="currentItem.type === 'text' && currentItem.body">
        {{ currentItem.body.substring(0, 100) }}{{ currentItem.body.length > 100 ? '...' : '' }}
      </span>
    </div>
    <div
      v-else
      class="text-center q-pa-md text-grey">محتوایی ثبت نشده است.</div>

    <q-dialog v-model="previewDialog">
      <q-card style="max-width: 99vw; min-width: 99vw; max-height: 99vh">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle2">پیش‌نمایش تصویر</div>
          </div>
          <div class="col-auto">
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey" />
          </div>
        </q-card-section>
        <q-card-section>
          <img
            :src="previewSrc"
            alt="پیش‌نمایش تصویر"
            style="width: 100%; height: auto; display: block">
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="pdfPreviewDialog">
      <q-card
        style="
          max-width: 99vw;
          min-width: 99vw;
          height: 99vh;
          display: flex;
          flex-direction: column;
        ">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle2">پیش‌نمایش PDF</div>
          </div>
          <div class="col-auto">
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey" />
          </div>
        </q-card-section>
        <q-card-section class="col q-pa-none overflow-hidden">
          <iframe
            :src="pdfPreviewSrc"
            style="width: 100%; height: 100%; border: none" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ContentType } from 'src/repositories/exam'

const modelValue = defineModel<ContentType | null>('value')

defineProps<{
  editable?: boolean;
}>()

const typeOptions = [
  { label: 'تصویر', value: 'image' },
  { label: 'متن', value: 'text' },
  { label: 'PDF', value: 'pdf' }
]

const currentType = ref<'text' | 'image' | 'pdf'>(modelValue.value?.type || 'text')
const currentBody = ref(modelValue.value?.body || '')
const currentFile = ref<File | null>(null)
const imageFileInput = ref<HTMLInputElement | null>(null)
const pdfFileInput = ref<HTMLInputElement | null>(null)
const previewDialog = ref(false)
const pdfPreviewDialog = ref(false)
const pdfPreviewSrc = ref('')

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

const previewSrc = computed(() => {
  const item = currentItem.value
  if (!item || item.type !== 'image') return ''

  if (item.file) {
    return URL.createObjectURL(item.file)
  }

  if (item.path) {
    return `storage/${item.path}`
  }

  return ''
})

function openFilePicker () {
  imageFileInput.value?.click()
}

function onFileChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    currentFile.value = target.files[0]
    emitChange()
  }
}

function openPdfPicker () {
  pdfFileInput.value?.click()
}

function onPdfChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    currentFile.value = target.files[0]
    emitChange()
  }
}

function openPreview () {
  if (previewSrc.value) {
    previewDialog.value = true
  }
}

function openPdfPreview () {
  const path = modelValue.value?.path || currentItem.value?.path
  if (path) {
    pdfPreviewSrc.value = `storage/${path}`
    pdfPreviewDialog.value = true
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
    } else {
      currentFile.value = newVal.file || null
    }
  } else {
    currentType.value = 'text'
    currentBody.value = ''
    currentFile.value = null
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
