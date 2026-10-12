<template>
  <section class="pricing">
    <div class="section-header section-header-pricing">
      <h2 class="section-title">طرح‌های همکاری با مدارس و مراکز آموزشی</h2>
      <p class="section-desc">زیرساخت‌های هوشمند برای مدیریت آزمون و تحلیل داده‌های آموزشی</p>
    </div>

    <div class="pricing-grid">

      <!-- پلن پایه -->
      <div class="pricing-card">
        <div>
          <span class="pricing-label">شروع سریع</span>
          <h3 class="pricing-name">پکیج پایلوت (آزمایشی)</h3>
          <div class="pricing-price">رایگان</div>
          <ul class="pricing-features">
            <li class="pricing-feature">✓ برگزاری ۵ آزمون در ماه</li>
            <li class="pricing-feature">✓ تصحیح هوشمند پاسخ‌برگ‌ها</li>
            <li class="pricing-feature">✓ پنل مدیریت محدود کلاس‌ها</li>
          </ul>
        </div>
        <a
          href="/register"
          class="pricing-btn pricing-btn-outline">
          ثبت‌نام و شروع تست
        </a>
      </div>

      <!-- پلن حرفه‌ای -->
      <div class="pricing-card pricing-card-featured">
        <div class="pricing-badge">
          پیشنهاد ویژه مراکز آموزشی
        </div>
        <div>
          <span class="pricing-label pricing-label-accent">حرفه‌ای</span>
          <h3 class="pricing-name">موسسه هوشمند</h3>
          <div class="pricing-price">۲۹۰,۰۰۰ <span class="pricing-price-unit">تومان / ماه</span></div>
          <ul class="pricing-features">
            <li class="pricing-feature">✓ تمامی امکانات پایه</li>
            <li class="pricing-feature">✓ تحلیل پیشرفته تراز و عملکرد کلاسی</li>
            <li class="pricing-feature">✓ نظارت آنلاین بر عملکرد مشاوران</li>
            <li class="pricing-feature">✓ آزمون‌ساز پیشرفته با بانک سوالات</li>
          </ul>
        </div>
        <a
          href="/register"
          class="pricing-btn pricing-btn-primary">
          فعال‌سازی پلن حرفه‌ای
        </a>
      </div>

      <!-- پلن سازمانی -->
      <div class="pricing-card">
        <div>
          <span class="pricing-label">سازمانی</span>
          <h3 class="pricing-name">مدارس و مجموعه‌ها</h3>
          <div class="pricing-price pricing-price-sm">تماس با واحد فروش</div>
          <ul class="pricing-features">
            <li class="pricing-feature">✓ مدیریت بی‌نهایت کاربر و کلاس</li>
            <li class="pricing-feature">✓ برندینگ اختصاصی و دامین سفارشی</li>
            <li class="pricing-feature">✓ پنل جامع اولیا و پیامک اختصاصی</li>
          </ul>
        </div>
        <a
          href="#contact-sales"
          class="pricing-btn pricing-btn-outline">
          درخواست دمو و مشاوره
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
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

/* ===== Pricing ===== */
.pricing {
  padding: 4rem 1rem;
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}
@media (min-width: 768px) {
  .pricing {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.pricing-grid {
  display: grid;
  gap: 2rem;
}
@media (min-width: 768px) {
  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.pricing-card {
  padding: 2rem;
  border-radius: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.pricing-card-featured {
  border: 2px solid #4f46e5;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.pricing-badge {
  position: absolute;
  top: -0.875rem;
  right: 1.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
}

.pricing-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pricing-label-accent {
  color: #4f46e5;
}

.pricing-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.pricing-price {
  font-size: 1.875rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.5rem;
}

.pricing-price-sm {
  font-size: 1.5rem;
  font-weight: 700;
}

.pricing-price-unit {
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #475569;
}

.pricing-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pricing-btn {
  margin-top: 2rem;
  display: block;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.75rem;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
  box-sizing: border-box;
}

.pricing-btn-outline {
  border: 1px solid #cbd5e1;
  color: #1e293b;
}
.pricing-btn-outline:hover {
  background-color: #f8fafc;
}

.pricing-btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
}
.pricing-btn-primary:hover {
  background-color: #4338ca;
}
</style>
