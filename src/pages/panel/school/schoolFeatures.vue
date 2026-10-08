<template>
  <div class="school-features-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">مدیریت ویژگی‌های مدرسه</div>
            <div class="text-caption text-grey">{{ school?.name || 'در حال بارگذاری...' }}</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="refresh"
              label="بروزرسانی"
              :loading="loading"
              @click="loadData" />
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="ویژگی جدید"
              @click="openDialog()" />
          </div>
          <div
            v-if="userStore.isAdmin"
            class="col-auto">
            <q-btn
              outline
              color="primary"
              icon="list"
              label="لیست مدارس"
              :to="{ name: 'Panel.School.List' }" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list
          v-if="features.length"
          bordered
          separator
          class="rounded-borders">
          <q-item
            v-for="feature in features"
            :key="feature.id ?? feature.feature_key">
            <q-item-section avatar>
              <q-icon
                :name="feature.feature_key === SchoolFeatureKey.Skyroom ? 'video_camera_front' : 'dashboard_customize'"
                color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ featureLabel(feature.feature_key) }}</q-item-label>
              <q-item-label caption>
                تاریخ انقضا: {{ feature.expires_at ? feature.expires_at.split('T')[0] : 'بدون محدودیت' }}
              </q-item-label>
              <q-item-label
                v-if="feature.settings && Object.keys(feature.settings).length"
                caption>
                تنظیمات: {{ JSON.stringify(feature.settings) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row items-center no-wrap">
                <q-chip
                  :color="feature.is_enabled ? 'positive' : 'grey'"
                  text-color="white"
                  dense>
                  {{ feature.is_enabled ? 'فعال' : 'غیرفعال' }}
                </q-chip>
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="primary"
                  @click="openDialog(feature)" />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="removeFeature(feature)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-else-if="!loading"
          class="text-center text-grey q-pa-xl">
          <q-icon
            name="extension"
            size="72px"
            color="grey-4" />
          <div class="q-mt-md">هیچ ویژگی‌ای برای مدرسه ثبت نشده است.</div>
        </div>
        <div
          v-if="loading"
          class="text-center q-pa-xl">
          <q-spinner
            color="primary"
            size="64px" />
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog.show">
      <q-card style="width: 560px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ dialog.edit ? 'ویرایش ویژگی مدرسه' : 'ویژگی جدید مدرسه' }}</div>
          <q-space />
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveFeature">
            <q-select
              v-model="dialog.form.feature_key"
              outlined
              emit-value
              map-options
              option-label="label"
              option-value="value"
              :options="schoolFeatureOptions"
              label="نوع ویژگی *"
              :rules="[(value) => !!value || 'نوع ویژگی الزامی است']" />
            <form-builder-date
              v-model:value="dialog.form.expires_at"
              outlined
              label="تاریخ انقضا" />
            <q-input
              v-model="dialog.form.settingsText"
              outlined
              type="textarea"
              autogrow
              label="تنظیمات JSON"
              hint='مثال: {"sender":"service-name"}'
              dir="ltr"
              :error="!!settingsError"
              :error-message="settingsError" />
            <q-toggle
              v-model="dialog.form.is_enabled"
              label="ویژگی فعال است" />
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                flat
                label="انصراف"
                @click="dialog.show = false" />
              <q-btn
                type="submit"
                color="primary"
                :label="dialog.edit ? 'بروزرسانی' : 'ثبت'"
                :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import SchoolFeatureAPI, {
  SCHOOL_FEATURE_LABELS,
  SchoolFeatureKey,
  schoolFeatureOptions,
  type SchoolFeatureSettingsType,
  type SchoolFeatureType
} from 'src/repositories/schoolFeature'

const $q = useQuasar()
const route = useRoute()
const userStore = useUser()
const currentSchoolManager = useCurrentSchool()
const schoolApi = new SchoolAPI()

const loading = ref(false)
const saving = ref(false)
const settingsError = ref('')
const school = ref<SchoolType | null>(null)
const features = ref<SchoolFeatureType[]>([])

const schoolId = computed<number | null>(() => {
  if (route.params.id) return Number(route.params.id)
  return currentSchoolManager.currentSchool.value?.id ?? null
})

const dialog = reactive({
  show: false,
  edit: false,
  form: {
    id: null as number | null,
    feature_key: null as SchoolFeatureKey | null,
    is_enabled: true,
    settingsText: '',
    expires_at: null as string | null
  }
})

function featureLabel (key: SchoolFeatureKey | null): string {
  return key ? SCHOOL_FEATURE_LABELS[key] : 'ویژگی نامشخص'
}

function openDialog (feature?: SchoolFeatureType) {
  settingsError.value = ''
  dialog.edit = !!feature
  dialog.form = {
    id: feature?.id ?? null,
    feature_key: feature?.feature_key ?? null,
    is_enabled: feature?.is_enabled ?? true,
    settingsText: feature?.settings ? JSON.stringify(feature.settings, null, 2) : '',
    expires_at: feature?.expires_at?.split('T')[0] ?? null
  }
  dialog.show = true
}

function parseSettings (): SchoolFeatureSettingsType | null | undefined {
  settingsError.value = ''
  if (!dialog.form.settingsText.trim()) return null
  try {
    const value = JSON.parse(dialog.form.settingsText)
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      settingsError.value = 'تنظیمات باید یک شیء JSON باشد.'
      return undefined
    }
    return value
  } catch {
    settingsError.value = 'ساختار JSON معتبر نیست.'
    return undefined
  }
}

async function loadData () {
  if (!schoolId.value) return
  loading.value = true
  try {
    const featureApi = new SchoolFeatureAPI(schoolId.value)
    const [schoolResponse, featureResponse] = await Promise.all([
      schoolApi.get(schoolId.value),
      featureApi.index({ length: 1000, sortation_field: 'created_at', sortation_order: 'desc' })
    ])
    school.value = schoolResponse
    features.value = featureResponse.data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری ویژگی‌های مدرسه' })
  } finally {
    loading.value = false
  }
}

async function saveFeature () {
  if (!schoolId.value || !dialog.form.feature_key) return
  const settings = parseSettings()
  if (settings === undefined) return

  saving.value = true
  try {
    const featureApi = new SchoolFeatureAPI(schoolId.value)
    const payload: SchoolFeatureType = {
      ...featureApi.defaultObject,
      feature_key: dialog.form.feature_key,
      is_enabled: dialog.form.is_enabled,
      settings,
      expires_at: dialog.form.expires_at
    }
    if (dialog.edit && dialog.form.id) {
      await featureApi.update(dialog.form.id, payload)
    } else {
      await featureApi.create(payload)
    }
    dialog.show = false
    await loadData()
    $q.notify({ type: 'positive', message: 'ویژگی مدرسه با موفقیت ذخیره شد.' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در ذخیره ویژگی مدرسه' })
  } finally {
    saving.value = false
  }
}

function removeFeature (feature: SchoolFeatureType) {
  if (!schoolId.value || !feature.id) return
  $q.dialog({
    title: 'حذف ویژگی مدرسه',
    message: `آیا از حذف «${featureLabel(feature.feature_key)}» مطمئن هستید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await new SchoolFeatureAPI(schoolId.value!).delete(feature.id!)
      await loadData()
      $q.notify({ type: 'positive', message: 'ویژگی مدرسه حذف شد.' })
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'خطا در حذف ویژگی مدرسه' })
    }
  })
}

onMounted(loadData)
</script>

<style scoped>
.school-features-page {
  width: 100%;
  margin: 0 auto;
}
</style>
