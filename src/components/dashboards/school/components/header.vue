<template>
  <div class="school-dashboard">
    <div class="welcome-hero q-mb-lg">
      <!-- لایه‌های نوری زنده و پس‌زمینه شیشه‌ای داینامیک فشرده -->
      <div class="hero-liquid-canvas">
        <div class="aurora-orb orb-cyan" />
        <div class="aurora-orb orb-indigo" />
        <div class="aurora-orb orb-sunset" />
        <div class="dynamic-mesh-grid" />
        <div class="frost-glass-overlay" />
        <div class="specular-reflection" />
      </div>

      <div class="hero-inner-container q-px-lg q-py-md">
        <!-- ردیف بالا: عنوان، بج وضعیت و لوگوی اختصاصی سنجاد -->
        <div class="row items-center justify-between no-wrap q-col-gutter-x-md">
          <!-- ستون اطلاعات و تیتر -->
          <div class="col-grow hero-text-col">
            <div class="badge-smart-pill q-mb-xs">
              <span class="pulsing-radar-dot" />
              <q-icon
                name="auto_awesome"
                size="15px"
                class="q-mr-xs text-amber-8 spin-sparkle" />
              <span class="pill-text">سامانه هوشمند سنجاد</span>
              <span class="status-live-chip">فعال</span>
            </div>

            <h1 class="hero-main-title text-h5 text-weight-bolder q-my-none">
              داشبورد مدیریت
              <span class="chromatic-gradient-text">
                {{ schoolName || 'مدرسه' }}
              </span>
            </h1>

            <p class="hero-lead-description text-caption q-mt-xs q-mb-none">
              گزارش عملکرد، شاخص‌های کلیدی و پایش لحظه‌ای امور آموزشی و سنجش
            </p>
          </div>

          <!-- ستون تصویر لوگوی پنل با افکت معلق و درخشان -->
          <div class="col-auto">
            <div class="floating-logo-pod">
              <div class="energy-field" />
              <div class="logo-core">
                <img
                  src="/images/logo.png"
                  alt="لوگوی سامانه"
                  class="panel-logo-img"
                  loading="eager">
              </div>
              <span class="cosmic-dust cd-1">✦</span>
              <span class="cosmic-dust cd-2">★</span>
              <span class="cosmic-dust cd-3">✧</span>
            </div>
          </div>
        </div>

        <!-- جداکننده ظریف نوری -->
        <div class="hero-divider q-my-sm" />

        <!-- ردیف پایین: کارت‌های دسترسی سریع فشرده (Compact Quick Actions) -->
        <div class="quick-actions-bar">
          <div class="row q-col-gutter-sm">
            <div
              v-for="action in quickActions"
              :key="action.label"
              class="col-12 col-sm-4">
              <q-card
                v-ripple
                flat
                class="quick-action-card cursor-pointer"
                @click="$router.push(action.to)">
                <div class="card-shimmer" />
                <div class="row items-center no-wrap full-height q-px-sm q-py-xs">
                  <!-- آیکون کپسولی مینیاتوری -->
                  <div
                    class="action-icon-wrapper flex flex-center q-mr-sm"
                    :style="{
                      backgroundColor: action.bgColor,
                      color: action.color,
                      boxShadow: `0 4px 12px -2px ${action.color}35`
                    }">
                    <q-icon
                      :name="action.icon"
                      size="20px" />
                  </div>

                  <!-- متن دسترسی فشرده -->
                  <div class="action-info-col ellipsis">
                    <div class="action-label text-weight-bold ellipsis">
                      {{ action.label }}
                    </div>
                    <div class="action-caption text-caption ellipsis">
                      {{ action.caption }}
                    </div>
                  </div>

                  <!-- پیکان هدایتگر ظریف -->
                  <div class="action-arrow q-ml-xs">
                    <q-icon
                      name="arrow_back_ios_new"
                      size="12px" />
                  </div>
                </div>
              </q-card>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ schoolName?: string }>()

interface QuickAction {
  label: string
  caption: string
  icon: string
  bgColor: string
  color: string
  to: RouteLocationRaw
}

const quickActions: QuickAction[] = [
  {
    label: 'آزمون آنلاین جدید',
    caption: 'طراحی آزمون و سوالات تستی',
    icon: 'quiz',
    bgColor: '#e0f2fe',
    color: '#0284c7',
    to: { name: 'Panel.Exam.Online.Create' }
  },
  {
    label: 'ثبت نمره',
    caption: 'ورود نمرات آزمون حضوری',
    icon: 'fact_check',
    bgColor: '#dcfce7',
    color: '#16a34a',
    to: { name: 'Panel.Exam.InPerson.Create' }
  },
  {
    label: 'تعریف تکلیف',
    caption: 'ارسال تمرین و تکالیف کلاسی',
    icon: 'assignment_add',
    bgColor: '#fef3c7',
    color: '#d97706',
    to: { name: 'Panel.Homework.Create' }
  }
]
</script>

<style lang="scss" scoped>
.school-dashboard {
  /* ==========================================================================
     💎 بنر هدر شیشه‌ای و فوق فشرده
     ========================================================================== */
  .welcome-hero {
    position: relative;
    border-radius: 22px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.88) 0%,
      rgba(248, 250, 252, 0.72) 50%,
      rgba(241, 245, 249, 0.82) 100%
    );
    overflow: hidden;
    isolation: isolate;
    border: 1px solid rgba(255, 255, 255, 0.95);
    box-shadow:
      0 12px 30px -10px rgba(99, 102, 241, 0.12),
      0 0 0 1px rgba(226, 232, 240, 0.6) inset,
      0 1px 2px rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);

    /* 🌊 بوم نوری متحرک و ملایم */
    .hero-liquid-canvas {
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: 1;
      pointer-events: none;

      .aurora-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.6;
        will-change: transform;
      }

      .orb-cyan {
        top: -25%;
        right: -5%;
        width: 280px;
        height: 280px;
        background: radial-gradient(circle, #38bdf8 0%, #06b6d4 50%, transparent 80%);
        animation: floatOrbA 10s cubic-bezier(0.4, 0, 0.2, 1) 7s infinite alternate;
      }

      .orb-indigo {
        bottom: -35%;
        right: 30%;
        width: 320px;
        height: 320px;
        background: radial-gradient(circle, #818cf8 0%, #c084fc 55%, transparent 80%);
        animation: floatOrbB 7s cubic-bezier(0.4, 0, 0.2, 1) 3s infinite alternate;
      }

      .orb-sunset {
        top: 15%;
        left: -10%;
        width: 260px;
        height: 260px;
        background: radial-gradient(circle, #fb7185 0%, #fed7aa 60%, transparent 80%);
        animation: floatOrbC 10s cubic-bezier(0.4, 0, 0.2, 1) 5s infinite alternate;
      }

      .dynamic-mesh-grid {
        position: absolute;
        inset: -40px;
        background-image:
          radial-gradient(circle, rgba(99, 102, 241, 0.14) 1.2px, transparent 1.5px),
          linear-gradient(rgba(226, 232, 240, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(226, 232, 240, 0.3) 1px, transparent 1px);
        background-size: 24px 24px, 48px 48px, 48px 48px;
        animation: smoothGridDrift 40s linear infinite;
        opacity: 0.5;
      }

      .frost-glass-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          125deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.15) 100%
        );
      }

      .specular-reflection {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1.5px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.95) 40%,
          rgba(255, 255, 255, 0.95) 60%,
          transparent 100%
        );
      }
    }

    .hero-inner-container {
      position: relative;
      z-index: 2;
    }

    /* 🏷️ نشان هوشمند کپسولی مینیاتوری */
    .badge-smart-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px 3px 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(226, 232, 240, 0.9);
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(8px);

      .pulsing-radar-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #10b981;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          inset: -2.5px;
          border-radius: 50%;
          border: 1.5px solid #10b981;
          animation: radarPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      }

      .pill-text {
        font-size: 0.78rem;
        font-weight: 700;
        color: #334155;
      }

      .status-live-chip {
        font-size: 0.65rem;
        font-weight: 800;
        color: #059669;
        background: #ecfdf5;
        padding: 1px 6px;
        border-radius: 999px;
        border: 1px solid #a7f3d0;
      }
    }

    .hero-main-title {
      color: #0f172a;
      line-height: 1.3;
      letter-spacing: -0.4px;

      .chromatic-gradient-text {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0284c7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
        padding: 0 3px;
      }
    }

    .hero-lead-description {
      color: #64748b;
      font-weight: 500;
      line-height: 1.4;
    }

    /* 🖼️ بخش لوگوی شناور مدرن و شکیل */
    .floating-logo-pod {
      position: relative;
      width: 76px;
      height: 76px;
      display: flex;
      align-items: center;
      justify-content: center;

      .energy-field {
        position: absolute;
        inset: -2px;
        border-radius: 20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
        filter: blur(10px);
        animation: energyPulse 4s ease-in-out infinite alternate;
      }

      .logo-core {
        position: relative;
        z-index: 2;
        width: 80px;
        height: 80px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        box-shadow:
          0 10px 22px -6px rgba(79, 70, 229, 0.2),
          0 0 0 1px rgba(226, 232, 240, 0.7);
        animation: bobFloat 5s ease-in-out infinite;
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

        &:hover {
          transform: translateY(-4px) scale(1.08) rotate(3deg);
        }

        .panel-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.08));
        }
      }

      .cosmic-dust {
        position: absolute;
        font-weight: bold;
        pointer-events: none;
        animation: cosmicTwinkle 3s ease-in-out infinite alternate;

        &.cd-1 {
          top: -2px;
          right: 0px;
          color: #f59e0b;
          font-size: 15px;
        }
        &.cd-2 {
          bottom: 4px;
          right: -8px;
          color: #06b6d4;
          font-size: 12px;
          animation-delay: 0.8s;
        }
        &.cd-3 {
          top: 8px;
          left: -6px;
          color: #ec4899;
          font-size: 14px;
          animation-delay: 1.6s;
        }
      }
    }

    /* خط جداکننده باریک و کریستالی */
    .hero-divider {
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(226, 232, 240, 0) 0%,
        rgba(226, 232, 240, 0.8) 20%,
        rgba(226, 232, 240, 0.8) 80%,
        rgba(226, 232, 240, 0) 100%
      );
    }

    /* ==========================================================================
       ⚡ کارت‌های دسترسی سریع (نسخه بهینه و فشرده)
       ========================================================================== */
    .quick-actions-bar {
      .quick-action-card {
        position: relative;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.95);
        box-shadow:
          0 4px 12px -3px rgba(15, 23, 42, 0.04),
          0 0 0 1px rgba(226, 232, 240, 0.6);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        overflow: hidden;

        .card-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255, 255, 255, 0) 35%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 65%,
            transparent 100%
          );
          transform: translateX(100%);
          transition: transform 0.65s ease;
          pointer-events: none;
        }

        &:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow:
            0 10px 20px -5px rgba(79, 70, 229, 0.12),
            0 0 0 1px rgba(99, 102, 241, 0.2);

          .card-shimmer {
            transform: translateX(-100%);
          }

          .action-icon-wrapper {
            transform: scale(1.08) rotate(-6deg);
          }

          .action-arrow {
            transform: translateX(-3px);
            color: #4f46e5;
          }
        }

        .action-icon-wrapper {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 11px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .action-info-col {
          flex: 1;

          .action-label {
            font-size: 0.88rem;
            color: #1e293b;
            line-height: 1.3;
          }

          .action-caption {
            color: #64748b;
            font-size: 0.72rem;
            line-height: 1.2;
          }
        }

        .action-arrow {
          color: #94a3b8;
          transition: all 0.25s ease;
        }
      }
    }
  }

  /* ==========================================================================
     🌀 انیمیشن‌ها
     ========================================================================== */
  @keyframes smoothGridDrift {
    0% { transform: translate(0, 0); }
    100% { transform: translate(48px, 48px); }
  }

  @keyframes floatOrbA {
    0% { transform: translate(125, -125) scale(0.5); }
    100% { transform: translate(-85px, 105px) scale(3.7); }
  }

  @keyframes floatOrbB {
    0% { transform: translate(-120px, 75px) scale(1); }
    100% { transform: translate(140px, -75px) scale(2.8); }
  }

  @keyframes floatOrbC {
    0% { transform: translate(10px, 0px) scale(0.9); }
    100% { transform: translate(-130px, 0px) scale(2.7); }
  }

  @keyframes bobFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(-2deg); }
  }

  @keyframes energyPulse {
    0% { transform: scale(0.9); opacity: 0.3; }
    100% { transform: scale(1.25); opacity: 0.8; }
  }

  @keyframes radarPing {
    0% { transform: scale(1); opacity: 0.9; }
    100% { transform: scale(2.6); opacity: 0; }
  }

  @keyframes cosmicTwinkle {
    0% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.2) rotate(45deg); filter: drop-shadow(0 0 4px currentColor); }
    100% { opacity: 0.3; transform: scale(0.9) rotate(90deg); }
  }

  .spin-sparkle {
    animation: slowSpin 8s linear infinite;
  }

  @keyframes slowSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}
</style>
