<template>
  <!-- نوار ناوبری اصلی (دقیقاً با استایل روشن، دکمه‌ها و منوهای اصلی) -->
  <landing-navigation />

  <!-- سکشن هیرو با حفظ ۱۰۰٪ چیدمان کارت و دکمه خاص Border Beam نارنجی -->
  <landing-hero />

  <!-- سکشن تیره با ۳ ویژگی کلیدی (دقیقاً مطابق قالب اصلی) -->
  <landing-features />

  <!-- نقشه راه ۴ مرحله‌ای یادگیری (Curriculum Roadmap) با همان جدول و استایل اصلی -->
  <landing-roadmap />

  <!-- کارت‌های پکیج‌ها و تعرفه‌ها (با حفظ دقیق رنگ‌ها، دکمه‌ها و بوردرهای اورجینال) -->
  <landing-pricing v-if="false" />

  <!-- فوتر اصلی روشن با لینک‌های کاربردی -->
  <landing-footer v-if="false" />
</template>

<script setup lang="ts">
import LandingNavigation from './components/navigation.vue'
import LandingHero from './components/hero.vue'
import LandingFeatures from './components/features.vue'
import LandingRoadmap from './components/roadmap.vue'
import LandingPricing from './components/pricing.vue'
import LandingFooter from './components/footer.vue'
</script>
