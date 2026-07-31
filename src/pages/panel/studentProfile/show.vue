<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات پروفایل دانش‌آموزی</h4>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="profile">
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">دانش‌آموز:</div>
              <div class="text-body1">{{ profile.user?.full_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">کد دانش‌آموزی:</div>
              <div class="text-body1">{{ profile.code || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">امتیاز XP:</div>
              <div class="text-body1">{{ profile.xp || 0 }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ ثبت:</div>
              <div class="text-body1">{{ profile.created_at || '-' }}</div>
            </div>
            <div
              v-if="profile.guardians && profile.guardians.length > 0"
              class="col-12">
              <div class="text-subtitle2">وصی نگهبانان:</div>
              <q-list>
                <q-item
                  v-for="guardian in profile.guardians"
                  :key="guardian.id">
                  <q-item-section>
                    <div class="text-subtitle2">{{ getRelationshipLabel(guardian.relationship_type) }}</div>
                    <div class="text-caption">{{ guardian.user?.full_name || '-' }} ({{ guardian.job || '-' }})</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { studentProfile } from 'src/repositories/studentProfile'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const loading = ref(true)
const profile = ref<any>(null)

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
    const response = await studentProfile.get(id)
    profile.value = response
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری پروفایل' })
  } finally {
    loading.value = false
  }
})
</script>
