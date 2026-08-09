<template>
  <div class="exam-answer-key-editor">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model.number="questionCount"
          label="تعداد سوالات"
          outlined
          dense
          type="number"
          min="1"
          max="100"
          :rules="[(val) => val > 0 || 'تعداد سوالات باید بیشتر از صفر باشد']" />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model.number="choiceCount"
          label="تعداد گزینه"
          outlined
          dense
          type="number"
          min="2"
          max="10"
          :rules="[(val) => val >= 2 || 'تعداد گزینه باید حداقل ۲ باشد']" />
      </div>
      <div class="col-12 col-md-4 flex items-center">
        <q-btn
          color="primary"
          label="تولید برگه پاسخ"
          class="full-width"
          @click="generateAnswerKeys" />
      </div>
    </div>

    <q-list
      v-if="answerKeys.length"
      bordered
      separator>
      <q-item class="q-py-sm">
        <q-item-section avatar>
          <div class="text-subtitle2 q-mb-xs" />
        </q-item-section>
        <q-item-section>
          <div class="row q-col-gutter-sm">
            <div
              v-for="(choice, choiceIndex) in choices"
              :key="choiceIndex"
              class="col-auto">
              <span class="q-ml-lg">
                {{ choice }}
              </span>
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item
        v-for="key in answerKeys"
        :key="key.question_number"
        class="q-py-sm">
        <q-item-section avatar>
          <div class="text-subtitle2 q-mb-xs q-mr-md">سوال {{ key.question_number }}</div>
        </q-item-section>
        <q-item-section>
          <div class="row q-col-gutter-md">
            <div
              v-for="(choice, choiceIndex) in choices"
              :key="choiceIndex"
              class="col-auto">
              <q-radio
                v-model="key.correct_option"
                :val="choice"
                dense
                color="primary"
                @update:model-value="onChangeCorrectOption(key)" />
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div
      v-else
      class="text-center q-pa-md text-grey">برگه پاسخی تولید نشده است.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue?: any[];
}>()

const emit = defineEmits<{
  (e: 'update:value', value: any[]): void;
}>()

const questionCount = ref(0)
const choiceCount = ref(4)
const answerKeys = ref<any[]>(props.modelValue || [])

watch(
  answerKeys,
  (newVal) => {
    emit('update:value', newVal)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) {
      answerKeys.value = newVal
      if (newVal.length > 0) {
        questionCount.value = newVal.length
        const firstKey = newVal[0]
        if (firstKey && firstKey.correct_option) {
          const optionCount = firstKey.correct_option.length
          if (optionCount >= 2 && optionCount <= 10) {
            choiceCount.value = optionCount
          }
        }
      }
    }
  },
  { deep: true }
)

const choices = computed(() => {
  return ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی', 'ک', 'ل', 'م', 'ن'].slice(
    0,
    choiceCount.value
  )
})

function generateAnswerKeys () {
  if (questionCount.value <= 0 || choiceCount.value < 2) {
    return
  }

  const labels = 'ABCDEFGHIJ'
  const newKeys: any[] = []

  for (let i = 1; i <= questionCount.value; i++) {
    const existingKey = answerKeys.value.find((k) => k.question_number === i)
    newKeys.push({
      question_number: i,
      correct_option: existingKey?.correct_option || labels[0],
      weight: existingKey?.weight ?? 1,
      has_negative_mark: existingKey?.has_negative_mark ?? false,
      is_active: existingKey?.is_active ?? true
    })
  }

  answerKeys.value = newKeys
}

function onChangeCorrectOption (key: any) {
  // trigger reactivity update
  answerKeys.value = [...answerKeys.value]
}
</script>

<style scoped></style>
