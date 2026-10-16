<template>
  <div class="auth-page flex flex-center">
    <!-- حباب‌های رنگی پرحرارت پس‌زمینه که هویت شیشه بهشون وابسته‌ست -->
    <div class="mesh-shape shape-1" />
    <div class="mesh-shape shape-2" />
    <div class="mesh-shape shape-3" />
    <div class="mesh-shape shape-4" />

    <!-- کارت اصلی با بافت شیشه فوق‌العاده واقعی -->
    <div class="liquid-glass-card row">

      <!-- ستون فرم لاگین -->
      <div class="col-12 col-md-6 form-col flex flex-center">
        <div class="form-wrapper">
          <!-- هدر و برندینگ -->
          <div class="brand-box text-center">
            <div
              class="logo-wrapper cursor-pointer"
              @click="goToHomePage">
              <q-img
                src="/images/logo.png"
                alt="سنجاد"
                class="brand-logo"
                fit="contain" />
            </div>
            <p class="brand-tagline">سامانه یکپارچه ارزیابی و آزمون‌های تحلیلی</p>
          </div>

          <!-- بخش قرارگیری فرم سنجاد -->
          <div class="form-slot-glass">
            <auth-component class="auth-component" />
          </div>

          <!-- لینک برگشت -->
          <div class="back-link-wrapper text-center">
            <span class="text-grey-7">بازگشت به </span>
            <a
              class="home-btn"
              @click="goToHomePage">صفحه اصلی</a>
          </div>
        </div>
      </div>



      <!-- جایگزین بخش showcase-col -->
      <div class="col-md-6 gt-sm showcase-col flex flex-center">
        <div class="showcase-visual-wrapper">
          <!-- آیکون و لوگوی بزرگ نورانی شیشه‌ای -->
          <div class="hero-glass-circle">
            <q-icon
              name="insights"
              size="64px"
              color="primary" />
          </div>

          <!-- کارت‌های آمار فلوتینگ شناور -->
          <div class="floating-card card-top">
            <q-icon
              name="trending_up"
              color="teal-6"
              size="24px" />
            <div>
              <div class="text-bold text-dark">گزارش‌های پیشرفت</div>
              <div class="text-caption text-grey-7">مسیر اختصاصی یادگیری</div>
            </div>
          </div>



          <div class="floating-card card-bottom">
            <q-icon
              name="bolt"
              color="amber-9"
              size="24px" />
            <div>
              <div class="text-bold text-dark">سریع و هوشمند</div>
              <div class="text-caption text-grey-7">پردازش آنی آزمون‌ها</div>
            </div>
          </div>
        </div>
      </div>






    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthComponent from 'src/components/AuthComponent.vue'

defineOptions({
  name: 'AuthPage'
})

const router = useRouter()

function goToHomePage () {
  router.push({ name: 'HomePage' })
}
</script>

<style lang="scss" scoped>
.auth-page {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  /* پس‌زمینه لایت گرادینت پرمایه */
  background: linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #f0fdf4 100%);
  padding: 1.5rem;
  box-sizing: border-box;

  /* المان‌های گرادینت متحرک زیر شیشه */
  .mesh-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(75px);
    pointer-events: none;
    z-index: 0;
  }

  .shape-1 {
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.55), rgba(192, 132, 252, 0.2));
    top: -100px;
    left: -50px;
    animation: floatShape 1s ease-in-out infinite alternate;
  }

  .shape-2 {
    width: 440px;
    height: 440px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.6), rgba(125, 211, 252, 0.2));
    bottom: -80px;
    right: 5%;
    animation: floatShape 1s ease-in-out infinite alternate-reverse;
  }

  .shape-3 {
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(251, 146, 60, 0.45), rgba(254, 215, 170, 0.15));
    top: 30%;
    right: 40%;
    animation: floatShape 1s ease-in-out infinite alternate;
  }

  .shape-4 {
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(244, 63, 94, 0.35), rgba(253, 164, 175, 0.15));
    bottom: 10%;
    left: 25%;
    animation: floatShape 1s ease-in-out infinite alternate-reverse;
  }

  /* کارت اصلی Glassmorphism با شکست نور و فیلتر اشباع */
  .liquid-glass-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1040px;
    min-height: 600px;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(28px) saturate(190%);
    -webkit-backdrop-filter: blur(28px) saturate(190%);
    border-radius: 28px;
    border: 1.5px solid rgba(255, 255, 255, 0.75);
    box-shadow:
      0 30px 60px -12px rgba(100, 116, 139, 0.25),
      0 12px 24px -8px rgba(100, 116, 139, 0.15),
      inset 0 1px 2px rgba(255, 255, 255, 0.9);
    overflow: hidden;
  }

  /* ستون لاگین */
  .form-col {
    padding: 3rem 2.5rem;

    .form-wrapper {
      width: 100%;
      max-width: 390px;
    }

    .brand-box {
      margin-bottom: 1.5rem;

      .logo-wrapper {
        $logo-size: 240px;
        width: $logo-size;
        height: $logo-size;
        margin: 0 auto;
        padding: 0;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

        &:hover {
          transform: translateY(-3px) scale(1.06);
        }

        .brand-logo {
          width: 100%;
          height: 100%;
        }
      }

      .brand-tagline {
        font-size: 0.85rem;
        color: #64748b;
        margin-top: 0.25rem;
      }
    }

    /* کادر داخلی شفاف زیر فرم */
    .form-slot-glass {
      background: rgba(255, 255, 255, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 1.25rem 0.85rem;
      box-shadow: 0 4px 16px rgba(148, 163, 184, 0.1);
    }

    .back-link-wrapper {
      margin-top: 1.5rem;
      font-size: 0.88rem;

      .home-btn {
        color: #6366f1;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        margin-right: 4px;
        transition: color 0.2s ease;

        &:hover {
          color: #4338ca;
          text-decoration: underline;
        }
      }
    }
  }

  /* ستون نمایشی شیشه‌ای نیمه‌رنگی */
  //.showcase-col {
  //  position: relative;
  //  padding: 3rem;
  //  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.2) 100%);
  //  border-right: 1px solid rgba(255, 255, 255, 0.6);
  //
  //  .showcase-inner {
  //    max-width: 410px;
  //  }
  //
  //  .pill-badge {
  //    display: inline-flex;
  //    align-items: center;
  //    gap: 6px;
  //    padding: 6px 16px;
  //    border-radius: 999px;
  //    background: rgba(255, 255, 255, 0.7);
  //    border: 1px solid rgba(255, 255, 255, 0.9);
  //    color: #334155;
  //    font-size: 0.82rem;
  //    font-weight: 600;
  //    box-shadow: 0 4px 12px rgba(148, 163, 184, 0.12);
  //  }
  //
  //  .showcase-heading {
  //    font-size: 2.1rem;
  //    font-weight: 800;
  //    line-height: 1.35;
  //    color: #0f172a;
  //    margin-bottom: 1rem;
  //  }
  //
  //  .showcase-caption {
  //    font-size: 0.95rem;
  //    color: #475569;
  //    line-height: 1.8;
  //    margin-bottom: 2rem;
  //  }
  //
  //  .glass-features-grid {
  //    display: flex;
  //    flex-direction: column;
  //    gap: 0.75rem;
  //
  //    .mini-glass-badge {
  //      display: flex;
  //      align-items: center;
  //      gap: 12px;
  //      padding: 10px 14px;
  //      background: rgba(255, 255, 255, 0.6);
  //      border: 1px solid rgba(255, 255, 255, 0.85);
  //      border-radius: 16px;
  //      box-shadow: 0 6px 14px rgba(148, 163, 184, 0.1);
  //      backdrop-filter: blur(10px);
  //      transition: transform 0.2s ease, background 0.2s ease;
  //
  //      &:hover {
  //        transform: translateX(-4px);
  //        background: rgba(255, 255, 255, 0.85);
  //      }
  //
  //      .badge-icon {
  //        width: 38px;
  //        height: 38px;
  //        border-radius: 10px;
  //        display: flex;
  //        align-items: center;
  //        justify-content: center;
  //
  //        &.icon-teal {
  //          background: #ccfbf1;
  //          color: #0d9488;
  //        }
  //        &.icon-purple {
  //          background: #f3e8ff;
  //          color: #7c3aed;
  //        }
  //      }
  //
  //      .badge-text {
  //        display: flex;
  //        flex-direction: column;
  //        text-align: right;
  //
  //        strong {
  //          font-size: 0.86rem;
  //          color: #1e293b;
  //        }
  //        small {
  //          font-size: 0.75rem;
  //          color: #64748b;
  //        }
  //      }
  //    }
  //  }
  //}



  /* استایل‌های مربوط به گزینه ۱ */
.showcase-col {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.5);

  .showcase-visual-wrapper {
    position: relative;
    width: 280px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;

    .hero-glass-circle {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
      animation: pulseGlow 1s ease-in-out infinite alternate;
    }

    .floating-card {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      box-shadow: 0 12px 28px rgba(100, 116, 139, 0.12);

      &.card-top {
        top: 0;
        right: -20px;
        animation: floatUpDown 2.5s ease-in-out infinite alternate;
      }

      &.card-bottom {
        bottom: 10px;
        left: -20px;
        animation: floatUpDown 3s ease-in-out infinite alternate-reverse;
      }
    }
  }
}

@keyframes floatUpDown {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-12px); }
}

@keyframes pulseGlow {
  0% { transform: scale(1); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.15); }
  100% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(99, 102, 241, 0.3); }
}

}

/* انیمیشن نرم حرکت مایع و نور */
@keyframes floatShape {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(35px, 25px) scale(1.1);
  }
}

/* ریسپانسیو اختصاصی موبایل */
@media (max-width: 599px) {
  .auth-page {
    padding: 0.75rem;

    .liquid-glass-card {
      border-radius: 22px;
      min-height: auto;
    }

    .form-col {
      padding: 2rem 1.25rem;

      .brand-box {
        .logo-wrapper {
          width: 68px;
          height: 68px;
        }
        .brand-name {
          font-size: 1.6rem;
        }
      }
    }
  }
}
</style>
