<template>
  <div class="school-dashboard">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-12">
        <q-card
          class="action-card"
          flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="section-title text-h6 text-weight-bold">
                <q-icon
                  name="bolt"
                  color="amber-8"
                  size="24px"
                  class="q-mr-xs" />
                دسترسی‌های سریع و پرکاربرد
              </div>
              <span class="text-caption text-grey-6">میان‌برهای سامانه</span>
            </div>

            <div class="row q-col-gutter-md">
              <div
                v-for="(action, idx) in quickActions"
                :key="idx"
                class="col-6 col-sm-4">
                <q-btn
                  flat
                  no-caps
                  class="quick-action-btn full-width"
                  :to="action.to">
                  <div class="column items-center q-py-sm">
                    <div
                      class="action-icon-circle q-mb-sm"
                      :style="{ backgroundColor: action.bgColor, color: action.color }">
                      <q-icon
                        :name="action.icon"
                        size="24px" />
                    </div>
                    <div class="text-weight-bold text-body2 text-grey-9">{{ action.label }}</div>
                    <div class="text-caption text-grey-6">{{ action.caption }}</div>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- وضعیت اسکای‌روم و کلاس‌های آنلاین -->
      <div
        v-if="false"
        class="col-12 col-lg-4">
        <q-card
          class="action-card skyroom-preview-card"
          flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="section-title text-h6 text-weight-bold">
                <q-icon
                  name="video_camera_front"
                  color="primary"
                  size="24px"
                  class="q-mr-xs" />
                کلاس آنلاین (اسکای‌روم)
              </div>
              <q-badge
                color="positive"
                rounded
                floating
                label="فعال" />
            </div>

            <p class="text-body2 text-grey-7 line-height-relaxed">
              اتاق‌ها و زمان‌بندی جلسات اسکای‌روم را بررسی، پیکربندی یا همگام‌سازی کنید.
            </p>

            <div class="q-mt-lg flex flex-center">
              <q-btn
                unelevated
                color="primary"
                rounded
                icon="meeting_room"
                label="مدیریت اتاق‌های اسکای‌روم"
                class="full-width q-py-sm text-weight-bold"
                to="/school/skyroom" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const quickActions = [
  {
    label: 'آزمون آنلاین جدید',
    caption: 'طراحی آزمون و سوالات تستی',
    icon: 'quiz', // یا 'laptop_chromebook' / 'timer'
    bgColor: '#e0f2fe',
    color: '#0284c7', // تم آبی آسمانی/تکنولوژی و آزمون آنلاین
    to: { name: 'Panel.Exam.Online.Create' }
  },
  {
    label: 'ثبت نمره',
    caption: 'ورود نمرات آزمون حضوری',
    icon: 'fact_check', // یا 'grade' / 'edit_note'
    bgColor: '#dcfce7',
    color: '#16a34a', // تم سبز ارزیابی، ثبت نمره و موفقیت
    to: { name: 'Panel.Exam.InPerson.Create' }
  },
  {
    label: 'تعریف تکلیف',
    caption: 'ارسال تمرین و تکالیف کلاسی',
    icon: 'assignment_add', // یا 'menu_book' / 'history_edu'
    bgColor: '#fef3c7',
    color: '#d97706', // تم کهربایی/نارنجی تکالیف و کار در منزل
    to: { name: 'Panel.Homework.Create' }
  }
]
</script>

<style lang="scss" scoped>
.school-dashboard {
  /* Action Cards */
  .action-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

    .section-title {
      color: #1e293b;
    }
  }

  /* Quick Action Buttons */
  .quick-action-btn {
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
    background: #f8fafc;
    transition: all 0.25s ease;

    &:hover {
      background: #ffffff;
      border-color: #6366f1;
      transform: translateY(-3px);
      box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.1);
    }

    .action-icon-circle {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    &:hover .action-icon-circle {
      transform: scale(1.1);
    }
  }

  .skyroom-preview-card {
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;

    .line-height-relaxed {
      line-height: 1.8;
    }
  }
}
</style>
