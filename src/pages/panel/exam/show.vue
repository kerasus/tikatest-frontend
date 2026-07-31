<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات آزمون</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="بازگشت"
          :to="{ name: 'Panel.Exam.List' }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="examItem">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام آزمون:</div>
              <div class="text-body1">{{ examItem.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">درس:</div>
              <div class="text-body1">{{ examItem.lesson?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">دسته‌بندی:</div>
              <div class="text-body1">{{ examItem.category?.title || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نوع تحویل:</div>
              <div class="text-body1">
                <q-chip
                  :color="examItem.delivery_mode === 'online' ? 'primary' : 'secondary'"
                  text-color="white"
                  dense>
                  {{ examItem.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
                </q-chip>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">حداقل نمره قبولی:</div>
              <div class="text-body1">{{ examItem.min_passing_score ?? '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">حداکثر نمره:</div>
              <div class="text-body1">{{ examItem.max_score ?? '-' }}</div>
            </div>
            <div
              v-if="examItem.inPersonDetail"
              class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ برگزاری:</div>
              <div class="text-body1">{{ examItem.inPersonDetail.held_at || '-' }}</div>
            </div>
            <div
              v-if="examItem.inPersonDetail"
              class="col-12 col-md-6">
              <div class="text-subtitle2">نوع توصیفی:</div>
              <div class="text-body1">{{ examItem.inPersonDetail.is_descriptive ? 'بله' : 'خیر' }}</div>
            </div>
            <div
              v-if="examItem.onlineDetail"
              class="col-12 col-md-6">
              <div class="text-subtitle2">زمان شروع:</div>
              <div class="text-body1">{{ examItem.onlineDetail.starts_at || '-' }}</div>
            </div>
            <div
              v-if="examItem.onlineDetail"
              class="col-12 col-md-6">
              <div class="text-subtitle2">زمان پایان:</div>
              <div class="text-body1">{{ examItem.onlineDetail.ends_at || '-' }}</div>
            </div>
            <div
              v-if="examItem.onlineDetail"
              class="col-12 col-md-6">
              <div class="text-subtitle2">زمان محدودیت (دقیقه):</div>
              <div class="text-body1">{{ examItem.onlineDetail.time_limit_minutes ?? '-' }}</div>
            </div>
            <div
              v-if="examItem.description"
              class="col-12">
              <div class="text-subtitle2">توضیحات:</div>
              <div class="text-body1">{{ examItem.description }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">کلیدهای پاسخ آنلاین</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            v-if="examItem.answerKeys?.length"
            :rows="examItem.answerKeys"
            :columns="answerKeyColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }">
            <template #body-cell-is_active="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.is_active ? 'positive' : 'grey'"
                  text-color="white"
                  dense>
                  {{ props.row.is_active ? 'فعال' : 'غیرفعال' }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
          <div
            v-else
            class="text-center q-pa-md text-grey">
            کلید پاسخی ثبت نشده است.
          </div>
        </q-card-section>
      </q-card>

      <q-card v-if="examItem.grades?.length">
        <q-card-section>
          <div class="text-h6">نمرات ثبت شده ({{ examItem.grades.length }})</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            :rows="examItem.grades"
            :columns="gradeColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }">
            <template #body-cell-student="props">
              <q-td :props="props">
                {{ props.row.student?.full_name || '-' }}
              </q-td>
            </template>
            <template #body-cell-class="props">
              <q-td :props="props">
                {{ props.row.schoolClass?.name || '-' }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam } from 'src/repositories/exam'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const examItem = ref<any>(null)

const answerKeyColumns = [
  { name: 'question_number', label: 'شماره سوال', field: 'question_number', align: 'center' as const },
  { name: 'correct_option', label: 'گزینه صحیح', field: 'correct_option', align: 'center' as const },
  { name: 'weight', label: 'وزن', field: 'weight', align: 'center' as const },
  { name: 'has_negative_mark', label: 'نمره منفی', field: 'has_negative_mark', align: 'center' as const },
  { name: 'is_active', label: 'وضعیت', field: 'is_active', align: 'center' as const }
]

const gradeColumns = [
  { name: 'student', label: 'دانش آموز', field: 'student', align: 'center' as const },
  { name: 'class', label: 'کلاس', field: 'class', align: 'center' as const },
  { name: 'raw_grade', label: 'نمره خام', field: 'raw_grade', align: 'center' as const },
  { name: 'calculated_grade', label: 'نمره محاسبه شده', field: 'calculated_grade', align: 'center' as const },
  { name: 'z_score', label: 'Z نمره', field: 'z_score', align: 'center' as const }
]

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await exam.get(id)
    examItem.value = response
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات آزمون' })
  } finally {
    loading.value = false
  }
})
</script>
