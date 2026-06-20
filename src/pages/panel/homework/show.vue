<template>
  <div class="homework-detail-page">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ homeworkData.title }}</div>
        <div class="text-grey-7 q-mt-sm">
          درس: {{ homeworkData.lesson?.name || '-' }} | کلاس: {{ homeworkData.schoolClass?.name || '-' }}
        </div>
        <div class="q-mt-sm" v-if="homeworkData.description">
          <div class="text-subtitle2">توضیحات:</div>
          <p>{{ homeworkData.description }}</p>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'

const route = useRoute()
const $q = useQuasar()

const homeworkData = ref<any>({})

onMounted(async () => {
  try {
    homeworkData.value = await HomeworkAPI.prototype.get(Number(route.params.id))
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات تکلیف.',
      color: 'negative'
    })
  }
})
</script>

<style lang="scss" scoped>
</style>
