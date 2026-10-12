<template>
  <header class="hero">
    <div class="hero-card">
      <div class="hero-grid">

        <!-- ستون متن هیرو -->
        <div class="hero-text">
          <div class="hero-badge">
            <span class="hero-badge-dot" />
            سامانه هوشمند ارزیابی و رشد دانش‌آموزان
          </div>

          <h1 class="hero-title">
            <span class="hero-title-accent">سنجاد</span>
            سامانه
            هوشمند مدیریت آموزش و ارزیابی
          </h1>

          <p class="hero-desc">
            زیرساخت جامع برگزاری آزمون، مدیریت کلاس‌ها و تحلیل عملکرد دانش‌آموزان با استاندارد کنکور سراسری. ابزاری که برای مدارس و آموزشگاه‌ها ساخته شده است.
          </p>

          <!-- دکمه خاص Border Beam نارنجی اصلی قالب با حفظ تمام لایه‌ها و انیمیشن‌ها -->
          <div class="hero-cta-wrap">
            <a
              href="/"
              class="btn-beam">
              <span class="btn-beam-spin" />
              <span class="btn-beam-inner">
                <span>درخواست دموی رایگان برای مدارس</span>
                <q-icon
                  name="fa-solid fa-arrow-left"
                  class="icon-sm btn-beam-arrow" />
              </span>
            </a>
          </div>

          <div class="hero-checks">
            <div class="hero-check">
              <q-icon
                name="fa-solid fa-circle-check"
                class="icon-sm icon-emerald-600" />
              تصحیح آنی پاسخ‌برگ
            </div>
            <div class="hero-check">
              <q-icon
                name="fa-solid fa-circle-check"
                class="icon-sm icon-emerald-600" />
              تحلیل مبحثی نقاط ضعف
            </div>
          </div>
        </div>

        <!-- ستون تصویر و ماک‌آپ هیرو (با حفظ افکت روتیشن اصلی) -->
        <div class="hero-visual">
          <div class="hero-visual-glow" />
          <div class="hero-visual-frame">
            <img
              :src="'/images/landing/home/hero-section.png'"
              alt="دانش‌آموزان سنجاد در حال تحلیل آزمون"
              class="hero-img">

            <div class="hero-float hero-float-top">
              <div class="hero-float-badge hero-float-badge-emerald">
                ۹۸٪
              </div>
              <div>
                <div class="hero-float-title">پیشرفت مبحثی</div>
                <div class="hero-float-sub">ریاضی و تجربی دوازدهم</div>
              </div>
            </div>

            <div class="hero-float hero-float-bottom">
              <div class="hero-float-badge hero-float-badge-indigo">
                <q-icon
                  name="fa-solid fa-award"
                  class="icon-sm" />
              </div>
              <div>
                <div class="hero-float-title">تراز ۷۲۰۰ کشوری</div>
                <div class="hero-float-sub">آزمون جامع سنجاد</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<style scoped>
.icon-sm {
  width: 1rem;
  height: 1rem;
  font-size: 1rem;
}
.icon-emerald-600 {
  color: #059669;
}
/* ===== Hero ===== */
.hero {
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem 1rem 3rem;
}
@media (min-width: 768px) {
  .hero {
    padding: 4rem 2rem 3rem;
  }
}

.hero-card {
  background-color: #f1f5f9;
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
}
@media (min-width: 640px) {
  .hero-card {
    padding: 2.5rem;
  }
}
@media (min-width: 1024px) {
  .hero-card {
    padding: 4rem;
  }
}

.hero-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}
@media (min-width: 768px) {
  .hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.hero-text {
  max-width: 32rem;
}
.hero-text > * + * {
  margin-top: 1.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.hero-badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #4f46e5;
}

.hero-title {
  font-size: 2.25rem;
  letter-spacing: -0.025em;
  color: #0f172a;
  font-weight: 500;
  line-height: 1.15;
}
@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}
@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.75rem;
  }
}

.hero-title-accent {
  color: #4f46e5;
  font-weight: 700;
}

.hero-desc {
  font-size: 1rem;
  color: #475569;
  line-height: 1.625;
}
@media (min-width: 640px) {
  .hero-desc {
    font-size: 1.125rem;
  }
}

.hero-cta-wrap {
  padding-top: 0.5rem;
}

/* Border Beam button */
.btn-beam {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 9999px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.15s;
}
.btn-beam:hover {
  box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.25);
}

.btn-beam-spin {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, #f97316, #fbbf24, #ea580c);
  animation: beam-spin 3s linear infinite;
}

.btn-beam-inner {
  position: relative;
  padding: 1rem 2rem;
  background-color: #09090b;
  color: #ffffff;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.15s;
}
@media (min-width: 640px) {
  .btn-beam-inner {
    font-size: 0.875rem;
  }
}
.btn-beam:hover .btn-beam-inner {
  background-color: #18181b;
}

.btn-beam-arrow {
  transition: transform 0.15s;
}
.btn-beam:hover .btn-beam-arrow {
  transform: translateX(-0.25rem);
}

.hero-checks {
  padding-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

.hero-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Hero visual */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-visual-glow {
  position: absolute;
  inset: 0;
  background-color: rgba(199, 210, 254, 0.5);
  border-radius: 1.5rem;
  transform: rotate(3deg) scale(0.95);
  filter: blur(24px);
  opacity: 0.7;
}

.hero-visual-frame {
  position: relative;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transform: rotate(-1deg);
  transition: transform 0.3s;
}
.hero-visual-frame:hover {
  transform: rotate(0deg);
}

.hero-img {
  border-radius: 1rem;
  object-fit: cover;
  width: 100%;
  height: 360px;
}

.hero-float {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hero-float-top {
  top: 2rem;
  right: 2rem;
}

.hero-float-bottom {
  bottom: 2rem;
  left: 2rem;
}

.hero-float-badge {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
}

.hero-float-badge-emerald {
  background-color: #d1fae5;
  color: #047857;
}

.hero-float-badge-indigo {
  background-color: #e0e7ff;
  color: #4338ca;
}

.hero-float-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
}

.hero-float-sub {
  font-size: 10px;
  color: #64748b;
}

/* ===== Animations ===== */
@keyframes beam-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dots-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 24px 24px;
  }
}

.animate-dots {
  animation: dots-move 8s linear infinite;
}
</style>
