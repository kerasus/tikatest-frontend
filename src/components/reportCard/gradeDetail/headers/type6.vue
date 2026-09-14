<template>
  <header class="report-header-kid-friendly">
    <!-- پترن بسیار محو ستاره و دایره برای حس سرزندگی -->
    <div class="doodle-pattern" />

    <div class="header-main-grid">
      <!-- بخش دانش‌آموز: کارتِ گرد -->
      <div class="student-card">
        <div class="avatar-wrap">
          <img
            :src="studentPhotoSrc"
            alt="avatar"
            class="avatar"
            @error="handleStudentPhotoError">
        </div>
        <div class="student-text">
          <div class="salutation">کارنامه تحصیلی</div>
          <h2 class="name">{{ studentFullName }}</h2>
          <div class="chips">
            <span class="chip">کد: {{ student?.student_code || '---' }}</span>
          </div>
        </div>
      </div>

      <!-- بخش مدرسه: مرکز توجه با استایل شاد -->
      <div class="school-card">
        <div class="logo-wrap">
          <img
            :src="schoolLogoSrc"
            alt="school"
            class="logo"
            @error="handleSchoolLogoError">
        </div>
        <h1 class="school-name">{{ school?.name || 'مجموعه آموزشی' }}</h1>
        <div class="title-pill">{{ title || 'کارنامه ریز نمرات' }}</div>
      </div>

      <!-- بخش مشخصات: باکس‌های رنگی -->
      <div class="info-card">
        <div class="info-grid">
          <div class="info-box">
            <span class="label">ترم:</span>
            <span class="val">{{ termName || '-' }}</span>
          </div>
          <div class="info-box">
            <span class="label">کلاس:</span>
            <span class="val">{{ className || '-' }}</span>
          </div>
          <div class="info-box year">
            <span class="label">سال:</span>
            <span class="val">{{ academicYear || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// (Interface definitions same as before...)
export interface SchoolInfo { name?: string; logo_url?: string | null; phone?: string | null; }
export interface StudentInfo { name?: string; last_name?: string; full_name?: string; student_code?: string; picture?: string | null; }

const props = defineProps<{
  school?: SchoolInfo; student?: StudentInfo; title?: string;
  termName?: string; className?: string; academicYear?: string;
  defaultAvatar?: string; defaultLogo?: string;
}>()

const studentPhotoSrc = ref(props.student?.picture || '/images/blankProfile.png')
const schoolLogoSrc = ref(props.school?.logo_url || '/images/logo.png')

const studentFullName = computed(() => props.student?.full_name || `${props.student?.name || ''} ${props.student?.last_name || ''}`.trim() || 'دانش‌آموز گرامی')

function handleStudentPhotoError () { studentPhotoSrc.value = '/images/blankProfile.png' }
function handleSchoolLogoError () { schoolLogoSrc.value = '/images/logo.png' }
</script>

<style scoped lang="scss">
.report-header-kid-friendly {
  position: relative;
  background: #f0f9ff; /* آبی آسمانی بسیار ملایم */
  border: 2px solid #bae6fd;
  border-radius: 24px;
  padding: 16px;
  margin-bottom: 14px;
  direction: rtl;
  overflow: hidden;
}

/* Doodle Pattern */
.doodle-pattern {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.05;
  background-image: radial-gradient(#0ea5e9 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

.header-main-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  position: relative;
}

/* Card Styles */
.student-card, .school-card, .info-card {
  background: white;
  border-radius: 16px;
  padding: 10px;
  border: 1px solid #e0f2fe;
}

.student-card {
  display: flex;
  align-items: center;
  gap: 10px;

  .avatar-wrap {
    width: 50px; height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #fef3c7;
    .avatar { width: 100%; height: 100%; object-fit: cover; }
  }

  .salutation { font-size: 10px; color: #64748b; }
  .name { margin: 0; font-size: 14px; font-weight: 800; color: #1e293b; }
  .chip { font-size: 10px; background: #f1f5f9; padding: 2px 8px; border-radius: 10px; }
}

.school-card {
  text-align: center;
  .logo-wrap { width: 40px; height: 40px; margin: 0 auto 5px; }
  .logo { width: 100%; height: 100%; object-fit: contain; }
  .school-name { margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; }
  .title-pill {
    display: inline-block;
    margin-top: 5px;
    background: #f59e0b;
    color: white;
    font-size: 11px;
    padding: 2px 12px;
    border-radius: 20px;
    font-weight: 600;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  .info-box {
    background: #f8fafc;
    padding: 6px;
    border-radius: 8px;
    .label { font-size: 9px; color: #94a3b8; display: block; }
    .val { font-size: 11px; font-weight: 700; color: #334155; }
    &.year { grid-column: span 2; }
  }
}

/* Print Optimization */
@media print {
  .report-header-kid-friendly {
    background: white !important;
    border: 1px solid #cbd5e1 !important;
    -webkit-print-color-adjust: exact !important;
  }
  .title-pill { background: #64748b !important; }
}
</style>
