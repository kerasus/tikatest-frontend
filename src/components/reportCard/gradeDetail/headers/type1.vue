<template>
  <header class="report-header-type1">
    <!-- ستون سمت راست: مشخصات دانش‌آموز -->
    <div class="student-section">
      <div class="avatar-frame">
        <img
          :src="studentPhotoSrc"
          alt="تصویر دانش‌آموز"
          class="student-img"
          @error="handleStudentPhotoError">
      </div>
      <div class="student-info">
        <h3 class="student-name">{{ studentFullName }}</h3>
        <div class="info-badge">
          <span class="badge-label">کد دانش‌آموزی:</span>
          <span class="badge-value code-text">{{ student?.student_code || '---' }}</span>
        </div>
        <div
          v-if="student?.national_code"
          class="info-badge">
          <span class="badge-label">کد ملی:</span>
          <span class="badge-value">{{ student.national_code }}</span>
        </div>
      </div>
    </div>

    <!-- ستون وسط: عناوین گزارش و اطلاعات ترم -->
    <div class="title-section">
      <div class="report-main-title">{{ title || 'کارنامه ریز نمرات' }}</div>
      <div class="report-sub-title">
        <span v-if="termName">ترم تحصیلی: <strong>{{ termName }}</strong></span>
        <span
          v-if="termName && className"
          class="bullet-separator">•</span>
        <span v-if="className">کلاس: <strong>{{ className }}</strong></span>
      </div>
      <div
        v-if="academicYear"
        class="issue-date">سال تحصیلی: {{ academicYear }}</div>
    </div>

    <!-- ستون سمت چپ: برندینگ و لوگوی آموزشگاه -->
    <div class="school-section">
      <div class="school-text">
        <div class="school-name">{{ school?.name || 'نام آموزشگاه' }}</div>
        <div
          v-if="school?.phone"
          class="school-meta">
          <q-icon
            name="call"
            size="13px"
            class="q-ml-xs text-primary" />
          <span>{{ school.phone }}</span>
        </div>
        <div
          v-if="school?.address"
          class="school-meta address-clamp"
          :title="school.address">
          <q-icon
            name="place"
            size="13px"
            class="q-ml-xs text-primary" />
          <span>{{ school.address }}</span>
        </div>
      </div>

      <div class="school-logo-frame">
        <img
          :src="schoolLogoSrc"
          alt="لوگوی مدرسه"
          class="school-logo-img"
          @error="handleSchoolLogoError">
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
    academicYear?: string;
    defaultAvatar?: string;
    defaultLogo?: string;
  }>(),
  {
    title: 'کارنامه ریز نمرات',
    defaultAvatar: '/images/blankProfile.png',
    defaultLogo: '/images/logo.png'
  }
)

const studentPhotoSrc = ref<string>(props.student?.picture || props.defaultAvatar)
const schoolLogoSrc = ref<string>(props.school?.logo_url || props.defaultLogo)

watch(
  () => props.student?.picture,
  (newVal) => {
    studentPhotoSrc.value = newVal || props.defaultAvatar
  }
)

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
  return `${first} ${last}`.trim() || 'دانش‌آموز نامشخص'
})

function handleStudentPhotoError () {
  studentPhotoSrc.value = props.defaultAvatar
}

function handleSchoolLogoError () {
  schoolLogoSrc.value = props.defaultLogo
}
</script>

<style scoped lang="scss">
.report-header-type1 {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.1fr;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-top: 4px solid #1976d2;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
  direction: rtl;
}

/* ─── مشخصات دانش‌آموز (ستون راست) ─── */
.student-section {
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar-frame {
    width: 68px;
    height: 78px;
    border-radius: 8px;
    overflow: hidden;
    border: 1.5px solid #cbd5e1;
    background-color: #f8fafc;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    .student-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .student-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    .student-name {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .info-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11.5px;
      color: #64748b;

      .badge-label {
        font-weight: 500;
      }

      .badge-value {
        font-weight: 600;
        color: #334155;
      }

      .code-text {
        font-family: monospace, sans-serif;
        letter-spacing: 0.5px;
        direction: ltr;
      }
    }
  }
}

/* ─── عناوین مرکزی (ستون وسط) ─── */
.title-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px dashed #e2e8f0;
  border-right: 1px dashed #e2e8f0;
  padding: 0 10px;

  .report-main-title {
    font-size: 17px;
    font-weight: 900;
    color: #1976d2;
    letter-spacing: -0.3px;
  }

  .report-sub-title {
    font-size: 12px;
    color: #475569;
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    strong {
      color: #0f172a;
    }

    .bullet-separator {
      color: #94a3b8;
      font-size: 14px;
    }
  }

  .issue-date {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
  }
}

/* ─── برندینگ و مشخصات مدرسه (ستون چپ) ─── */
.school-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  text-align: left;
  direction: ltr;

  .school-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    min-width: 0;
    direction: rtl;

    .school-name {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 170px;
    }

    .school-meta {
      font-size: 11px;
      color: #64748b;
      display: flex;
      align-items: center;

      span {
        white-space: nowrap;
      }
    }

    .address-clamp {
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .school-logo-frame {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1.5px solid #cbd5e1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    .school-logo-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
}

/* ─── قوانین اختصاصی پرینت و PDF (A4) ─── */
@media print {
  .report-header-type1 {
    border-color: #cbd5e1 !important;
    border-top: 4px solid #1976d2 !important;
    background: #ffffff !important;
    box-shadow: none !important;
    padding: 8px 14px !important;
    margin-bottom: 12px !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .avatar-frame,
  .school-logo-frame {
    border-color: #94a3b8 !important;
    box-shadow: none !important;
  }
}
</style>
