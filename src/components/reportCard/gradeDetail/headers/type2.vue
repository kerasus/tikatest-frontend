<template>
  <header class="report-header-type2">
    <!-- بخش بالایی: مشخصات مدرسه و تایتل گزارش -->
    <div class="top-row">
      <!-- سمت راست: لوگو و برندینگ مدرسه -->
      <div class="school-brand">
        <div class="school-logo-wrap">
          <img
            :src="schoolLogoSrc"
            alt="لوگو"
            class="school-logo-img"
            @error="handleSchoolLogoError">
        </div>
        <div class="school-details">
          <div class="school-name">{{ school?.name || 'نام آموزشگاه' }}</div>
          <div
            v-if="school?.phone || school?.address"
            class="school-sub">
            <span
              v-if="school?.phone"
              class="meta-item">
              <q-icon
                name="phone"
                size="12px" />
              {{ school.phone }}
            </span>
            <span
              v-if="school?.phone && school?.address"
              class="meta-dot">•</span>
            <span
              v-if="school?.address"
              class="meta-item address-text"
              :title="school.address">
              {{ school.address }}
            </span>
          </div>
        </div>
      </div>

      <!-- سمت چپ: عنوان کارنامه و ترم تحصیلی -->
      <div class="report-brand">
        <div class="title-badge">{{ title || 'کارنامه ریز نمرات' }}</div>
        <div
          v-if="termName || academicYear"
          class="term-info">
          <span v-if="termName">{{ termName }}</span>
          <span v-if="termName && academicYear"> | </span>
          <span v-if="academicYear">{{ academicYear }}</span>
        </div>
      </div>
    </div>

    <!-- خط جداکننده مینیمال -->
    <div class="section-divider" />

    <!-- بخش پایینی: نوار جامع اطلاعات دانش‌آموز -->
    <div class="student-bar">
      <!-- تصویر دانش‌آموز -->
      <div class="student-avatar-wrap">
        <img
          :src="studentPhotoSrc"
          alt="دانش‌آموز"
          class="student-avatar-img"
          @error="handleStudentPhotoError">
      </div>

      <!-- تگ‌ها و مشخصات دانش‌آموز به صورت افقی -->
      <div class="student-tags">
        <div class="tag-item student-name-tag">
          <q-icon
            name="person"
            size="14px"
            class="q-ml-xs text-indigo-7" />
          <span class="tag-title">نام و نام خانوادگی:</span>
          <span class="tag-content bold-text">{{ studentFullName }}</span>
        </div>

        <div class="tag-item">
          <span class="tag-title">کد دانش‌آموزی:</span>
          <span class="tag-content code-text">{{ student?.student_code || '---' }}</span>
        </div>

        <div
          v-if="student?.national_code"
          class="tag-item">
          <span class="tag-title">کد ملی:</span>
          <span class="tag-content code-text">{{ student.national_code }}</span>
        </div>

        <div
          v-if="className"
          class="tag-item">
          <span class="tag-title">کلاس:</span>
          <span class="tag-content">{{ className }}</span>
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
.report-header-type2 {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 16px;
  box-sizing: border-box;
  direction: rtl;
  margin-bottom: 12px;
}

/* ─── ردیف اول: برندینگ و عنوان ─── */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .school-brand {
    display: flex;
    align-items: center;
    gap: 10px;

    .school-logo-wrap {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      flex-shrink: 0;

      .school-logo-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .school-details {
      .school-name {
        font-size: 15px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.2;
      }
      .school-sub {
        font-size: 11px;
        color: #64748b;
        margin-top: 3px;
        display: flex;
        align-items: center;
        gap: 6px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .meta-dot {
          color: #cbd5e1;
        }

        .address-text {
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .report-brand {
    text-align: left;
    direction: ltr;

    .title-badge {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      padding: 3px 12px;
      border-radius: 6px;
      font-size: 13.5px;
      font-weight: 800;
      direction: rtl;
    }

    .term-info {
      font-size: 11.5px;
      color: #64748b;
      margin-top: 3px;
      direction: rtl;
      font-weight: 600;
    }
  }
}

/* ─── دیوایدر میانی ─── */
.section-divider {
  height: 1px;
  background: #edf2f7;
  margin: 9px 0;
}

/* ─── ردیف دوم: نوار افقی دانش‌آموز ─── */
.student-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;

  .student-avatar-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 1.5px solid #cbd5e1;
    background: #ffffff;
    flex-shrink: 0;

    .student-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .student-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 16px;
    flex: 1;

    .tag-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;

      .tag-title {
        color: #64748b;
        font-weight: 500;
      }

      .tag-content {
        color: #1e293b;
        font-weight: 600;
      }

      .bold-text {
        color: #0f172a;
        font-weight: 800;
        font-size: 13px;
      }

      .code-text {
        font-family: monospace, sans-serif;
        direction: ltr;
        letter-spacing: 0.5px;
      }
    }
  }
}

/* ─── تنظیمات ویژه چاپ ─── */
@media print {
  .report-header-type2 {
    border: 1px solid #cbd5e1 !important;
    background: #ffffff !important;
    padding: 6px 12px !important;
    margin-bottom: 10px !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .title-badge {
    background: #eef2ff !important;
    color: #312e81 !important;
    border: 1px solid #c7d2fe !important;
  }

  .student-bar {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    padding: 4px 8px !important;
  }

  .student-avatar-wrap,
  .school-logo-wrap {
    border-color: #94a3b8 !important;
  }
}
</style>
