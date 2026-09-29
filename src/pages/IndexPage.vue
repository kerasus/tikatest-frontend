<template>

  <!-- نوار ناوبری اصلی (دقیقاً با استایل روشن، دکمه‌ها و منوهای اصلی) -->
  <nav class="nav">
    <div class="nav-inner">

      <!-- لوگو و دراپ‌داون دسته‌بندی دروس -->
      <div class="nav-left">
        <a
          href="/"
          class="logo-link">
          <div class="logo-icon">
            ت
          </div>
          <span class="logo-text">تیکا<span class="logo-text-accent">تست</span></span>
        </a>

        <!-- منوی کشویی پایه‌ها و مباحث -->
        <div class="dropdown-wrap">
          <button
            id="category-btn"
            onclick="document.getElementById('list-dropdown').classList.toggle('hidden')"
            class="dropdown-btn">
            <span>پایه‌ها و دروس</span>
            <q-icon
              name="fa-solid fa-chevron-down"
              class="icon-sm" />
          </button>

          <div
            id="list-dropdown"
            class="dropdown-menu hidden">
            <a
              href="#high-school"
              class="dropdown-item">
              <div class="dropdown-item-inner">
                <q-icon
                  name="fa-solid fa-graduation-cap"
                  class="icon-sm icon-indigo" />
                <span class="dropdown-item-text">متوسطه دوم و کنکور</span>
              </div>
              <q-icon
                name="fa-solid fa-chevron-left"
                class="icon-sm icon-slate-400" />
            </a>
            <a
              href="#middle-school"
              class="dropdown-item">
              <div class="dropdown-item-inner">
                <q-icon
                  name="fa-solid fa-book-open"
                  class="icon-sm icon-purple" />
                <span class="dropdown-item-text">متوسطه اول و تیزهوشان</span>
              </div>
              <q-icon
                name="fa-solid fa-chevron-left"
                class="icon-sm icon-slate-400" />
            </a>
            <a
              href="#elementary"
              class="dropdown-item">
              <div class="dropdown-item-inner">
                <q-icon
                  name="fa-solid fa-shapes"
                  class="icon-sm icon-emerald" />
                <span class="dropdown-item-text">آزمون‌های جامع دوره‌ای</span>
              </div>
              <q-icon
                name="fa-solid fa-chevron-left"
                class="icon-sm icon-slate-400" />
            </a>
          </div>
        </div>
      </div>

      <!-- نوار جستجو (راست‌چین شده با حفظ شعاع و سایه‌ها) -->
      <div class="search-wrap">
        <div class="search-inner">
          <q-icon
            name="fa-solid fa-magnifying-glass"
            class="icon-md icon-slate-400 search-icon" />
          <input
            type="text"
            placeholder="جستجوی درس، مبحث، آزمون آنلاین یا دبیر..."
            class="search-input">
        </div>
      </div>

      <!-- لینک‌ها و دکمه‌های ورود / ثبت‌نام -->
      <div class="nav-right">
        <a
          href="#teachers"
          class="nav-link">
          پنل دبیران
        </a>
        <a
          href="#schools"
          class="nav-link">
          مدارس و موسسات
        </a>
        <router-link
          :to="{ name: 'PublicAuth.Login' }"
          class="btn-login">
          ورود به پنل
        </router-link>
        <a
          v-if="false"
          href="/register"
          class="btn-register">
          ثبت‌نام رایگان
        </a>
      </div>

    </div>
  </nav>

  <!-- سکشن هیرو با حفظ ۱۰۰٪ چیدمان کارت و دکمه خاص Border Beam نارنجی -->
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
            <span class="hero-title-accent">تیکا تست</span>
            سامانه
            هوشمند مدیریت آموزش و ارزیابی
          </h1>

          <p class="hero-desc">
            زیرساخت جامع برگزاری آزمون، مدیریت کلاس‌ها و تحلیل عملکرد دانش‌آموزان با استاندارد کنکور سراسری. ابزاری که برای مدارس و آموزشگاه‌ها ساخته شده است.
          </p>

          <!-- دکمه خاص Border Beam نارنجی اصلی قالب با حفظ تمام لایه‌ها و انیمیشن‌ها -->
          <div class="hero-cta-wrap">
            <a
              href="/register"
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
              alt="دانش‌آموزان تیکاتست در حال تحلیل آزمون"
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
                <div class="hero-float-sub">آزمون جامع تیکاتست</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>

  <!-- سکشن تیره با ۳ ویژگی کلیدی (دقیقاً مطابق قالب اصلی) -->
  <section class="features-dark">
    <div class="features-dark-inner">

      <div class="features-dark-text">
        <h2 class="features-dark-title">
          مدیریت متمرکز؛ از طرح سوال تا تحلیل داده
        </h2>
        <p class="features-dark-desc">
          تیکاتست دغدغه‌های آموزشی مراکز را حذف می‌کند. از تصحیح خودکار گرفته تا گزارش‌دهی هوشمند به اولیا؛ همه‌چیز زیر یک سقف
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

  <!-- نقشه راه ۴ مرحله‌ای یادگیری (Curriculum Roadmap) با همان جدول و استایل اصلی -->
  <section class="roadmap">
    <div class="section-header">
      <span class="section-label">فرآیند رشد در تیکاتست</span>
      <h2 class="section-title">مسیر تحول دیجیتال در موسسه شما</h2>
      <p class="section-desc">چگونه با تیکاتست، فرآیند آموزشی مجموعه خود را هوشمند کنید؟</p>
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

  <!-- کارت‌های پکیج‌ها و تعرفه‌ها (با حفظ دقیق رنگ‌ها، دکمه‌ها و بوردرهای اورجینال) -->
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

  <!-- فوتر اصلی روشن با لینک‌های کاربردی -->
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
        <h4 class="footer-heading">امکانات تیکاتست</h4>
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
          تیکاتست بستر یکپارچه برگزاری آزمون، تحلیل عملکرد و مدیریت یادگیری مدارس سراسر کشور است.
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
      <div>© ۱۴۰۳ سامانه هوشمند سنجش آموزشی تیکاتست (TikaTest). تمامی حقوق محفوظ است.</div>
      <div>نسخه ۳.۵.۰</div>
    </div>
  </footer>

</template>

<style scoped>
/* ===== Base / Reset helpers ===== */
.hidden {
  display: none !important;
}

/* ===== Icons ===== */
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
.icon-indigo {
  color: #6366f1;
}
.icon-purple {
  color: #a855f7;
}
.icon-emerald {
  color: #10b981;
}
.icon-emerald-600 {
  color: #059669;
}
.icon-slate-400 {
  color: #94a3b8;
}

/* ===== Navigation ===== */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
@media (min-width: 768px) {
  .nav {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.nav-inner {
  display: flex;
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background-image: linear-gradient(to top right, #4f46e5, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
  color: #ffffff;
  font-weight: 900;
  font-size: 1.125rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #0f172a;
}
.logo-text-accent {
  color: #4f46e5;
}

.dropdown-wrap {
  position: relative;
}

.dropdown-btn {
  display: none;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
}
.dropdown-btn:hover {
  color: #4f46e5;
  background-color: #f8fafc;
}
@media (min-width: 768px) {
  .dropdown-btn {
    display: flex;
  }
}

.dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 16rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #f1f5f9;
  padding: 0.5rem;
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem;
  border-radius: 0.75rem;
  color: #334155;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}
.dropdown-item:hover {
  background-color: #f8fafc;
  color: #4f46e5;
}

.dropdown-item-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-item-text {
  font-size: 0.75rem;
  font-weight: 600;
}

/* Search */
.search-wrap {
  display: none;
  flex: 1 1 0%;
  max-width: 42rem;
}
@media (min-width: 1024px) {
  .search-wrap {
    display: block;
  }
}

.search-inner {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  right: 1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 0.625rem 3rem 0.625rem 1rem;
  font-size: 0.75rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input::placeholder {
  color: #94a3b8;
}
.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Nav right */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  display: none;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  transition: color 0.15s;
}
.nav-link:hover {
  color: #4f46e5;
}
@media (min-width: 640px) {
  .nav-link {
    display: inline-block;
  }
}

.btn-login {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
}
.btn-login:hover {
  color: #0f172a;
  background-color: #f8fafc;
}

.btn-register {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  background-color: #0f172a;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  text-decoration: none;
  transition: background-color 0.15s;
}
.btn-register:hover {
  background-color: #1e293b;
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
