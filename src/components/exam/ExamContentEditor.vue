<template>
  <div class="exam-content-editor">
    <div class="row q-col-gutter-sm">
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
      <!--      <q-chip-->
      <!--        :color="currentItem.type === 'image' ? 'info' : 'secondary'"-->
      <!--        text-color="white"-->
      <!--        dense-->
      <!--        class="q-ml-sm">-->
      <!--        {{ currentItem.type === 'image' ? 'تصویر' : 'متن' }}-->
      <!--      </q-chip>-->
      <span v-if="currentItem.type === 'image' && currentItem.file">
        {{ currentItem.file.name }}
      </span>
      <span v-else-if="currentItem.type === 'image' && currentItem.path">
        <img
          :src="`storage/${currentItem.path}`"
          alt="پیش‌نمایش تصویر"
          style="max-width: 100%; display: block; margin-top: 8px">
      </span>
      <span v-else-if="currentItem.type === 'text' && currentItem.body">
        {{ currentItem.body.substring(0, 100) }}{{ currentItem.body.length > 100 ? '...' : '' }}
      </span>
    </div>
    <div
      v-else
      class="text-center q-pa-md text-grey">محتوایی ثبت نشده است.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const modelValue = defineModel<{
  type: 'text' | 'image';
  body?: string;
  path?: string;
  file?: File;
} | null>('value')

const typeOptions = [
  { label: 'تصویر', value: 'image' },
  { label: 'متن', value: 'text' }
]

const currentType = ref<'text' | 'image'>(modelValue.value?.type || 'text')
const currentBody = ref(modelValue.value?.body || '')
const currentFile = ref<File | null>(null)
const imageFileInput = ref<HTMLInputElement | null>(null)

watch(modelValue, (newVal) => {
  if (newVal) {
    currentType.value = newVal.type
    if (newVal.type === 'text') {
      currentBody.value = newVal.body || ''
    } else {
      currentFile.value = null
    }
  } else {
    currentType.value = 'text'
    currentBody.value = ''
    currentFile.value = null
  }
})

const canSave = computed(() => {
  if (!currentType.value) return false
  if (currentType.value === 'image') {
    return !!currentFile.value || !!modelValue.value?.path
  }
  return !!currentBody.value.trim()
})

const currentItem = computed(() => {
  if (!canSave.value) return null

  const item: { type: 'text' | 'image'; body?: string; path?: string; file?: File } = {
    type: currentType.value
  }

  if (currentType.value === 'image') {
    item.file = currentFile.value || undefined
    item.path = modelValue.value?.path || undefined
  } else {
    item.body = currentBody.value.trim()
  }

  return item
})

watch(currentItem, (newVal) => {
  modelValue.value = newVal
})

function openFilePicker () {
  imageFileInput.value?.click()
}

function onFileChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    currentFile.value = target.files[0]
  }
}
</script>

<style scoped></style>
