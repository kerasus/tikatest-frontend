<template>
  <div class="exam-answer-key-editor">
    <!-- نوار شیشه‌ای تنظیمات بالای جدول (در حالت ادیت) -->
    <div
      v-if="!readonly"
      class="editor-config-bar q-mb-md">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-sm-6 col-md-4">
          <div class="crystal-config-input">
            <q-input
              v-model.number="questionCount"
              label="تعداد کل سوالات"
              outlined
              dense
              type="number"
              min="1"
              max="100"
              :rules="[(val) => val > 0 || 'تعداد سوالات باید بیشتر از صفر باشد']">
              <template #prepend>
                <q-icon
                  name="format_list_numbered"
                  color="indigo-7" />
              </template>
              <template #append>
                <span class="text-caption text-weight-bold text-indigo-9">سوال</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <div class="crystal-config-input">
            <q-input
              v-model.number="choiceCount"
              label="تعداد گزینه‌های پیش‌فرض"
              outlined
              dense
              type="number"
              min="2"
              max="10"
              :rules="[(val) => val >= 2 || 'حداقل ۲ گزینه نیاز است']">
              <template #prepend>
                <q-icon
                  name="rule"
                  color="purple-7" />
              </template>
              <template #append>
                <span class="text-caption text-weight-bold text-purple-9">گزینه</span>
              </template>
            </q-input>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="editor-info-chip">
            <q-icon
              name="touch_app"
              size="18px"
              class="q-mr-xs text-primary pulse-anim" />
            <span>برای تعیین کلید صحیح، روی گزینه مورد نظر کلیک کنید.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- جدول آب‌نباتی کلید پاسخ‌ها -->
    <div
      v-if="answerKeys.length"
      class="candy-table-container">
      <q-table
        :columns="tableColumns"
        :rows="answerKeys"
        row-key="question_number"
        :rows-per-page-options="[0]"
        flat
        dense
        class="candy-key-table"
        separator="none"
        hide-pagination>

        <!-- اسلات هدر ستون نمره منفی همراه با چک‌باکس گروهی -->
        <template #header-cell-has_negative_mark="headerProps">
          <q-th
            :props="headerProps"
            class="th-negative">
            <div class="row items-center justify-center no-wrap q-gutter-xs">
              <span>{{ headerProps.col.label }}</span>
              <q-checkbox
                v-if="!readonly && answerKeys.length > 0"
                :model-value="allNegativeMarksState"
                dense
                color="deep-purple-6"
                size="xs"
                @update:model-value="toggleAllNegativeMarks">
                <q-tooltip>
                  فعال / غیرفعال‌سازی نمره منفی تمام سوالات
                </q-tooltip>
              </q-checkbox>
            </div>
          </q-th>
        </template>

        <!-- بدنه سلول‌های جدول -->
        <template #body-cell="cellProps">
          <!-- شماره سوال -->
          <q-td
            v-if="cellProps.col.name === 'question_number'"
            :props="cellProps">
            <div class="row items-center justify-center">
              <span class="q-num-badge">
                {{ cellProps.row.question_number }}
              </span>
            </div>
          </q-td>

          <!-- تعداد گزینه برای هر سوال -->
          <q-td
            v-else-if="cellProps.col.name === 'number_of_choices'"
            :props="cellProps">
            <div class="row items-center justify-center">
              <q-input
                v-if="!readonly"
                v-model.number="cellProps.row.number_of_choices"
                type="number"
                min="2"
                max="10"
                dense
                outlined
                class="mini-table-input"
                @update:model-value="onChangeCorrectOption(cellProps.row)" />
              <span
                v-else
                class="count-pill">
                {{ cellProps.row.number_of_choices ?? 4 }} گزینه
              </span>
            </div>
          </q-td>

          <!-- وزن / ضریب سوال -->
          <q-td
            v-else-if="cellProps.col.name === 'weight'"
            :props="cellProps">
            <div class="row items-center justify-center">
              <q-input
                v-if="!readonly"
                v-model.number="cellProps.row.weight"
                type="number"
                min="1"
                dense
                outlined
                class="mini-table-input"
                @update:model-value="onChangeCorrectOption(cellProps.row)" />
              <span
                v-else
                class="weight-badge">
                {{ cellProps.row.weight ?? 1 }}
              </span>
            </div>
          </q-td>

          <!-- نمره منفی -->
          <q-td
            v-else-if="cellProps.col.name === 'has_negative_mark'"
            :props="cellProps">
            <div class="row items-center justify-center">
              <q-checkbox
                v-if="!readonly"
                v-model="cellProps.row.has_negative_mark"
                dense
                color="deep-purple-6"
                @update:model-value="onChangeCorrectOption(cellProps.row)" />
              <span
                v-else
                class="neg-mark-pill"
                :class="cellProps.row.has_negative_mark ? 'neg-mark-pill--active' : 'neg-mark-pill--inactive'">
                <q-icon
                  :name="cellProps.row.has_negative_mark ? 'check' : 'close'"
                  size="12px"
                  class="q-mr-xs" />
                {{ cellProps.row.has_negative_mark ? 'دارد' : 'ندارد' }}
              </span>
            </div>
          </q-td>

          <!-- گزینه‌ها (الف، ب، ج، د و ...) با حباب تعاملی شیشه‌ای -->
          <q-td
            v-else
            :props="cellProps"
            :class="{ 'cursor-default': readonly, 'cursor-pointer': !readonly }"
            @click="!readonly && toggleCorrectOption(cellProps.row, cellProps.col.name)">
            <div
              v-if="Number(cellProps.col.name) <= (cellProps.row.number_of_choices || choiceCount)"
              class="row items-center justify-center">
              <div
                class="option-bubble"
                :class="{
                  'option-bubble--selected': cellProps.row.correct_option == cellProps.col.name,
                  'option-bubble--readonly': readonly
                }">
                <template v-if="!readonly">
                  <span class="option-bubble__label">{{ cellProps.col.label }}</span>
                  <q-icon
                    v-if="cellProps.row.correct_option == cellProps.col.name"
                    name="check"
                    size="14px"
                    class="option-bubble__check" />
                </template>
                <template v-else>
                  <q-icon
                    :name="cellProps.row.correct_option == cellProps.col.name ? 'check_circle' : 'circle'"
                    :size="cellProps.row.correct_option == cellProps.col.name ? '20px' : '10px'"
                    :class="cellProps.row.correct_option == cellProps.col.name ? 'text-positive' : 'text-grey-4'" />
                </template>
              </div>
            </div>
            <div
              v-else
              class="text-grey-4 text-caption text-center">
              -
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- وضعیت خالی (Empty State) -->
    <div
      v-else
      class="key-empty-state q-pa-xl text-center">
      <div class="key-empty-bubble q-mb-md">
        <q-icon
          name="fact_check"
          size="38px"
          color="indigo-6" />
      </div>
      <div class="text-subtitle1 text-weight-bolder text-grey-9">
        {{ readonly ? 'کلید پاسخی برای این آزمون ثبت نشده است' : 'تنظیم و ایجاد پاسخنامه تستی' }}
      </div>
      <div class="text-caption text-grey-6 q-mt-xs">
        {{ readonly ? 'پس از برگزاری آزمون یا توسط طراح، کلید سوالات نمایش داده خواهد شد.' : 'برای رسم جدول پاسخنامه، تعداد سوالات و تعداد گزینه‌ها را در بالا مشخص کنید.' }}
      </div>
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

<style scoped lang="scss">
@keyframes softPulse {
  0% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.85; }
}

.pulse-anim {
  animation: softPulse 2s infinite ease-in-out;
}

.exam-answer-key-editor {
  position: relative;
}

/* نوار تنظیمات بالای جدول */
.editor-config-bar {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 14px;
  padding: 12px 16px;
}

.crystal-config-input {
  background: #ffffff;
  border-radius: 10px;
}

.editor-info-chip {
  display: flex;
  align-items: center;
  font-size: 11.5px;
  color: #4338ca;
  background: rgba(99, 102, 241, 0.1);
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px dashed #a5b4fc;
}

/* محفظه جدول کلید آب‌نباتی */
.candy-table-container {
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 8px 24px -10px rgba(79, 70, 229, 0.08);
}

.candy-key-table {
  /* استایل هدر جدول */
  :deep(thead tr th) {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    color: #1e293b;
    font-weight: 900;
    font-size: 12px;
    padding: 10px 8px;
    border-bottom: 2px solid #cbd5e1;
    letter-spacing: -0.2px;
  }

  /* ردیف‌های جدول به صورت یک‌درمیان و هاور نرم */
  :deep(tbody tr) {
    transition: background-color 0.18s ease;

    &:nth-child(even) {
      background-color: #fafafa;
    }

    &:hover {
      background-color: #f5f3ff !important;
    }

    td {
      padding: 8px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 12.5px;
    }
  }
}

/* شماره سوال با پلاک گرد */
.q-num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 900;
  font-size: 12px;
  border: 1px solid #c7d2fe;
}

/* ورودی‌های کوچک داخل سطرها */
.mini-table-input {
  max-width: 68px;
  background: #ffffff;
  border-radius: 6px;

  :deep(.q-field__control) {
    height: 32px;
    min-height: 32px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: 800;
    text-align: center;
  }
}

.count-pill {
  font-size: 11px;
  font-weight: 800;
  color: #475569;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
}

.weight-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  padding: 2px 6px;
  border-radius: 6px;
  background: #fef3c7;
  color: #b45309;
  font-weight: 900;
  font-size: 12px;
}

/* بج نمره منفی */
.neg-mark-pill {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;

  &--active {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.25);
  }

  &--inactive {
    background: rgba(16, 185, 129, 0.12);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.25);
  }
}

/* حباب گزینه (Interactive Option Bubble) */
.option-bubble {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 32px;
  border-radius: 9px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  color: #64748b;
  font-weight: 800;
  font-size: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  user-select: none;

  &:hover:not(.option-bubble--readonly) {
    border-color: #818cf8;
    background: #eef2ff;
    color: #4f46e5;
    transform: scale(1.08);
  }

  &--selected {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
    border-color: #4338ca !important;
    color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.38) !important;
    transform: scale(1.05);

    .option-bubble__label {
      color: #ffffff;
    }
  }

  &--readonly {
    cursor: default;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  &__check {
    margin-right: 2px;
  }
}

/* حالت خالی جدول */
.key-empty-state {
  background: linear-gradient(135deg, #faf5ff 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1.5px dashed #cbd5e1;
}

.key-empty-bubble {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.15);
}
</style>
