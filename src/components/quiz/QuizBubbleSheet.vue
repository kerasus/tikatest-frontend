<template>
  <div class="bubble-sheet">
    <div class="row header-labels shadow-2 bg-primary text-white">
      <div class="col-2 table-label">ردیف</div>
      <div
        v-for="option in optionLabels"
        :key="option.value"
        class="col table-label"
      >
        {{ option.label }}
      </div>
      <div class="col table-label">بی‌پاسخ</div>
    </div>

    <q-scroll-area class="bubble-sheet-scroll" :thumb-style="thumbStyle" :bar-style="barStyle">
      <div
        v-for="questionNumber in questionNumbers"
        :key="questionNumber"
        class="bubble-sheet-row"
      >
        <div
          class="bubble-sheet-col question-number-col"
          :class="statusClass(questionNumber)"
        >
          {{ questionNumber }}
        </div>

        <div
          v-for="option in optionLabels"
          :key="`${questionNumber}-${option.value}`"
          class="bubble-sheet-col choice-col"
          :class="resultCellClass(questionNumber, option.value)"
        >
          <template v-if="readonly && showComparison">
            <q-icon
              v-if="isMarkedChoice(questionNumber, option.value)"
              :name="comparisonIcon(questionNumber, option.value)"
              :color="comparisonColor(questionNumber, option.value)"
              size="28px"
            />
          </template>
          <input
            v-else
            type="radio"
            :name="`choice-of-question-${questionNumber}`"
            :value="option.value"
            :checked="getChoice(questionNumber) === option.value"
            :disabled="disabled"
            @change="onChoiceChange(questionNumber, option.value)"
          />
        </div>

        <div
          class="bubble-sheet-col choice-col"
          :class="resultCellClass(questionNumber, NO_ANSWER_VALUE)"
        >
          <template v-if="readonly && showComparison">
            <q-icon
              v-if="isMarkedChoice(questionNumber, NO_ANSWER_VALUE)"
              :name="comparisonIcon(questionNumber, NO_ANSWER_VALUE)"
              :color="comparisonColor(questionNumber, NO_ANSWER_VALUE)"
              size="28px"
            />
          </template>
          <input
            v-else
            type="radio"
            :name="`choice-of-question-${questionNumber}`"
            :value="NO_ANSWER_VALUE"
            :checked="getChoice(questionNumber) === NO_ANSWER_VALUE"
            :disabled="disabled"
            @change="onChoiceChange(questionNumber, NO_ANSWER_VALUE)"
          />
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const NO_ANSWER_VALUE = 'none'

const props = withDefaults(defineProps<{
  questionCount: number
  choices?: Record<number, string>
  saveStatus?: Record<number, 'pending' | 'saved' | 'error'>
  userAnswers?: Record<number, string>
  correctAnswers?: Record<number, string>
  readonly?: boolean
  disabled?: boolean
  showComparison?: boolean
}>(), {
  choices: () => ({}),
  saveStatus: () => ({}),
  userAnswers: () => ({}),
  correctAnswers: () => ({}),
  readonly: false,
  disabled: false,
  showComparison: false
})

const emit = defineEmits<{
  (event: 'select', questionNumber: number, value: string): void
}>()

const optionLabels = [
  { label: '۱', value: 'a' },
  { label: '۲', value: 'b' },
  { label: '۳', value: 'c' },
  { label: '۴', value: 'd' }
]

const thumbStyle = {
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '9px',
  opacity: 0.75
}

const barStyle = {
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '9px',
  opacity: 0.2
}

const questionNumbers = computed(() =>
  Array.from({ length: props.questionCount }, (_, index) => index + 1)
)

const getChoice = (questionNumber: number): string =>
  props.choices[questionNumber] ?? NO_ANSWER_VALUE

const onChoiceChange = (questionNumber: number, value: string) => {
  emit('select', questionNumber, value)
}

const statusClass = (questionNumber: number): string => {
  if (props.readonly) return ''
  const status = props.saveStatus[questionNumber]
  if (status === 'pending') return 'bg-yellow-4'
  if (status === 'saved') return 'bg-green-3'
  if (status === 'error') return 'bg-red-3'
  return ''
}

const isTrueChoice = (questionNumber: number, value: string): boolean =>
  props.correctAnswers[questionNumber] === value

const isUserChoice = (questionNumber: number, value: string): boolean =>
  props.userAnswers[questionNumber] === value

const isMarkedChoice = (questionNumber: number, value: string): boolean =>
  isTrueChoice(questionNumber, value) || isUserChoice(questionNumber, value)

const comparisonIcon = (questionNumber: number, value: string): string => {
  const user = isUserChoice(questionNumber, value)
  const correct = isTrueChoice(questionNumber, value)
  if (user && correct) return 'check_circle_outline'
  if (user && !correct) return 'check_circle_outline'
  if (!user && correct) return 'radio_button_unchecked'
  return 'radio_button_unchecked'
}

const comparisonColor = (questionNumber: number, value: string): string => {
  const user = isUserChoice(questionNumber, value)
  const correct = isTrueChoice(questionNumber, value)
  if (user && !correct) return 'negative'
  if (correct) return 'positive'
  return 'grey-6'
}

const resultCellClass = (questionNumber: number, value: string) => {
  if (!props.showComparison) return {}
  return {
    trueAnswer: isTrueChoice(questionNumber, value),
    userAnswer: isUserChoice(questionNumber, value)
  }
}
</script>

<style scoped>
.bubble-sheet {
  width: 100%;
}

.header-labels {
  position: sticky;
  top: 0;
  z-index: 2;
  min-height: 44px;
  align-items: center;
}

.table-label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  padding: 8px 2px;
}

.bubble-sheet-scroll {
  height: calc(100vh - 360px);
  min-height: 240px;
}

.bubble-sheet-row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.bubble-sheet-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.question-number-col {
  flex: 0 0 42px;
  max-width: 42px;
  font-weight: 600;
}

.choice-col input[type='radio'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.choice-col.trueAnswer {
  background: #adff2f;
}

.choice-col.userAnswer:not(.trueAnswer) {
  box-shadow: inset 0 0 0 2px #1e90ff;
}
</style>
