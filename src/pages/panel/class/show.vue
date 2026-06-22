<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات کلاس</h4>
      </div>
      <div class="col-auto">
        <q-btn color="primary" label="ویرایش" :to="{ name: 'Panel.Class.Edit', params: { id: schoolClass?.id } }" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else-if="schoolClass">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام کلاس:</div>
              <div class="text-body1">{{ schoolClass.name }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">رشته:</div>
              <div class="text-body1">{{ schoolClass.academicField?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">پایه:</div>
              <div class="text-body1">{{ schoolClass.academicLevel?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تعداد دانش آموزان:</div>
              <div class="text-body1">{{ students.length }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">دانش آموزان این کلاس</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            :rows="students"
            :columns="studentColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-name="{ props }">
              <q-td :props="props">
                {{ props.row.full_name || `${props.row.firstname || ''} ${props.row.lastname || ''}` }}
              </q-td>
            </template>
            <template #body-cell-actions="{ props }">
              <q-td :props="props">
                <q-btn flat round dense icon="visibility" color="info" size="sm" :to="{ name: 'Panel.Student.Show', params: { id: props.row.id } }" />
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
import { schoolClass } from 'src/repositories/schoolClass'
import { student } from 'src/repositories/student'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const schoolClassData = ref<any>(null)
const students = ref<any[]>([])

const studentColumns = [
  { name: 'name', label: 'نام و نام خانوادگی', field: 'name', align: 'center' as const },
  { name: 'username', label: 'نام کاربری', field: 'username', align: 'center' as const },
  { name: 'student_phone', label: 'شماره تلفن', field: 'student_phone', align: 'center' as const },
  { name: 'actions', label: 'عملیات', field: 'actions', align: 'center' as const },
]

const loadData = async () => {
  loading.value = true
  try {
    const classId = parseInt(route.params.id as string)
    const [classRes, studentsRes] = await Promise.all([
      schoolClass.get(classId),
      student.index({ class_ids: [classId], length: 200 }),
    ])
    schoolClassData.value = classRes
    students.value = studentsRes.data.data || []
    // Load relations if not loaded
    if (!schoolClassData.value.academicField) {
      const refreshed = await schoolClass.get(classId)
      schoolClassData.value = refreshed
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات کلاس' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
