<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ویرایش تکلیف</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Homework.Show', params: { id: routeId } }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="homeworkForm">
      <homework-detail-card
        v-model:homework="homeworkForm"
        :editable="true" />

      <div class="row q-mt-md">
        <div class="col-12">
          <q-btn
            color="primary"
            label="ذخیره تغییرات"
            :loading="saving"
            @click="onSubmit" />
          <q-btn
            flat
            label="انصراف"
            :to="{ name: 'Panel.Homework.Show', params: { id: routeId } }"
            class="q-ml-sm" />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import HomeworkDetailCard from 'src/components/homework/HomeworkDetailCard.vue'
import { buildHomeworkFormData, validateHomework } from 'src/composables/useHomeworkForm'
import type { HomeworkType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const routeId = computed(() => Number(route.params.id))

const homeworkForm = ref<Partial<HomeworkType>>({})
const loading = ref(true)
const saving = ref(false)

async function loadHomework () {
  loading.value = true
  try {
    homeworkForm.value = await homeworkApi.get(routeId.value)
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات تکلیف.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function onSubmit () {
  if (!validateHomework(homeworkForm.value)) {
    $q.notify({ icon: 'warning', message: 'عنوان و درس الزامی هستند.', color: 'warning' })
    return
  }

  saving.value = true
  try {
    const fd = buildHomeworkFormData(homeworkForm.value)
    await homeworkApi.update(routeId.value, fd)

    $q.notify({
      icon: 'check',
      message: 'تکلیف با موفقیت به‌روز شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Homework.Show', params: { id: routeId.value } })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در به‌روزرسانی تکلیف.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadHomework()
})
</script>
