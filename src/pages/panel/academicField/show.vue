<template>
  <div class="academic-field-show-page">
    <q-card v-if="fieldData">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">جزئیات رشته</div>
          <q-btn
            color="primary"
            label="ویرایش"
            :to="{ name: 'Panel.AcademicField.Edit', params: { id: fieldData.id } }" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">نام رشته:</div>
            <div class="text-body1">{{ fieldData.name }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">مدرسه:</div>
            <div class="text-body1">{{ fieldData.school?.name || '-' }}</div>
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
import AcademicFieldAPI from 'src/repositories/academicField'
import type { AcademicFieldType } from 'src/repositories/academicField'

const fieldApi = new AcademicFieldAPI()

const route = useRoute()
const $q = useQuasar()

const fieldData = ref<AcademicFieldType | null>(null)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  try {
    fieldData.value = await fieldApi.get(id)
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری اطلاعات رشته'
    })
  }
})
</script>

<style lang="scss" scoped>
.academic-field-show-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
