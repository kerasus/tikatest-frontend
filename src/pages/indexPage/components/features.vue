<template>
  <section class="features-dark">
    <div class="features-dark-inner">

      <div class="features-dark-text">
        <h2 class="features-dark-title">
          مدیریت متمرکز؛ از طرح سوال تا تحلیل داده
        </h2>
        <p class="features-dark-desc">
          سنجاد دغدغه‌های آموزشی مراکز را حذف می‌کند. از تصحیح خودکار گرفته تا گزارش‌دهی هوشمند به اولیا؛ همه‌چیز زیر یک سقف
        </p>

        <div class="features-dark-list">

          <div class="features-dark-item">
            <div class="features-dark-check">
              <q-icon
                name="fa-solid fa-check"
                class="icon-sm" />
            </div>
            <div>
              <h4 class="features-dark-item-title">ارزیابی عملکرد بر اساس زمان صرف‌شده</h4>
              <p class="features-dark-item-desc">شناسایی سوالاتی که وقت بیش از حد گرفته‌اند و مدیریت زمان در جلسه آزمون.</p>
            </div>
          </div>

          <div class="features-dark-item">
            <div class="features-dark-check">
              <q-icon
                name="fa-solid fa-check"
                class="icon-sm" />
            </div>
            <div>
              <h4 class="features-dark-item-title">پاسخ‌نامه کامپکت و تشریحی همراه با کلید رسمی</h4>
              <p class="features-dark-item-desc">دانلود فوری فایل PDF پاسخ‌نامه و ویدیوی تحلیل سوالات توسط دبیران برتر.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- کارت‌های گرید در بخش دارک -->
      <div class="features-dark-cards">
        <div class="feature-card">
          <div class="feature-card-icon feature-card-icon-indigo">
            <q-icon
              name="fa-solid fa-chart-column"
              class="icon-md" />
          </div>
          <h3 class="feature-card-title">کارنامه تحلیلی هوشمند</h3>
          <p class="feature-card-desc">تحلیل وضعیت هر مبحث درسی، صدور نمودار تراز و مقایسه با میانگین کشوری و کلاسی.</p>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-card-icon-purple">
            <q-icon
              name="fa-solid fa-calendar-check"
              class="icon-md" />
          </div>
          <h3 class="feature-card-title">دفتر برنامه‌ریزی آنلاین</h3>
          <p class="feature-card-desc">ثبت ساعت مطالعه روزانه، تعداد تست‌ها و دریافت بازخورد منظم از مشاور مدرسه.</p>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-card-icon-emerald">
            <q-icon
              name="fa-solid fa-comments"
              class="icon-md" />
          </div>
          <h3 class="feature-card-title">پیام‌رسان کلاسی و تکالیف</h3>
          <p class="feature-card-desc">ارسال تکالیف، دریافت فایل تصحیح‌شده و رفع اشکال مستقیم با استاد هر درس.</p>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-card-icon-amber">
            <q-icon
              name="fa-solid fa-shield-halved"
              class="icon-md" />
          </div>
          <h3 class="feature-card-title">پایداری و امنیت بالا</h3>
          <p class="feature-card-desc">ذخیره خودکار گزینه‌ها و جلوگیری از خروج ناخواسته یا از دست رفتن زمان در قطعی اینترنت.</p>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.icon-sm {
  width: 1rem;
  height: 1rem;
  font-size: 1rem;
}
.icon-md {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
}
/* ===== Features Dark ===== */
.features-dark {
  background-color: #0f172a;
  color: #ffffff;
  padding: 5rem 1rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .features-dark {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.features-dark-inner {
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  gap: 3rem;
  align-items: center;
}
@media (min-width: 1024px) {
  .features-dark-inner {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}

.features-dark-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
@media (min-width: 1024px) {
  .features-dark-text {
    grid-column: span 6 / span 6;
  }
}

.features-dark-title {
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  line-height: 1.25;
}
@media (min-width: 768px) {
  .features-dark-title {
    font-size: 2.25rem;
  }
}

.features-dark-desc {
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.625;
}

.features-dark-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
}

.features-dark-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.features-dark-check {
  padding: 0.25rem;
  border-radius: 9999px;
  background-color: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.features-dark-item-title {
  font-weight: 700;
  color: #ffffff;
  font-size: 0.875rem;
}

.features-dark-item-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.features-dark-cards {
  display: grid;
  gap: 1rem;
}
@media (min-width: 640px) {
  .features-dark-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .features-dark-cards {
    grid-column: span 6 / span 6;
  }
}

.feature-card {
  background-color: rgba(30, 41, 59, 0.8);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(51, 65, 85, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card-icon-indigo {
  background-color: rgba(99, 102, 241, 0.1);
  color: #818cf8;
}
.feature-card-icon-purple {
  background-color: rgba(168, 85, 247, 0.1);
  color: #c084fc;
}
.feature-card-icon-emerald {
  background-color: rgba(16, 185, 129, 0.1);
  color: #34d399;
}
.feature-card-icon-amber {
  background-color: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
}

.feature-card-title {
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
}

.feature-card-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.625;
}
</style>
