<template>
  <div
    class="status-pill-minimal"
    :class="isOnline ? 'is-online' : 'is-offline'">
    <!-- نقطه نوری مینیاتوری با افکت پالس -->
    <div class="beacon-wrapper">
      <span class="beacon-ping" />
      <span class="beacon-core" />
    </div>

    <!-- متن کوتاه و مینیمال -->
    <transition
      name="fade-slide"
      mode="out-in">
      <span
        :key="isOnline ? 'online' : 'offline'"
        class="status-label">
        {{ isOnline ? 'آنلاین' : 'قطع ارتباط' }}
      </span>
    </transition>

    <!-- تولتیپ شیشه‌ای مدرن -->
    <q-tooltip
      anchor="bottom middle"
      self="top middle"
      :offset="[0, 6]"
      class="glass-tooltip">
      <div class="row items-center no-wrap q-gutter-xs">
        <q-icon
          :name="isOnline ? 'wifi' : 'wifi_off'"
          :color="isOnline ? 'positive' : 'negative'"
          size="14px" />
        <span>
          {{
            isOnline
              ? 'اتصال پایدار با سرور برقرار است'
              : 'ارتباط با سرور قطع شده است؛ تغییرات ذخیره نخواهد شد!'
          }}
        </span>
      </div>
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref<boolean>(true)
let pingInterval: ReturnType<typeof setInterval> | null = null

const checkHostConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`/connection-check.txt?t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
      signal: AbortSignal.timeout(4000)
    })

    isOnline.value = response.ok
    return response.ok
  } catch {
    isOnline.value = false
    return false
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    checkHostConnection()
  }
}

onMounted(() => {
  checkHostConnection()
  pingInterval = setInterval(checkHostConnection, 15000)

  window.addEventListener('online', checkHostConnection)
  window.addEventListener('offline', () => {
    isOnline.value = false
  })
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  if (pingInterval) clearInterval(pingInterval)
  window.removeEventListener('online', checkHostConnection)
  window.removeEventListener('offline', () => {
    isOnline.value = false
  })
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped lang="scss">
.status-pill-minimal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  border-radius: 7px;
  cursor: default;
  user-select: none;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* حالت آنلاین: شیشه مات با ته‌رنگ بسیار ملایم سبز */
  &.is-online {
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(16, 185, 129, 0.18);
    color: #047857;

    &:hover {
      background: rgba(255, 255, 255, 0.7);
      border-color: rgba(16, 185, 129, 0.35);
    }

    .beacon-core {
      background: #10b981;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
    }

    .beacon-ping {
      border: 1px solid #10b981;
      animation: sonar-wave 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
  }

  /* حالت قطعی: شیشه یاقوتی نیمه‌شفاف هشداردهنده */
  &.is-offline {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #b91c1c;

    &:hover {
      background: rgba(239, 68, 68, 0.16);
    }

    .beacon-core {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.7);
    }

    .beacon-ping {
      border: 1px solid #ef4444;
      animation: emergency-ping 0.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

/* چراغ مینیاتوری */
.beacon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 8px;
}

.beacon-core {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: background 0.3s ease;
}

.beacon-ping {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
}

.status-label {
  letter-spacing: -0.2px;
  line-height: 1;
  white-space: nowrap;
}

/* انیمیشن‌ها */
@keyframes sonar-wave {
  0% { transform: scale(0.9); opacity: 0.8; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}

@keyframes emergency-ping {
  0% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(2.7); opacity: 0; }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(2px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
