<template>
  <q-card
    flat
    class="light-fantasy-card relative-position overflow-hidden"
    :class="{ 'full-height': fullHeight }">
    <!-- هاله‌های نوری رنگی زیر شیشه (Aurora Mesh) - فشرده و ظریف -->
    <div class="aurora-blob aurora-blob-top" />
    <div class="aurora-blob aurora-blob-bottom" />
    <div class="specular-reflection" />

    <!-- هدر کارت - بسیار متراکم و جمع‌وجور -->
    <q-card-section class="card-header row items-center justify-between no-wrap q-py-xs q-px-md relative-position">
      <div class="row items-center q-gutter-x-sm no-wrap min-width-0">
        <!-- آیکون فشرده ۳۴ پیکسلی -->
        <div class="header-icon-wrapper">
          <q-avatar
            size="34px"
            :color="iconColor"
            :text-color="iconTextColor"
            :icon="icon"
            class="header-avatar shadow-1" />
          <div class="icon-candy-glow" />
        </div>

        <div class="column min-width-0 justify-center">
          <div class="text-weight-bolder text-deep-fantasy ellipsis card-title">
            {{ title }}
          </div>
          <div
            v-if="subtitle"
            class="text-caption text-purple-8 ellipsis card-subtitle q-mt-none">
            {{ subtitle }}
          </div>
        </div>
      </div>

      <!-- دکمه اکشن متراکم -->
      <div class="action-wrapper">
        <slot name="header-action">
          <q-btn
            v-if="allTo && allLabel"
            unelevated
            rounded
            dense
            no-caps
            class="btn-light-fantasy text-weight-bold q-px-sm"
            icon-right="chevron_left"
            :label="allLabel"
            :to="allTo" />
        </slot>
      </div>
    </q-card-section>

    <!-- خط کریستالی ظریف -->
    <div class="crystal-divider" />

    <!-- محتوای داخل کارت با پدینگ کنترل‌شده -->
    <q-card-section class="card-body q-pa-sm relative-position">
      <!-- لودینگ شیشه‌ای متراکم -->
      <div
        v-if="loading"
        class="q-gutter-y-xs">
        <div
          v-for="n in 3"
          :key="n"
          class="light-skeleton-row q-pa-xs row items-center no-wrap q-gutter-x-sm">
          <q-skeleton
            type="QAvatar"
            size="32px"
            class="light-skeleton-avatar" />
          <div class="col">
            <q-skeleton
              type="text"
              width="55%"
              height="14px"
              class="light-skeleton-bar q-mb-none" />
            <q-skeleton
              type="text"
              width="30%"
              height="12px"
              class="light-skeleton-bar" />
          </div>
        </div>
      </div>

      <!-- وضعیت خالی (Empty State) فشرده -->
      <div
        v-else-if="empty"
        class="fantasy-light-empty text-center q-py-md q-px-sm column items-center justify-center">
        <div class="empty-floating-bubble q-mb-xs">
          <q-icon
            :name="emptyIcon"
            size="24px"
            class="empty-sparkle-icon" />
          <span class="bubble-sparkle">✨</span>
        </div>
        <div class="text-body2 text-weight-bolder text-deep-fantasy empty-title">
          {{ emptyMessage }}
        </div>
        <div class="text-caption text-purple-7 empty-desc">
          {{ emptySubtitle }}
        </div>
      </div>

      <!-- اسلات سفارشی داده‌ها -->
      <slot v-else />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  subtitle?: string
  icon: string
  iconColor: string
  iconTextColor: string
  allLabel?: string
  allTo?: RouteLocationRaw
  emptyMessage: string
  emptySubtitle?: string
  emptyIcon: string
  empty: boolean
  loading?: boolean
  fullHeight?: boolean
}>()
</script>

<style lang="scss" scoped>
/* بدنه شیشه‌ای با لبه‌های فشرده‌تر */
.light-fantasy-card {
  border-radius: 18px !important;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.82) 0%,
    rgba(245, 238, 255, 0.72) 45%,
    rgba(238, 246, 255, 0.76) 100%
  ) !important;
  backdrop-filter: blur(20px) saturate(190%);
  -webkit-backdrop-filter: blur(20px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    0 10px 24px -8px rgba(118, 75, 162, 0.1),
    0 4px 12px -4px rgba(59, 130, 246, 0.06),
    inset 0 1px 1px rgba(255, 255, 255, 0.95);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 1);
    box-shadow:
      0 14px 28px -8px rgba(118, 75, 162, 0.16),
      0 6px 16px -4px rgba(59, 130, 246, 0.1),
      inset 0 1px 1px rgba(255, 255, 255, 1);
  }
}

/* هاله‌های نوری مینیمال پشت شیشه */
.aurora-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(25px);
  opacity: 0.45;
  z-index: 0;
}

.aurora-blob-top {
  top: -20px;
  right: -15px;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, #fbcfe8 0%, #ddd6fe 60%, transparent 80%);
}

.aurora-blob-bottom {
  bottom: -20px;
  left: -15px;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, #bae6fd 0%, #e0e7ff 60%, transparent 80%);
}

.specular-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

.card-header {
  z-index: 1;
  min-height: 48px;
}

.header-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .header-avatar {
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 2;
    font-size: 19px !important;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .icon-candy-glow {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(244, 114, 182, 0.3), rgba(96, 165, 250, 0.3));
    filter: blur(4px);
    z-index: 1;
  }

  &:hover .header-avatar {
    transform: scale(1.08) rotate(4deg);
  }
}

.text-deep-fantasy {
  color: #1e1b4b;
}

.card-title {
  letter-spacing: -0.2px;
  font-size: 0.92rem;
  line-height: 1.25;
}

.card-subtitle {
  font-size: 0.72rem;
  line-height: 1.2;
  opacity: 0.85;
}

/* دکمه اکشن متراکم */
.btn-light-fantasy {
  background: rgba(255, 255, 255, 0.7) !important;
  color: #6366f1 !important;
  border: 1px solid rgba(167, 139, 250, 0.3);
  font-size: 11px !important;
  padding: 2px 8px !important;
  height: 26px;
  line-height: 1;
  transition: all 0.2s ease;

  :deep(.q-icon) {
    font-size: 14px;
    margin-right: -2px;
  }

  &:hover {
    background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%) !important;
    color: #ffffff !important;
    border-color: transparent;
    transform: translateX(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.22);
  }
}

/* خط دیوایدر مویی */
.crystal-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(192, 132, 252, 0.2) 25%,
    rgba(129, 140, 248, 0.25) 50%,
    rgba(244, 114, 182, 0.2) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  position: relative;
  z-index: 1;
}

/* اسکلتون فشرده */
.light-skeleton-row {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.light-skeleton-avatar {
  background: rgba(196, 181, 253, 0.3) !important;
}

.light-skeleton-bar {
  background: rgba(221, 214, 254, 0.4) !important;
}

/* Empty State متراکم */
.fantasy-light-empty {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.35);
  border: 1.5px dashed rgba(167, 139, 250, 0.35);
}

.empty-floating-bubble {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fbcfe8 0%, #e0e7ff 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 14px rgba(244, 114, 182, 0.18);

  .empty-sparkle-icon {
    color: #8b5cf6;
  }

  .bubble-sparkle {
    position: absolute;
    top: -3px;
    right: -3px;
    font-size: 11px;
  }
}

.empty-title {
  font-size: 0.88rem;
  line-height: 1.3;
}

.empty-desc {
  max-width: 230px;
  font-size: 0.72rem;
  line-height: 1.4;
}
</style>
