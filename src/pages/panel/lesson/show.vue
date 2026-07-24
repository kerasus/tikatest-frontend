<template>
  <div class="lesson-show-page">
    <q-card v-if="lessonData">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">جزئیات درس</div>
          <q-btn
            color="primary"
            label="ویرایش"
            :to="{ name: 'Panel.Lesson.Edit', params: { id: lessonData.id } }" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">نام درس:</div>
            <div class="text-body1">{{ lessonData.name }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">مدرسه:</div>
            <div class="text-body1">{{ lessonData.school?.name || '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">کلاس:</div>
            <div class="text-body1">{{ lessonData.schoolClass?.name || '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">ترتیب نمایش:</div>
            <div class="text-body1">{{ lessonData.order ?? '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">ضریب کارنامه:</div>
            <div class="text-body1">{{ lessonData.coefficient ?? '-' }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import LessonAPI from 'src/repositories/lesson'
import type { LessonType } from 'src/repositories/lesson'

const lessonApi = new LessonAPI()

const route = useRoute()
const $q = useQuasar()

const lessonData = ref<LessonType | null>(null)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  try {
    lessonData.value = await lessonApi.get(id)
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری اطلاعات درس'
    })
  }
})
</script>

<style lang="scss" scoped>
.lesson-show-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
