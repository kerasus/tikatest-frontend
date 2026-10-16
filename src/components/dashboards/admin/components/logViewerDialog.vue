<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="clearing"
    transition-show="scale"
    transition-hide="scale"
    @update:model-value="emit('update:modelValue', $event)">
    <q-card class="log-dialog-dark column no-wrap">
      <!-- ۱. هدر بار دارک دیالوگ -->
      <header class="dialog-header row items-center justify-between q-px-md q-py-sm">
        <div class="row items-center q-gutter-x-sm">
          <div class="terminal-dots row items-center q-gutter-x-xs q-mr-xs">
            <span class="dot dot-red" />
            <span class="dot dot-yellow" />
            <span class="dot dot-green" />
          </div>

          <q-icon
            name="terminal"
            size="20px"
            class="text-teal-4" />
          <div class="text-subtitle1 text-weight-bolder text-white font-fa">
            گزارش‌های سامانه
            <span class="text-caption text-grey-5 q-ml-xs font-mono">(System Logs)</span>
          </div>
        </div>

        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          class="text-grey-4 close-hover-red" />
      </header>

      <q-separator
        dark
        class="separator-dark" />

      <!-- ۲. نوار ابزار بالا (شامل q-select فایل، سرچ، فیلتر لول و دکمه‌ها) -->
      <section class="dialog-toolbar q-px-md q-py-sm">
        <div class="row q-col-gutter-sm items-center">
          <!-- انتخاب فایل با q-select -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="selectedFile"
              dense
              dark
              outlined
              emit-value
              map-options
              :options="filesOptions"
              :loading="loadingFiles"
              label="فایل لاگ مورد نظر"
              class="dark-input"
              @update:model-value="onFileChange">
              <template #prepend>
                <q-icon
                  name="description"
                  size="18px"
                  class="text-amber-5" />
              </template>

              <!-- نمایش آیتم انتخاب شده -->
              <template #selected-item="scope">
                <span class="font-mono text-teal-3 ellipsis">
                  {{ scope.opt.label }}
                </span>
              </template>

              <!-- آپشن‌های بازشونده -->
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  dense
                  dark
                  class="file-option-item">
                  <q-item-section
                    avatar
                    class="min-w-auto q-pr-sm">
                    <q-icon
                      name="insert_drive_file"
                      size="16px"
                      class="text-teal-4" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="font-mono text-caption text-weight-bold">
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label
                      caption
                      class="text-grey-5 text-caption-xs font-mono">
                      {{ scope.opt.size }} • {{ scope.opt.modified_at }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template #after>
                <q-btn
                  flat
                  round
                  dense
                  dark
                  icon="refresh"
                  size="sm"
                  class="text-grey-4"
                  :loading="loadingFiles"
                  @click="loadFiles">
                  <q-tooltip>تازه‌سازی فهرست فایل‌ها</q-tooltip>
                </q-btn>
              </template>
            </q-select>
          </div>

          <!-- فیلد جست‌وجو -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="search"
              dense
              dark
              outlined
              clearable
              placeholder="جستجو در پیام، کلاس یا Stack Trace..."
              class="dark-input"
              @keyup.enter="applyFilters">
              <template #prepend>
                <q-icon
                  name="search"
                  size="18px"
                  class="text-grey-4" />
              </template>
              <template #append>
                <q-btn
                  v-if="search"
                  flat
                  round
                  dense
                  size="xs"
                  icon="arrow_forward"
                  class="text-teal-4"
                  @click="applyFilters" />
              </template>
            </q-input>
          </div>

          <!-- فیلتر سطح لاگ -->
          <div class="col-6 col-sm-4 col-md-2">
            <q-select
              v-model="level"
              dense
              dark
              outlined
              clearable
              :options="levels"
              placeholder="تمام سطوح"
              class="dark-input"
              @update:model-value="applyFilters">
              <template #prepend>
                <q-icon
                  name="filter_alt"
                  size="17px"
                  class="text-grey-4" />
              </template>
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  dense
                  dark>
                  <q-item-section>
                    <div class="row items-center q-gutter-x-xs font-mono text-caption">
                      <span
                        class="level-dot"
                        :class="getLevelTagClass(scope.opt)" />
                      <span>{{ scope.opt }}</span>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- دکمه‌های عملیاتی -->
          <div class="col-6 col-sm-8 col-md-2 row items-center justify-end q-gutter-x-xs">
            <q-btn
              flat
              dense
              icon="refresh"
              label="رفرش"
              class="btn-dark"
              :loading="loadingEntries"
              @click="loadEntries">
              <q-tooltip>تازه‌سازی لاگ‌های این فایل</q-tooltip>
            </q-btn>

            <q-btn
              flat
              dense
              icon="delete_sweep"
              label="تخلیه"
              class="btn-dark btn-danger"
              :disable="!selectedFile"
              :loading="clearing"
              @click="confirmClear">
              <q-tooltip>پاک کردن تمام رکوردهای فایل جاری</q-tooltip>
            </q-btn>
          </div>
        </div>
      </section>

      <q-separator
        dark
        class="separator-dark" />

      <!-- پیغام خطای ارتباطی -->
      <div
        v-if="error"
        class="bg-red-10 text-red-2 q-mx-md q-my-xs q-pa-sm rounded-borders text-caption row items-center">
        <q-icon
          name="error_outline"
          size="18px"
          class="q-mr-xs text-red-3" />
        <span>{{ error }}</span>
      </div>

      <!-- ۳. ناحیه نمایش لاگ‌ها (تمام عرض / Full Width) -->
      <q-scroll-area class="col log-stream-viewport q-px-md q-py-sm">
        <!-- وضعیت لودینگ لاگ‌ها -->
        <div
          v-if="loadingEntries"
          class="flex flex-center full-height column q-py-xl">
          <q-spinner-orbit
            color="teal-4"
            size="46px" />
          <span class="text-caption font-mono text-grey-5 q-mt-sm">درحال واکشی لاگ‌ها...</span>
        </div>

        <!-- بدون لاگ -->
        <div
          v-else-if="selectedFile && entries.length === 0"
          class="empty-state-dark flex flex-center column q-pa-xl text-center">
          <q-icon
            name="check_circle"
            size="44px"
            class="text-teal-4 q-mb-sm" />
          <div class="text-weight-bold text-grey-3 font-fa">هیچ خطایی یا رکوردی منطبق با این فیلتر ثبت نشده است.</div>
          <div class="text-caption text-grey-5 font-mono q-mt-xs">System status: Normal • 0 logs matched</div>
        </div>

        <!-- انتخاب نشدن فایل -->
        <div
          v-else-if="!selectedFile"
          class="flex flex-center full-height column q-pa-xl text-grey-6">
          <q-icon
            name="source"
            size="44px"
            class="q-mb-sm" />
          <span class="font-fa">لطفاً از نوار ابزار بالا، یک فایل لاگ را انتخاب کنید.</span>
        </div>

        <!-- لیست کارت‌های تمام‌عرض لاگ -->
        <div
          v-else
          class="q-gutter-y-sm">
          <article
            v-for="(entry, index) in entries"
            :key="`${entry.timestamp}-${index}`"
            class="terminal-card"
            :class="getLevelBorderClass(entry.level)">
            <!-- هدر کارت (بج لول، تایم‌استمپ و دکمه کپی) -->
            <div class="row items-center justify-between no-wrap q-mb-xs">
              <div class="row items-center q-gutter-x-xs">
                <span
                  class="level-badge font-mono"
                  :class="getLevelTagClass(entry.level)">
                  {{ entry.level }}
                </span>

                <span class="timestamp-badge font-mono">
                  {{ entry.timestamp }}
                </span>

                <span
                  v-if="entry.environment"
                  class="env-badge font-mono">
                  {{ entry.environment }}
                </span>
              </div>

              <q-btn
                flat
                round
                dense
                size="xs"
                icon="content_copy"
                class="copy-btn text-grey-5"
                @click="copyLogMessage(entry)">
                <q-tooltip>کپی متن کامل لاگ</q-tooltip>
              </q-btn>
            </div>

            <!-- پیام لاگ با فرمت LTR و مونواسپیس -->
            <div class="log-message font-mono">
              {{ entry.message }}
            </div>

            <!-- استک‌تریس کشویی -->
            <div
              v-if="entry.stack_trace"
              class="q-mt-xs">
              <q-expansion-item
                dense
                dense-toggle
                expand-separator
                dark
                header-class="trace-expansion-bar"
                class="rounded-borders">
                <template #header>
                  <div class="row items-center q-gutter-x-xs text-caption">
                    <q-icon
                      name="bug_report"
                      size="14px"
                      class="text-rose-4" />
                    <span class="text-weight-bold font-mono text-grey-4">Stack Trace Details</span>
                  </div>
                </template>

                <div class="trace-terminal-box relative-position">
                  <q-btn
                    flat
                    round
                    dense
                    size="xs"
                    icon="content_copy"
                    class="trace-copy-btn"
                    @click="copyToClipboard(entry.stack_trace)">
                    <q-tooltip>کپی استک‌تریس</q-tooltip>
                  </q-btn>
                  <pre class="font-mono trace-code">{{ entry.stack_trace }}</pre>
                </div>
              </q-expansion-item>
            </div>
          </article>
        </div>
      </q-scroll-area>

      <q-separator
        dark
        class="separator-dark" />

      <!-- ۴. فوتر پیجینیشن و تعداد رویدادها -->
      <footer
        v-if="selectedFile && total > 0"
        class="dialog-footer row items-center justify-between q-px-md q-py-xs">
        <div class="text-caption font-mono text-grey-4 row items-center q-gutter-x-xs">
          <span class="text-teal-4 text-weight-bolder">{{ total.toLocaleString('fa-IR') }}</span>
          <span class="font-fa">رویداد</span>
          <span class="text-grey-6">•</span>
          <span class="font-fa">صفحه {{ page.toLocaleString('fa-IR') }} از {{ Math.max(1, lastPage).toLocaleString('fa-IR') }}</span>
        </div>

        <q-pagination
          v-model="page"
          dark
          :max="Math.max(1, lastPage)"
          :max-pages="6"
          direction-links
          boundary-links
          dense
          size="12px"
          color="teal-4"
          active-color="teal-5"
          active-text-color="dark"
          @update:model-value="loadEntries" />
      </footer>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import { logViewer, type LogEntry, type LogFile } from 'src/repositories/logViewer'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const $q = useQuasar()

const levels = ['DEBUG', 'INFO', 'NOTICE', 'WARNING', 'ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY']
const files = ref<LogFile[]>([])
const selectedFile = ref<string | null>(null)
const entries = ref<LogEntry[]>([])
const loadingFiles = ref(false)
const loadingEntries = ref(false)
const clearing = ref(false)
const error = ref('')
const search = ref<string | null>(null)
const level = ref<string | null>(null)
const page = ref(1)
const total = ref(0)
const lastPage = ref(0)
let requestId = 0

const filesOptions = computed(() => {
  return files.value.map((f) => ({
    label: `${f.name} (${f.size})`,
    value: f.name,
    name: f.name,
    size: f.size,
    modified_at: f.modified_at
  }))
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    void loadFiles()
  } else {
    requestId++
  }
})

async function loadFiles () {
  loadingFiles.value = true
  error.value = ''
  try {
    files.value = await logViewer.files()
    if (!selectedFile.value || !files.value.some((file) => file.name === selectedFile.value)) {
      if (files.value.length > 0) {
        selectedFile.value = files.value[0]!.name
        page.value = 1
        void loadEntries()
      } else {
        selectedFile.value = null
        entries.value = []
        total.value = 0
      }
    }
  } catch {
    error.value = 'دریافت فهرست فایل‌های لاگ ناموفق بود.'
  } finally {
    loadingFiles.value = false
  }
}

function onFileChange () {
  page.value = 1
  void loadEntries()
}

function applyFilters () {
  page.value = 1
  void loadEntries()
}

function confirmClear () {
  if (!selectedFile.value || clearing.value) return

  const filename = selectedFile.value
  $q.dialog({
    dark: true,
    class: 'clear-confirm-dialog font-fa',
    title: 'تخلیه فایل لاگ',
    message: `همهٔ داده‌های لاگ در فایل "${filename}" تخلیه خواهند شد و قابل بازگشت نیستند. ادامه می‌دهید؟`,
    cancel: { label: 'انصراف', flat: true, color: 'grey-4' },
    ok: { label: 'تخلیه کامل', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(() => { void clearFile(filename) })
}

async function clearFile (filename: string) {
  clearing.value = true
  try {
    await logViewer.clear(filename)
    requestId++
    entries.value = []
    total.value = 0
    lastPage.value = 0
    page.value = 1
    await Promise.all([loadEntries(), loadFiles()])
    $q.notify({ type: 'positive', message: 'فایل لاگ با موفقیت تخلیه شد.', icon: 'done_all' })
  } catch {
    error.value = 'خالی کردن فایل لاگ ناموفق بود.'
  } finally {
    clearing.value = false
  }
}

async function loadEntries () {
  if (!selectedFile.value) return

  const currentRequest = ++requestId
  loadingEntries.value = true
  error.value = ''
  try {
    const result = await logViewer.entries({
      file: selectedFile.value,
      page: page.value,
      per_page: 50,
      search: search.value || undefined,
      level: level.value || undefined
    })
    if (currentRequest !== requestId || !props.modelValue) return
    entries.value = result.logs
    total.value = result.total
    lastPage.value = result.last_page
  } catch {
    if (currentRequest === requestId && props.modelValue) {
      error.value = 'دریافت لاگ‌های فایل ناموفق بود.'
      entries.value = []
      total.value = 0
    }
  } finally {
    if (currentRequest === requestId) loadingEntries.value = false
  }
}

function copyToClipboard (text: string) {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({ message: 'در حافظه کپی شد', color: 'teal-9', timeout: 1200, icon: 'content_paste' })
  }).catch(() => {})
}

function copyLogMessage (entry: LogEntry) {
  const fullText = `[${entry.timestamp}] ${entry.environment}.${entry.level}: ${entry.message}${entry.stack_trace ? '\n' + entry.stack_trace : ''}`
  copyToClipboard(fullText)
}

function getLevelTagClass (lvl: string) {
  switch (lvl?.toUpperCase()) {
    case 'EMERGENCY':
    case 'ALERT':
    case 'CRITICAL':
    case 'ERROR':
      return 'tag-error'
    case 'WARNING':
      return 'tag-warn'
    case 'NOTICE':
    case 'INFO':
      return 'tag-info'
    default:
      return 'tag-debug'
  }
}

function getLevelBorderClass (lvl: string) {
  switch (lvl?.toUpperCase()) {
    case 'EMERGENCY':
    case 'ALERT':
    case 'CRITICAL':
    case 'ERROR':
      return 'border-error'
    case 'WARNING':
      return 'border-warn'
    case 'NOTICE':
      return 'border-info'
    case 'INFO':
      return 'border-info'
    default:
      return 'border-debug'
  }
}
</script>

<style scoped lang="scss">
/* ظرف اصلی تم دارک */
.log-dialog-dark {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  border-radius: 12px;
  background-color: #0b0f17 !important; /* رنگ زمینه دارک یکپارچه */
  color: #e2e8f0;
  border: 1px solid #1e293b;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.separator-dark {
  background-color: #1e293b;
}

/* هدر دارک */
.dialog-header {
  background-color: #111827;

  .terminal-dots {
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      &.dot-red { background: #ef4444; }
      &.dot-yellow { background: #f59e0b; }
      &.dot-green { background: #10b981; }
    }
  }

  .close-hover-red:hover {
    color: #ef4444 !important;
  }
}

/* نوار ابزار */
.dialog-toolbar {
  background-color: #0f172a;

  .dark-input {
    :deep(.q-field__control) {
      background-color: #0b0f17;
      border-color: #1e293b;
      border-radius: 6px;
      font-size: 0.82rem;
    }
    :deep(.q-field__label) {
      color: #94a3b8;
    }
  }

  .btn-dark {
    font-size: 0.78rem;
    font-weight: 600;
    border: 1px solid #1e293b;
    border-radius: 6px;
    background: #111827;
    color: #cbd5e1;
    &:hover {
      background: #1e293b;
    }
  }

  .btn-danger {
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.3);
    &:hover {
      background: rgba(239, 68, 68, 0.15);
    }
  }
}

/* ناحیه لاگ‌ها */
.log-stream-viewport {
  background-color: #070a0f;
}

/* کارت‌های لاگ */
.terminal-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 8px 12px;
  transition: border-color 0.15s ease-in-out;

  &:hover {
    border-color: #334155;
  }

  &.border-error { border-right: 4px solid #ef4444; }
  &.border-warn  { border-right: 4px solid #f59e0b; }
  &.border-info  { border-right: 4px solid #0ea5e9; }
  &.border-debug { border-right: 4px solid #64748b; }

  .level-badge {
    font-size: 0.68rem;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 4px;
    text-transform: uppercase;

    &.tag-error {
      background: rgba(239, 68, 68, 0.18);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.35);
    }
    &.tag-warn {
      background: rgba(245, 158, 11, 0.18);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
    &.tag-info {
      background: rgba(14, 165, 233, 0.18);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.35);
    }
    &.tag-debug {
      background: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
    }
  }

  .timestamp-badge {
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .env-badge {
    font-size: 0.68rem;
    background: #0b0f17;
    border: 1px solid #1e293b;
    color: #94a3b8;
    padding: 0 4px;
    border-radius: 3px;
  }

  .copy-btn:hover {
    color: #ffffff !important;
  }
}

/* متن پیام خطا/لاگ */
.log-message {
  background: #080c14;
  color: #e2e8f0;
  border: 1px solid #162032;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.8rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  /* rtl:ignore */
  direction: ltr;
  /* rtl:ignore */
  text-align: left;
}

/* استک تریس در دارک مود */
.trace-expansion-bar {
  padding: 2px 6px;
  background: #111827;
  border-radius: 4px;
}

.trace-terminal-box {
  background: #020408;
  border: 1px solid #162032;
  border-radius: 6px;
  padding: 8px;
  margin-top: 4px;

  .trace-copy-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.08);
    &:hover {
      color: #38bdf8;
    }
  }

  .trace-code {
    color: #e2e8f0;
  /* rtl:ignore */
    direction: ltr;
  /* rtl:ignore */
    text-align: left;
    white-space: pre;
    overflow-x: auto;
    max-height: 260px;
    margin: 0;
    font-size: 0.73rem;
    line-height: 1.45;

    &::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 3px;
    }
  }
}

/* فوتر پیجینیشن */
.dialog-footer {
  background-color: #111827;
}

/* تایپوگرافی و کمک‌کننده‌ها */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
}

.font-fa {
  font-family: inherit;
}

.level-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  &.tag-error { background: #ef4444; }
  &.tag-warn  { background: #f59e0b; }
  &.tag-info  { background: #0ea5e9; }
  &.tag-debug { background: #64748b; }
}

.min-w-auto {
  min-width: auto;
}

.text-caption-xs {
  font-size: 0.68rem;
}

/* استایل پنجره کانفرمیشن تخلیه لاگ (بدون اسکوپ چون توی body رندر می‌شه) */
:global(.clear-confirm-dialog) {
  background-color: #0f172a !important;
  border: 1px solid #1e293b !important;
  border-radius: 10px !important;
  color: #e2e8f0 !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7) !important;

  .q-dialog__title {
    color: #f1f5f9 !important;
    font-weight: 700;
  }

  .q-dialog__message {
    color: #94a3b8 !important;
    line-height: 1.6;
  }
}

</style>
