<template>
  <header class="report-header-fantasy">
    <!-- پترن پس‌زمینه نقاط شاداب و اشکال فانتزی -->
    <div class="fantasy-pattern" />
    <div class="glow-orb glow-violet" />
    <div class="glow-orb glow-cyan" />

    <div class="fantasy-content-grid">
      <!-- سمت راست: بخش آواتار و معرفی دانش‌آموز با استایل استیکری -->
      <div class="student-fantasy-wing">
        <div class="avatar-sticker-box">
          <div class="avatar-blob-border">
            <img
              :src="studentPhotoSrc"
              alt="تصویر دانش‌آموز"
              class="student-fantasy-avatar"
              @error="handleStudentPhotoError">
          </div>
          <div
            class="avatar-star-badge"
            title="دانش‌آموز کوشا">✨</div>
        </div>

        <div class="student-fantasy-info">
          <div class="student-bubble-tag">
            <span class="sparkle-icon">🌟</span>
            <span>دانش‌آموز کوشا</span>
          </div>
          <h2 class="student-fantasy-name">{{ studentFullName }}</h2>
          <div class="chips-row">
            <span class="fantasy-chip chip-code">
              کد دانش‌آموزی: <strong class="code-font">{{ student?.student_code || '---' }}</strong>
            </span>
            <span
              v-if="student?.national_code"
              class="fantasy-chip chip-id">
              کد ملی: <strong class="code-font">{{ student.national_code }}</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- وسط: مدال مدرسه و عنوان شاداب کارنامه -->
      <div class="center-banner-wing">
        <div class="school-fantasy-crest">
          <div class="logo-floating-badge">
            <img
              :src="schoolLogoSrc"
              alt="لوگو"
              class="school-fantasy-logo"
              @error="handleSchoolLogoError">
          </div>
          <div class="school-name-fantasy">{{ school?.name || 'آموزشگاه هوشمند' }}</div>
        </div>

        <!-- تایتل کپسولی و سه‌بعدی نرم -->
        <div class="report-fantasy-capsule">
          <span class="capsule-star">🚀</span>
          <span class="capsule-title">{{ title || 'کارنامه ریز نمرات' }}</span>
          <span class="capsule-star">🎯</span>
        </div>
      </div>

      <!-- سمت چپ: کارت مشخصات تحصیلی با گوشه‌های حبابی -->
      <div class="term-fantasy-wing">
        <div class="fantasy-info-card">
          <div
            v-if="termName"
            class="info-bubble-row">
            <span class="bubble-icon">📚</span>
            <span class="bubble-label">ترم:</span>
            <span class="bubble-value">{{ termName }}</span>
          </div>
          <div
            v-if="className"
            class="info-bubble-row">
            <span class="bubble-icon">🎓</span>
            <span class="bubble-label">کلاس:</span>
            <span class="bubble-value">{{ className }}</span>
          </div>
          <div
            v-if="academicYear"
            class="info-bubble-row">
            <span class="bubble-icon">📅</span>
            <span class="bubble-label">سال:</span>
            <span class="bubble-value code-font">{{ academicYear }}</span>
          </div>
        </div>

        <div
          v-if="school?.phone"
          class="school-contact-bubble">
          <q-icon
            name="call"
            size="13px"
            class="q-ml-xs text-secondary" />
          <span class="code-font">{{ school.phone }}</span>
        </div>
      </div>
    </div>

    <!-- خط زیگزاگ/موجی فانتزی پایین هدر -->
    <div class="fantasy-wave-bottom" />
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
  return `${first} ${last}`.trim() || 'دانش‌آموز ممتاز'
})

function handleStudentPhotoError () {
  studentPhotoSrc.value = props.defaultAvatar
}

function handleSchoolLogoError () {
  schoolLogoSrc.value = props.defaultLogo
}
</script>

<style scoped lang="scss">
.report-header-fantasy {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f5f3ff 60%, #eef2ff 100%);
  border: 2px solid #ddd6fe;
  border-radius: 18px;
  padding: 14px 20px 10px 20px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(124, 58, 237, 0.06);
  direction: rtl;
  margin-bottom: 14px;
  box-sizing: border-box;
}

/* ─── پترن و هاله نوری فانتزی ─── */
.fantasy-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#c4b5fd 1.2px, transparent 1.2px);
  background-size: 14px 14px;
  opacity: 0.35;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
  pointer-events: none;
}

.glow-violet {
  top: -50px;
  right: -30px;
  background: #7c3aed;
}

.glow-cyan {
  bottom: -50px;
  left: -20px;
  background: #06b6d4;
}

/* ─── چیدمان سه ستونه شاداب ─── */
.fantasy-content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.05fr;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

/* ─── ستون راست: آواتار استیکری و مشخصات ─── */
.student-fantasy-wing {
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar-sticker-box {
    position: relative;
    flex-shrink: 0;

    .avatar-blob-border {
      width: 66px;
      height: 74px;
      border-radius: 14px 14px 20px 14px;
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      padding: 3px;
      box-shadow: 0 4px 10px rgba(139, 92, 246, 0.25);

      .student-fantasy-avatar {
        width: 100%;
        height: 100%;
        border-radius: 11px 11px 17px 11px;
        object-fit: cover;
        background: #ffffff;
        display: block;
      }
    }

    .avatar-star-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      background: #fef08a;
      border: 1.5px solid #facc15;
      font-size: 12px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .student-fantasy-info {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .student-bubble-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10.5px;
      font-weight: 700;
      color: #6d28d9;
      background: #ede9fe;
      padding: 2px 8px;
      border-radius: 20px;
      width: fit-content;
      margin-bottom: 3px;

      .sparkle-icon {
        font-size: 10px;
      }
    }

    .student-fantasy-name {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      color: #1e1b4b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chips-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-top: 4px;

      .fantasy-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #4b5563;

        .code-font {
          font-family: monospace, sans-serif;
          color: #1f2937;
          letter-spacing: 0.5px;
        }
      }
    }
  }
}

/* ─── ستون وسط: مهر و تایتل کپسولی ─── */
.center-banner-wing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 8px;

  .school-fantasy-crest {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .logo-floating-badge {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #ffffff;
      border: 2px solid #e0e7ff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.12);

      .school-fantasy-logo {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .school-name-fantasy {
      font-size: 14.5px;
      font-weight: 900;
      color: #312e81;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .report-fantasy-capsule {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
    color: #ffffff;
    padding: 4px 14px;
    border-radius: 30px;
    box-shadow: 0 3px 10px rgba(124, 58, 237, 0.25);

    .capsule-star {
      font-size: 12px;
    }

    .capsule-title {
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: -0.2px;
    }
  }
}

/* ─── ستون چپ: کارت مشخصات حبابی ─── */
.term-fantasy-wing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;

  .fantasy-info-card {
    background: #ffffff;
    border: 1.5px solid #e0e7ff;
    border-radius: 12px;
    padding: 6px 12px;
    width: 100%;
    max-width: 190px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

    .info-bubble-row {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      margin-bottom: 2px;

      &:last-child {
        margin-bottom: 0;
      }

      .bubble-icon {
        font-size: 11px;
      }

      .bubble-label {
        color: #6b7280;
        font-weight: 500;
      }

      .bubble-value {
        color: #111827;
        font-weight: 700;
        margin-right: auto;
      }

      .code-font {
        font-family: monospace, sans-serif;
      }
    }
  }

  .school-contact-bubble {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #4b5563;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 12px;
    direction: ltr;

    .code-font {
      font-family: monospace, sans-serif;
      font-weight: 600;
    }
  }
}

/* ─── موج فانتزی انتهای هدر ─── */
.fantasy-wave-bottom {
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #f59e0b 100%);
  border-radius: 4px;
  margin-top: 10px;
}

/* ─── استایل پرینت بهینه (A4 Vector) ─── */
@media print {
  .report-header-fantasy {
    background: #ffffff !important;
    border: 1.5px solid #c4b5fd !important;
    box-shadow: none !important;
    padding: 8px 14px !important;
    margin-bottom: 10px !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .glow-orb,
  .fantasy-pattern {
    display: none !important;
  }

  .report-fantasy-capsule {
    background: #7c3aed !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .avatar-blob-border {
    background: #8b5cf6 !important;
    box-shadow: none !important;
  }
}
</style>
