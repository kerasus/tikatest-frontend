<template>
  <div class="exam-content-editor">
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
        <template v-if="currentType === 'image' || currentType === 'pdf'">
          <div class="row q-col-gutter-sm items-center">
            <div class="col-auto">
              <q-btn
                :label="currentType === 'image' ? 'انتخاب تصویر' : 'انتخاب فایل PDF'"
                icon="attach_file"
                dense
                outlined
                @click="openFilePicker" />
              <input
                ref="imageFileInput"
                type="file"
                :accept="currentType === 'image' ? 'image/*' : 'application/pdf'"
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
          style="width: 120px; height: 80px; cursor: pointer; border-radius: 4px;"
          @click="openPreview" />
        <span class="q-ml-sm text-grey">
          {{ currentItem.file ? currentItem.file.name : (currentItem.path || '') }}
        </span>
      </template>
      <template v-else-if="currentItem.type === 'pdf'">
        <q-btn
          flat
          dense
          color="primary"
          icon="picture_as_pdf"
          label="پیش‌نمایش PDF"
          @click="openPreview" />
        <span class="q-ml-sm text-grey">
          {{ currentItem.file ? currentItem.file.name : (currentItem.path || '') }}
        </span>
      </template>
      <span v-else-if="currentItem.type === 'text' && currentItem.body">
        {{ currentItem.body.substring(0, 100) }}{{ currentItem.body.length > 100 ? '...' : '' }}
      </span>
    </div>
    <div
      v-else
      class="text-center q-pa-md text-grey">
      محتوایی ثبت نشده است.
    </div>

    <q-dialog v-model="previewDialog">
      <q-card style="width: 90vw; max-width: 90vw; height: 90vh; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle2">
              {{ currentType === 'image' ? 'پیش‌نمایش تصویر' : 'پیش‌نمایش PDF' }}
            </div>
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
          <img
            v-if="currentType === 'image'"
            :src="previewSrc"
            alt="پیش‌نمایش تصویر"
            style="width: 100%; height: auto; display: block;">
          <iframe
            v-else-if="currentType === 'pdf'"
            :src="previewSrc"
            style="width: 100%; height: 100%; border: none;" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const modelValue = defineModel<{
  type: 'text' | 'image' | 'pdf';
  body?: string;
  path?: string;
  file?: File;
} | null>('value')

defineProps<{
  editable?: boolean
}>()

const typeOptions = [
  { label: 'تصویر', value: 'image' },
  { label: 'فایل PDF', value: 'pdf' },
  { label: 'متن', value: 'text' }
]

const currentType = ref<'text' | 'image' | 'pdf'>(modelValue.value?.type || 'text')
const currentBody = ref(modelValue.value?.body || '')
const currentFile = ref<File | null>(null)
const imageFileInput = ref<HTMLInputElement | null>(null)
const previewDialog = ref(false)

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

const canSave = computed(() => {
  if (!currentType.value) return false
  if (currentType.value === 'image' || currentType.value === 'pdf') {
    return !!currentFile.value || !!modelValue.value?.path
  }
  return !!currentBody.value.trim()
})

const previewSrc = computed(() => {
  const item = currentItem.value
  if (!item || (item.type !== 'image' && item.type !== 'pdf')) return ''

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

function openPreview () {
  if (previewSrc.value) {
    previewDialog.value = true
  }
}

watch(currentType, (newType) => {
  currentFile.value = null
  if (newType === 'text') {
    currentBody.value = ''
  } else {
    currentBody.value = ''
  }
  // Clear file input value to allow selecting same file again if needed
  if (imageFileInput.value) {
    imageFileInput.value.value = ''
  }
})

watch(currentBody, (newVal) => {
  if (currentType.value === 'text') {
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

<style scoped></style>
