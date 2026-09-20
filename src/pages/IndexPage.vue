<template>

  <!-- نوار ناوبری اصلی (دقیقاً با استایل روشن، دکمه‌ها و منوهای اصلی) -->
  <nav class="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 md:px-8 py-3 shadow-sm">
    <div class="flex max-w-screen-2xl mx-auto items-center justify-between gap-4">

      <!-- لوگو و دراپ‌داون دسته‌بندی دروس -->
      <div class="flex items-center gap-6">
        <a
          href="/"
          class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white font-black text-lg">
            ت
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-900">تیکا<span class="text-indigo-600">تست</span></span>
        </a>

        <!-- منوی کشویی پایه‌ها و مباحث -->
        <div class="relative">
          <button
            id="category-btn"
            onclick="document.getElementById('list-dropdown').classList.toggle('hidden')"
            class="md:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <span>پایه‌ها و دروس</span>
            <i
              data-lucide="chevron-down"
              class="w-4 h-4" />
          </button>

          <div
            id="list-dropdown"
            class="hidden absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
            <a
              href="#high-school"
              class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
              <div class="flex items-center gap-3">
                <i
                  data-lucide="graduation-cap"
                  class="w-4 h-4 text-indigo-500" />
                <span class="text-xs font-semibold">متوسطه دوم و کنکور</span>
              </div>
              <i
                data-lucide="chevron-left"
                class="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#middle-school"
              class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
              <div class="flex items-center gap-3">
                <i
                  data-lucide="book-open"
                  class="w-4 h-4 text-purple-500" />
                <span class="text-xs font-semibold">متوسطه اول و تیزهوشان</span>
              </div>
              <i
                data-lucide="chevron-left"
                class="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#elementary"
              class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
              <div class="flex items-center gap-3">
                <i
                  data-lucide="shapes"
                  class="w-4 h-4 text-emerald-500" />
                <span class="text-xs font-semibold">آزمون‌های جامع دوره‌ای</span>
              </div>
              <i
                data-lucide="chevron-left"
                class="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      <!-- نوار جستجو (راست‌چین شده با حفظ شعاع و سایه‌ها) -->
      <div class="hidden flex-1 max-w-2xl lg:block">
        <div class="relative flex items-center">
          <i
            data-lucide="search"
            class="w-5 h-5 text-slate-400 absolute right-4 pointer-events-none" />
          <input
            type="text"
            placeholder="جستجوی درس، مبحث، آزمون آنلاین یا دبیر..."
            class="w-full bg-slate-50 border border-slate-200 rounded-full pr-12 pl-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all">
        </div>
      </div>

      <!-- لینک‌ها و دکمه‌های ورود / ثبت‌نام -->
      <div class="flex items-center gap-3">
        <a
          href="#teachers"
          class="sm:inline-block text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2">
          پنل دبیران
        </a>
        <a
          href="#schools"
          class="sm:inline-block text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2">
          مدارس و موسسات
        </a>
        <router-link
          :to="{ name: 'PublicAuth.Login' }"
          class="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          ورود به پنل
        </router-link>
        <a
          v-if="false"
          href="/register"
          class="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors">
          ثبت‌نام رایگان
        </a>
      </div>

    </div>
  </nav>

  <!-- سکشن هیرو با حفظ ۱۰۰٪ چیدمان کارت و دکمه خاص Border Beam نارنجی -->
  <header class="md:px-8 md:pt-16 max-w-screen-2xl mx-auto pt-8 pr-4 pb-12 pl-4">
    <div class="bg-slate-100 rounded-3xl p-6 sm:p-10 lg:p-16 border border-slate-200/60 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
      <div class="grid md:grid-cols-2 gap-12 items-center">

        <!-- ستون متن هیرو -->
        <div class="max-w-lg space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm">
            <span class="w-2 h-2 rounded-full bg-indigo-600" />
            سامانه هوشمند ارزیابی و رشد دانش‌آموزان
          </div>

          <h1 class="text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 font-medium leading-[1.15]">
            <span class="text-indigo-600 font-bold">تیکا تست</span>
            سامانه
            هوشمند مدیریت آموزش و ارزیابی
          </h1>

          <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
            زیرساخت جامع برگزاری آزمون، مدیریت کلاس‌ها و تحلیل عملکرد دانش‌آموزان با استاندارد کنکور سراسری. ابزاری که برای مدارس و آموزشگاه‌ها ساخته شده است.
          </p>

          <!-- دکمه خاص Border Beam نارنجی اصلی قالب با حفظ تمام لایه‌ها و انیمیشن‌ها -->
          <div class="pt-2">
            <a
              href="/register"
              class="relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden group shadow-lg hover:shadow-orange-500/25 transition-all">
              <span class="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 animate-beam-spin" />
              <span class="relative px-8 py-4 bg-zinc-950 text-white rounded-full text-xs sm:text-sm font-bold tracking-wide flex items-center gap-3 group-hover:bg-zinc-900 transition-colors">
                <span>درخواست دموی رایگان برای مدارس</span>
                <i
                  data-lucide="arrow-left"
                  class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </span>
            </a>
          </div>

          <div class="pt-4 flex items-center gap-6 text-xs text-slate-500">
            <div class="flex items-center gap-2">
              <i
                data-lucide="check-circle"
                class="w-4 h-4 text-emerald-600" />
              تصحیح آنی پاسخ‌برگ
            </div>
            <div class="flex items-center gap-2">
              <i
                data-lucide="check-circle"
                class="w-4 h-4 text-emerald-600" />
              تحلیل مبحثی نقاط ضعف
            </div>
          </div>
        </div>

        <!-- ستون تصویر و ماک‌آپ هیرو (با حفظ افکت روتیشن اصلی) -->
        <div class="relative flex justify-center items-center">
          <div class="absolute inset-0 bg-indigo-200/50 rounded-3xl transform rotate-3 scale-95 filter blur-xl opacity-70" />
          <div class="relative bg-white p-4 rounded-3xl shadow-xl border border-slate-200 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <img
              :src="'/images/landing/home/hero-section.png'"
              alt="دانش‌آموزان تیکاتست در حال تحلیل آزمون"
              class="rounded-2xl object-cover w-full h-[360px]">

            <div class="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-lg flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ۹۸٪
              </div>
              <div>
                <div class="text-xs font-bold text-slate-800">پیشرفت مبحثی</div>
                <div class="text-[10px] text-slate-500">ریاضی و تجربی دوازدهم</div>
              </div>
            </div>

            <div class="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-lg flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                <i
                  data-lucide="award"
                  class="w-4 h-4" />
              </div>
              <div>
                <div class="text-xs font-bold text-slate-800">تراز ۷۲۰۰ کشوری</div>
                <div class="text-[10px] text-slate-500">آزمون جامع تیکاتست</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>

  <!-- سکشن تیره با ۳ ویژگی کلیدی (دقیقاً مطابق قالب اصلی) -->
  <section class="bg-slate-900 text-white py-20 px-4 md:px-8 my-12">
    <div class="max-w-screen-2xl mx-auto grid lg:grid-cols-12 gap-12 items-center">

      <div class="lg:col-span-6 space-y-6">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          مدیریت متمرکز؛ از طرح سوال تا تحلیل داده
        </h2>
        <p class="text-slate-400 text-base leading-relaxed">
          تیکاتست دغدغه‌های آموزشی مراکز را حذف می‌کند. از تصحیح خودکار گرفته تا گزارش‌دهی هوشمند به اولیا؛ همه‌چیز زیر یک سقف
        </p>

        <div class="space-y-4 pt-2">

          <div class="flex items-start gap-3">
            <div class="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-1">
              <i
                data-lucide="check"
                class="w-4 h-4" />
            </div>
            <div>
              <h4 class="font-bold text-white text-sm">ارزیابی عملکرد بر اساس زمان صرف‌شده</h4>
              <p class="text-xs text-slate-400 mt-1">شناسایی سوالاتی که وقت بیش از حد گرفته‌اند و مدیریت زمان در جلسه آزمون.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-1">
              <i
                data-lucide="check"
                class="w-4 h-4" />
            </div>
            <div>
              <h4 class="font-bold text-white text-sm">پاسخ‌نامه کامپکت و تشریحی همراه با کلید رسمی</h4>
              <p class="text-xs text-slate-400 mt-1">دانلود فوری فایل PDF پاسخ‌نامه و ویدیوی تحلیل سوالات توسط دبیران برتر.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- کارت‌های گرید در بخش دارک -->
      <div class="lg:col-span-6 grid sm:grid-cols-2 gap-4">
        <div class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <i
              data-lucide="bar-chart-3"
              class="w-5 h-5" />
          </div>
          <h3 class="font-bold text-white text-base">کارنامه تحلیلی هوشمند</h3>
          <p class="text-xs text-slate-400 leading-relaxed">تحلیل وضعیت هر مبحث درسی، صدور نمودار تراز و مقایسه با میانگین کشوری و کلاسی.</p>
        </div>

        <div class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <i
              data-lucide="calendar-check"
              class="w-5 h-5" />
          </div>
          <h3 class="font-bold text-white text-base">دفتر برنامه‌ریزی آنلاین</h3>
          <p class="text-xs text-slate-400 leading-relaxed">ثبت ساعت مطالعه روزانه، تعداد تست‌ها و دریافت بازخورد منظم از مشاور مدرسه.</p>
        </div>

        <div class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <i
              data-lucide="messages-square"
              class="w-5 h-5" />
          </div>
          <h3 class="font-bold text-white text-base">پیام‌رسان کلاسی و تکالیف</h3>
          <p class="text-xs text-slate-400 leading-relaxed">ارسال تکالیف، دریافت فایل تصحیح‌شده و رفع اشکال مستقیم با استاد هر درس.</p>
        </div>

        <div class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <i
              data-lucide="shield-check"
              class="w-5 h-5" />
          </div>
          <h3 class="font-bold text-white text-base">پایداری و امنیت بالا</h3>
          <p class="text-xs text-slate-400 leading-relaxed">ذخیره خودکار گزینه‌ها و جلوگیری از خروج ناخواسته یا از دست رفتن زمان در قطعی اینترنت.</p>
        </div>
      </div>

    </div>
  </section>

  <!-- نقشه راه ۴ مرحله‌ای یادگیری (Curriculum Roadmap) با همان جدول و استایل اصلی -->
  <section class="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
      <span class="text-indigo-600 font-bold text-xs uppercase tracking-wider">فرآیند رشد در تیکاتست</span>
      <h2 class="text-3xl font-extrabold text-slate-900">مسیر تحول دیجیتال در موسسه شما</h2>
      <p class="text-slate-500 text-sm">چگونه با تیکاتست، فرآیند آموزشی مجموعه خود را هوشمند کنید؟</p>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-400 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base mb-4">۱</div>
        <h3 class="font-bold text-slate-900 text-sm mb-2">تعریف ساختار آموزشی</h3>
        <p class="text-xs text-slate-500 leading-relaxed">ایجاد پایه‌ها، کلاس‌ها و دبیران</p>
      </div>

      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-400 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base mb-4">۲</div>
        <h3 class="font-bold text-slate-900 text-sm mb-2">بارگذاری محتوا و آزمون</h3>
        <p class="text-xs text-slate-500 leading-relaxed">ایجاد بانک سوالات اختصاصی موسسه</p>
      </div>

      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-400 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">۳</div>
        <h3 class="font-bold text-slate-900 text-sm mb-2">اجرای آزمون‌های هدفمند</h3>
        <p class="text-xs text-slate-500 leading-relaxed">برگزاری آزمون‌های آنلاین و حضوری</p>
      </div>

      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-400 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base mb-4">۴</div>
        <h3 class="font-bold text-slate-900 text-sm mb-2">تصمیم‌گیری داده‌محور</h3>
        <p class="text-xs text-slate-500 leading-relaxed">تحلیل نتایج و بازخورد به اولیا و دانش‌آموزان</p>
      </div>
    </div>
  </section>

  <!-- کارت‌های پکیج‌ها و تعرفه‌ها (با حفظ دقیق رنگ‌ها، دکمه‌ها و بوردرهای اورجینال) -->
  <section class="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto border-t border-slate-200/80">
    <div class="text-center max-w-2xl mx-auto mb-16 space-y-2">
      <h2 class="text-3xl font-extrabold text-slate-900">طرح‌های همکاری با مدارس و مراکز آموزشی</h2>
      <p class="text-slate-500 text-sm">زیرساخت‌های هوشمند برای مدیریت آزمون و تحلیل داده‌های آموزشی</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">

      <!-- پلن پایه -->
      <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">شروع سریع</span>
          <h3 class="text-xl font-bold text-slate-900 mt-2 mb-4">پکیج پایلوت (آزمایشی)</h3>
          <div class="text-3xl font-extrabold text-slate-900 mb-6">رایگان</div>
          <ul class="space-y-3 text-xs text-slate-600">
            <li class="flex items-center gap-2">✓ برگزاری ۵ آزمون در ماه</li>
            <li class="flex items-center gap-2">✓ تصحیح هوشمند پاسخ‌برگ‌ها</li>
            <li class="flex items-center gap-2">✓ پنل مدیریت محدود کلاس‌ها</li>
          </ul>
        </div>
        <a
          href="/register"
          class="mt-8 block w-full py-3 rounded-xl border border-slate-300 text-slate-800 text-center font-bold text-xs hover:bg-slate-50 transition-colors">
          ثبت‌نام و شروع تست
        </a>
      </div>

      <!-- پلن حرفه‌ای -->
      <div class="p-8 rounded-3xl bg-white border-2 border-indigo-600 shadow-xl flex flex-col justify-between relative">
        <div class="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
          پیشنهاد ویژه مراکز آموزشی
        </div>
        <div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">حرفه‌ای</span>
          <h3 class="text-xl font-bold text-slate-900 mt-2 mb-4">موسسه هوشمند</h3>
          <div class="text-3xl font-extrabold text-slate-900 mb-6">۲۹۰,۰۰۰ <span class="text-xs font-normal text-slate-500">تومان / ماه</span></div>
          <ul class="space-y-3 text-xs text-slate-600">
            <li class="flex items-center gap-2">✓ تمامی امکانات پایه</li>
            <li class="flex items-center gap-2">✓ تحلیل پیشرفته تراز و عملکرد کلاسی</li>
            <li class="flex items-center gap-2">✓ نظارت آنلاین بر عملکرد مشاوران</li>
            <li class="flex items-center gap-2">✓ آزمون‌ساز پیشرفته با بانک سوالات</li>
          </ul>
        </div>
        <a
          href="/register"
          class="mt-8 block w-full py-3 rounded-xl bg-indigo-600 text-white text-center font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-colors">
          فعال‌سازی پلن حرفه‌ای
        </a>
      </div>

      <!-- پلن سازمانی -->
      <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">سازمانی</span>
          <h3 class="text-xl font-bold text-slate-900 mt-2 mb-4">مدارس و مجموعه‌ها</h3>
          <div class="text-2xl font-bold text-slate-900 mb-6">تماس با واحد فروش</div>
          <ul class="space-y-3 text-xs text-slate-600">
            <li class="flex items-center gap-2">✓ مدیریت بی‌نهایت کاربر و کلاس</li>
            <li class="flex items-center gap-2">✓ برندینگ اختصاصی و دامین سفارشی</li>
            <li class="flex items-center gap-2">✓ پنل جامع اولیا و پیامک اختصاصی</li>
          </ul>
        </div>
        <a
          href="#contact-sales"
          class="mt-8 block w-full py-3 rounded-xl border border-slate-300 text-slate-800 text-center font-bold text-xs hover:bg-slate-50 transition-colors">
          درخواست دمو و مشاوره
        </a>
      </div>

    </div>
  </section>

  <!-- فوتر اصلی روشن با لینک‌های کاربردی -->
  <footer class="border-t border-slate-200 bg-slate-50 py-12 px-4 md:px-8 text-slate-500 text-xs">
    <div class="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div>
        <h4 class="font-bold text-slate-900 mb-4 text-sm">پنل‌های کاربری</h4>
        <ul class="space-y-2">
          <li><a
            href="/student"
            class="hover:text-indigo-600 transition-colors">ورود دانش‌آموز</a></li>
          <li><a
            href="/teacher"
            class="hover:text-indigo-600 transition-colors">پنل دبیران</a></li>
          <li><a
            href="/school"
            class="hover:text-indigo-600 transition-colors">مدیریت مدارس</a></li>
          <li><a
            href="/parent"
            class="hover:text-indigo-600 transition-colors">پرتال اولیا</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 mb-4 text-sm">امکانات تیکاتست</h4>
        <ul class="space-y-2">
          <li><a
            href="#exams"
            class="hover:text-indigo-600 transition-colors">بانک سوالات تستی</a></li>
          <li><a
            href="#exams"
            class="hover:text-indigo-600 transition-colors">آزمون آنلاین هوشمند</a></li>
          <li><a
            href="#planner"
            class="hover:text-indigo-600 transition-colors">دفتر برنامه‌ریزی تحصیلی</a></li>
          <li><a
            href="#report-card"
            class="hover:text-indigo-600 transition-colors">کارنامه تحلیلی کشوری</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 mb-4 text-sm">پشتیبانی و راهنما</h4>
        <ul class="space-y-2">
          <li><a
            href="/faq"
            class="hover:text-indigo-600 transition-colors">پرسش‌های متداول</a></li>
          <li><a
            href="/guide"
            class="hover:text-indigo-600 transition-colors">راهنمای آزمون آنلاین</a></li>
          <li><a
            href="/contact"
            class="hover:text-indigo-600 transition-colors">ارتباط با پشتیبانی</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 mb-4 text-sm">درباره سامانه</h4>
        <p class="leading-relaxed text-slate-500 mb-3">
          تیکاتست بستر یکپارچه برگزاری آزمون، تحلیل عملکرد و مدیریت یادگیری مدارس سراسر کشور است.
        </p>
        <div class="text-slate-700 font-semibold">
          پشتیبانی:
          <span dir="ltr">
            ۰۲۱
            -
            ۸۸۸۸۸۸۸۸
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
      <div>© ۱۴۰۳ سامانه هوشمند سنجش آموزشی تیکاتست (TikaTest). تمامی حقوق محفوظ است.</div>
      <div>نسخه ۳.۵.۰</div>
    </div>
  </footer>

</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const loadExternalScript = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    // اگر قبلاً لود شده معطل نکن
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await nextTick()

  // اول Tailwind CDN لود میشه تا استایل‌ها سر جای خودشون بشینن
  await loadExternalScript('https://cdn.tailwindcss.com')

  // بعد Lucide لود میشه و آیکون‌ها رو توی DOM تزریق میکنه
  await loadExternalScript('https://unpkg.com/lucide@latest')

  if ((window as any).lucide) {
    ;(window as any).lucide.createIcons()
  }
})
</script>

<style scoped>
@keyframes beam-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-beam-spin {
  animation: beam-spin 3s linear infinite;
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
