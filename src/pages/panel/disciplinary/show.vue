<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات مورد انضباطی</h4>
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else-if="record">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">دانش آموز:</div>
              <div class="text-body1">{{ record.student?.full_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نوع مورد:</div>
              <div class="text-body1">{{ record.disciplinaryCase?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ واقعه:</div>
              <div class="text-body1">{{ record.incident_date || '-' }}</div>
            </div>
            <div class="col-12" v-if="record.description">
              <div class="text-subtitle2">توضیحات:</div>
              <div class="text-body1">{{ record.description }}</div>
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
import { disciplinaryRecord } from 'src/repositories/disciplinaryRecord'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const record = ref<any>(null)

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await disciplinaryRecord.get(id)
    record.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات مورد انضباطی' })
  } finally {
    loading.value = false
  }
})
</script>
