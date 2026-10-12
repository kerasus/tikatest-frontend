<template>
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <h4 class="footer-heading">پنل‌های کاربری</h4>
        <ul class="footer-list">
          <li><a
            href="/student"
            class="footer-link">ورود دانش‌آموز</a></li>
          <li><a
            href="/teacher"
            class="footer-link">پنل دبیران</a></li>
          <li><a
            href="/school"
            class="footer-link">مدیریت مدارس</a></li>
          <li><a
            href="/parent"
            class="footer-link">پرتال اولیا</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer-heading">امکانات سنجاد</h4>
        <ul class="footer-list">
          <li><a
            href="#exams"
            class="footer-link">بانک سوالات تستی</a></li>
          <li><a
            href="#exams"
            class="footer-link">آزمون آنلاین هوشمند</a></li>
          <li><a
            href="#planner"
            class="footer-link">دفتر برنامه‌ریزی تحصیلی</a></li>
          <li><a
            href="#report-card"
            class="footer-link">کارنامه تحلیلی کشوری</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer-heading">پشتیبانی و راهنما</h4>
        <ul class="footer-list">
          <li><a
            href="/faq"
            class="footer-link">پرسش‌های متداول</a></li>
          <li><a
            href="/guide"
            class="footer-link">راهنمای آزمون آنلاین</a></li>
          <li><a
            href="/contact"
            class="footer-link">ارتباط با پشتیبانی</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer-heading">درباره سامانه</h4>
        <p class="footer-about">
          سنجاد بستر یکپارچه برگزاری آزمون، تحلیل عملکرد و مدیریت یادگیری مدارس سراسر کشور است.
        </p>
        <div class="footer-phone">
          پشتیبانی:
          <span dir="ltr">
            ۰۲۱
            -
            ۸۸۸۸۸۸۸۸
          </span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© ۱۴۰۳ سامانه هوشمند سنجش آموزشی سنجاد (Sanjad.ir). تمامی حقوق محفوظ است.</div>
      <div>نسخه ۳.۵.۰</div>
    </div>
  </footer>
</template>

<style scoped>
/* ===== Footer ===== */
.footer {
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 3rem 1rem;
  color: #64748b;
  font-size: 0.75rem;
}
@media (min-width: 768px) {
  .footer {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.footer-grid {
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.footer-heading {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-link:hover {
  color: #4f46e5;
}

.footer-about {
  line-height: 1.625;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.footer-phone {
  color: #334155;
  font-weight: 600;
}

.footer-bottom {
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: #94a3b8;
}
@media (min-width: 640px) {
  .footer-bottom {
    flex-direction: row;
  }
}
</style>
