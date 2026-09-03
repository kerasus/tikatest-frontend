<template>
  <q-card class="exam-category-form-page">
    <q-card-section>
      <div class="text-h6">تعریف دسته‌بندی آزمون</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input
              v-model="form.title"
              label="عنوان دسته‌بندی *"
              outlined
              :rules="[(v) => !!v || 'عنوان الزامی است']" />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="form.term_number"
              label="شماره ترم"
              type="number"
              outlined />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="form.sort_order"
              label="ترتیب نمایش"
              type="number"
              outlined />
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn
            type="submit"
            color="primary"
            label="ثبت"
            :loading="submitting" />
          <q-btn
            flat
            label="انصراف"
            class="q-ml-sm"
            :to="{ name: 'Panel.ExamCategory.List' }" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { examCategory } from 'src/repositories/examCategory'

const router = useRouter()
const $q = useQuasar()
const examCategoryApi = examCategory

const submitting = ref(false)

const form = ref({
  title: null as string | null,
  term_number: null as number | null,
  sort_order: 0 as number,
  is_system: false as boolean
})

async function onSubmit () {
  if (!form.value.title) return

  submitting.value = true
  try {
    await examCategoryApi.create({
      title: form.value.title,
      term_number: form.value.term_number,
      sort_order: form.value.sort_order,
      is_system: form.value.is_system
    } as any)
    $q.notify({ type: 'positive', message: 'ثبت شد' })
    router.push({ name: 'Panel.ExamCategory.List' })
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در ذخیره' })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.exam-category-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
