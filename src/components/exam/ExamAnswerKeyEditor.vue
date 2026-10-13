<template>
  <div class="exam-answer-key-editor">
    <div
      v-if="!readonly"
      class="row q-col-gutter-sm q-mb-md">
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
          label="تعداد گزینه (پیش‌فرض)"
          outlined
          dense
          type="number"
          min="2"
          max="10"
          :rules="[(val) => val >= 2 || 'تعداد گزینه باید حداقل ۲ باشد']" />
      </div>
    </div>

    <q-table
      v-if="answerKeys.length"
      :columns="tableColumns"
      :rows="answerKeys"
      row-key="question_number"
      :rows-per-page-options="[0]"
      dense
      separator="cell"
      hide-pagination>
      <!-- اسلات هدر اختصاصی برای ستون نمره منفی -->
      <template #header-cell-has_negative_mark="headerProps">
        <q-th :props="headerProps">
          <div class="row items-center justify-center no-wrap q-gutter-xs">
            <span>{{ headerProps.col.label }}</span>
            <q-checkbox
              v-if="!readonly && answerKeys.length > 0"
              :model-value="allNegativeMarksState"
              dense
              color="primary"
              size="xs"
              @update:model-value="toggleAllNegativeMarks">
              <q-tooltip
                anchor="top middle"
                self="bottom middle">
                تغییر وضعیت نمره منفی همه سوالات
              </q-tooltip>
            </q-checkbox>
          </div>
        </q-th>
      </template>

      <template #body-cell="cellProps">
        <q-td
          v-if="cellProps.col.name === 'question_number'"
          :props="cellProps">
          <div class="text-center">
            {{ cellProps.row.question_number }}
          </div>
        </q-td>
        <q-td
          v-else-if="cellProps.col.name === 'number_of_choices'"
          :props="cellProps">
          <div class="text-center">
            <q-input
              v-if="!readonly"
              v-model.number="cellProps.row.number_of_choices"
              type="number"
              min="2"
              max="10"
              dense
              outlined
              style="max-width: 80px"
              @update:model-value="onChangeCorrectOption(cellProps.row)" />
            <span v-else>{{ cellProps.row.number_of_choices ?? 4 }}</span>
          </div>
        </q-td>
        <q-td
          v-else-if="cellProps.col.name === 'weight'"
          :props="cellProps">
          <div class="text-center">
            <q-input
              v-if="!readonly"
              v-model.number="cellProps.row.weight"
              type="number"
              min="1"
              dense
              outlined
              style="max-width: 80px"
              @update:model-value="onChangeCorrectOption(cellProps.row)" />
            <span v-else>{{ cellProps.row.weight ?? 1 }}</span>
          </div>
        </q-td>
        <q-td
          v-else-if="cellProps.col.name === 'has_negative_mark'"
          :props="cellProps">
          <div class="text-center">
            <q-checkbox
              v-if="!readonly"
              v-model="cellProps.row.has_negative_mark"
              dense
              color="primary"
              @update:model-value="onChangeCorrectOption(cellProps.row)" />
            <q-chip
              v-else
              :color="cellProps.row.has_negative_mark ? 'warning' : 'positive'"
              text-color="white"
              dense>
              {{ cellProps.row.has_negative_mark ? 'دارد' : 'ندارد' }}
            </q-chip>
          </div>
        </q-td>
        <q-td
          v-else
          :props="cellProps"
          :class="{ 'cursor-default': readonly, 'cursor-pointer': !readonly }"
          @click="!readonly && toggleCorrectOption(cellProps.row, cellProps.col.name)">
          <div
            v-if="Number(cellProps.col.name) <= (cellProps.row.number_of_choices || choiceCount)"
            class="text-center">
            <q-radio
              v-if="!readonly"
              v-model="cellProps.row.correct_option"
              :val="cellProps.col.name"
              dense
              color="primary"
              readonly />
            <q-icon
              v-else
              :name="
                cellProps.row.correct_option == cellProps.col.name
                  ? 'check_circle'
                  : 'radio_button_unchecked'
              "
              :color="cellProps.row.correct_option == cellProps.col.name ? 'primary' : 'grey-4'"
              size="24px" />
          </div>
        </q-td>
      </template>
    </q-table>
    <div
      v-else
      class="text-center q-pa-md text-grey">
      {{
        readonly
          ? 'کلید پاسخی تنظیم نشده است.'
          : 'برای نمایش برگه پاسخ، تعداد سوالات و گزینه‌ها را وارد کنید.'
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'

const props = defineProps<{
  value?: any[];
  readonly?: boolean;
}>()

const emit = defineEmits<{
  (e: 'update:value', value: any[]): void;
}>()

const optionLabels = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی']
const maxOptions = optionLabels.length

const questionCount = ref(props.value?.length || 0)
const choiceCount = ref(4)
const answerKeys = ref<any[]>(props.value || [])
const isSyncingFromProps = ref(false)

watch(
  () => props.value,
  async (newVal) => {
    if (Array.isArray(newVal)) {
      isSyncingFromProps.value = true
      answerKeys.value = newVal
      if (newVal.length > 0) {
        questionCount.value = newVal.length
        const firstKey = newVal[0]
        if (firstKey?.number_of_choices) {
          // choiceCount.value = Number(firstKey.number_of_choices)
        } else if (firstKey && firstKey.correct_option) {
          const optionNum = Number(firstKey.correct_option)
          if (optionNum >= 2 && optionNum <= maxOptions) {
            // choiceCount.value = optionNum
          }
        }
      }
      await nextTick()
      isSyncingFromProps.value = false
    }
  },
  { deep: true }
)

watch([questionCount, choiceCount], () => {
  if (isSyncingFromProps.value || props.readonly) return
  answerKeys.value = []
  regenerateAnswerKeys()
})

watch(
  answerKeys,
  (newVal) => {
    if (props.readonly) return
    emit('update:value', newVal)
  },
  { deep: true }
)

const effectiveChoiceCount = computed(() => {
  const maxFromKeys = answerKeys.value.reduce((max, key) => {
    const n = Number(key.number_of_choices) || 0
    return n > max ? n : max
  }, 0)
  return Math.max(choiceCount.value, maxFromKeys, 2)
})

const tableColumns = computed(() => {
  const cols = [
    {
      name: 'question_number',
      label: 'شماره سوال',
      field: 'question_number',
      align: 'center' as const
    },
    {
      name: 'number_of_choices',
      label: 'تعداد گزینه',
      field: 'number_of_choices',
      align: 'center' as const
    }
  ]
  for (let i = 0; i < effectiveChoiceCount.value; i++) {
    cols.push({
      name: String(i + 1),
      label: optionLabels[i],
      field: String(i + 1),
      align: 'center' as const
    })
  }
  cols.push(
    { name: 'weight', label: 'وزن', field: 'weight', align: 'center' as const },
    {
      name: 'has_negative_mark',
      label: 'نمره منفی',
      field: 'has_negative_mark',
      align: 'center' as const
    }
  )
  return cols
})

// وضعیت سه‌حالته چک‌باکس هدر: true (همه فعال)، false (همه غیرفعال)، null (ترکیبی/indeterminate)
const allNegativeMarksState = computed<boolean | null>(() => {
  if (!answerKeys.value.length) return false

  const trueCount = answerKeys.value.filter((k) => !!k.has_negative_mark).length

  if (trueCount === answerKeys.value.length) return true
  if (trueCount === 0) return false
  return null // Quasar در مقدار null به صورت خودکار حالت indeterminate (خط تیره) رو نشون میده
})

// با کلیک، اگر همه فعال باشند غیرفعال میشن، در غیر این صورت (چه خالی و چه بینابینی) همه فعال میشن
function toggleAllNegativeMarks (newVal: boolean | null) {
  if (props.readonly || !answerKeys.value.length) return

  // اگر قبلاً همه انتخاب بودن، هدف ما False کردنه، وگرنه True
  const targetState = allNegativeMarksState.value === true ? false : true

  answerKeys.value.forEach((row) => {
    row.has_negative_mark = targetState
  })

  // تریگر برای watch عمیق و به‌روزرسانی v-model/emit
  answerKeys.value = [...answerKeys.value]
}

function regenerateAnswerKeys () {
  if (questionCount.value <= 0) {
    answerKeys.value = []
    return
  }

  const newKeys: any[] = []

  for (let i = 1; i <= questionCount.value; i++) {
    const existingKey = answerKeys.value.find((k) => k.question_number === i)
    newKeys.push({
      question_number: i,
      correct_option: existingKey?.correct_option ?? '1',
      number_of_choices: existingKey?.number_of_choices ?? choiceCount.value,
      weight: existingKey?.weight ?? 1,
      has_negative_mark: existingKey?.has_negative_mark ?? true,
      is_active: existingKey?.is_active ?? true
    })
  }

  answerKeys.value = newKeys
}

function onChangeCorrectOption (key: any) {
  answerKeys.value = [...answerKeys.value]
}

function toggleCorrectOption (row: any, option: string) {
  if (row.correct_option == option) {
    row.correct_option = null
  } else {
    row.correct_option = option
  }
  onChangeCorrectOption(row)
}
</script>

<style scoped></style>
