<template>
  <div class="bale-studio-container q-pa-md q-pa-lg-lg">
    <!-- هدر فانتزی و پر زرق و برق -->
    <div class="studio-header q-mb-lg">
      <div class="header-glass-card row items-center justify-between q-pa-md">
        <div class="row items-center q-gutter-x-md">
          <div class="header-icon-badge">
            <q-icon
              name="send"
              class="flying-plane" />
            <span class="pulsing-orbit" />
          </div>
          <div>
            <div class="row items-center q-gutter-x-sm">
              <h1 class="studio-title text-h6 text-weight-bolder text-white q-my-none">
                استودیوی ارسال پیام بله به دانش‌آموزان
              </h1>
              <q-badge
                color="positive"
                class="status-pill text-weight-bold"
                rounded>
                <q-icon
                  name="bolt"
                  size="12px"
                  class="q-mr-xs" />
                سریع و مستقیم
              </q-badge>
            </div>
            <p class="studio-subtitle q-mb-none q-mt-xs">
              مخاطبان هدف را با فیلترهای هوشمند جدا کن و با جلوه‌های جذاب در بله غوغا به پا کن!
            </p>
          </div>
        </div>

        <div class="header-meta gt-sm row items-center q-gutter-x-sm">
          <div class="bale-brand-chip">
            <q-avatar
              size="24px"
              class="bg-white">
              <q-icon
                name="chat"
                color="positive"
                size="16px" />
            </q-avatar>
            <span class="text-caption text-weight-bold text-white">پیام‌رسان سازمانی بله</span>
          </div>
        </div>
      </div>
    </div>

    <!-- بدنه اصلی دو ستونه (فیلترها + استودیو و پیش‌نمایش زنده) -->
    <div class="row q-col-gutter-lg">
      <!-- ستون سمت راست: فیلترهای هدف‌گیری مخاطبان (تارگتینگ) -->
      <div class="col-12 col-lg-7">
        <q-card
          flat
          class="glass-panel filter-panel">
          <div class="panel-header row items-center justify-between q-pa-md">
            <div class="row items-center q-gutter-x-sm">
              <div class="panel-icon-wrap bg-primary-gradient">
                <q-icon
                  name="tune"
                  size="18px"
                  color="white" />
              </div>
              <div>
                <span class="text-subtitle1 text-weight-bolder text-dark">فیلتر و هدف‌گیری هوشمند</span>
                <div class="text-caption text-grey-7">دانش‌آموزان دریافت‌کننده را تعیین کن</div>
              </div>
            </div>

            <q-btn
              v-if="hasFilters"
              flat
              dense
              no-caps
              size="sm"
              color="negative"
              icon="restart_alt"
              label="پاکسازی فیلترها"
              class="reset-btn"
              @click="resetAllFilters" />
          </div>

          <q-separator class="faint-separator" />

          <q-card-section class="q-pa-md">
            <!-- بخش ساختار آموزشی مدرسه -->
            <div class="section-label-chip q-mb-sm">
              <q-icon
                name="account_balance"
                size="14px"
                class="q-mr-xs" />
              <span>ساختار آموزشی و کلاسی</span>
            </div>

            <div class="row q-col-gutter-sm q-mb-md">
              <div
                v-if="!currentSchoolId"
                class="col-12">
                <div class="input-card-wrap">
                  <form-builder-select-school
                    v-model:value="filters.school_id"
                    label="مدرسه مورد نظر"
                    outlined
                    dense
                    bg-color="white"
                    class="custom-form-builder"
                    @update:value="onSchoolChange" />
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="input-card-wrap">
                  <form-builder-select-academic-field
                    :key="filters.school_id ?? 'all-schools'"
                    v-model:value="filters.field_id"
                    label="رشته تحصیلی"
                    outlined
                    dense
                    bg-color="white"
                    class="custom-form-builder"
                    :school-id="filters.school_id"
                    @update:value="onFieldChange" />
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="input-card-wrap">
                  <form-builder-select-academic-level
                    :key="`${filters.school_id ?? 'all'}-${filters.field_id ?? 'all'}`"
                    v-model:value="filters.academic_level_id"
                    label="پایه تحصیلی"
                    outlined
                    dense
                    bg-color="white"
                    class="custom-form-builder"
                    :school-id="filters.school_id"
                    :field-id="filters.field_id"
                    @update:value="onLevelChange" />
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="input-card-wrap">
                  <form-builder-select-school-class
                    :key="`${filters.school_id ?? 'all'}-${filters.field_id ?? 'all'}-${filters.academic_level_id ?? 'all'}`"
                    v-model:value="filters.class_id"
                    label="کلاس مشخص"
                    outlined
                    dense
                    bg-color="white"
                    class="custom-form-builder"
                    :school-id="filters.school_id"
                    :field-id="filters.field_id"
                    :level-id="filters.academic_level_id" />
                </div>
              </div>
            </div>

            <!-- بخش فیلترهای هویتی و انفرادی -->
            <div class="section-label-chip q-mb-sm">
              <q-icon
                name="person_search"
                size="14px"
                class="q-mr-xs" />
              <span>فیلتر انفرادی و مشخصات فردی (اختیاری)</span>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6 col-md-3">
                <form-builder-input
                  v-model:value="filters.first_name"
                  label="نام"
                  outlined
                  dense
                  bg-color="white"
                  class="custom-form-builder" />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <form-builder-input
                  v-model:value="filters.last_name"
                  label="نام خانوادگی"
                  outlined
                  dense
                  bg-color="white"
                  class="custom-form-builder" />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <form-builder-input
                  v-model:value="filters.national_id"
                  label="کد ملی"
                  outlined
                  dense
                  bg-color="white"
                  class="custom-form-builder" />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <form-builder-input
                  v-model:value="filters.username"
                  label="نام کاربری"
                  outlined
                  dense
                  bg-color="white"
                  class="custom-form-builder" />
              </div>
            </div>

            <!-- خلاصه شاخص‌های هدف‌گیری فعلی -->
            <div class="active-criteria-box q-mt-md">
              <div class="row items-center justify-between">
                <div class="row items-center q-gutter-x-xs text-caption text-weight-bold text-primary">
                  <q-icon name="radar" />
                  <span>شاخص هدف‌گیری:</span>
                </div>
                <span
                  class="text-caption"
                  :class="hasFilters ? 'text-positive text-weight-bolder' : 'text-negative text-weight-medium'">
                  {{ hasFilters ? 'حداقل یک فیلتر فعال است' : 'هیچ فیلتری انتخاب نشده!' }}
                </span>
              </div>
              <p class="hint-text q-mb-none q-mt-xs">
                🛡️ توجه: پیام‌ها به صورت خودکار تنها به کاربرانی مخابره می‌شوند که اکانت فعال
                <strong>بله</strong> آن‌ها در سامانه ست شده باشد.
              </p>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- ستون سمت چپ: ادیتور نگارش پیام + پیش‌نمایش بالن چت بله -->
      <div class="col-12 col-lg-5">
        <div class="column q-gutter-y-md">
          <!-- ادیتور نگارش پیام -->
          <q-card
            flat
            class="glass-panel editor-panel">
            <div class="panel-header row items-center justify-between q-pa-md">
              <div class="row items-center q-gutter-x-sm">
                <div class="panel-icon-wrap bg-purple-gradient">
                  <q-icon
                    name="edit_note"
                    size="20px"
                    color="white" />
                </div>
                <span class="text-subtitle1 text-weight-bolder text-dark">نگارش محتوای پیام</span>
              </div>
              <div class="char-count-pill text-caption">
                {{ body.trim().length }} کاراکتر
              </div>
            </div>

            <q-separator class="faint-separator" />

            <q-card-section class="q-pa-md">
              <!-- نوار قالب‌های آماده سریع (Quick Snippets) -->
              <div class="snippets-bar row items-center q-gutter-xs q-mb-sm">
                <span class="text-caption text-grey-8 text-weight-bold q-mr-xs">قالب سریع:</span>
                <q-btn
                  dense
                  unelevated
                  size="xs"
                  label="📢 آزمون آنلاین"
                  class="snippet-chip"
                  @click="insertSnippet('دانش‌آموز گرامی، آزمون جدید شما در سامانه سنجاد بارگذاری شد. لطفاً به موقع شرکت کنید.')" />
                <q-btn
                  dense
                  unelevated
                  size="xs"
                  label="📝 تحویل تکلیف"
                  class="snippet-chip"
                  @click="insertSnippet('مهلت ارسال تکلیف تا پایان ساعت ۲۴ امشب تمدید شد. سریع‌تر نسبت به ارسال اقدام فرمایید.')" />
                <q-btn
                  dense
                  unelevated
                  size="xs"
                  label="⭐ اعلام نمرات"
                  class="snippet-chip"
                  @click="insertSnippet('کارنامه و نمرات جدید در داشبورد شما ثبت گردید.')" />
              </div>

              <!-- تکست آریا با طراحی مدرن -->
              <div class="fancy-textarea-wrapper">
                <q-input
                  v-model="body"
                  type="textarea"
                  rows="5"
                  outlined
                  placeholder="متن دلخواه، نکات مهم یا لینک‌ها را اینجا تایپ کنید..."
                  class="fancy-textarea" />
              </div>

              <!-- دکمه نهایی با انیمیشن و شیب رنگی متحرک -->
              <q-btn
                unelevated
                class="dispatch-action-btn full-width q-mt-md"
                :loading="sending"
                :disable="!body.trim() || !hasFilters"
                @click="send">
                <div class="row items-center justify-center q-gutter-x-sm">
                  <q-icon
                    name="rocket_launch"
                    size="20px"
                    class="rocket-icon" />
                  <span class="text-weight-bolder text-body1">ارسال پیام به دانش‌آموزان منتخب</span>
                </div>
              </q-btn>
            </q-card-section>
          </q-card>

          <!-- پیش‌نمایش تعاملی بالن چت در بله (Bale Live Preview) -->
          <q-card
            flat
            class="bale-preview-card">
            <div class="bale-bar row items-center justify-between q-px-md q-py-xs">
              <div class="row items-center q-gutter-x-xs">
                <q-icon
                  name="smart_toy"
                  color="positive"
                  size="18px" />
                <span class="text-caption text-weight-bolder text-grey-9">پیش‌نمایش در اپلیکیشن بله</span>
              </div>
              <span class="preview-tag">Live Simulator</span>
            </div>

            <div class="bale-screen q-pa-md">
              <div class="bale-bubble-box">
                <div class="bale-bubble-sender row items-center q-gutter-x-xs q-mb-xs">
                  <span class="bot-name text-weight-bolder">سامانه سنجاد</span>
                  <q-icon
                    name="verified"
                    size="13px"
                    color="primary" />
                </div>
                <div class="bale-bubble-text">
                  {{ body.trim() || 'متن پیام پس از تایپ به صورت خودکار در این بالن چت شبیه‌سازی خواهد شد...' }}
                </div>
                <div class="bale-bubble-time row items-center justify-end q-gutter-x-xs q-mt-xs">
                  <span>{{ currentTimeString }}</span>
                  <q-icon
                    name="done_all"
                    size="14px"
                    color="positive" />
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import { message } from 'src/repositories/message'

const $q = useQuasar()
const currentSchoolManager = useCurrentSchool()
const currentSchoolId = computed(() => currentSchoolManager.currentSchool.value?.id ?? null)

const filters = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  first_name: '',
  last_name: '',
  national_id: '',
  username: ''
})

const body = ref('')
const sending = ref(false)

const currentTimeString = computed(() => {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
})

const hasFilters = computed(() => Boolean(
  filters.school_id || filters.field_id || filters.academic_level_id || filters.class_id ||
    filters.first_name.trim() || filters.last_name.trim() || filters.national_id.trim() || filters.username.trim()
))

watch(currentSchoolId, (schoolId) => {
  filters.school_id = schoolId
  onSchoolChange()
}, { immediate: true })

function onSchoolChange () {
  filters.field_id = null
  onFieldChange()
}

function onFieldChange () {
  filters.academic_level_id = null
  onLevelChange()
}

function onLevelChange () {
  filters.class_id = null
}

function insertSnippet (text: string) {
  if (body.value.trim()) {
    body.value = `${body.value}\n${text}`
  } else {
    body.value = text
  }
}

function resetAllFilters () {
  if (!currentSchoolId.value) {
    filters.school_id = null
  }
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
  filters.first_name = ''
  filters.last_name = ''
  filters.national_id = ''
  filters.username = ''
}

async function send () {
  if (sending.value || !hasFilters.value || !body.value.trim()) return

  $q.dialog({
    title: '🚀 تایید اعزام موشک پیام بله!',
    message: 'این پیام از طریق بات بله برای تمامی دانش‌آموزان منطبق با فیلترها ارسال خواهد شد. آیا مطمئن هستید؟',
    cancel: {
      label: 'انصراف',
      flat: true,
      color: 'grey-8'
    },
    ok: {
      label: 'بله، ارسال شود',
      unelevated: true,
      color: 'positive'
    },
    persistent: true
  }).onOk(async () => {
    sending.value = true
    try {
      const response = await message.sendToStudents({
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== null && String(value).trim() !== '')
        ),
        body: body.value.trim()
      })
      $q.notify({
        type: 'positive',
        message: `🎉 با موفقیت برای ${response.sent} دانش‌آموز ارسال گردید!`,
        position: 'top',
        timeout: 4000
      })
      body.value = ''
    } catch {
      $q.notify({
        type: 'negative',
        message: 'متأسفانه ارسال پیام انجام نشد. اتصال شبکه یا بله را بررسی فرمایید.',
        position: 'top'
      })
    } finally {
      sending.value = false
    }
  })
}
</script>

<style scoped lang="scss">
/* ۱) هدر فضایی و گرادیان جذاب شیشه‌ای */
.header-glass-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #2b1055 0%, #4338ca 60%, #0d9488 100%);
  box-shadow:
    0 12px 30px -8px rgba(67, 56, 202, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -40px;
    left: -40px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
}

.header-icon-badge {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fef08a;

  .flying-plane {
    font-size: 24px;
    transform: rotate(180deg);
  }

  .pulsing-orbit {
    position: absolute;
    inset: -3px;
    border-radius: 17px;
    border: 2px dashed rgba(254, 240, 138, 0.5);
    animation: spin 14s linear infinite;
  }
}

.studio-title {
  letter-spacing: -0.3px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.studio-subtitle {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.85);
}

.status-pill {
  padding: 4px 8px;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
}

.bale-brand-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
}

/* ۲) کارت‌های شیشه‌ای مدرن (Glass Panels) */
.glass-panel {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 14px 30px -5px rgba(15, 23, 42, 0.09);
  }
}

.panel-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
}

.bg-purple-gradient {
  background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);
}

.section-label-chip {
  display: inline-flex;
  align-items: center;
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  background: #f1f5f9;
  padding: 3px 10px;
  border-radius: 8px;
}

.faint-separator {
  background: rgba(226, 232, 240, 0.6);
}

.reset-btn {
  border-radius: 8px;
  background: #fee2e2;
  font-weight: 700;
}

/* ۳) استایل کادرهای فرم بیلدر */
.custom-form-builder {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    transition: all 0.2s ease;
    &:hover {
      border-color: #6366f1;
    }
  }
}

.active-criteria-box {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 10px 14px;

  .hint-text {
    font-size: 11px;
    color: #64748b;
  }
}

/* ۴) ادیتور پیام و تکست‌آریا */
.char-count-pill {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
}

.snippets-bar {
  .snippet-chip {
    border-radius: 8px;
    background: #f3e8ff;
    color: #7e22ce;
    font-weight: 700;
    transition: all 0.2s;
    &:hover {
      background: #e9d5ff;
      transform: translateY(-1px);
    }
  }
}

.fancy-textarea {
  :deep(.q-field__control) {
    border-radius: 14px !important;
    background: #ffffff;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
  }
  :deep(.q-field__native) {
    font-family: inherit;
    font-size: 13.5px;
    line-height: 1.6;
  }
}

/* ۵) دکمه متحرک پرتاب موشک */
.dispatch-action-btn {
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 10px 24px rgba(16, 185, 129, 0.55);
    .rocket-icon {
      transform: translateY(-2px) rotate(-15deg);
    }
  }

  .rocket-icon {
    transition: transform 0.25s ease;
  }
}

/* ۶) شبیه‌ساز زنده بله (Live Chat Bubble) */
.bale-preview-card {
  border-radius: 18px;
  background: #e5ddd5;
  background-image: radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 0);
  background-size: 14px 14px;
  overflow: hidden;
  border: 1px solid #d1d5db;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

  .bale-bar {
    background: #f0f2f5;
    border-bottom: 1px solid #e4e6eb;

    .preview-tag {
      font-size: 10px;
      font-weight: 800;
      color: #059669;
      background: #d1fae5;
      padding: 1px 6px;
      border-radius: 6px;
    }
  }

  .bale-screen {
    min-height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .bale-bubble-box {
    background: #ffffff;
    max-width: 88%;
    align-self: flex-start;
    padding: 8px 12px;
    border-radius: 12px 12px 12px 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    position: relative;

    .bale-bubble-sender {
      font-size: 11px;
      color: #0284c7;
    }

    .bale-bubble-text {
      font-size: 12.5px;
      color: #1e293b;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .bale-bubble-time {
      font-size: 10px;
      color: #94a3b8;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-glass-card {
    border-radius: 16px;
    padding: 12px !important;
  }
  .dispatch-action-btn {
    height: 44px;
  }
}
</style>
