<template>
  <header class="report-header-compact">
    <!-- نوار رنگی گرادیان بالای هدر -->
    <div class="color-ribbon" />

    <!-- ردیف اصلی فشرده -->
    <div class="main-row">
      <!-- هویت مدرسه + لوگو -->
      <div class="school-block">
        <div class="logo-circle">
          <img
            :src="schoolLogoSrc"
            alt="لوگوی آموزشگاه"
            class="logo-img"
            @error="handleLogoError">
        </div>
        <div class="school-text">
          <span class="school-label">آموزشگاه</span>
          <h1 class="school-name">{{ school?.name || 'مجموعه آموزشی و تربیتی' }}</h1>
          <div
            v-if="school?.phone"
            class="phone-line">
            <q-icon
              name="call"
              size="10px" />
            <span>{{ school.phone }}</span>
          </div>
        </div>
      </div>

      <!-- عنوان کارنامه -->
      <div class="title-block">
        <span class="title-sub">{{ title || 'کارنامه ریز نمرات' }}</span>
        <div class="title-year">{{ academicYear || '---' }}</div>
      </div>

      <!-- پروفایل دانش‌آموز -->
      <div class="student-block">
        <div class="avatar-circle">
          <img
            :src="studentPhotoSrc"
            alt="تصویر دانش‌آموز"
            class="avatar-img"
            @error="handleImgError">
        </div>
        <div class="student-text">
          <span class="student-label">دانش‌آموز</span>
          <h2 class="student-name">{{ studentFullName }}</h2>
          <div class="student-codes">
            <span class="code-tag">
              <span class="code-dot" />
              {{ student?.student_code || '---' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ردیف کارت‌های رنگی فشرده -->
    <div class="cards-row">
      <div class="mini-card card-blue">
        <div class="mini-head">
          <q-icon
            name="school"
            size="13px" />
          <span>پایه و کلاس</span>
        </div>
        <div class="mini-body">
          <div class="mini-val">{{ gradeName || '---' }}</div>
          <div class="mini-sub">{{ className || '---' }}</div>
        </div>
      </div>

      <div class="mini-card card-purple">
        <div class="mini-head">
          <q-icon
            name="auto_stories"
            size="13px" />
          <span>دوره / ترم</span>
        </div>
        <div class="mini-body">
          <div class="mini-val">{{ termName || '---' }}</div>
          <div class="mini-sub">{{ examType || '---' }}</div>
        </div>
      </div>

      <div class="mini-card card-green">
        <div class="mini-head">
          <q-icon
            name="calendar_month"
            size="13px" />
          <span>سال تحصیلی</span>
        </div>
        <div class="mini-body">
          <div class="mini-val">{{ academicYear || '---' }}</div>
          <div class="mini-sub">{{ issueDate || '---' }}</div>
        </div>
      </div>

      <div class="mini-card card-orange">
        <div class="mini-head">
          <q-icon
            name="verified"
            size="13px" />
          <span>وضعیت</span>
        </div>
        <div class="mini-body">
          <div class="mini-val">{{ status || 'در حال تحصیل' }}</div>
          <div class="mini-sub">{{ student?.national_code ? `کدملی: ${student.national_code}` : '---' }}</div>
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
    title: 'کارنامه ریز نمرات',
    status: 'در حال تحصیل',
    defaultAvatar: '/images/blankProfile.png',
    defaultLogo: '/images/logo.png'
  }
)

const defaultAvatar = props.defaultAvatar
const defaultLogo = props.defaultLogo

const studentPhotoSrc = ref<string>(props.student?.picture || defaultAvatar)
const schoolLogoSrc = ref<string>(props.school?.logo_url || defaultLogo)

watch(
  () => props.student?.picture,
  (newVal) => {
    studentPhotoSrc.value = newVal || defaultAvatar
  }
)

watch(
  () => props.school?.logo_url,
  (newVal) => {
    schoolLogoSrc.value = newVal || defaultLogo
  }
)

const handleImgError = () => {
  studentPhotoSrc.value = defaultAvatar
}
const handleLogoError = () => {
  schoolLogoSrc.value = defaultLogo
}

const studentFullName = computed(() => {
  if (props.student?.full_name) return props.student.full_name
  const first = props.student?.name || ''
  const last = props.student?.last_name || ''
  return `${first} ${last}`.trim() || 'دانش‌آموز گرامی'
})
</script>

<style scoped lang="scss">
.report-header-compact {
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px 14px 16px;
  overflow: hidden;
  direction: rtl;
  margin-bottom: 14px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  font-family: 'Vazirmatn', 'IRANSans', Tahoma, sans-serif;
}

/* ─── نوار رنگی گرادیان بالای هدر ─── */
.color-ribbon {
  height: 4px;
  margin: 0 -16px 12px -16px;
  background: linear-gradient(
    90deg,
    #3b82f6 0%,
    #8b5cf6 33%,
    #10b981 66%,
    #f97316 100%
  );
  width: calc(100% + 32px);
}

/* ── ردیف اصلی فشرده ─── */
.main-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  width: 100%;
}

/* ─── بلوک مدرسه ─── */
.school-block {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  .logo-circle {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 2px solid #3b82f6;
    padding: 3px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);

    .logo-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #ffffff;
    }
  }

  .school-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;

    .school-label {
      font-size: 9.5px;
      font-weight: 600;
      color: #3b82f6;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .school-name {
      margin: 1px 0 0 0;
      font-size: 14px;
      font-weight: 800;
      color: #111827;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .phone-line {
      display: flex;
      align-items: center;
      gap: 3px;
      margin-top: 2px;
      font-size: 10px;
      color: #6b7280;
      direction: ltr;
      justify-content: flex-start;
      font-family: monospace;

      .q-icon {
        color: #3b82f6;
      }
    }
  }
}

/* ─── بلوک عنوان ─── */
.title-block {
  text-align: center;
  padding: 4px 20px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 10px;
  border: 1px dashed #d1d5db;
  white-space: nowrap;

  .title-sub {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: #111827;
    letter-spacing: 0.3px;
  }

  .title-year {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    margin-top: 2px;
    font-family: 'Vazirmatn', monospace;
  }
}

/* ─── بلوک دانش‌آموز ─── */
.student-block {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row-reverse;
  justify-content: flex-start;
  min-width: 0;

  .avatar-circle {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #f59e0b;
    padding: 3px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(245, 158, 11, 0.2);

    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #ffffff;
    }
  }

  .student-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    align-items: flex-end;
    flex: 1;

    .student-label {
      font-size: 9.5px;
      font-weight: 600;
      color: #f59e0b;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .student-name {
      margin: 1px 0 0 0;
      font-size: 14px;
      font-weight: 800;
      color: #111827;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
    }

    .student-codes {
      display: flex;
      gap: 6px;
      margin-top: 2px;

      .code-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        font-weight: 600;
        color: #92400e;
        background: #fef3c7;
        padding: 1px 7px;
        border-radius: 8px;
        font-family: monospace;
        direction: ltr;

        .code-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #f59e0b;
        }
      }
    }
  }
}

/* ─── ردیف کارت‌های رنگی فشرده ── */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
  width: 100%;
}

.mini-card {
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid;
  transition: transform 0.15s ease;
  min-width: 0;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-1px);
  }

  .mini-head {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    font-weight: 700;
    margin-bottom: 5px;
    padding-bottom: 4px;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
    white-space: nowrap;
    overflow: hidden;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .mini-body {
    .mini-val {
      font-size: 12.5px;
      font-weight: 800;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mini-sub {
      font-size: 10px;
      font-weight: 500;
      margin-top: 1px;
      opacity: 0.75;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* کارت آبی - پایه و کلاس */
  &.card-blue {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #bfdbfe;

    .mini-head {
      color: #1e40af;

      .q-icon {
        color: #3b82f6;
      }
    }

    .mini-val {
      color: #1e3a8a;
    }

    .mini-sub {
      color: #3b82f6;
    }
  }

  /* کارت بنفش - دوره / ترم */
  &.card-purple {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-color: #e9d5ff;

    .mini-head {
      color: #6b21a8;

      .q-icon {
        color: #8b5cf6;
      }
    }

    .mini-val {
      color: #581c87;
    }

    .mini-sub {
      color: #8b5cf6;
    }
  }

  /* کارت سبز - سال تحصیلی */
  &.card-green {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-color: #bbf7d0;

    .mini-head {
      color: #166534;

      .q-icon {
        color: #10b981;
      }
    }

    .mini-val {
      color: #14532d;
    }

    .mini-sub {
      color: #10b981;
    }
  }

  /* کارت نارنجی - وضعیت */
  &.card-orange {
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
    border-color: #fed7aa;

    .mini-head {
      color: #9a3412;

      .q-icon {
        color: #f97316;
      }
    }

    .mini-val {
      color: #7c2d12;
    }

    .mini-sub {
      color: #f97316;
    }
  }
}

</style>
