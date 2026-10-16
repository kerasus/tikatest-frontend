<template>
  <div class="school-dashboard">
    <div class="row q-col-gutter-lg q-mb-xl">
      <div
        v-for="(card, index) in statCards"
        :key="index"
        class="col-12 col-sm-6 col-lg-3">
        <q-card
          v-ripple
          class="stat-card cursor-pointer"
          :class="`stat-card--${card.theme}`"
          flat
          @click="toStat(card.to)">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="stat-label text-subtitle2 text-weight-medium">{{ card.title }}</div>
                <div class="stat-value text-h3 text-weight-bolder q-mt-xs">
                  <q-skeleton
                    v-if="loading"
                    type="text"
                    width="80px"
                    height="48px" />
                  <span v-else>{{ card.value.toLocaleString('fa-IR') }}</span>
                </div>
              </div>
              <div class="stat-icon-wrapper flex flex-center">
                <q-icon
                  :name="card.icon"
                  size="32px" />
              </div>
            </div>

            <!-- فوتر کوچک برای حس زنده بودن داده‌ها + آیکون فلش شیک -->
            <div class="stat-footer row items-center justify-between q-mt-md text-caption">
              <div class="row items-center no-wrap">
                <q-icon
                  :name="card.subIcon"
                  size="16px"
                  class="q-mr-xs" />
                <span>{{ card.subText }}</span>
              </div>
              <q-icon
                name="arrow_forward"
                size="14px"
                class="stat-footer__arrow" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'

const props = defineProps<{
  loading: boolean
  stats: { students: number, classes: number, exams: number, homework: number }
}>()

const router = useRouter()
const statCards = computed(() => [
  {
    title: 'دانش‌آموزان ثبت‌نامی',
    value: props.stats.students,
    icon: 'groups',
    theme: 'indigo',
    subIcon: 'trending_up',
    subText: 'کل محصلین فعال',
    to: { name: 'Panel.Student.List' }
  },
  {
    title: 'مدیریت کلاس‌ها',
    value: props.stats.classes,
    icon: 'class',
    theme: 'emerald',
    subIcon: 'domain',
    subText: 'پایه‌ها و گروه‌ها',
    to: { name: 'Panel.CurrentSchool.Classes' }
  },
  {
    title: 'آزمون‌های ساخته شده',
    value: props.stats.exams,
    icon: 'quiz',
    theme: 'rose',
    subIcon: 'fact_check',
    subText: 'آنلاین و تستی',
    to: { name: 'Panel.Exam.Online.List' }
  },
  {
    title: 'تکالیف ثبت‌شده',
    value: props.stats.homework,
    icon: 'assignment',
    theme: 'amber',
    subIcon: 'task_alt',
    subText: 'پروژه‌ها و تمرین‌ها',
    to: { name: 'Panel.Homework.List' }
  }
])

function toStat (route: RouteLocationRaw) {
  router.push(route)
}
</script>

<style lang="scss" scoped>
.school-dashboard {
  /* Stat Cards */
  .stat-card {
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -2px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-6px);
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.08),
        0 8px 10px -6px rgba(0, 0, 0, 0.04);
    }

    .stat-icon-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      transition: transform 0.3s ease;
    }

    &:hover .stat-icon-wrapper {
      transform: scale(1.1) rotate(6deg);
    }

    /* Themes */
    &--indigo {
      .stat-icon-wrapper {
        background: #e0e7ff;
        color: #4f46e5;
      }
      .stat-value {
        color: #3730a3;
      }
      .stat-label,
      .stat-footer {
        color: #6366f1;
      }
    }

    &--emerald {
      .stat-icon-wrapper {
        background: #d1fae5;
        color: #059669;
      }
      .stat-value {
        color: #065f46;
      }
      .stat-label,
      .stat-footer {
        color: #10b981;
      }
    }

    &--rose {
      .stat-icon-wrapper {
        background: #ffe4e6;
        color: #e11d48;
      }
      .stat-value {
        color: #9f1239;
      }
      .stat-label,
      .stat-footer {
        color: #f43f5e;
      }
    }

    &--amber {
      .stat-icon-wrapper {
        background: #fef3c7;
        color: #d97706;
      }
      .stat-value {
        color: #92400e;
      }
      .stat-label,
      .stat-footer {
        color: #f59e0b;
      }
    }
  }

}
</style>
