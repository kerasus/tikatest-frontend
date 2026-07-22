<template>
  <div class="school-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ویرایش مدرسه</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-card
          v-if="loading"
          class="q-pa-lg text-center">
          <q-spinner
            color="primary"
            size="80px" />
          <div class="q-mt-md">در حال بارگذاری...</div>
        </q-card>

        <q-form
          v-else
          @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.code"
                label="کد مدرسه *"
                outlined
                :rules="[value => !!value || 'کد الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="نام مدرسه *"
                outlined
                :rules="[value => !!value || 'نام الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.type"
                :options="typeOptions"
                label="نوع *"
                outlined
                emit-value
                map-options
                :rules="[value => !!value || 'نوع الزامی است']" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.address"
                label="آدرس"
                outlined
                type="textarea" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.website"
                label="وب‌سایت"
                outlined
                hint="مثال: https://school.example.com" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.account_url"
                label="آدرس حساب کاربری"
                outlined
                hint="مثال: https://school.example.com/account" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.logo_url"
                label="آدرس لوگو"
                outlined
                hint="مسیر فایل لوگو" />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 q-mb-sm">لوگو (تصویر)</div>
              <input
                ref="logoInput"
                type="file"
                accept="image/*"
                @change="onLogoSelected">
              <div
                v-if="form.logo_file"
                class="q-mt-sm text-caption">
                فایل انتخاب شده: {{ form.logo_file.name }}
              </div>
              <div
                v-if="form.logo_url && !form.logo_file"
                class="q-mt-sm text-caption text-grey-7">
                لوگوی فعلی: {{ form.logo_url }}
              </div>
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ذخیره تغییرات"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.School.Show', params: { id: route.params.id } }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import SchoolAPI from 'src/repositories/school'

const schoolApi = new SchoolAPI()

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const loading = ref(false)
const saving = ref(false)
const logoInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  code: null as string | null,
  name: null as string | null,
  type: null as string | null,
  address: null as string | null,
  website: null as string | null,
  logo_url: null as string | null,
  account_url: null as string | null,
  logo_file: null as File | null
})

const typeOptions = [
  { label: 'مدرسه', value: 'school' },
  { label: 'موسسه', value: 'institute' }
]

function onLogoSelected (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.logo_file = target.files[0]
  }
}

function buildFormData (): FormData {
  const fd = new FormData()

  fd.append('code', form.code || '')
  fd.append('name', form.name || '')
  fd.append('type', form.type || '')
  fd.append('address', form.address || '')
  fd.append('website', form.website || '')
  fd.append('account_url', form.account_url || '')

  if (form.logo_file) {
    fd.append('logo', form.logo_file)
  }

  return fd
}

async function loadSchool () {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const data = await schoolApi.get(id)
    form.code = data.code
    form.name = data.name
    form.type = data.type
    form.address = data.address
    form.website = data.website
    form.logo_url = data.logo_url
    form.account_url = data.account_url
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات مدرسه',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function onSubmit () {
  saving.value = true
  try {
    const id = parseInt(route.params.id as string)
    const formData = buildFormData()
    await schoolApi.update(id, formData)
    $q.notify({
      icon: 'check',
      message: 'مدرسه با موفقیت بروزرسانی شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.School.Show', params: { id } })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بروزرسانی مدرسه.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSchool()
})
</script>

<style lang="scss" scoped>
.school-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
