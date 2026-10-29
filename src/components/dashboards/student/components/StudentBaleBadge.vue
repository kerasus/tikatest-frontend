<template>
  <div class="student-bale-badge-wrapper">
    <!-- حالت اول: متصل شده به پیام‌رسان بله (مدال افتخار و نام کاربری) -->
    <div
      v-if="isBaleConnected"
      class="bale-connected-badge"
      role="status"
      title="حساب بله شما متصل و تایید شده است">
      <div class="badge-ribbon-icon">
        <q-icon
          name="workspace_premium"
          size="20px"
          class="medal-icon" />
        <span class="active-sparkle" />
      </div>

      <div class="badge-info column justify-center">
        <div class="badge-label row items-center no-wrap q-gutter-x-xs">
          <span>متصل به بله</span>
          <q-icon
            name="check_circle"
            size="13px"
            color="positive" />
        </div>
        <div class="badge-username ellipsis ltr-text">
          {{ displayBaleUsername }}
        </div>
      </div>

      <!-- دکمه مدیریت یا مشاهده جزئیات -->
      <q-btn
        flat
        round
        dense
        size="xs"
        icon="chevron_left"
        class="action-mini-btn"
        :to="{ name: 'Profile' }" />
    </div>

    <!-- حالت دوم: عدم اتصال (CTA پرانرژی، براق و چشم‌گیر) -->
    <div
      v-else
      class="bale-disconnected-badge row items-center no-wrap"
      @click="triggerConnectBale">
      <!-- موج راداری چشم‌نواز برای جلب توجه -->
      <span class="pulse-beacon" />

      <div class="glow-avatar row items-center justify-center">
        <q-icon
          name="campaign"
          size="18px"
          class="bell-shaking" />
      </div>

      <div class="badge-cta-text column">
        <span class="cta-title row items-center q-gutter-x-xs">
          <span>اتصال به پیام‌رسان بله</span>
          <q-badge
            color="amber-4"
            text-color="dark"
            rounded
            label="مهم"
            class="text-weight-bolder mini-tag" />
        </span>
        <span class="cta-subtitle">دریافت سریع نمرات و اطلاعیه‌ها</span>
      </div>

      <q-btn
        dense
        unelevated
        no-caps
        label="اتصال فوری"
        icon-right="bolt"
        class="connect-action-btn q-ml-xs" />
    </div>

    <!-- دیالوگ مدال کمکی برای باز کردن مستقیم کارت BaleConnectionCard در صورت کلیک روی هدر -->
    <q-dialog
      v-model="baleDialog"
      persistent
      transition-show="scale"
      transition-hide="scale">
      <q-card
        class="bale-connect-modal shadow-10"
        style="width: 100%; max-width: 580px; border-radius: 20px;">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-subtitle1 text-weight-bolder text-primary row items-center q-gutter-x-sm">
            <q-icon
              name="link"
              size="22px" />
            <span>اتصال حساب کاربری به پیام‌رسان بله</span>
          </div>
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <bale-connection-card />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import BaleConnectionCard from 'src/components/bale/BaleConnectionCard.vue'

const router = useRouter()
const userManager = useUser()
const baleDialog = ref(false)

const user = computed(() => userManager.me as any)

/**
 * بررسی هوشمند اتصال بر اساس فیلدهای معمول مدل کاربر
 * (bale_chat_id, is_bale_connected, bale_username یا مشابه آن)
 */
const isBaleConnected = computed<boolean>(() => {
  if (!user.value) return false
  return Boolean(
    user.value.bale_chat_id ||
      user.value.bale_id ||
      user.value.is_bale_connected ||
      user.value.bale_username ||
      user.value.extra?.bale_chat_id
  )
})

const displayBaleUsername = computed<string>(() => {
  const username =
    user.value?.bale_username ||
    user.value?.bale_nickname ||
    user.value?.bale_first_name ||
    user.value?.extra?.bale_username

  if (!username) {
    return 'کاربر تایید شده'
  }

  return username.startsWith('@') ? username : `@${username}`
})

function triggerConnectBale () {
  // باز کردن دیالوگ سریع درون هدر؛ در صورت نیاز می‌تواند مستقیم به پروفایل هدایت کند
  baleDialog.value = true
}
</script>

<style scoped lang="scss">
.student-bale-badge-wrapper {
  display: inline-flex;
  align-items: center;
}

/* ۱) استایل اختصاصی حالت متصل (مدال) */
.bale-connected-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 6px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 95, 70, 0.35) 100%);
  border: 1px solid rgba(52, 211, 153, 0.45);
  box-shadow: 0 4px 14px -3px rgba(16, 185, 129, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #ffffff;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(52, 211, 153, 0.7);
    box-shadow: 0 6px 18px -2px rgba(16, 185, 129, 0.5);
  }

  .badge-ribbon-icon {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.5);

    .medal-icon {
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .active-sparkle {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 7px;
      height: 7px;
      background: #a7f3d0;
      border-radius: 50%;
      box-shadow: 0 0 6px #6ee7b7;
    }
  }

  .badge-info {
    line-height: 1.25;

    .badge-label {
      font-size: 10.5px;
      font-weight: 800;
      color: #a7f3d0;
    }

    .badge-username {
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      max-width: 110px;
    }
  }

  .action-mini-btn {
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
    }
  }
}

/* ۲) استایل اختصاصی حالت غیر متصل (توی چشم، پرانرژی و جذاب) */
.bale-disconnected-badge {
  position: relative;
  cursor: pointer;
  gap: 10px;
  padding: 6px 10px 6px 8px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.32) 0%, rgba(245, 158, 11, 0.36) 100%);
  border: 1px solid rgba(251, 191, 36, 0.65);
  box-shadow:
    0 4px 18px rgba(245, 158, 11, 0.35),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;

  &:hover {
    transform: scale(1.02) translateY(-2px);
    border-color: #fde047;
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.55);
  }

  /* رادار نوری چشمک‌زن */
  .pulse-beacon {
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(251, 191, 36, 0.3);
    animation: beacon-wave 2s infinite;
    pointer-events: none;
    z-index: 0;
  }

  .glow-avatar {
    position: relative;
    z-index: 1;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: #ffffff;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.7);

    .bell-shaking {
      animation: bell-ring 2.5s infinite;
    }
  }

  .badge-cta-text {
    position: relative;
    z-index: 1;
    line-height: 1.25;

    .cta-title {
      font-size: 11.5px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);

      .mini-tag {
        font-size: 9px;
        padding: 1px 5px;
        line-height: 1.2;
      }
    }

    .cta-subtitle {
      font-size: 10px;
      font-weight: 600;
      color: #fef08a;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }

  .connect-action-btn {
    position: relative;
    z-index: 1;
    border-radius: 10px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);

    &:hover {
      filter: brightness(1.1);
    }
  }
}

.ltr-text {
  direction: ltr;
  display: inline-block;
}

/* انیمیشن زنگوله و رادار */
@keyframes bell-ring {
  0%, 100% { transform: rotate(0); }
  10%, 30% { transform: rotate(14deg); }
  20%, 40% { transform: rotate(-14deg); }
  50% { transform: rotate(0); }
}

@keyframes beacon-wave {
  0% {
    transform: translateY(-50%) scale(0.6);
    opacity: 0.9;
  }
  100% {
    transform: translateY(-50%) scale(2.2);
    opacity: 0;
  }
}

@media (max-width: 600px) {
  .bale-disconnected-badge {
    .cta-subtitle {
      display: none;
    }
    .connect-action-btn {
      padding: 3px 7px;
      font-size: 10.5px;
    }
  }
}
</style>
