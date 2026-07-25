<template>
  <div class="academic-level-show-page">
    <q-card v-if="levelData">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">جزئیات مقطع</div>
          <q-btn
            color="primary"
            label="ویرایش"
            :to="{ name: 'Panel.AcademicLevel.Edit', params: { id: levelData.id } }" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">نام مقطع:</div>
            <div class="text-body1">{{ levelData.name }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">رشته:</div>
            <div class="text-body1">{{ levelData.academicField?.name || '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">مدرسه:</div>
            <div class="text-body1">{{ levelData.school?.name || '-' }}</div>
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
import AcademicLevelAPI from 'src/repositories/academicLevel'
import type { AcademicLevelType } from 'src/repositories/academicLevel'

const levelApi = new AcademicLevelAPI()

const route = useRoute()
const $q = useQuasar()

const levelData = ref<AcademicLevelType | null>(null)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  try {
    levelData.value = await levelApi.get(id)
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری اطلاعات مقطع'
    })
  }
})
</script>

<style lang="scss" scoped>
.academic-level-show-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
