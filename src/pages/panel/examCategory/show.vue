<template>
  <q-page class="exam-category-show-page">
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="80px" />
    </div>
    <template v-else-if="examCategoryData">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ examCategoryData.title }}</div>
              <div
                v-if="examCategoryData.school?.name"
                class="text-caption text-grey">
                مدرسه: {{ examCategoryData.school.name }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="text-subtitle2">شماره ترم</div>
                  <div>{{ examCategoryData.term_number ?? '-' }}</div>
                </div>
                <div class="col-6">
                  <div class="text-subtitle2">ترتیب نمایش</div>
                  <div>{{ examCategoryData.sort_order ?? '-' }}</div>
                </div>
                <div class="col-6">
                  <div class="text-subtitle2">نوع</div>
                  <q-chip
                    :color="examCategoryData.is_system ? 'positive' : 'grey'"
                    text-color="white"
                    dense>
                    {{ examCategoryData.is_system ? 'سیستمی' : 'سفارشی' }}
                  </q-chip>
                </div>
                <div class="col-6">
                  <div class="text-subtitle2">تاریخ ثبت</div>
                  <div>{{ formatDate(examCategoryData.created_at) }}</div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn
                color="primary"
                icon="edit"
                label="ویرایش"
                :to="{ name: 'Panel.ExamCategory.Edit', params: { id: examCategoryData.id } }" />
              <q-btn
                flat
                label="بازگشت"
                @click="goBack" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { examCategory } from 'src/repositories/examCategory'
import type { ExamCategoryType } from 'src/repositories/examCategory'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const examCategoryApi = examCategory

const loading = ref(false)
const examCategoryData = ref<ExamCategoryType | null>(null)

async function loadCategory () {
  const id = parseInt(route.params.id as string)
  if (!id || Number.isNaN(id)) return
  loading.value = true
  try {
    examCategoryData.value = await examCategoryApi.get(id)
  } catch (e) {
    $q.notify({ type: 'negative', message: 'خطا در دریافت اطلاعات' })
  } finally {
    loading.value = false
  }
}

function formatDate (iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('fa-IR')
}

function goBack () {
  router.push({ name: 'Panel.ExamCategory.List' })
}

onMounted(() => {
  loadCategory()
})
</script>

<style lang="scss" scoped>
.exam-category-show-page {
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
}
</style>
