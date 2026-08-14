<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch, onMounted, nextTick } from 'vue'
import { useAppLayout } from 'stores/appLayout'
import { useAppConfig } from 'stores/appConfig'
import { useOnlineExamSession } from 'src/stores/onlineExamSession'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'
import moment from 'jalali-moment'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const appLayoutStore = useAppLayout()
const appConfigManager = useAppConfig()
const startAPI = new OnlineExamSessionAPI()
const onlineExamStore = useOnlineExamSession()

const optionLabels = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی']

const session = computed(() => onlineExamStore.sessionData)
const answerKeys = computed(() => onlineExamStore.answerKeys ?? null)
const isReadonly = computed(
  () => route.name === 'Student.Exam.Result' || !onlineExamStore.isActive
)

const answerColumns = computed(() => {
  const cols = [
    {
      name: 'question_number',
      label: 'شماره سوال',
      field: 'question_number',
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
  return cols
})

const currentRouteName = computed(() => route.name)

const effectiveChoiceCount = computed(() => {
  if (!answerKeys.value) return 4
  const maxFromKeys = answerKeys.value.reduce((max, key) => {
    const n = Number(key.number_of_choices) || 0
    return n > max ? n : max
  }, 0)
  return Math.max(maxFromKeys, 2)
})

function toggleLeftDrawer () {
  appLayoutStore.layoutLeftDrawerMiniToOverlay = $q.screen.lt.md
  appLayoutStore.layoutLeftDrawerMini = !appLayoutStore.layoutLeftDrawerMini
}

function toggleLeftDrawerVisible () {
  appLayoutStore.layoutLeftDrawerMiniToOverlay = false
  appLayoutStore.layoutLeftDrawerVisible = !appLayoutStore.layoutLeftDrawerVisible
}

const isChoiceEnabled = (row: any, choiceIndex: number) => {
  const maxChoices = Number(row.number_of_choices) || effectiveChoiceCount.value
  return choiceIndex >= 1 && choiceIndex <= maxChoices
}

const selectOption = (row: any, option: string) => {
  if (isReadonly.value) return

  const previous = row.submitted_option
  row.submitted_option = previous === option ? null : option

  submitAnswer(row.question_number, row.submitted_option)
}

const choiceIcon = (row: any, option: string) => {
  const isSelected = row.submitted_option === option
  const isCorrect = row.correct_option === option

  if (isSelected && isCorrect) return 'check_circle'
  if (isSelected) return 'cancel'
  if (isCorrect) return 'check_circle_outline'
  return 'radio_button_unchecked'
}

const choiceColor = (row: any, option: string) => {
  if (row.correct_option === option) return 'positive'
  if (row.submitted_option === option) return 'negative'
  return 'grey-4'
}

const submitAnswer = async (questionNumber: number, submittedOption: string | null) => {
  try {
    await startAPI.submitAnswer(session.value.id, questionNumber, submittedOption || undefined)
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'خطا در ذخیره پاسخ' })
  }
}

const confirmSubmit = () => {
  $q.dialog({
    title: 'تایید ثبت آزمون',
    message: 'آیا مطمئن هستید که می‌خواهید آزمون را ثبت کنید؟',
    cancel: true,
    persistent: true
  }).onOk(() => {
    submitSession()
  })
}

const submitSession = async () => {
  try {
    const currentSession = session.value
    await startAPI.submitSession(currentSession.id)
    $q.notify({ type: 'positive', message: 'آزمون با موفقیت ثبت شد' })
    onlineExamStore.clearSession()
    router.push({
      name: 'Student.Exam.Result',
      params: { id: currentSession.exam?.id ?? route.params.id }
    })
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'خطا در ثبت آزمون' })
  }
}

function checkLayoutLeftDrawerOverlay () {
  appLayoutStore.layoutLeftDrawerOverlay = !$q.screen.gt.md
}

watch(
  currentRouteName,
  () => {
    if ($q.screen.lt.md) {
      appLayoutStore.layoutLeftDrawerVisible = false
    }
  },
  {
    immediate: true
  }
)

const formatSessionDateTime = (value: string | null | undefined) => {
  if (!value) return '-'
  return moment(value).locale('fa').format('jYYYY/jMM/jDD HH:mm:ss')
}

watch(
  () => $q.screen.gt.md,
  () => {
    requestAnimationFrame(() => {
      checkLayoutLeftDrawerOverlay()
    })
  },
  { immediate: true }
)

onMounted(async () => {
  await nextTick()

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  checkLayoutLeftDrawerOverlay()
                })
              })
            })
          })
        })
      })
    })
  })
})
</script>

<template>
  <div
    class="left-drawer"
    :class="{ 'left-drawer--mini': appLayoutStore.layoutLeftDrawerMini }">
    <div class="left-drawer__inner">
      <div class="left-drawer__toggle-visible lt-md">
        <q-btn
          class="icon-button drawer-btn"
          color="primary"
          flat
          :icon="
            !appLayoutStore.layoutLeftDrawerVisible
              ? 'keyboard_double_arrow_left'
              : 'keyboard_double_arrow_right'
          "
          @click="toggleLeftDrawerVisible" />
      </div>
      <q-scroll-area class="scroll-area">
        <q-card>
          <q-table
            v-if="answerKeys"
            :columns="answerColumns"
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
                v-else
                :props="cellProps"
                :class="{
                  'cursor-pointer':
                    !isReadonly && isChoiceEnabled(cellProps.row, Number(cellProps.col.name)),
                }"
                @click="
                  !isReadonly &&
                    isChoiceEnabled(cellProps.row, Number(cellProps.col.name)) &&
                    selectOption(cellProps.row, cellProps.col.name)
                ">
                <div class="text-center">
                  <q-icon
                    v-if="isChoiceEnabled(cellProps.row, Number(cellProps.col.name))"
                    :name="
                      isReadonly
                        ? choiceIcon(cellProps.row, cellProps.col.name)
                        : cellProps.row.submitted_option === cellProps.col.name
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                    "
                    :color="
                      isReadonly
                        ? choiceColor(cellProps.row, cellProps.col.name)
                        : cellProps.row.submitted_option === cellProps.col.name
                          ? 'primary'
                          : 'grey-4'
                    "
                    size="24px" />
                  <span
                    v-else
                    class="text-grey-5">-</span>
                </div>
              </q-td>
            </template>
          </q-table>

          <q-separator />

          <q-card-section
            v-if="isReadonly && session"
            class="q-pb-none">
            <div class="row q-col-gutter-sm text-caption">
              <div class="col-6">
                <div class="text-grey-7">نمره</div>
                <div class="text-subtitle2">{{ session.score ?? 0 }}</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">درصد</div>
                <div class="text-subtitle2">{{ session.percent ?? 0 }}٪</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">زمان مصرف‌شده</div>
                <div class="text-subtitle2">{{ onlineExamStore.usedTimeSeconds ?? 0 }} ثانیه</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">وضعیت</div>
                <div class="text-subtitle2">{{ onlineExamStore.statusLabel }}</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">شروع</div>
                <div class="text-subtitle2 ltr">
                  {{ formatSessionDateTime(session.started_at) }}
                </div>
              </div>
              <div class="col-6">
                <div class="text-grey-7">پایان</div>
                <div class="text-subtitle2 ltr">
                  {{ formatSessionDateTime(session.submitted_at) }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator v-if="isReadonly && session" />

          <q-card-section
            v-if="isReadonly"
            class="text-caption">
            <div class="row items-center q-gutter-sm">
              <q-icon
                name="check_circle_outline"
                color="positive" />
              <span>پاسخ صحیح</span>
              <q-icon
                name="cancel"
                color="negative" />
              <span>پاسخ انتخاب‌شده نادرست</span>
            </div>
          </q-card-section>

          <q-card-actions
            v-else
            align="right">
            <q-btn
              flat
              icon="send"
              label="اتمام و ثبت"
              color="positive"
              @click="confirmSubmit" />
          </q-card-actions>
        </q-card>
      </q-scroll-area>
      <div class="left-drawer__copyright-section">
        <div class="app-version">v: {{ appConfigManager.version }}</div>
        <div class="copy-right">
          <span> Copyright TikaTest co. </span>
          <span> &copy; {{ new Date().getFullYear() }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-drawer {
  background: $gray-100;
  width: 100%;
  height: 100%;
  position: relative;
  .left-drawer__inner {
    background: $gray-100;
    padding: $space-4 $space-2;
    border-radius: 0 $radius-6 $radius-6 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    .left-drawer__toggle-visible {
    }
    :deep(.scroll-area) {
      flex: 1;
      .q-scrollarea__container {
        .q-scrollarea__content {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
    .left-drawer__copyright-section {
      padding-left: $space-4;
      color: #67748e;
      font-size: 11px;
      direction: rtl;
      text-align: left;
      .app-version {
      }
      .copy-right {
      }
    }
  }
  &.left-drawer--mini {
    .left-drawer__inner {
      :deep(.scroll-area) {
        flex: 1;
        .q-scrollarea__container {
          .q-scrollarea__content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
      }
      .left-drawer__copyright-section {
        display: flex;
        flex-direction: column;
        span {
          text-align: justify;
        }
      }
    }
  }
}
:deep(.q-expansion-item--expanded) {
  color: $primary;
  .q-expansion-item__container {
    .q-icon {
      color: $primary;
    }
  }
}
:deep(.q-table__container) {
  .q-table__middle .q-table {
    thead tr th {
      height: 0;
      padding: 0;
    }
    tbody tr td {
      height: 0;
      padding: 0;
      border-bottom-width: 1px;
    }
  }
}
</style>
