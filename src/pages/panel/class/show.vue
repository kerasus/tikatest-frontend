<template>
  <div class="class-show-page">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ classData.name }}</div>
        <div class="text-grey-7 q-mt-sm">
          رشته: {{ classData.academicField?.name || '-' }} | پایه: {{ classData.academicLevel?.name || '-' }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6 q-mb-md">دانش آموزان این کلاس</div>
        <q-table
          :rows="students"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered>
          <template #body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar size="32px" class="q-ml-sm">
                  <img :src="props.row.picture || 'https://cdn.quasar.dev/img/avatar.png'" />
                </q-avatar>
                <span>{{ props.row.name }} {{ props.row.lastname }}</span>
              </div>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                icon="visibility"
                color="primary"
                :to="{ name: 'Panel.Student.Show', params: { id: props.row.id } }" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import SchoolClassAPI from 'src/repositories/schoolClass'
import StudentAPI from 'src/repositories/student'

const route = useRoute()
const $q = useQuasar()

const classData = ref<any>({})
const students = ref<any[]>([])
const loading = ref(false)

const columns = [
  { name: 'name', label: 'دانش آموز', align: 'right' as const },
  { name: 'username', label: 'نام کاربری', align: 'right' as const, field: 'username' },
  { name: 'student_phone', label: 'تلفن', align: 'right' as const, field: 'student_phone' },
  { name: 'actions', label: 'عملیات', align: 'center' as const }
]

onMounted(async () => {
  loading.value = true
  try {
    classData.value = await SchoolClassAPI.prototype.get(Number(route.params.id))
    const result = await StudentAPI.prototype.index({ class_ids: [Number(route.params.id)], length: 100 })
    students.value = result.data
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات کلاس.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
</style>
