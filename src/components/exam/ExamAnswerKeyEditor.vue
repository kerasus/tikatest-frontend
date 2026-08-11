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
          label="تعداد گزینه"
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
      <template #body-cell="cellProps">
        <q-td
          v-if="cellProps.col.name === 'question_number'"
          :props="cellProps">
          <div class="text-center">
            {{ cellProps.row.question_number }}
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
              :color="cellProps.row.has_negative_mark ? 'warning' : 'info'"
              text-color="white"
              dense>
              {{ cellProps.row.has_negative_mark ? 'ندارد' : 'دارد' }}
            </q-chip>
          </div>
        </q-td>
        <q-td
          v-else
          :props="cellProps"
          :class="{ 'cursor-default': readonly, 'cursor-pointer': !readonly }"
          @click="!readonly && toggleCorrectOption(cellProps.row, cellProps.col.name)">
          <div class="text-center">
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
        if (firstKey && firstKey.correct_option) {
          const optionNum = Number(firstKey.correct_option)
          if (optionNum >= 2 && optionNum <= maxOptions) {
            choiceCount.value = optionNum
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

const tableColumns = computed(() => {
  const cols = [
    {
      name: 'question_number',
      label: 'شماره سوال',
      field: 'question_number',
      align: 'center' as const
    }
  ]
  for (let i = 0; i < choiceCount.value; i++) {
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
      weight: existingKey?.weight ?? 1,
      has_negative_mark: existingKey?.has_negative_mark ?? false,
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
