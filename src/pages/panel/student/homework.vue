<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">تکالیف من</h4>

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
      v-else-if="homeworks.length === 0"
      class="text-center q-pa-lg">
      <q-icon
        name="assignment"
        size="100px"
        color="primary" />
      <p class="text-subtitle1 q-mt-md">هیچ تکلیفی برای شما موجود نیست</p>
    </div>

    <!-- Homeworks List -->
    <div
      v-else
      class="row q-col-gutter-md">
      <div
        v-for="homework in homeworks"
        :key="homework.id"
        class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-start q-col-gutter-md">
              <div class="col">
                <h6 class="q-ma-none q-mb-sm">{{ homework.title }}</h6>
                <p class="q-ma-none q-mb-md text-caption text-grey">
                  {{ homework.description }}
                </p>
                <div class="row q-col-gutter-md">
                  <div class="col-auto">
                    <strong>درس:</strong> {{ homework.lesson?.name || '-' }}
                  </div>
                  <div class="col-auto">
                    <strong>مهلت:</strong> {{ formatDate(homework.due_date) }}
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getStatusColor(homework)"
                  text-color="white"
                  :label="getStatusLabel(homework)" />
                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="visibility"
                    color="primary"
                    :to="{ name: 'Student.Homework.Show', params: { id: homework.id } }" />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator v-if="homework.owners?.length > 0" />

          <q-card-section v-if="homework.owners?.length > 0">
            <strong>وضعیت تکلیف:</strong>
            <q-list
              v-for="owner in homework.owners"
              :key="owner.id"
              class="q-mt-md">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <q-chip
                      :color="owner.submitted_at ? 'positive' : 'info'"
                      text-color="white"
                      :label="owner.submitted_at ? 'ارسال شده' : 'در انتظار ارسال'" />
                  </q-item-label>
                  <q-item-label
                    v-if="owner.submitted_at"
                    caption>
                    زمان ارسال: {{ formatDate(owner.submitted_at) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-mt-md text-center">
      <q-btn
        label="تکالیف ارسال شده"
        color="secondary"
        :to="{ name: 'Student.Homework.Submissions' }" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkOwnerType } from 'src/repositories/homework'

const $q = useQuasar()

const homeworks = ref<(HomeworkType & { owners?: HomeworkOwnerType[] })[]>([])
const loading = ref(true)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getStatusColor = (homework: any): string => {
  if (!homework.owners?.length) return 'info'
  const owner = homework.owners[0]
  if (owner.submitted_at) return 'positive'
  return 'info'
}

const getStatusLabel = (homework: any): string => {
  if (!homework.owners?.length) return 'در انتظار ارسال'
  const owner = homework.owners[0]
  if (owner.submitted_at) return 'ارسال شده'
  return 'در انتظار ارسال'
}

const loadHomeworks = async () => {
  loading.value = true
  try {
    const response = await new HomeworkAPI().myHomework({ length: 100 })
    homeworks.value = response.data || []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری تکالیف'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHomeworks()
})
</script>

<style lang="scss" scoped></style>
