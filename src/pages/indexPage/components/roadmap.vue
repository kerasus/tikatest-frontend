<template>
  <section class="roadmap">
    <div class="section-header">
      <span class="section-label">فرآیند رشد در سنجاد</span>
      <h2 class="section-title">مسیر تحول دیجیتال در موسسه شما</h2>
      <p class="section-desc">چگونه با سنجاد، فرآیند آموزشی مجموعه خود را هوشمند کنید؟</p>
    </div>

    <div class="roadmap-grid">
      <div class="roadmap-card">
        <div class="roadmap-num roadmap-num-indigo">۱</div>
        <h3 class="roadmap-card-title">تعریف ساختار آموزشی</h3>
        <p class="roadmap-card-desc">ایجاد پایه‌ها، کلاس‌ها و دبیران</p>
      </div>

      <div class="roadmap-card">
        <div class="roadmap-num roadmap-num-purple">۲</div>
        <h3 class="roadmap-card-title">بارگذاری محتوا و آزمون</h3>
        <p class="roadmap-card-desc">ایجاد بانک سوالات اختصاصی موسسه</p>
      </div>

      <div class="roadmap-card">
        <div class="roadmap-num roadmap-num-emerald">۳</div>
        <h3 class="roadmap-card-title">اجرای آزمون‌های هدفمند</h3>
        <p class="roadmap-card-desc">برگزاری آزمون‌های آنلاین و حضوری</p>
      </div>

      <div class="roadmap-card">
        <div class="roadmap-num roadmap-num-amber">۴</div>
        <h3 class="roadmap-card-title">تصمیم‌گیری داده‌محور</h3>
        <p class="roadmap-card-desc">تحلیل نتایج و بازخورد به اولیا و دانش‌آموزان</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== Roadmap ===== */
.roadmap {
  padding: 4rem 1rem;
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 768px) {
  .roadmap {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.section-header {
  text-align: center;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
}
.section-header > * + * {
  margin-top: 0.75rem;
}

.section-header-pricing {
  margin-bottom: 4rem;
}
.section-header-pricing > * + * {
  margin-top: 0.5rem;
}

.section-label {
  color: #4f46e5;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #0f172a;
}

.section-desc {
  color: #64748b;
  font-size: 0.875rem;
}

.roadmap-grid {
  display: grid;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .roadmap-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.roadmap-card {
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: border-color 0.15s;
}
.roadmap-card:hover {
  border-color: #818cf8;
}

.roadmap-num {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.roadmap-num-indigo {
  background-color: #e0e7ff;
  color: #4338ca;
}
.roadmap-num-purple {
  background-color: #f3e8ff;
  color: #7e22ce;
}
.roadmap-num-emerald {
  background-color: #d1fae5;
  color: #047857;
}
.roadmap-num-amber {
  background-color: #fef3c7;
  color: #b45309;
}

.roadmap-card-title {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.roadmap-card-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.625;
}
</style>
