<template>
  <div class="school-show-page">
    <q-card v-if="schoolData">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">جزئیات مدرسه</div>
          <q-btn
            color="primary"
            label="ویرایش"
            :to="{ name: 'Panel.School.Edit', params: { id: schoolData.id } }" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">کد مدرسه:</div>
            <div class="text-body1">{{ schoolData.code }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">نام مدرسه:</div>
            <div class="text-body1">{{ schoolData.name }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">نوع:</div>
            <div class="text-body1">{{ schoolData.type === 'school' ? 'مدرسه' : 'موسسه' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">آدرس:</div>
            <div class="text-body1">{{ schoolData.address || '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">وب‌سایت:</div>
            <div class="text-body1">{{ schoolData.website || '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">آدرس حساب کاربری:</div>
            <div class="text-body1">{{ schoolData.account_url || '-' }}</div>
          </div>
          <div
            v-if="schoolData.logo_url"
            class="col-12 col-md-6">
            <div class="text-subtitle2">لوگو:</div>
            <q-img
              :src="schoolData.logo_url"
              style="max-width: 200px; max-height: 200px;"
              contain />
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
import SchoolAPI from 'src/repositories/school'
import type { SchoolType } from 'src/repositories/school'

const schoolApi = new SchoolAPI()

const route = useRoute()
const $q = useQuasar()

const schoolData = ref<SchoolType | null>(null)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  try {
    schoolData.value = await schoolApi.get(id)
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری اطلاعات مدرسه'
    })
  }
})
</script>

<style lang="scss" scoped>
.school-show-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
