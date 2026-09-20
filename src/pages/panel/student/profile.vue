<template>
  <div class="student-profile-page q-pa-md q-pa-lg-lg">
    <!-- هدر فانتزی / کارت شناور دانش‌آموزی -->
    <q-card
      flat
      class="profile-hero-card shadow-3">
      <div class="hero-cover">
        <div class="floating-bubble bubble-1" />
        <div class="floating-bubble bubble-2" />
        <div class="pattern-mesh" />

        <div class="status-chip row items-center q-gutter-xs">
          <span class="live-dot" />
          <span class="text-caption text-weight-bold">دانش‌آموز فعال تیکاتست</span>
        </div>
      </div>

      <div class="hero-content q-px-lg q-pb-lg">
        <div class="avatar-box">
          <q-avatar
            size="116px"
            class="student-avatar shadow-8">
            <img
              :src="user?.picture || '/images/blankProfile.png'"
              alt="Student Avatar">
          </q-avatar>
          <div class="verified-badge shadow-2">
            <q-icon
              name="verified"
              size="18px"
              color="white" />
          </div>
        </div>

        <div class="student-intro q-mt-sm">
          <div class="row items-center q-gutter-sm">
            <h1 class="student-name q-ma-none">
              {{ user?.first_name }} {{ user?.last_name }}
            </h1>
            <span
              v-if="user?.username"
              class="student-tag">@{{ user.username }}</span>
          </div>

          <div class="school-affiliation row items-center q-gutter-xs q-mt-xs">
            <q-icon
              name="school"
              color="secondary"
              size="16px" />
            <span class="text-caption text-weight-medium text-grey-8">
              {{ currentSchoolName }}
            </span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- بخش کارت‌های ویترین اطلاعات (صرفاً نمایشی و جذاب) -->
    <div class="row q-col-gutter-lg q-mt-md">
      <!-- ستون ۱: کارت هویت دانش‌آموزی دیجیتال -->
      <div class="col-12 col-md-5">
        <q-card
          flat
          class="digital-card shadow-2">
          <div class="card-chip-top row items-center justify-between">
            <div class="row items-center q-gutter-xs">
              <q-icon
                name="auto_awesome"
                color="amber-8"
                size="20px" />
              <span class="text-subtitle2 text-weight-bolder text-white">کارت هویت دیجیتال</span>
            </div>
            <span class="id-type-badge">Tika Pass</span>
          </div>

          <div class="card-details q-pa-md">
            <div class="id-row">
              <span class="label">کد ملی دانش‌آموز</span>
              <span class="value ltr-text">{{ user?.national_id || 'نامشخص' }}</span>
            </div>

            <div class="id-row">
              <span class="label">تلفن همراه ثبت‌شده</span>
              <span class="value ltr-text">{{ user?.mobile || 'ثبت نشده' }}</span>
            </div>

            <div class="id-row">
              <span class="label">شناسه کاربری</span>
              <span class="value ltr-text">#{{ user?.id }}</span>
            </div>

            <q-separator
              class="q-my-sm"
              style="background: rgba(255,255,255,0.15);" />

            <div class="security-stamp row items-center q-gutter-xs">
              <q-icon
                name="security"
                size="16px"
                color="teal-2" />
              <span class="text-caption text-white-8">تأیید هویت شده توسط واحد آموزش</span>
            </div>
          </div>
        </q-card>

        <!-- باکس باحال تذکر و راهنما -->
        <div class="fun-support-card q-pa-md q-mt-md shadow-1">
          <div class="row items-start q-gutter-sm no-wrap">
            <div class="bulb-circle">
              <q-icon
                name="lightbulb"
                color="white"
                size="20px" />
            </div>
            <div>
              <div class="text-weight-bold text-neutral-dark text-body2">اطلاعاتت نیاز به ویرایش داره؟</div>
              <p class="text-caption text-grey-7 q-ma-none q-mt-xs line-height-md">
                برای حفظ سوابق آزمون‌ها و پرونده تحصیلی، مشخصات فردی مستقیماً از سامانه مدرسه کنترل میشه. برای هرگونه تغییر به معاونت یا مسئول فناوری مدرست پیام بده! 😉
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ستون ۲: مشخصات فردی با دیزاین کارت‌های گلس‌مورفیک کوچک -->
      <div class="col-12 col-md-7">
        <q-card
          flat
          class="data-hub-card shadow-1 q-pa-md q-pa-lg-md">
          <div class="hub-header row items-center justify-between q-pb-md">
            <div class="row items-center q-gutter-sm">
              <q-icon
                name="fingerprint"
                color="primary"
                size="24px" />
              <span class="text-subtitle1 text-weight-bold text-neutral-dark">پرونده تحصیلی و فردی</span>
            </div>
            <q-badge
              color="grey-3"
              text-color="grey-8"
              class="q-px-sm q-py-xs rounded-borders">
              صرفاً جهت مشاهده
            </q-badge>
          </div>

          <div class="row q-col-gutter-md q-mt-xs">
            <div class="col-12 col-sm-6">
              <div class="stat-box">
                <div class="stat-icon-wrapper bg-blue-1">
                  <q-icon
                    name="person"
                    color="primary"
                    size="22px" />
                </div>
                <div class="stat-content">
                  <span class="stat-label">نام کامل</span>
                  <span class="stat-value">{{ user?.first_name }} {{ user?.last_name }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="stat-box">
                <div class="stat-icon-wrapper bg-purple-1">
                  <q-icon
                    name="alternate_email"
                    color="secondary"
                    size="22px" />
                </div>
                <div class="stat-content">
                  <span class="stat-label">نام کاربری</span>
                  <span class="stat-value ltr-text">{{ user?.username || '-' }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="stat-box">
                <div class="stat-icon-wrapper bg-teal-1">
                  <q-icon
                    name="mail"
                    color="teal"
                    size="22px" />
                </div>
                <div class="stat-content">
                  <span class="stat-label">رایانامه (ایمیل)</span>
                  <span class="stat-value ltr-text text-truncate">{{ user?.email || 'ثبت نشده' }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="stat-box">
                <div class="stat-icon-wrapper bg-orange-1">
                  <q-icon
                    name="badge"
                    color="orange-8"
                    size="22px" />
                </div>
                <div class="stat-content">
                  <span class="stat-label">نقش سامانه</span>
                  <span class="stat-value text-secondary">دانش‌آموز (Student)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- بخش مدارس متصل -->
          <div class="schools-section q-mt-lg">
            <span class="text-subtitle2 text-weight-bold text-grey-8 block q-mb-sm">مدرسه / موسسه فعال:</span>
            <div
              v-if="user?.schools && user.schools.length"
              class="row q-col-gutter-sm">
              <div
                v-for="sch in user.schools"
                :key="sch.id || sch.pivot?.school_id"
                class="col-12">
                <div class="school-banner row items-center justify-between q-pa-sm">
                  <div class="row items-center q-gutter-sm">
                    <q-avatar
                      size="36px"
                      color="white"
                      text-color="primary"
                      class="shadow-1">
                      <img
                        v-if="sch.logo"
                        :src="sch.logo">
                      <q-icon
                        v-else
                        name="account_balance"
                        size="20px" />
                    </q-avatar>
                    <div>
                      <div class="text-weight-bold text-body2 text-neutral-dark">{{ sch.name }}</div>
                      <div class="text-caption text-grey-6">{{ sch.address || 'شعبه مرکزی' }}</div>
                    </div>
                  </div>
                  <q-badge
                    color="positive"
                    class="q-px-sm"
                    rounded>عضو رسمی</q-badge>
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-caption text-grey-6 bg-grey-1 q-pa-md rounded-borders text-center">
              در حال حاضر مدرسه‌ای به این حساب متصل نیست.
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUser } from 'src/stores/user'
import { type UserType } from 'src/repositories/user'

const userManager = useUser()

const user = computed<UserType | null>(() => userManager.me)

const currentSchoolName = computed(() => {
  if (user.value?.schools && user.value.schools.length > 0) {
    return user.value.schools[0].name
  }
  return 'پلتفرم آزمون تیکاتست'
})
</script>

<style scoped lang="scss">
.student-profile-page {
  max-width: 1080px;
  margin: 0 auto;
}

/* هدر فانتزی و رنگارنگ */
.profile-hero-card {
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.04);

  .hero-cover {
    height: 130px;
    background: linear-gradient(135deg, #5b36e8 0%, #3a88e9 50%, #00d2ff 100%);
    position: relative;
    overflow: hidden;

    .pattern-mesh {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.25) 1.5px, transparent 1.5px);
      background-size: 16px 16px;
    }

    .floating-bubble {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(4px);
    }
    .bubble-1 { width: 90px; height: 90px; top: -20px; left: 10%; }
    .bubble-2 { width: 60px; height: 60px; bottom: -10px; right: 25%; }

    .status-chip {
      position: absolute;
      top: 14px;
      left: 16px;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
      color: #ffffff;

      .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00e676;
        box-shadow: 0 0 8px #00e676;
      }
    }
  }

  .hero-content {
    display: flex;
    align-items: flex-end;
    gap: 20px;

    .avatar-box {
      position: relative;
      margin-top: -58px;

      .student-avatar {
        border: 4px solid #ffffff;
        background: #ffffff;
        img { object-fit: cover; }
      }

      .verified-badge {
        position: absolute;
        bottom: 6px;
        right: 4px;
        background: #00c853;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
      }
    }

    .student-intro {
      flex: 1;

      .student-name {
        font-size: 1.4rem;
        font-weight: 800;
        color: #1e1e2d;
      }

      .student-tag {
        font-size: 0.85rem;
        color: #7e8299;
        direction: ltr;
      }
    }
  }
}

/* کارت دیجیتال گرادیانی شبیه کارت اعتباری/گیمینگ */
.digital-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #2a2b3d 0%, #1e1e2d 100%);
  color: #ffffff;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);

  .card-chip-top {
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .id-type-badge {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 1px;
      color: #ffb300;
      background: rgba(255, 179, 0, 0.15);
      padding: 3px 8px;
      border-radius: 6px;
    }
  }

  .id-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

    .label {
      font-size: 0.8rem;
      color: #a1a5b7;
    }
    .value {
      font-size: 0.92rem;
      font-weight: 700;
      color: #f1f1f4;
    }
  }

  .text-white-8 { color: rgba(255, 255, 255, 0.7); }
}

/* کارت تذکر فان */
.fun-support-card {
  background: #fdfaf3;
  border: 1px dashed #fcd34d;
  border-radius: 16px;

  .bulb-circle {
    background: #f59e0b;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .line-height-md { line-height: 1.6; }
}

/* هاب اطلاعات فردی */
.data-hub-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);

  .hub-header {
    border-bottom: 1px solid #f1f2f6;
  }
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8f9fc;
  border-radius: 14px;
  border: 1px solid #edf0f5;

  .stat-icon-wrapper {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .stat-label {
      font-size: 0.72rem;
      color: #7e8299;
      font-weight: 600;
    }
    .stat-value {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e1e2d;
    }
  }
}

.school-banner {
  background: #f4f6fb;
  border-radius: 12px;
  border: 1px solid #e8ecf4;
}

.ltr-text {
  direction: ltr;
  display: inline-block;
}
</style>
