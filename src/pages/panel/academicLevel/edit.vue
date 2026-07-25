<template>
  <div class="academic-level-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ویرایش مقطع</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.field_id"
                :options="fieldOptions"
                option-value="id"
                option-label="name"
                label="رشته *"
                outlined
                emit-value
                map-options
                :rules="[value => !!value || 'رشته الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="نام مقطع *"
                outlined
                :rules="[value => !!value || 'نام مقطع الزامی است']" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="بروزرسانی مقطع"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.AcademicLevel.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import AcademicFieldAPI from 'src/repositories/academicField'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { AcademicFieldType } from 'src/repositories/academicField'

const levelApi = new AcademicLevelAPI()
const fieldApi = new AcademicFieldAPI()

const route = useRoute()
const $q = useQuasar()

const saving = ref(false)

const form = reactive({
  field_id: null as number | null,
  name: null as string | null
})

const fieldOptions = ref<AcademicFieldType[]>([])

onMounted(async () => {
  try {
    const [fieldResult, level] = await Promise.all([
      fieldApi.index({ length: 100 }),
      levelApi.get(parseInt(route.params.id as string))
    ])
    fieldOptions.value = fieldResult.data
    form.field_id = level.field_id
    form.name = level.name
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری اطلاعات مقطع'
    })
  }
})

async function onSubmit () {
  saving.value = true
  try {
    await levelApi.update(parseInt(route.params.id as string), form as any)
    $q.notify({
      icon: 'check',
      message: 'مقطع با موفقیت بروزرسانی شد.',
      color: 'positive'
    })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بروزرسانی مقطع.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.academic-level-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
