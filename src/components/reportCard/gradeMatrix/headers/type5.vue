<!-- /home/ali/projects/TikaTest/tikatest-frontend/src/components/reportCard/gradeMatrix/headers/type5.vue -->
<template>
  <header class="matrix-header-compact">
    <!-- نوار باریک گرادیان بالای هدر -->
    <div class="color-ribbon" />

    <div class="header-content">
      <!-- بخش راست: هویت مدرسه + لوگو -->
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
              size="11px" />
            <span>{{ school.phone }}</span>
          </div>
        </div>
      </div>

      <!-- بخش وسط: عنوان کارنامه و سال تحصیلی -->
      <div class="title-block">
        <span class="title-text">{{ title || 'کارنامه جامع و ماتریس نمرات' }}</span>
        <span
          v-if="academicYear"
          class="title-badge">
          سال تحصیلی {{ academicYear }}
        </span>
      </div>

      <!-- بخش چپ: بج‌های فشرده اطلاعات کلاس، دوره و وضعیت -->
      <div class="meta-badges">
        <div
          v-if="className || gradeName"
          class="badge-pill pill-blue">
          <q-icon
            name="school"
            size="13px" />
          <span class="pill-label">کلاس:</span>
          <strong class="pill-val">{{ gradeName ? `${gradeName} - ` : '' }}{{ className || '---' }}</strong>
        </div>

        <div
          v-if="termName || examType"
          class="badge-pill pill-purple">
          <q-icon
            name="auto_stories"
            size="13px" />
          <span class="pill-label">دوره:</span>
          <strong class="pill-val">{{ termName || examType || '---' }}</strong>
        </div>

        <div
          v-if="issueDate"
          class="badge-pill pill-green">
          <q-icon
            name="event"
            size="13px" />
          <span class="pill-label">تاریخ:</span>
          <strong class="pill-val">{{ issueDate }}</strong>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface SchoolInfo {
  name?: string;
  logo_url?: string | null;
  phone?: string | null;
  address?: string | null;
}

const props = withDefaults(
  defineProps<{
    school?: SchoolInfo;
    title?: string;
    termName?: string;
    className?: string;
    gradeName?: string;
    academicYear?: string;
    examType?: string;
    issueDate?: string;
    defaultLogo?: string;
  }>(),
  {
    title: 'کارنامه جامع و ماتریس نمرات',
    defaultLogo: '/images/logo.png'
  }
)

const defaultLogo = props.defaultLogo
const schoolLogoSrc = ref<string>(props.school?.logo_url || defaultLogo)

watch(
  () => props.school?.logo_url,
  (newVal) => {
    schoolLogoSrc.value = newVal || defaultLogo
  }
)

const handleLogoError = () => {
  schoolLogoSrc.value = defaultLogo
}
</script>

<style scoped lang="scss">
.matrix-header-compact {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px 8px 12px;
  overflow: hidden;
  direction: rtl;
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
  font-family: 'Vazirmatn', 'IRANSans', Tahoma, sans-serif;
}

/* نوار گرادیان باریک */
.color-ribbon {
  height: 3.5px;
  margin: 0 -12px 6px -12px;
  background: linear-gradient(
    90deg,
    #2563eb 0%,
    #7c3aed 33%,
    #059669 66%,
    #ea580c 100%
  );
  width: calc(100% + 24px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
}

/* بلوک مدرسه */
.school-block {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;

  .logo-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1.5px solid #3b82f6;
    padding: 2px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

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

    .school-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #3b82f6;
      letter-spacing: 0.2px;
    }

    .school-name {
      margin: 0;
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .phone-line {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 9.5px;
      color: #64748b;
      direction: ltr;
      font-family: monospace;

      .q-icon {
        color: #3b82f6;
      }
    }
  }
}

/* عنوان وسط */
.title-block {
  text-align: center;
  padding: 3px 14px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px dashed #cbd5e1;
  white-space: nowrap;
  flex-shrink: 0;

  .title-text {
    display: block;
    font-size: 12.5px;
    font-weight: 800;
    color: #1e293b;
  }

  .title-badge {
    display: inline-block;
    font-size: 9.5px;
    font-weight: 600;
    color: #475569;
    margin-top: 1px;
  }
}

/* بج‌های فشرده سمت چپ */
.meta-badges {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex: 1;
  flex-wrap: wrap;

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    border: 1px solid;
    white-space: nowrap;

    .pill-label {
      opacity: 0.8;
      font-weight: 500;
    }

    .pill-val {
      font-weight: 700;
    }

    &.pill-blue {
      background: #eff6ff;
      border-color: #bfdbfe;
      color: #1e40af;
      .q-icon { color: #2563eb; }
    }

    &.pill-purple {
      background: #faf5ff;
      border-color: #e9d5ff;
      color: #6b21a8;
      .q-icon { color: #7c3aed; }
    }

    &.pill-green {
      background: #f0fdf4;
      border-color: #bbf7d0;
      color: #166534;
      .q-icon { color: #059669; }
    }
  }
}

@media print {
  .matrix-header-compact {
    box-shadow: none !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
