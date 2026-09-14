<template>
  <header class="report-header-minimal">
    <!-- ردیف بالا: هویت مدرسه + عنوان + تاریخ -->
    <div class="top-band">
      <div class="school-identity">
        <div class="logo-frame">
          <img
            :src="schoolLogoSrc"
            alt="لوگوی آموزشگاه"
            class="logo-img"
            @error="handleSchoolLogoError">
        </div>
        <div class="school-text">
          <span class="school-label">آموزشگاه</span>
          <h1 class="school-name">{{ school?.name || 'مجموعه آموزشی و تربیتی' }}</h1>
        </div>
      </div>

      <div class="report-title-block">
        <span class="title-label">کارنامه</span>
        <h2 class="title-main">{{ title || 'ریز نمرات دانش‌آموز' }}</h2>
      </div>

      <div class="issue-meta">
        <span class="meta-label">تاریخ صدور</span>
        <span class="meta-value">{{ issueDate || '---' }}</span>
        <div
          v-if="school?.phone"
          class="phone-line">
          <q-icon
            name="call"
            size="11px" />
          <span>{{ school.phone }}</span>
        </div>
      </div>
    </div>

    <!-- خط جداکننده ظریف -->
    <div class="section-divider" />

    <!-- ردیف پایین: کارت‌های اطلاعات با کادربندی مجزا -->
    <div class="info-grid">
      <!-- کارت دانش‌آموز -->
      <div class="info-card student-card">
        <div class="card-head">
          <q-icon
            name="person"
            size="14px" />
          <span>مشخصات دانش‌آموز</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">نام و نام‌خانوادگی</span>
            <span class="info-value name-value">{{ studentFullName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">کد دانش‌آموزی</span>
            <span class="info-value mono">{{ student?.student_code || '---' }}</span>
          </div>
          <div
            v-if="student?.national_code"
            class="info-row">
            <span class="info-label">کد ملی</span>
            <span class="info-value mono">{{ student.national_code }}</span>
          </div>
        </div>
      </div>

      <!-- کارت پایه و کلاس -->
      <div class="info-card">
        <div class="card-head">
          <q-icon
            name="school"
            size="14px" />
          <span>پایه و کلاس</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">پایه تحصیلی</span>
            <span class="info-value">{{ gradeName || '---' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">کلاس</span>
            <span class="info-value">{{ className || '---' }}</span>
          </div>
        </div>
      </div>

      <!-- کارت دوره / ترم -->
      <div class="info-card">
        <div class="card-head">
          <q-icon
            name="auto_stories"
            size="14px" />
          <span>دوره / ترم</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">نام دوره</span>
            <span class="info-value">{{ termName || '---' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">نوع آزمون</span>
            <span class="info-value">{{ examType || '---' }}</span>
          </div>
        </div>
      </div>

      <!-- کارت سال تحصیلی -->
      <div class="info-card">
        <div class="card-head">
          <q-icon
            name="calendar_month"
            size="14px" />
          <span>سال تحصیلی</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">شروع</span>
            <span class="info-value mono">{{ academicYear || '---' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">وضعیت</span>
            <span class="info-value status-badge">{{ status || 'در حال تحصیل' }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface SchoolInfo {
  name?: string;
  logo_url?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface StudentInfo {
  name?: string;
  last_name?: string;
  full_name?: string;
  student_code?: string;
  national_code?: string;
  picture?: string | null;
}

const props = withDefaults(
  defineProps<{
    school?: SchoolInfo;
    student?: StudentInfo;
    title?: string;
    termName?: string;
    className?: string;
    gradeName?: string;
    academicYear?: string;
    examType?: string;
    issueDate?: string;
    status?: string;
    defaultAvatar?: string;
    defaultLogo?: string;
  }>(),
  {
    title: 'ریز نمرات دانش‌آموز',
    status: 'در حال تحصیل',
    defaultAvatar: '/images/blankProfile.png',
    defaultLogo: '/images/logo.png'
  }
)

const schoolLogoSrc = ref<string>(props.school?.logo_url || props.defaultLogo)

watch(
  () => props.school?.logo_url,
  (newVal) => {
    schoolLogoSrc.value = newVal || props.defaultLogo
  }
)

const studentFullName = computed(() => {
  if (props.student?.full_name) return props.student.full_name
  const first = props.student?.name || ''
  const last = props.student?.last_name || ''
  return `${first} ${last}`.trim() || 'دانش‌آموز گرامی'
})

function handleSchoolLogoError () {
  schoolLogoSrc.value = props.defaultLogo
}
</script>

<style scoped lang="scss">
.report-header-minimal {
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 18px 22px 20px 22px;
  overflow: hidden;
  direction: rtl;
  margin-bottom: 16px;
  box-sizing: border-box;
  font-family: 'Vazirmatn', 'IRANSans', Tahoma, sans-serif;
}

/* ─── ردیف بالا: هویت مدرسه + عنوان + تاریخ ─── */
.top-band {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
}

.school-identity {
  display: flex;
  align-items: center;
  gap: 12px;

  .logo-frame {
    width: 54px;
    height: 54px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 4px;
    background: #fafafa;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .school-text {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .school-label {
      font-size: 10px;
      font-weight: 500;
      color: #9ca3af;
      letter-spacing: 0.3px;
    }

    .school-name {
      margin: 2px 0 0 0;
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 240px;
    }
  }
}

.report-title-block {
  text-align: center;
  padding: 0 20px;

  .title-label {
    display: block;
    font-size: 10px;
    font-weight: 500;
    color: #9ca3af;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .title-main {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.3px;
    position: relative;
    display: inline-block;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 28px;
      height: 1px;
      background: #d1d5db;
    }

    &::before {
      right: calc(100% + 10px);
    }

    &::after {
      left: calc(100% + 10px);
    }
  }
}

.issue-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;

  .meta-label {
    font-size: 10px;
    font-weight: 500;
    color: #9ca3af;
  }

  .meta-value {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    font-family: 'Vazirmatn', monospace;
  }

  .phone-line {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 11px;
    color: #6b7280;
    direction: ltr;
    font-family: monospace;

    .q-icon {
      color: #9ca3af;
    }
  }
}

/* ─── خط جداکننده ─── */
.section-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0 14px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 50%;
  }
}

/* ─── گرید کارت‌های اطلاعات ─── */
.info-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 12px;
}

.info-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }

  &.student-card {
    border-color: #111827;
    border-width: 1.5px;
  }

  .card-head {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px dashed #e5e7eb;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;

    .q-icon {
      color: #111827;
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    line-height: 1.4;

    .info-label {
      color: #9ca3af;
      font-weight: 500;
      flex-shrink: 0;
    }

    .info-value {
      color: #111827;
      font-weight: 600;
      text-align: left;
      direction: rtl;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60%;

      &.name-value {
        font-weight: 700;
        color: #111827;
      }

      &.mono {
        font-family: 'Vazirmatn', monospace;
        letter-spacing: 0.3px;
      }

      &.status-badge {
        font-size: 10.5px;
        font-weight: 600;
        color: #059669;
        background: #ecfdf5;
        padding: 1px 8px;
        border-radius: 10px;
        border: 1px solid #d1fae5;
      }
    }
  }
}

/* ─── ریسپانسیو ─── */
@media (max-width: 1024px) {
  .top-band {
    grid-template-columns: 1fr;
    gap: 14px;
    text-align: center;
  }

  .school-identity {
    justify-content: center;
  }

  .issue-meta {
    align-items: center;
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .info-card.student-card {
    grid-column: 1 / -1;
  }
}

/* ─── استاندارد پرینت ─── */
@media print {
  .report-header-minimal {
    border: 1px solid #d1d5db !important;
    box-shadow: none !important;
    padding: 12px 16px !important;
    margin-bottom: 12px !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-card {
    break-inside: avoid;
  }

  .info-card.student-card {
    border-color: #111827 !important;
  }

  .report-title-block .title-main::before,
  .report-title-block .title-main::after {
    background: #d1d5db !important;
  }
}
</style>
