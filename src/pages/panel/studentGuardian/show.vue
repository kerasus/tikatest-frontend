<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات وصی نگهبان دانش‌آموزی</h4>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="guardian">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">وصی:</div>
              <div class="text-body1">{{ guardian.user?.full_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">دانش‌آموز:</div>
              <div class="text-body1">{{ guardian.studentProfile?.user?.full_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نوع رابطه:</div>
              <div class="text-body1">{{ getRelationshipLabel(guardian.relationship_type) }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">شغل:</div>
              <div class="text-body1">{{ guardian.job || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تماس اصلی:</div>
              <div class="text-body1">{{ guardian.is_primary_contact ? 'بله' : 'خیر' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ ثبت:</div>
              <div class="text-body1">{{ guardian.created_at || '-' }}</div>
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
import { studentGuardian } from 'src/repositories/studentGuardian'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const guardian = ref<any>(null)

const relationshipLabels: Record<string, string> = {
  father: 'پدر',
  mother: 'مادر',
  guardian: 'سایر'
}

function getRelationshipLabel (value: string | null): string {
  if (!value) return '-'
  return relationshipLabels[value] || value
}

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await studentGuardian.get(id)
    guardian.value = response
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری وصی نگهبان' })
  } finally {
    loading.value = false
  }
})
</script>
