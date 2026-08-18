<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">تکالیف ارسال شده</h4>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="submissions.length === 0"
      class="text-center q-pa-lg">
      <q-icon
        name="assignment_turned_in"
        size="100px"
        color="primary" />
      <p class="text-subtitle1 q-mt-md">هیچ تکلیفی ارسال نشده است</p>
    </div>

    <!-- Submissions List -->
    <div
      v-else
      class="row q-col-gutter-md">
      <div
        v-for="item in submissions"
        :key="item.id"
        class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-start q-col-gutter-md">
              <div class="col">
                <h6 class="q-ma-none q-mb-sm">{{ item.homework?.title || 'تکلیف بدون عنوان' }}</h6>
                <p class="q-ma-none q-mb-md text-caption text-grey">
                  درس: {{ item.homework?.lesson?.name || '-' }}
                </p>
                <div class="row q-col-gutter-md">
                  <div class="col-auto">
                    <strong>زمان ارسال:</strong> {{ formatDate(item.submitted_at) }}
                  </div>
                  <div class="col-auto">
                    <strong>کلاس:</strong> {{ schoolClassName(item.homework) }}
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="item.submitted_at ? 'positive' : 'info'"
                  text-color="white"
                  :label="item.submitted_at ? 'ارسال شده' : 'در انتظار ارسال'" />
                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="visibility"
                    color="primary"
                    :to="{ name: 'Student.Homework.Show', params: { id: item.homework?.id } }" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkSubmissionType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()

const $q = useQuasar()

const submissions = ref<HomeworkSubmissionType[]>([])
const loading = ref(true)

const schoolClassName = (homework: any) => homework?.schoolClass?.name || '-'

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const loadSubmissions = async () => {
  loading.value = true
  try {
    const response = await homeworkApi.mySubmissions({ length: 100 })
    submissions.value = response.data.data || []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری تکالیف ارسال شده'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSubmissions()
})
</script>

<style lang="scss" scoped>
</style>
