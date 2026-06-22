<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات نمره</h4>
      </div>
      <div class="col-auto">
        <q-btn color="primary" label="ویرایش" :to="{ name: 'Panel.Grade.Edit', params: { id: grade?.id } }" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else-if="grade">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">دانش آموز:</div>
              <div class="text-body1">{{ grade.student?.full_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">درس:</div>
              <div class="text-body1">{{ grade.lesson?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">کلاس:</div>
              <div class="text-body1">{{ grade.schoolClass?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ:</div>
              <div class="text-body1">{{ grade.gregorian_date || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نوع نمره:</div>
              <div class="text-body1">{{ getGradeTypeLabel(grade.grade_type) }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نمره خام:</div>
              <div class="text-body1">{{ grade.raw_grade ?? '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نمره محاسبه شده:</div>
              <div class="text-body1">{{ grade.calculated_grade ?? '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نمره Z:</div>
              <div class="text-body1">{{ grade.z_score ?? '-' }}</div>
            </div>
            <div class="col-12 col-md-6" v-if="grade.explanation">
              <div class="text-subtitle2">توضیحات:</div>
              <div class="text-body1">{{ grade.explanation }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { grade } from 'src/repositories/grade'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const gradeData = ref<any>(null)

const gradeTypeMap: Record<string, string> = {
  class_quiz: 'آزمون کلاسی',
  monthly_quiz: 'آزمون ماهانه',
  mid_term_1: 'میان ترم اول',
  continuous_1: 'مستمر اول',
  final_1: 'پایان ترم اول',
  mid_term_2: 'میان ترم دوم',
  continuous_2: 'مستمر دوم',
  final_2: 'پایان ترم دوم',
  other: 'سایر',
}

const getGradeTypeLabel = (value: string | null): string => {
  return gradeTypeMap[value || ''] || value || '-'
}

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await grade.get(id)
    gradeData.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری جزئیات نمره' })
  } finally {
    loading.value = false
  }
})
</script>
