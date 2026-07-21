<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">پیشخوان</h4>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section>
              <div class="text-subtitle2">نمرات اخیر</div>
              <div class="text-h4 text-primary">{{ stats.recent_grades?.length || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section>
              <div class="text-subtitle2">جلسات مطالعه این ماه (دقیقه)</div>
              <div class="text-h4 text-positive">{{ stats.total_study_minutes_this_month || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section>
              <div class="text-subtitle2">تکالیف در انتظار</div>
              <div class="text-h4 text-warning">{{ stats.pending_homework_count || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section>
              <div class="text-subtitle2">موارد انضباطی اخیر</div>
              <div class="text-h4 text-negative">{{ stats.recent_disciplinary?.length || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">نمرات اخیر</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-table
                v-if="stats.recent_grades && stats.recent_grades.length > 0"
                :rows="stats.recent_grades"
                :columns="gradeColumns"
                row-key="id"
                :pagination="{ rowsPerPage: 5 }">
                <template #body-cell-lesson="props">
                  <q-td :props="props">{{ props.row.lesson?.name || '-' }}</q-td>
                </template>
                <template #body-cell-raw_grade="props">
                  <q-td :props="props">
                    <span :class="props.row.raw_grade >= (props.row.min_grade || 10) ? 'text-positive' : 'text-negative'">
                      {{ props.row.raw_grade }}
                    </span>
                  </q-td>
                </template>
              </q-table>
              <div
                v-else
                class="text-center q-pa-lg">
                <p>هنوز نمره‌ای ثبت نشده است</p>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">جلسات مطالعه اخیر</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-table
                v-if="stats.recent_study_sessions && stats.recent_study_sessions.length > 0"
                :rows="stats.recent_study_sessions"
                :columns="studyColumns"
                row-key="id"
                :pagination="{ rowsPerPage: 5 }">
                <template #body-cell-lesson="props">
                  <q-td :props="props">{{ props.row.lesson?.name || '-' }}</q-td>
                </template>
                <template #body-cell-duration="props">
                  <q-td :props="props">{{ props.row.duration_minutes || 0 }} دقیقه</q-td>
                </template>
              </q-table>
              <div
                v-else
                class="text-center q-pa-lg">
                <p>هنوز جلسه‌ای ثبت نشده است</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { student } from 'src/repositories/student'

const $q = useQuasar()
const loading = ref(true)
const stats = ref<any>({})

const gradeColumns = [
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'raw_grade', label: 'نمره', field: 'raw_grade', align: 'center' as const },
  { name: 'grade_type', label: 'نوع', field: 'grade_type', align: 'center' as const }
]

const studyColumns = [
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'started_at', label: 'تاریخ', field: 'started_at', align: 'center' as const },
  { name: 'duration', label: 'مدت', field: 'duration', align: 'center' as const }
]

onMounted(async () => {
  loading.value = true
  try {
    const response = await student.dashboard()
    stats.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات پیشخوان' })
  } finally {
    loading.value = false
  }
})
</script>
