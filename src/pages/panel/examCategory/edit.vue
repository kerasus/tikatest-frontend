<template>
  <q-card class="exam-category-form-page">
    <q-card-section>
      <div class="text-h6">{{ label }}</div>
      <div
        v-if="school?.name"
        class="text-caption text-grey">
        {{ school.name }}
      </div>
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
            :label="editingId ? 'بروزرسانی' : 'ثبت'"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { examCategory } from 'src/repositories/examCategory'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const examCategoryApi = examCategory
const schoolApi = new SchoolAPI()

const label = ref('تعریف دسته‌بندی آزمون')
const editingId = ref<number | null>(null)
const submitting = ref(false)
const school = ref<SchoolType | null>(null)

const form = ref({
  title: null as string | null,
  term_number: null as number | null,
  sort_order: 0 as number,
  is_system: false as boolean
})

async function loadCategory () {
  if (route.params.id) {
    const id = parseInt(route.params.id as string)
    editingId.value = id
    label.value = 'ویرایش دسته‌بندی آزمون'
    const data = await examCategoryApi.get(id)
    form.value.title = data.title
    form.value.term_number = data.term_number
    form.value.sort_order = data.sort_order ?? 0
    form.value.is_system = data.is_system ?? false
    if (data.school_id) {
      school.value = await schoolApi.get(data.school_id)
    }
  }
}

async function onSubmit () {
  if (!form.value.title) return

  submitting.value = true
  try {
    const payload = {
      title: form.value.title,
      term_number: form.value.term_number,
      sort_order: form.value.sort_order,
      is_system: form.value.is_system
    }

    if (editingId.value) {
      await examCategoryApi.update(editingId.value, payload as any)
      $q.notify({ type: 'positive', message: 'بروزرسانی شد' })
    } else {
      await examCategoryApi.create(payload as any)
      $q.notify({ type: 'positive', message: 'ثبت شد' })
    }

    router.push({ name: 'Panel.ExamCategory.List' })
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در ذخیره' })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCategory()
})
</script>

<style lang="scss" scoped>
.exam-category-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
