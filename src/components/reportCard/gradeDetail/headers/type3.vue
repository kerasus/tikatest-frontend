<template>
  <header class="report-header-type3">
    <!-- پترن هندسی محو هنری در پس‌زمینه -->
    <div class="art-background-pattern" />

    <!-- نوار دکوراتیو طلایی فوقانی -->
    <div class="luxury-top-ribbon">
      <div class="ribbon-line" />
      <div class="ribbon-gem">◆</div>
      <div class="ribbon-line" />
    </div>

    <div class="header-main-grid">
      <!-- سمت راست: مدالیون پرتره و نام دانش‌آموز -->
      <div class="student-art-wing">
        <div class="portrait-medallion">
          <div class="gold-ring">
            <img
              :src="studentPhotoSrc"
              alt="تصویر دانش‌آموز"
              class="portrait-img"
              @error="handleStudentPhotoError">
          </div>
        </div>

        <div class="student-details">
          <div class="student-salutation">کارنامه تحصیلی دانش‌آموز</div>
          <h2 class="student-full-name">{{ studentFullName }}</h2>
          <div class="student-credentials">
            <span class="cred-chip">
              <span class="dot-gold" />
              کد دانش‌آموزی: <strong class="code-font">{{ student?.student_code || '---' }}</strong>
            </span>
            <span
              v-if="student?.national_code"
              class="cred-chip">
              <span class="dot-gold" />
              کد ملی: <strong class="code-font">{{ student.national_code }}</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- وسط: مهر برندینگ و تایتل فاخر -->
      <div class="center-crest-wing">
        <div class="school-insignia">
          <div class="crest-frame">
            <img
              :src="schoolLogoSrc"
              alt="لوگوی آموزشگاه"
              class="crest-img"
              @error="handleSchoolLogoError">
          </div>
          <h1 class="school-display-name">{{ school?.name || 'مجموعه آموزشی و تربیتی' }}</h1>
        </div>

        <!-- تایتل اصلی کارنامه با استایل هنری -->
        <div class="report-royal-title">
          <span class="ornament-bracket">‹</span>
          <span class="title-text">{{ title || 'کارنامه ریز نمرات' }}</span>
          <span class="ornament-bracket">›</span>
        </div>
      </div>

      <!-- سمت چپ: پنل تشریفاتی مشخصات دوره و تماس -->
      <div class="period-art-wing">
        <div class="academic-cohort-card">
          <div
            v-if="termName"
            class="cohort-row">
            <span class="cohort-label">دوره / ترم:</span>
            <span class="cohort-val">{{ termName }}</span>
          </div>
          <div
            v-if="className"
            class="cohort-row">
            <span class="cohort-label">پایه و کلاس:</span>
            <span class="cohort-val">{{ className }}</span>
          </div>
          <div
            v-if="academicYear"
            class="cohort-row">
            <span class="cohort-label">سال تحصیلی:</span>
            <span class="cohort-val code-font">{{ academicYear }}</span>
          </div>
        </div>

        <div
          v-if="school?.phone"
          class="school-footer-contact">
          <q-icon
            name="call"
            size="13px"
            class="contact-icon" />
          <span class="phone-number">{{ school.phone }}</span>
        </div>
      </div>
    </div>

    <!-- خط پایان هنری زیر هدر -->
    <div class="artistic-bottom-border" />
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
  return `${first} ${last}`.trim() || 'دانش‌آموز گرامی'
})

function handleStudentPhotoError () {
  studentPhotoSrc.value = props.defaultAvatar
}

function handleSchoolLogoError () {
  schoolLogoSrc.value = props.defaultLogo
}
</script>

<style scoped lang="scss">
.report-header-type3 {
  position: relative;
  background: radial-gradient(circle at 50% 0%, #ffffff 0%, #fafaf9 100%);
  border: 1px solid #e7e5e4;
  border-radius: 14px;
  padding: 14px 22px 12px 22px;
  overflow: hidden;
  box-shadow: 0 4px 20px -6px rgba(0, 0, 0, 0.05);
  direction: rtl;
  margin-bottom: 14px;
  box-sizing: border-box;
}

/* ─── پترن نامحسوس ژئومتریک در بک‌گراند ─── */
.art-background-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: radial-gradient(#78716c 1px, transparent 1px);
  background-size: 16px 16px;
  pointer-events: none;
}

/* ─── ریبون طلایی بالا با نشان کریستالی ─── */
.luxury-top-ribbon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;

  .ribbon-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d97706 50%, transparent);
    opacity: 0.5;
  }

  .ribbon-gem {
    color: #d97706;
    font-size: 9px;
    line-height: 1;
  }
}

/* ─── گرید اصلی هدر ─── */
.header-main-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr 1.05fr;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 1;
}

/* ─── بال راست: پرتره و نام دانش‌آموز ─── */
.student-art-wing {
  display: flex;
  align-items: center;
  gap: 14px;

  .portrait-medallion {
    position: relative;
    flex-shrink: 0;

    .gold-ring {
      width: 64px;
      height: 74px;
      border-radius: 10px;
      padding: 2.5px;
      background: linear-gradient(135deg, #f59e0b 0%, #b45309 50%, #d97706 100%);
      box-shadow: 0 3px 10px rgba(217, 119, 6, 0.2);

      .portrait-img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        background: #f5f5f4;
        display: block;
      }
    }
  }

  .student-details {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .student-salutation {
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: #78716c;
      margin-bottom: 1px;
    }

    .student-full-name {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      color: #1c1917;
      letter-spacing: -0.4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .student-credentials {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-top: 5px;

      .cred-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #57534e;

        .dot-gold {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d97706;
          display: inline-block;
        }

        .code-font {
          font-family: monospace, sans-serif;
          letter-spacing: 0.5px;
          color: #292524;
        }
      }
    }
  }
}

/* ─── بال مرکزی: نشان، مدرسه و عنوان ─── */
.center-crest-wing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 10px;
  border-right: 1px solid rgba(214, 211, 209, 0.5);
  border-left: 1px solid rgba(214, 211, 209, 0.5);

  .school-insignia {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    .crest-frame {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid #e7e5e4;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

      .crest-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .school-display-name {
      margin: 0;
      font-size: 14.5px;
      font-weight: 800;
      color: #292524;
      line-height: 1.2;
      max-width: 210px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .report-royal-title {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
    color: #fef08a;
    padding: 3px 14px;
    border-radius: 20px;
    border: 1px solid #d97706;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .title-text {
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.2px;
      color: #ffffff;
    }

    .ornament-bracket {
      color: #f59e0b;
      font-size: 14px;
      font-weight: 300;
      line-height: 1;
    }
  }
}

/* ─── بال چپ: مشخصات تحصیلی و ارتباطی ─── */
.period-art-wing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;

  .academic-cohort-card {
    background: #ffffff;
    border: 1px solid #e7e5e4;
    border-right: 3px solid #d97706;
    border-radius: 6px;
    padding: 6px 10px;
    width: 100%;
    max-width: 200px;
    box-sizing: border-box;

    .cohort-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      line-height: 1.5;

      .cohort-label {
        color: #78716c;
        font-weight: 500;
      }

      .cohort-val {
        color: #1c1917;
        font-weight: 700;
      }

      .code-font {
        font-family: monospace, sans-serif;
      }
    }
  }

  .school-footer-contact {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #78716c;
    direction: ltr;

    .contact-icon {
      color: #d97706;
    }

    .phone-number {
      font-family: monospace, sans-serif;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }
}

/* ─── نوار دکوراتیو پایین ─── */
.artistic-bottom-border {
  height: 2px;
  margin-top: 10px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #e7e5e4 20%,
    #d97706 50%,
    #e7e5e4 80%,
    transparent 100%
  );
  opacity: 0.7;
}

/* ─── استاندارد خروجی پرینت و پی‌دی‌اف ─── */
@media print {
  .report-header-type3 {
    border-color: #d6d3d1 !important;
    background: #ffffff !important;
    box-shadow: none !important;
    padding: 8px 16px 8px 16px !important;
    margin-bottom: 10px !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .art-background-pattern {
    display: none !important;
  }

  .gold-ring {
    box-shadow: none !important;
    border: 2px solid #d97706 !important;
    background: none !important;
  }

  .report-royal-title {
    background: #292524 !important;
    color: #ffffff !important;
    border: 1px solid #b45309 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .academic-cohort-card {
    border-color: #d6d3d1 !important;
    border-right-color: #d97706 !important;
  }
}
</style>
