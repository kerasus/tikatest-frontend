<template>
  <q-btn
    v-if="userManager.me"
    flat
    dense
    round
    class="profile-trigger-btn">
    <div class="avatar-aura-wrapper">
      <div class="avatar-aura-pulse" />
      <q-avatar
        size="38px"
        class="trigger-avatar">
        <img
          :src="userManager.me?.picture || '/images/blankProfile.png'"
          alt="avatar">
        <span class="online-indicator" />
      </q-avatar>
    </div>

    <q-menu
      anchor="bottom left"
      self="top left"
      :offset="[0, 14]"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="aurora-glass-menu shadow-20">

      <!-- موتور جلوه شیشه‌ای و هاله‌های گرادیان شناور -->
      <div class="liquid-mesh-canvas">
        <div class="aurora-orb orb-1" />
        <div class="aurora-orb orb-2" />
        <div class="aurora-orb orb-3" />
        <div class="glass-surface-highlight" />
      </div>

      <div class="menu-content">
        <!-- بخش هدر پروفایل و آواتار هولوگرافیک -->
        <div class="user-hero-card">
          <div class="quantum-avatar-wrapper">
            <div class="quantum-ring ring-outer" />
            <div class="quantum-ring ring-inner" />
            <q-avatar
              size="58px"
              class="quantum-avatar">
              <img
                :src="userManager.me?.picture || '/images/blankProfile.png'"
                alt="avatar">
            </q-avatar>
          </div>

          <div class="user-meta">
            <div class="user-fullname">
              {{ userManager.me?.first_name }} {{ userManager.me?.last_name }}
            </div>

            <div class="roles-container">
              <span
                v-for="(r, idx) in userManager.me?.roles || []"
                :key="idx"
                class="role-pill">
                <q-icon
                  name="auto_awesome"
                  size="11px"
                  class="role-icon" />
                {{ translateRole(r.name) }}
              </span>
            </div>
          </div>
        </div>

        <div class="menu-divider" />

        <!-- لیست آیتم‌ها -->
        <div class="actions-list">
          <div
            v-for="item in menuItems"
            :key="item.title"
            class="action-card"
            @click="item.action ? item.action() : null">
            <div
              class="card-icon"
              :style="{ '--accent-glow': item.color }">
              <q-icon
                :name="item.icon"
                size="18px" />
            </div>
            <div class="card-details">
              <span class="card-title">{{ item.title }}</span>
              <span class="card-caption">{{ item.caption }}</span>
            </div>
            <q-icon
              name="chevron_left"
              size="17px"
              class="chevron-arrow" />
          </div>

          <!-- دکمه خروج با استایل گلس ملایم قرمز -->
          <div
            class="action-card logout-card"
            @click="logout">
            <div class="card-icon danger">
              <q-icon
                name="logout"
                size="17px" />
            </div>
            <div class="card-details">
              <span class="card-title">خروج از حساب</span>
              <span class="card-caption">پایان نشست کاری جاری</span>
            </div>
          </div>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useUser } from 'stores/user'
import { useRouter } from 'vue-router'
import { userRoleOptions } from 'src/repositories/user'

const router = useRouter()
const userManager = useUser()

const menuItems = [
  {
    title: 'پنل کاربری',
    caption: 'تنظیمات و مشخصات پروفایل',
    icon: 'manage_accounts',
    color: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    action: () => {
      router.push({ name: 'Panel.Profile' })
    }
  }
]

function translateRole (roleName: string): string {
  const target = userRoleOptions.find((role) => role.value === roleName)
  return target ? target.label : roleName || '-'
}

function logout () {
  userManager.logout()
  router.push({ name: 'Auth.Login' })
}
</script>

<style scoped lang="scss">
/* دکمه تریگر هدر */
.profile-trigger-btn {
  padding: 2px;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: scale(1.05);
  }
}

.avatar-aura-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar-aura-pulse {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(6, 182, 212, 0.4));
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(4px);
  }

  &:hover .avatar-aura-pulse {
    opacity: 1;
  }
}

.trigger-avatar {
  position: relative;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);

  .online-indicator {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 9px;
    height: 9px;
    background: #10b981;
    border: 1.5px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
  }
}

/* ساختار شیشه‌ای منو پاپ‌آپ */
:global(.aurora-glass-menu) {
  width: 285px;
  min-width: 285px;
  border-radius: 24px !important;
  overflow: hidden !important;
  border: 1px solid rgba(255, 255, 255, 0.75) !important;
  background: rgba(255, 255, 255, 0.68) !important;
  backdrop-filter: blur(28px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
  box-shadow: 0 20px 48px -10px rgba(79, 70, 229, 0.16),
              0 1px 2px rgba(255, 255, 255, 0.8) inset !important;
  contain: paint;
}

/* بوم نورهای متحرک مایع در پس‌زمینه شیشه */
.liquid-mesh-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  .glass-surface-highlight {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }

  .aurora-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(35px);
    opacity: 0.55;
    mix-blend-mode: multiply;
  }

  .orb-1 {
    top: -40px;
    right: -20px;
    width: 170px;
    height: 170px;
    background: radial-gradient(circle, #818cf8 0%, #c084fc 60%, transparent 80%);
    animation: drift-orb-1 2s ease-in-out infinite alternate;
  }

  .orb-2 {
    bottom: -30px;
    left: -20px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, #38bdf8 0%, #818cf8 60%, transparent 80%);
    animation: drift-orb-2 2s ease-in-out infinite alternate;
  }

  .orb-3 {
    top: 40%;
    left: 20%;
    width: 130px;
    height: 130px;
    background: radial-gradient(circle, #f472b6 0%, #fb923c 60%, transparent 80%);
    opacity: 0.35;
    animation: drift-orb-3 2s ease-in-out infinite alternate;
  }
}

@keyframes drift-orb-1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 25px) scale(1.15); }
  100% { transform: translate(15px, 10px) scale(0.95); }
}

@keyframes drift-orb-2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(25px, -20px) scale(1.1); }
  100% { transform: translate(-10px, 15px) scale(0.9); }
}

@keyframes drift-orb-3 {
  0% { transform: translate(0, 0) scale(0.9); opacity: 0.25; }
  50% { transform: translate(20px, 20px) scale(1.2); opacity: 0.45; }
  100% { transform: translate(-15px, -15px) scale(1); opacity: 0.3; }
}

.menu-content {
  position: relative;
  z-index: 1;
  padding: 18px 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* کارت هدر کاربر */
.user-hero-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;

  .quantum-avatar-wrapper {
    position: relative;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;

    .quantum-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      pointer-events: none;

      &.ring-outer {
        border: 2px dashed rgba(99, 102, 241, 0.4);
        animation: spin-clockwise 14s linear infinite;
      }

      &.ring-inner {
        inset: 4px;
        border: 1.5px solid transparent;
        border-top-color: #06b6d4;
        border-bottom-color: #a855f7;
        animation: spin-counter 6s linear infinite;
      }
    }

    .quantum-avatar {
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
    }
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .user-fullname {
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }

    .roles-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 5px;

      .role-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 9px;
        border-radius: 14px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(99, 102, 241, 0.22);
        color: #4f46e5;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);

        .role-icon {
          color: #6366f1;
        }
      }
    }
  }
}

.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.35), transparent);
  margin: 2px 6px;
}

/* لیست آیتم‌ها و دکمه‌ها */
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 7px;

  .action-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 11px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.75);
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.88);
      border-color: rgba(99, 102, 241, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(79, 70, 229, 0.1);

      .chevron-arrow {
        transform: translateX(-4px);
        color: #4f46e5;
      }
    }

    .card-icon {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: var(--accent-glow, linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%));
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);

      &.danger {
        background: linear-gradient(135deg, #ef4444 0%, #f43f5e 100%);
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.25);
      }
    }

    .card-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;

      .card-title {
        font-size: 12.5px;
        font-weight: 700;
        color: #1e293b;
      }

      .card-caption {
        font-size: 10px;
        color: #64748b;
      }
    }

    .chevron-arrow {
      color: #94a3b8;
      transition: transform 0.25s ease, color 0.25s ease;
    }

    &.logout-card {
      &:hover {
        background: rgba(254, 242, 242, 0.9);
        border-color: rgba(239, 68, 68, 0.28);

        .card-details .card-title {
          color: #dc2626;
        }

        .chevron-arrow {
          color: #dc2626;
        }
      }
    }
  }
}

@keyframes spin-clockwise {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-counter {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
</style>
