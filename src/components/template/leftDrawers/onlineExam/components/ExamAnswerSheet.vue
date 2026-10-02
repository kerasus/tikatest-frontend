<template>
  <q-list
    v-if="booklets.length"
    bordered
    class="rounded-borders overflow-hidden">
    <q-expansion-item
      v-for="booklet in booklets"
      :key="booklet.id"
      group="booklets"
      header-class="booklet-header"
      :default-opened="booklet.id === booklets[0]?.id"
      @show="selectedBookletId = booklet.id">
      <!-- هدر سفارشی برای هر دفترچه -->
      <template #header>
        <q-item-section avatar>
          <q-icon
            name="menu_book"
            color="primary" />
        </q-item-section>

        <q-item-section>
          <div class="text-subtitle2 text-weight-bold">
            {{ booklet.title || 'دفترچه آزمون' }}
          </div>
          <div class="text-caption text-grey-6">
            سوال {{ booklet.from_question }} تا {{ booklet.to_question }}
          </div>
        </q-item-section>

        <q-item-section side>
          <q-badge
            color="primary"
            outline
            class="q-py-xs">
            {{ getBookletProgress(booklet) }}
          </q-badge>
        </q-item-section>
      </template>

      <!-- بدنه: جدول پاسخنامه (فشرده) -->
      <q-card class="bg-grey-1">
        <q-card-section class="q-pa-none">
          <q-table
            v-if="answerKeys"
            :columns="answerColumns"
            :rows="bookletAnswerKeys(booklet).value"
            row-key="question_number"
            :rows-per-page-options="[0]"
            dense
            separator="cell"
            hide-pagination
            class="compact-table">
            <template #body-cell="cellProps">
              <q-td
                v-if="cellProps.col.name === 'question_number'"
                :props="cellProps">
                <div class="text-center">
                  {{ cellProps.row.question_number }}
                </div>
              </q-td>

              <q-td
                v-else-if="cellProps.col.name === 'unanswered'"
                :props="cellProps"
                :class="{ 'cursor-pointer': !readonly && !!cellProps.row.submitted_option }"
                @click="resetOption(cellProps.row)">
                <div class="text-center">
                  <q-icon
                    :name="
                      !cellProps.row.submitted_option
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'
                    "
                    :color="unansweredColor(cellProps.row)"
                    size="24px" />
                </div>
              </q-td>

              <q-td
                v-else
                :props="cellProps"
                :class="{
                  'cursor-pointer':
                    !readonly && isChoiceEnabled(cellProps.row, Number(cellProps.col.name)),
                }"
                @click="selectOption(cellProps.row, cellProps.col.name)">
                <div class="text-center">
                  <q-icon
                    v-if="isChoiceEnabled(cellProps.row, Number(cellProps.col.name))"
                    :name="choiceIcon(cellProps.row, cellProps.col.name)"
                    :color="choiceColor(cellProps.row, cellProps.col.name)"
                    size="24px" />
                  <span
                    v-else
                    class="text-grey-5">-</span>
                </div>
              </q-td>
            </template>
          </q-table>
          <div class="exam-legend-card q-pa-sm q-mb-md bg-grey-1 rounded-borders border">
            <div class="row items-center q-col-gutter-y-sm q-col-gutter-x-lg text-caption text-weight-medium">

              <!-- ۱. پاسخ صحیح انتخاب شده -->
              <div class="col-auto flex items-center q-gutter-x-xs">
                <q-icon
                  name="check_circle"
                  color="positive"
                  size="22px" />
                <span>پاسخ صحیح (انتخاب شما)</span>
              </div>

              <!-- ۲. کلید صحیح که انتخاب نشده -->
              <div class="col-auto flex items-center q-gutter-x-xs">
                <q-icon
                  name="check_circle_outline"
                  color="positive"
                  size="22px" />
                <span>کلید صحیح آزمون</span>
              </div>

              <!-- ۳. پاسخ نادرست انتخاب شده -->
              <div class="col-auto flex items-center q-gutter-x-xs">
                <q-icon
                  name="cancel"
                  color="negative"
                  size="22px" />
                <span>پاسخ نادرست (انتخاب شما)</span>
              </div>

              <!-- ۴. سوال بدون پاسخ -->
              <div class="col-auto flex items-center q-gutter-x-xs">
                <q-icon
                  name="radio_button_checked"
                  color="warning"
                  size="22px" />
                <span>سؤال بدون پاسخ</span>
              </div>

            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>

  <q-card
    v-else
    flat
    bordered
    class="rounded-borders overflow-hidden bg-grey-1">
    <q-card-section class="q-pa-none">
      <q-table
        v-if="answerKeys"
        :columns="answerColumns"
        :rows="filteredAnswerKeys"
        row-key="question_number"
        :rows-per-page-options="[0]"
        dense
        separator="cell"
        hide-pagination
        class="compact-table">
        <template #body-cell="cellProps">
          <q-td
            v-if="cellProps.col.name === 'question_number'"
            :props="cellProps">
            <div class="text-center">
              {{ cellProps.row.question_number }}
            </div>
          </q-td>

          <q-td
            v-else-if="cellProps.col.name === 'unanswered'"
            :props="cellProps"
            :class="{ 'cursor-pointer': !readonly && !!cellProps.row.submitted_option }"
            @click="resetOption(cellProps.row)">
            <div class="text-center">
              <q-icon
                :name="
                  !cellProps.row.submitted_option
                    ? 'radio_button_checked'
                    : 'radio_button_unchecked'
                "
                :color="unansweredColor(cellProps.row)"
                size="24px" />
            </div>
          </q-td>

          <q-td
            v-else
            :props="cellProps"
            :class="{
              'cursor-pointer':
                !readonly && isChoiceEnabled(cellProps.row, Number(cellProps.col.name)),
            }"
            @click="selectOption(cellProps.row, cellProps.col.name)">
            <div class="text-center">
              <q-icon
                v-if="isChoiceEnabled(cellProps.row, Number(cellProps.col.name))"
                :name="choiceIcon(cellProps.row, cellProps.col.name)"
                :color="choiceColor(cellProps.row, cellProps.col.name)"
                size="24px" />
              <span
                v-else
                class="text-grey-5">-</span>
            </div>
          </q-td>
        </template>
      </q-table>


      <div class="exam-legend-card q-pa-sm q-mb-md bg-grey-1 rounded-borders border">
        <div class="row items-center q-col-gutter-y-sm q-col-gutter-x-lg text-caption text-weight-medium">

          <!-- ۱. پاسخ صحیح انتخاب شده -->
          <div class="col-auto flex items-center q-gutter-x-xs">
            <q-icon
              name="check_circle"
              color="positive"
              size="22px" />
            <span>پاسخ صحیح (انتخاب شما)</span>
          </div>

          <!-- ۲. کلید صحیح که انتخاب نشده -->
          <div class="col-auto flex items-center q-gutter-x-xs">
            <q-icon
              name="check_circle_outline"
              color="positive"
              size="22px" />
            <span>کلید صحیح آزمون</span>
          </div>

          <!-- ۳. پاسخ نادرست انتخاب شده -->
          <div class="col-auto flex items-center q-gutter-x-xs">
            <q-icon
              name="cancel"
              color="negative"
              size="22px" />
            <span>پاسخ نادرست (انتخاب شما)</span>
          </div>

          <!-- ۴. سوال بدون پاسخ -->
          <div class="col-auto flex items-center q-gutter-x-xs">
            <q-icon
              name="radio_button_checked"
              color="warning"
              size="22px" />
            <span>سؤال بدون پاسخ</span>
          </div>

        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BookletType, OnlineExamAnswerKeyType } from 'src/repositories/exam'
import type {
  OnlineExamSessionResponseItemType
} from 'src/repositories/onlineExamSession'

const props = defineProps<{
  booklets: BookletType[];
  answerKeys: OnlineExamAnswerKeyType[] | null;
  sessionResponses: OnlineExamSessionResponseItemType[] | null;
  readonly: boolean;
}>()

const emit = defineEmits<{
  answerChanged: [questionNumber: number, submittedOption: string | null];
}>()

interface LocalOnlineExamAnswerKeyType extends OnlineExamAnswerKeyType {
  submitted_option: string | null
}

const optionLabels = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی']
const selectedBookletId = ref<number | null>(props.booklets[0]?.id ?? null)
const localOnlineExamAnswerKeys = ref<LocalOnlineExamAnswerKeyType[]>([])

const effectiveChoiceCount = computed(() => {
  if (!props.answerKeys) return 4

  const maxFromKeys = props.answerKeys.reduce((maximum, key) => {
    const choiceCount = Number(key.number_of_choices) || 0
    return choiceCount > maximum ? choiceCount : maximum
  }, 0)

  return Math.max(maxFromKeys, 2)
})

const answerColumns = computed(() => {
  const columns = [
    {
      name: 'question_number',
      label: 'شماره سوال',
      field: 'question_number',
      align: 'center' as const
    }
  ]

  for (let index = 0; index < effectiveChoiceCount.value; index++) {
    columns.push({
      name: String(index + 1),
      label: optionLabels[index] ?? String(index + 1),
      field: String(index + 1),
      align: 'center' as const
    })
  }

  columns.push({
    name: 'unanswered',
    label: 'بی‌پاسخ',
    field: 'unanswered',
    align: 'center' as const
  })

  return columns
})

const selectedBooklet = computed(() => {
  if (!props.booklets.length) return null
  if (selectedBookletId.value === null) return props.booklets[0] ?? null

  return props.booklets.find((booklet) => booklet.id === selectedBookletId.value) ?? null
})

const filteredAnswerKeys = computed(() => {
  const keys = props.answerKeys ?? []
  const booklet = selectedBooklet.value

  if (!booklet || booklet.from_question == null || booklet.to_question == null) {
    return keys
  }

  return keys.filter((key) => {
    const questionNumber = Number(key.question_number)
    return questionNumber >= booklet.from_question! && questionNumber <= booklet.to_question!
  })
})

// فیلتر کردن سوالات فقط برای همین دفترچه که در اکسپنشن باز است
const bookletAnswerKeys = (booklet: BookletType) => computed<LocalOnlineExamAnswerKeyType[]>(() => {
  if (!localOnlineExamAnswerKeys.value) return []
  return localOnlineExamAnswerKeys.value.filter((key) => {
    const qNum = Number(key.question_number)
    return qNum >= Number(booklet.from_question) && qNum <= Number(booklet.to_question)
  })
})

// محاسبه پیشرفت (مثلا ۶/۱۰) برای نمایش در هدر
function getBookletProgress (booklet: BookletType) {
  const keys = bookletAnswerKeys(booklet).value
  const sessionResponses = keys.map((i) => getSessionResponsesByQuestionNumber(i.question_number)).filter(Boolean)
  const answered = sessionResponses.filter((key) => key.submitted_option).length
  return `${answered}/${keys.length}`
}

function bookletQuestionCount (booklet?: BookletType) {
  if (!booklet) return '-'

  const fromQuestion = Number(booklet.from_question)
  const toQuestion = Number(booklet.to_question)
  if (!fromQuestion || !toQuestion || toQuestion < fromQuestion) return '-'

  return String(toQuestion - fromQuestion + 1)
}

function isChoiceEnabled (row: LocalOnlineExamAnswerKeyType, choiceIndex: number) {
  const maxChoices = Number(row.number_of_choices) || effectiveChoiceCount.value
  return choiceIndex >= 1 && choiceIndex <= maxChoices
}

function selectOption (row: LocalOnlineExamAnswerKeyType, option: string) {
  if (props.readonly || !isChoiceEnabled(row, Number(option))) return

  row.submitted_option = row.submitted_option === option ? null : option
  emitAnswerChange(row)
}

function resetOption (row: LocalOnlineExamAnswerKeyType) {
  if (props.readonly || !row.submitted_option) return

  row.submitted_option = null
  emitAnswerChange(row)
}

function emitAnswerChange (row: LocalOnlineExamAnswerKeyType) {
  if (row.question_number == null) return
  // localOnlineExamAnswerKeys.value.forEach((i) => {
  //   if (i.question_number === row.question_number) {
  //     i.submitted_option = row.submitted_option
  //   }
  // })
  emit('answerChanged', row.question_number, row.submitted_option ?? null)
}

function choiceIcon (row: LocalOnlineExamAnswerKeyType, option: string) {
  if (!props.readonly) {
    return row.submitted_option === option ? 'check_circle' : 'radio_button_unchecked'
  }

  const sessionResponse = getSessionResponsesByQuestionNumber(row.question_number)
  const isSelected = sessionResponse?.submitted_option === option
  const isCorrect = row.correct_option === option

  if (isSelected && isCorrect) return 'check_circle'
  if (isSelected) return 'cancel'
  if (isCorrect) return 'check_circle_outline'
  return 'radio_button_unchecked'
}

function choiceColor (row: LocalOnlineExamAnswerKeyType, option: string) {
  if (!props.readonly) {
    return row.submitted_option === option ? 'primary' : 'grey-4'
  }

  const sessionResponse = getSessionResponsesByQuestionNumber(row.question_number)
  if (row.correct_option === option) return 'positive'
  if (sessionResponse?.submitted_option === option) return 'negative'
  return 'grey-4'
}

function unansweredColor (row: LocalOnlineExamAnswerKeyType) {
  if (!row?.submitted_option) return props.readonly ? 'amber-8' : 'primary'
  return 'grey-4'
}

function getSessionResponsesByQuestionNumber (questionNumber: number): OnlineExamSessionResponseItemType | undefined {
  return props.sessionResponses.find((s) => s.question_number === questionNumber)
}

function getSubmittedOptionByQuestionNumber (questionNumber: number): string | undefined {
  const sessionResponse = getSessionResponsesByQuestionNumber(questionNumber)
  if (!sessionResponse) return undefined
  return sessionResponse.submitted_option
}

function resetLocalOnlineExamAnswerKeys () {
  if (!props.answerKeys) {
    localOnlineExamAnswerKeys.value = []
    return
  }
  localOnlineExamAnswerKeys.value = props.answerKeys.map((i) => ({ ...i, submitted_option: getSubmittedOptionByQuestionNumber(i.question_number) }))
}

watch(
  () => props.booklets,
  (booklets) => {
    resetLocalOnlineExamAnswerKeys()
    if (!booklets.length) {
      selectedBookletId.value = null
      return
    }

    const selectedBookletExists = booklets.some(
      (booklet) => booklet.id === selectedBookletId.value
    )

    if (!selectedBookletExists) {
      selectedBookletId.value = booklets[0]?.id ?? null
    }
  },
  { immediate: true }
)

watch( () => props.answerKeys,
       () => {
         resetLocalOnlineExamAnswerKeys()
       },
       { immediate: true }
)
</script>

<style scoped lang="scss">
.booklet-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
}
:deep(.q-expansion-item) {
  &:not(.menu-item) .q-expansion-item__container {
    .q-expansion-item__content > * {
      padding: 0;
    }
    .q-item .q-item__section .q-icon.q-expansion-item__toggle-icon {
      color: $neutral-60;
    }
  }
}
.compact-table {
  :deep(.q-table__middle) {
    // حذف پدینگ اضافه برای فشرده‌تر شدن
    padding: 0;
  }
}
.rounded-borders {
  border-radius: 12px;
}
:deep(.q-table__container) {
  .q-table__middle .q-table {
    thead tr th,
    tbody tr td {
      height: 0;
      padding: 0;
    }

    tbody tr td {
      border-bottom-width: 1px;
    }
  }
}
</style>
