<template>
  <header class="report-header-playful">
    <!-- ستون ۱: دانش‌آموز (رنگ آبی آسمانی) -->
    <div class="col student-col">
      <div class="avatar-frame">
        <img
          :src="studentPhotoSrc"
          alt="Student"
          @error="handleImgError">
      </div>
      <div class="student-details">
        <h2 class="name">{{ student.first_name }} {{ student.last_name }}</h2>
        <div class="codes">
          <span class="code-item">کد: {{ student.student_profile?.code || '-' }}</span>
          <span class="code-item">ملی: {{ student.national_id || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- ستون ۲: مدرسه (مرکز - رنگ زرد خورشیدی) -->
    <div class="col center-col school-focus">
      <div class="logo-wrapper">
        <img
          :src="schoolLogoSrc"
          alt="Logo"
          @error="handleLogoError">
      </div>
      <h1 class="school-name">{{ school.name }}</h1>
      <div class="report-tag">{{ title }}</div>
    </div>

    <!-- ستون ۳: اطلاعات آموزشی (چگال و شاد) -->
    <div class="col academic-col">
      <div class="grid-info">
        <div class="info-row">
          <label>پایه:</label> <span>{{ academicLevelName }}</span>
        </div>
        <div class="info-row">
          <label>کلاس:</label> <span>{{ className }}</span>
        </div>
        <div class="info-row">
          <label>ترم:</label> <span>{{ termName }}</span>
        </div>
        <div class="info-row">
          <label>سال:</label> <span>{{ yearName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ReportCardSchool,
  ReportCardStudentInfoExtended
} from 'src/repositories/reportCard'

const props = defineProps<{
  student: ReportCardStudentInfoExtended;
  school: ReportCardSchool;
  title: string;
  academicLevelName?: string;
  yearName?: string;
  className: string;
  termName: string;
}>()

const defaultAvatar = '/images/blankProfile.png'
const defaultLogo = '/images/logo.png'

const studentPhotoSrc = ref(props.student?.picture || defaultAvatar)
const schoolLogoSrc = ref(props.school?.logo_url || defaultLogo)

const handleImgError = () => {
  studentPhotoSrc.value = defaultAvatar
}
const handleLogoError = () => {
  schoolLogoSrc.value = defaultLogo
}
</script>

<style scoped lang="scss">
.report-header-playful {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.2fr;
  align-items: center;
  padding: 15px;
  background: linear-gradient(to right, #e0f2fe, #fff9c4); /* گرادیانت ملایم آبی به زرد */
  border-radius: 15px; /* گوشه‌های گردتر */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  font-family: 'IRANSans', sans-serif; /* فونت کودکانه و گردتر */
  gap: 18px;
  border: 2px solid #bae6fd; /* حاشیه آبی روشن */
}

.col {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ستون دانش‌آموز (آبی آسمانی) */
.student-col {
  padding-left: 10px;
  border-left: 2px dashed #bae6fd;
}
.avatar-frame {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #dbeafe; /* حاشیه سفید دور عکس */
}
.avatar-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e3a8a;
} /* آبی تیره */
.codes {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;
}
.code-item {
  font-size: 9px;
  color: #3b82f6;
  font-weight: 600;
} /* آبی روشن */

/* ستون مدرسه (مرکزی - زرد) */
.school-focus {
  justify-content: center;
  flex-direction: column;
}
.logo-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: #fef3c7; /* پس‌زمینه زرد برای لوگو */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}
.logo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.school-name {
  margin: 5px 0 0;
  font-size: 13px;
  font-weight: 800;
  color: #92400e;
} /* قهوه‌ای پررنگ */
.report-tag {
  margin-top: 5px;
  padding: 3px 10px;
  background: #fbbf24; /* زرد تیره */
  color: #7c2d12;
  border-radius: 15px;
  font-size: 9px;
  font-weight: 700;
}

/* ستون آموزشی (چگال و شاد) */
.academic-col {
  background: rgba(255, 255, 255, 0.7); /* پس‌زمینه نیمه‌شفاف */
  padding: 10px;
  border-radius: 12px;
  border-left: 2px dashed #fcd34d; /* خط جداکننده زرد */
}
.grid-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}
.info-row label {
  color: #64748b;
  font-weight: 600;
}
.info-row span {
  color: #1e3a8a;
  font-weight: 700;
} /* آبی تیره برای مقادیر */

/* مدیا کوئری برای موبایل یا پرینت */
@media (max-width: 768px) {
  .report-header-playful {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 10px;
  }
  .student-col,
  .academic-col {
    border: none;
    padding: 5px 0;
  }
  .student-col {
    margin-bottom: 5px;
  }
  .academic-col {
    margin-top: 5px;
    background: rgba(255, 255, 255, 0.7);
    padding: 8px;
    border-radius: 10px;
  }
  .grid-info {
    grid-template-columns: 1fr 1fr;
  } /* دو ستونه بمونه */
}
</style>
