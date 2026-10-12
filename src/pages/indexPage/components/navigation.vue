<template>
  <nav class="nav">
    <div class="nav-inner">

      <!-- لوگو و دراپ‌داون دسته‌بندی دروس -->
      <div class="nav-left">
        <a
          href="/public"
          class="logo-link"
          aria-label="صفحه اصلی">
          <q-img
            src="/images/landing/home/logo-image.png"
            class="logo-image"
            fit="contain"
            alt="لوگوی تیکاتست" />

          <q-img
            src="/images/landing/home/logo-text.png"
            class="logo-wordmark"
            fit="contain"
            alt="تیکاتست" />
        </a>


        <!-- منوی کشویی پایه‌ها و مباحث -->
        <div
          v-if="false"
          class="dropdown-wrap">
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
      <div
        v-if="false"
        class="search-wrap">
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
          v-if="false"
          href="#teachers"
          class="nav-link">
          پنل دبیران
        </a>
        <a
          v-if="false"
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
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

/* لوگوی تصویر */
.logo-image {
  width: 64px;
  height: 56px;
  flex: 0 0 64px;
  object-fit: contain;
}

/* لوگوی متنی */
.logo-wordmark {
  width: 112px;
  height: 40px;
  flex: 0 0 112px;
  object-fit: contain;
}

@media (max-width: 480px) {
  .logo-link {
    gap: 0.3rem;
  }

  .logo-image {
    width: 54px;
    height: 48px;
    flex-basis: 54px;
  }

  .logo-wordmark {
    width: 96px;
    height: 34px;
    flex-basis: 96px;
  }
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
</style>
