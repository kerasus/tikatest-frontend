<template>
  <q-dialog
    v-model="showDevModal"
    :persistent="executingScript"
    backdrop-filter="blur(12px) brightness(95%)">
    <q-card class="light-dev-modal">
      <div class="modal-top-accent" />

      <q-card-section class="row items-center q-pa-md modal-head">
        <div class="modal-badge-icon q-mr-md">
          <q-icon
            :name="devActionMeta.icon"
            size="24px" />
        </div>

        <div>
          <div class="text-h6 text-weight-bolder text-neutral-dark-20 row items-center">
            {{ devActionMeta.title }}
            <q-badge
              :color="devActionMeta.badgeColor"
              text-color="white"
              class="q-ml-sm text-bold pulse-tag">
              {{ devActionMeta.badge }}
            </q-badge>
          </div>
          <div class="text-caption text-neutral">
            {{ devActionMeta.description }}
          </div>
        </div>

        <q-space />

        <q-btn
          v-close-popup
          icon="close"
          flat
          round
          dense
          color="neutral-50"
          :disable="executingScript" />
      </q-card-section>

      <q-separator color="primary-95" />

      <q-card-section class="q-pa-md">
        <div class="q-mb-md">
          <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
            نوع عملیات:
          </label>

          <!-- در بخش نوع عملیات q-select -->
          <!-- در بخش نوع عملیات q-select -->
          <q-select
            v-model="selectedDevAction"
            dense
            outlined
            emit-value
            map-options
            class="soft-input"
            :disable="executingScript"
            :options="[
              {
                label: 'تنظیم وب‌هوک بازوی بله (Set Webhook)',
                value: 'set-bale-webhook',
              },
              {
                label: 'اصلاح رمز عبور دانش‌آموزان (Bcrypt)',
                value: 'fix-student-passwords',
              },
              {
                label: 'انتقال فایل‌های خارجی آزمون',
                value: 'migrate-exam-files',
              },
              {
                label: 'بازشماری نتایج آزمون',
                value: 'recalculate-exam-results',
              },
              {
                label: 'پاک‌سازی کش فایل‌های FTP مدارس',
                value: 'flush-school-ftp-cache',
              },
            ]">
            <template #prepend>
              <q-icon
                name="settings_suggest"
                color="primary" />
            </template>
          </q-select>
        </div>

        <div class="warning-soft-box q-pa-sm q-mb-md">
          <div class="row items-start no-wrap">
            <q-icon
              name="info"
              color="warning-dark"
              size="22px"
              class="q-mr-sm" />

            <div>
              <div class="text-subtitle2 text-weight-bold text-neutral-dark-20">
                {{ devActionMeta.introTitle }}
              </div>

              <div
                class="text-caption text-neutral-dark"
                style="line-height: 1.8">
                {{ devActionMeta.introText }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="selectedDevAction === 'migrate-exam-files'"
          class="q-mb-md">
          <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
            حداکثر تعداد رکورد برای بررسی:
          </label>

          <q-input
            v-model.number="migrationLimit"
            type="number"
            min="0"
            dense
            outlined
            placeholder="مثلاً 5"
            class="soft-input"
            :disable="executingScript">
            <template #prepend>
              <q-icon
                name="filter_5"
                color="primary" />
            </template>
          </q-input>
        </div>

        <div
          v-if="selectedDevAction === 'recalculate-exam-results'"
          class="q-mb-md">
          <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
            شناسه آزمون برای بازشماری:
          </label>

          <q-input
            v-model.number="recalculateExamId"
            type="number"
            min="1"
            dense
            outlined
            placeholder="مثلاً 5 - اگر خالی بماند، همه آزمون‌ها بررسی می‌شوند"
            class="soft-input"
            :disable="executingScript">
            <template #prepend>
              <q-icon
                name="tag"
                color="secondary" />
            </template>
          </q-input>

          <div class="text-caption text-neutral q-mt-xs">
            خالی بگذار تا همه‌ی آزمون‌های قابل‌بررسی بازشماری شوند.
          </div>
        </div>

        <!-- فیلد ورودی شناسه‌های مدرسه برای fix-student-passwords -->
        <div
          v-if="selectedDevAction === 'fix-student-passwords'"
          class="q-mb-md">
          <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
            شناسه مدارس هدف (با کاما جدا کنید):
          </label>

          <q-input
            v-model="targetSchoolIdsInput"
            dense
            outlined
            placeholder="مثلاً 1, 2"
            class="soft-input"
            :disable="executingScript">
            <template #prepend>
              <q-icon
                name="domain"
                color="accent" />
            </template>
          </q-input>

          <div class="text-caption text-neutral q-mt-xs">
            پیش‌فرض مدارس ۱ (مبتکران) و ۲ (اسدی کیا) هستند.
          </div>
        </div>

        <div
          v-if="selectedDevAction === 'flush-school-ftp-cache'"
          class="q-mb-md">
          <form-builder-select-school
            v-model:value="cacheSchoolId"
            label="مدرسه (اختیاری)"
            placeholder="برای پاک‌سازی همه مدارس خالی بگذارید"
            outlined
            :disable="executingScript" />
          <div class="text-caption text-neutral q-mt-xs">
            اگر مدرسه‌ای انتخاب نشود، کش فایل‌های FTP همه مدارس پاک می‌شود.
          </div>
        </div>

        <div class="q-mb-md">
          <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
            برای آغاز، کلمه <strong class="text-error">«تایید»</strong> را بنویسید:
          </label>

          <q-input
            v-model="confirmationWord"
            dense
            outlined
            placeholder="تایید"
            class="soft-input"
            :disable="executingScript" />
        </div>

        <div
          v-if="logs.length > 0 || scriptResult"
          class="light-terminal-window q-pa-sm q-mt-md">
          <div class="terminal-bar row items-center justify-between q-mb-xs">
            <span class="text-caption font-mono text-neutral-dark-40"> Migration Logs </span>

            <div class="row q-gutter-x-xs">
              <span class="dot d-red" />
              <span class="dot d-yellow" />
              <span class="dot d-green" />
            </div>
          </div>

          <div class="terminal-body font-mono">
            <div
              v-for="(log, idx) in logs"
              :key="idx"
              class="log-row">
              <span class="log-arrow">➜</span>
              {{ log }}
            </div>

            <div
              v-if="scriptResult"
              class="result-pill-box q-mt-sm q-pa-sm">
              <template v-if="selectedDevAction === 'flush-school-ftp-cache'">
                <div class="text-weight-bold text-success-dark">
                  ✔ {{ scriptResult.message }}
                </div>
                <div>
                  {{ scriptResult.school_id ? `مدرسه ${scriptResult.school_id}` : 'همه مدارس' }}
                </div>
              </template>
              <template v-else-if="selectedDevAction === 'migrate-exam-files'">
                <div
                  class="text-weight-bold"
                  :class="
                    scriptResult.failed_count > 0 ? 'text-warning-dark' : 'text-success-dark'
                  ">
                  {{
                    scriptResult.failed_count > 0
                      ? '⚠ عملیات با موارد ناموفق تمام شد'
                      : '✔ عملیات موفق'
                  }}
                </div>

                <div>
                  رکوردهای منطبق:
                  <strong>{{ scriptResult.total_matched_records }}</strong>
                </div>

                <div>
                  رکوردهای به‌روزشده:
                  <strong>{{ scriptResult.updated_records }}</strong>
                </div>

                <div>
                  فایل‌های دانلودشده:
                  <strong>{{ scriptResult.downloaded_files }}</strong>
                </div>

                <div>
                  دانلودهای ناموفق:
                  <strong>{{ scriptResult.failed_count }}</strong>
                </div>

                <div
                  v-if="scriptResult.failed_urls?.length > 0"
                  class="failed-url-list q-mt-sm">
                  <div class="text-weight-bold q-mb-xs">فایل‌های ناموفق:</div>

                  <div
                    v-for="(failure, index) in scriptResult.failed_urls"
                    :key="`${failure.url}-${index}`"
                    class="failed-url-item">
                    <div class="failed-url">
                      {{ failure.url }}
                    </div>

                    <div class="text-caption">
                      {{ failure.reason }}
                      <span v-if="failure.status"> (HTTP {{ failure.status }}) </span>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="selectedDevAction === 'recalculate-exam-results'">
                <div class="text-weight-bold text-success-dark">
                  ✔ بازشماری نتایج با موفقیت انجام شد
                </div>

                <div v-if="'sessions_processed' in scriptResult">
                  سشن‌های پردازش‌شده:
                  <strong>{{ scriptResult.sessions_processed }}</strong>
                </div>

                <div v-if="'responses_updated' in scriptResult">
                  پاسخ‌های به‌روزشده:
                  <strong>{{ scriptResult.responses_updated }}</strong>
                </div>

                <div v-if="scriptResult.message">
                  پیام:
                  <strong>{{ scriptResult.message }}</strong>
                </div>
              </template>

              <!-- نمایش خروجی عملیات هش رمز عبور در ترمینال -->
              <template v-else-if="selectedDevAction === 'fix-student-passwords'">
                <div class="text-weight-bold text-success-dark">
                  ✔ عملیات اصلاح رمز عبور با موفقیت پایان یافت
                </div>

                <div v-if="'fixed' in scriptResult">
                  تعداد رکوردهای هش‌شده:
                  <strong class="text-primary">{{ scriptResult.fixed }}</strong>
                </div>

                <div v-if="'skipped_already_bcrypt' in scriptResult">
                  رد شده (از قبل هش معتبر داشتند):
                  <strong>{{ scriptResult.skipped_already_bcrypt }}</strong>
                </div>

                <div v-if="'skipped_empty_password' in scriptResult">
                  رد شده (رمز خالی):
                  <strong>{{ scriptResult.skipped_empty_password }}</strong>
                </div>

                <div v-if="'total_checked' in scriptResult">
                  کل دانش‌آموزان بررسی‌شده:
                  <strong>{{ scriptResult.total_checked }}</strong>
                </div>

                <div v-if="scriptResult.schools">
                  مدارس پردازش‌شده:
                  <q-badge
                    v-for="sId in scriptResult.schools"
                    :key="sId"
                    color="primary"
                    class="q-mr-xs">
                    مدرسه {{ sId }}
                  </q-badge>
                </div>
              </template>

              <!-- نمایش خروجی وب‌هوک بله در پنجره ترمینال -->
              <template v-else-if="selectedDevAction === 'set-bale-webhook'">
                <div
                  class="text-weight-bold"
                  :class="scriptResult.success ? 'text-success-dark' : 'text-negative'">
                  {{
                    scriptResult.success
                      ? '✔ وب‌هوک بله با موفقیت ثبت شد'
                      : '✖ خطا در تنظیم وب‌هوک بله'
                  }}
                </div>

                <div class="q-mt-xs">
                  کد خروجی:
                  <strong>{{ scriptResult.exit_code }}</strong>
                </div>

                <div
                  v-if="scriptResult.output"
                  class="q-mt-xs">
                  <div class="text-caption text-neutral-dark q-mb-xs">خروجی کنسول آرتیسان:</div>
                  <div
                    class="q-pa-xs bg-grey-2 rounded-borders font-mono text-caption"
                    style="white-space: pre-wrap; word-break: break-all">
                    {{ scriptResult.output }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions
        align="right"
        class="q-px-md q-pb-md">
        <q-btn
          v-close-popup
          flat
          label="بستن"
          color="neutral-dark-40"
          :disable="executingScript" />

        <q-btn
          unelevated
          class="run-action-btn"
          :icon="devActionMeta.buttonIcon"
          :label="devActionMeta.buttonLabel"
          :loading="executingScript"
          :disable="!canRunDevAction"
          @click="handleRunDevAction" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { type BaleWebhookResultType, devAdmin } from 'src/repositories/devAdmin'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'

type DevActionType =
  | 'set-bale-webhook'
  | 'migrate-exam-files'
  | 'recalculate-exam-results'
  | 'fix-student-passwords'
  | 'flush-school-ftp-cache'

const $q = useQuasar()

const showDevModal = ref(false)
const cacheSchoolId = ref<number | null>(null)
const confirmationWord = ref('')
const migrationLimit = ref<number | null>(5)
const scriptResult = ref<Record<string, any> | null>(null)
const executingScript = ref(false)
const logs = ref<string[]>([])
const targetSchoolIdsInput = ref('1, 2')
const selectedDevAction = ref<DevActionType>('set-bale-webhook')
const recalculateExamId = ref<number | null>(null)

const devActionMeta = computed(() => {
  if (selectedDevAction.value === 'flush-school-ftp-cache') {
    return {
      title: 'پاک‌سازی کش فایل‌های FTP',
      badge: 'FTP CACHE',
      badgeColor: 'primary',
      description: 'بی‌اعتبارسازی کش فایل‌ها و درخت فایل‌های کلاس‌ها',
      icon: 'cached',
      buttonLabel: 'پاک‌سازی کش',
      buttonIcon: 'delete_sweep',
      introTitle: 'انتخاب محدوده پاک‌سازی',
      introText: 'با انتخاب مدرسه، فقط کش همان مدرسه پاک می‌شود؛ بدون انتخاب مدرسه، کش همه مدارس پاک خواهد شد.'
    }
  }

  if (selectedDevAction.value === 'set-bale-webhook') {
    return {
      title: 'تنظیم وب‌هوک بازوی بله',
      badge: 'BALE BOT',
      badgeColor: 'positive',
      description: 'ثبت خودکار URL وب‌هوک و سکرت در سرور پیام‌رسان بله از طریق Artisan',
      icon: 'smart_toy',
      buttonLabel: 'ثبت وب‌هوک در بله',
      buttonIcon: 'link',
      introTitle: 'اتصال رویدادهای بله به سرور تیکاتست',
      introText:
        'این دستور دستور bale:set-webhook را در پس‌زمینه اجرا کرده و آدرس سرور شما را همراه با سکرت توکن به API بله معرفی می‌کند تا پیام‌های /start به سرور فوروارد شوند.'
    }
  }

  if (selectedDevAction.value === 'fix-student-passwords') {
    return {
      title: 'اصلاح رمز عبور دانش‌آموزان',
      badge: 'BCRYPT FIX',
      badgeColor: 'accent',
      description:
        'تبدیل کدهای ملی خام به هش Bcrypt استاندارد جهت فعال‌سازی امکان لاگین دانش‌آموزان',
      icon: 'lock_reset',
      buttonLabel: 'شروع هش‌گذاری امن',
      buttonIcon: 'security',
      introTitle: 'توجه به عملکرد امنیتی کاربران',
      introText:
        'این اسکریپت رکوردهای دانش‌آموزان مدارس انتخاب‌شده را بررسی کرده و رمزهای متنی خام (کد ملی) را بدون دستکاری پسوردهای هش‌شده قبلی، به هش استاندارد Bcrypt لاراول تبدیل می‌کند.'
    }
  }

  if (selectedDevAction.value === 'recalculate-exam-results') {
    return {
      title: 'بازشماری نتایج آزمون',
      badge: 'RECALCULATE',
      badgeColor: 'secondary',
      description: 'بازسازی شمارش پاسخ‌های درست، غلط، بی‌پاسخ و نمره نهایی جلسات آزمون',
      icon: 'calculate',
      buttonLabel: 'شروع بازشماری نتایج',
      buttonIcon: 'restart_alt',
      introTitle: 'قبل از اجرای نهایی، بهتر است روی یک آزمون تست بگیری',
      introText:
        'اگر شناسه آزمون را وارد کنی، فقط همان آزمون بازشماری می‌شود. اگر خالی بگذاری، همه‌ی جلسات آزمون‌های منطبق بررسی و بازسازی می‌شوند.'
    }
  }

  return {
    title: 'انتقال فایل‌های خارجی آزمون',
    badge: 'MIGRATION',
    badgeColor: 'warning',
    description: 'انتقال فایل‌های content و solution به استوریج محلی',
    icon: 'sync',
    buttonLabel: 'شروع انتقال فایل‌ها',
    buttonIcon: 'cloud_download',
    introTitle: 'قبل از اجرای کامل، ابتدا با تعداد کم تست کن',
    introText:
      'مقدار ۵ حداکثر پنج رکورد را بررسی می‌کند. مقدار ۰ یعنی همه‌ی رکوردهای منطبق بررسی شوند. فایل‌های دانلودشده در پوشه‌ی exam-files دیسک public ذخیره می‌شوند.'
  }
})

const canRunDevAction = computed(() => {
  if (confirmationWord.value.trim() !== 'تایید') return false

  if (selectedDevAction.value === 'set-bale-webhook') {
    return true
  }

  if (selectedDevAction.value === 'flush-school-ftp-cache') {
    return cacheSchoolId.value === null ||
      (Number.isInteger(Number(cacheSchoolId.value)) && Number(cacheSchoolId.value) > 0)
  }

  if (selectedDevAction.value === 'fix-student-passwords') {
    const ids = targetSchoolIdsInput.value
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0)
    return ids.length > 0
  }

  if (selectedDevAction.value === 'migrate-exam-files') {
    return (
      migrationLimit.value !== null &&
      Number.isInteger(Number(migrationLimit.value)) &&
      Number(migrationLimit.value) >= 0
    )
  }

  if (selectedDevAction.value === 'recalculate-exam-results') {
    return (
      recalculateExamId.value === null ||
      (Number.isInteger(Number(recalculateExamId.value)) && Number(recalculateExamId.value) > 0)
    )
  }

  return false
})

function open () {
  selectedDevAction.value = 'set-bale-webhook'
  cacheSchoolId.value = null
  targetSchoolIdsInput.value = '1, 2'
  confirmationWord.value = ''
  migrationLimit.value = 5
  recalculateExamId.value = null
  scriptResult.value = null
  logs.value = []
  showDevModal.value = true
}

defineExpose({ open })

async function handleRunDevAction () {
  if (confirmationWord.value.trim() !== 'تایید') return

  executingScript.value = true
  scriptResult.value = null
  logs.value = []

  try {
    if (selectedDevAction.value === 'flush-school-ftp-cache') {
      const schoolId = cacheSchoolId.value
      logs.value = [
        'اتصال امن به Sanctum API...',
        schoolId === null ? 'پاک‌سازی کش همه مدارس...' : `پاک‌سازی کش مدرسه ${schoolId}...`
      ]

      const result = await devAdmin.runDevScript<{
        success: boolean
        message: string
        school_id: number | null
      }>('flush-school-ftp-cache', schoolId === null ? {} : { school_id: schoolId })

      scriptResult.value = result
      logs.value.push(result.message)
      $q.notify({
        type: result.success ? 'positive' : 'negative',
        message: result.message,
        position: 'top'
      })
      return
    }

    if (selectedDevAction.value === 'set-bale-webhook') {
      logs.value = [
        'اتصال امن به Sanctum API...',
        'در حال ارسال درخواست اجرای دستور bale:set-webhook به Artisan...'
      ]

      const result = await devAdmin.runDevScript<BaleWebhookResultType>('set-bale-webhook')
      scriptResult.value = result

      if (result.success) {
        logs.value.push('✔ پاسخ بله با موفقیت دریافت شد.')
        if (result.output) {
          logs.value.push(result.output)
        }

        $q.notify({
          type: 'positive',
          icon: 'check_circle',
          message: 'وب‌هوک بله با موفقیت در سرور ثبت شد!',
          position: 'top',
          timeout: 5000
        })
      } else {
        logs.value.push(`[ERROR]: ثبت وب‌هوک با کد ${result.exit_code} شکست خورد.`)
        if (result.output) {
          logs.value.push(result.output)
        }

        $q.notify({
          type: 'negative',
          icon: 'error',
          message: 'خطا در ثبت وب‌هوک بله. خروجی کنسول را بررسی کنید.',
          position: 'top',
          timeout: 6000
        })
      }
      return
    }

    if (selectedDevAction.value === 'fix-student-passwords') {
      const parsedSchoolIds = targetSchoolIdsInput.value
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0)

      if (parsedSchoolIds.length === 0) {
        $q.notify({
          type: 'warning',
          icon: 'warning',
          message: 'حداقل یک شناسه مدرسه معتبر وارد کنید.',
          position: 'top'
        })
        executingScript.value = false
        return
      }

      logs.value = [
        'اتصال امن به Sanctum API...',
        `مدارس هدف: [${parsedSchoolIds.join(', ')}]`,
        'در حال جست‌وجوی دانش‌آموزان با رمز عبور غیرهش و تبدیل به Bcrypt...'
      ]

      const result = await devAdmin.runDevScript('fix-student-passwords', {
        school_ids: parsedSchoolIds
      })

      scriptResult.value = result

      logs.value.push(`پاسخ سرور: ${result.message}`)
      if ('fixed' in result) {
        logs.value.push(`تعداد پسوردهای اصلاح‌شده: ${result.fixed}`)
      }
      if ('skipped_already_bcrypt' in result) {
        logs.value.push(`تعداد از قبل هش‌شده: ${result.skipped_already_bcrypt}`)
      }
      if ('skipped_empty_password' in result) {
        logs.value.push(`تعداد پسورد خالی: ${result.skipped_empty_password}`)
      }

      $q.notify({
        type: 'positive',
        icon: 'check_circle',
        message: `رمز عبور ${result.fixed ?? 0} دانش‌آموز با موفقیت هش شد.`,
        position: 'top',
        timeout: 5000
      })
      return
    }

    if (selectedDevAction.value === 'migrate-exam-files') {
      // ... کد قبلی migration ...
    }

    if (selectedDevAction.value === 'recalculate-exam-results') {
      // ... کد قبلی recalculate ...
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'خطای نامشخص'

    logs.value.push(`[ERROR]: ${errorMessage}`)

    $q.notify({
      type: 'negative',
      icon: 'error_outline',
      message: errorMessage,
      position: 'top',
      timeout: 6000
    })
  } finally {
    executingScript.value = false
  }
}
</script>

<style lang="scss" scoped>
.failed-url-list {
  max-height: 180px;
  overflow-y: auto;
  direction: ltr;
  text-align: left;
}

.failed-url-item {
  padding: 7px 0;
  border-top: 1px solid rgba(118, 87, 245, 0.12);
}

.failed-url {
  overflow-wrap: anywhere;
  color: #b4234d;
  font-size: 11px;
}
</style>
