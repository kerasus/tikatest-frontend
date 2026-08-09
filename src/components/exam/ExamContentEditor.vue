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
              class="col">
              {{ currentFile.name }}
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
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="save"
          label="ذخیره"
          dense
          :disable="!canSave"
          @click="saveItem" />
      </div>
    </div>

    <div
      v-if="currentItem"
      class="q-mt-sm">
      <q-chip
        :color="currentItem.type === 'image' ? 'info' : 'secondary'"
        text-color="white"
        dense
        class="q-ml-sm">
        {{ currentItem.type === 'image' ? 'تصویر' : 'متن' }}
      </q-chip>
      <span v-if="currentItem.type === 'image' && currentItem.file">
        {{ currentItem.file.name }}
      </span>
      <span v-else-if="currentItem.type === 'text' && currentItem.body">
        {{ currentItem.body.substring(0, 100) }}{{ currentItem.body.length > 100 ? '...' : '' }}
      </span>
    </div>
    <div
      v-else
      class="text-center q-pa-md text-grey">
      محتوایی ثبت نشده است.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue?: { type: 'text' | 'image'; body?: string; path?: string; file?: File } | null
}>()

const emit = defineEmits<{
  (e: 'update:value', value: { type: 'text' | 'image'; body?: string; path?: string; file?: File } | null): void
}>()

const typeOptions = [
  { label: 'تصویر', value: 'image' },
  { label: 'متن', value: 'text' }
]

const currentType = ref<'text' | 'image'>('text')
const currentBody = ref('')
const currentFile = ref<File | null>(null)
const imageFileInput = ref<HTMLInputElement | null>(null)

const currentItem = ref<{ type: 'text' | 'image'; body?: string; path?: string; file?: File } | null>(props.modelValue || null)

watch(() => props.modelValue, (newVal) => {
  if (newVal && typeof newVal === 'object') {
    currentItem.value = newVal
    currentType.value = newVal.type || 'text'
    currentBody.value = newVal.body || ''
    currentFile.value = newVal.file || null
  } else {
    currentItem.value = null
    currentType.value = 'text'
    currentBody.value = ''
    currentFile.value = null
  }
}, { deep: true })

const canSave = computed(() => {
  if (!currentType.value) return false
  if (currentType.value === 'image') {
    return !!currentFile.value
  }
  return !!currentBody.value.trim()
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

function saveItem () {
  if (!canSave.value) return

  const newItem: { type: 'text' | 'image'; body?: string; path?: string; file?: File } = {
    type: currentType.value
  }

  if (currentType.value === 'image') {
    newItem.file = currentFile.value || undefined
  } else {
    newItem.body = currentBody.value.trim()
  }

  currentItem.value = newItem
  emit('update:value', newItem)
}
</script>

<style scoped></style>
