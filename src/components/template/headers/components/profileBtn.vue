<template>
  <q-btn
    v-if="userManager.me"
    color="primary"
    flat
    class="icon-button">
    <q-avatar
      size="32px"
      class="trigger-avatar">
      <img
        :src="userManager.me?.picture || '/images/blankProfile.png'"
        alt="avatar">
      <span class="online-indicator" />
    </q-avatar>

    <q-menu
      anchor="bottom left"
      self="top left"
      :offset="[0, 12]"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="cyber-profile-menu shadow-14">

      <!-- جلوه شیشه‌ای و نور پس‌زمینه ایزوله -->
      <div class="glass-canvas">
        <div class="ambient-glow" />
        <div class="ambient-pulse" />
      </div>


      <div class="menu-content">
        <!-- بخش هدر پروفایل و آواتار متحرک -->
        <div class="user-hero-card">
          <div class="quantum-avatar-wrapper">
            <div class="quantum-ring ring-outer" />
            <div class="quantum-ring ring-inner" />
            <q-avatar
              size="56px"
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
              size="16px"
              class="chevron-arrow" />
          </div>

          <!-- دکمه خروج -->
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
    color: '#06b6d4',
    action: () => {
      router.push({ name: userManager.isStudent ? 'Student.Profile' : 'Panel.Profile' })
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
.trigger-avatar {
  position: relative;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);

  .online-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
  }
}

:global(.cyber-profile-menu) {
  width: 275px;
  min-width: 275px;
  border-radius: 20px !important;
  overflow: hidden !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  background: rgba(255, 255, 255, 0.72) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12) !important;
  contain: paint;
}

.glass-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  .ambient-glow {
    position: absolute;
    top: -50px;
    right: -30px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.12) 60%, transparent 80%);
    border-radius: 50%;
    animation: ambient-drift 6s ease-in-out infinite alternate;
  }

  /* لایه‌ی پالس ظریف روی همون هاله */
  .ambient-pulse {
    position: absolute;
    top: -50px;
    right: -30px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
    animation: ambient-pulse 2.2s ease-out infinite;
  }
}

@keyframes ambient-drift {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.15) translate(-20px, 15px); }
}

@keyframes ambient-pulse {
  0% {
    transform: scale(0.85);
    opacity: 0.7;
  }
  60% {
    transform: scale(1.25);
    opacity: 0.15;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.menu-content {
  position: relative;
  z-index: 1;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* کارت معرفی کاربر */
.user-hero-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;

  .quantum-avatar-wrapper {
    position: relative;
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;

    .quantum-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      pointer-events: none;

      &.ring-outer {
        border: 2px dashed rgba(99, 102, 241, 0.45);
        animation: spin-clockwise 10s linear infinite;
      }

      &.ring-inner {
        inset: 3px;
        border: 1.5px solid transparent;
        border-top-color: #06b6d4;
        border-bottom-color: #a855f7;
        animation: spin-counter 4s linear infinite;
      }
    }

    .quantum-avatar {
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
    }
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    .user-fullname {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
    }

    .roles-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px;

      .role-pill {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(99, 102, 241, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.16);
        color: #4f46e5;

        .role-icon {
          color: #818cf8;
        }
      }
    }
  }
}

.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.8), transparent);
  margin: 0 4px;
}

/* لیست اکشن‌ها */
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .action-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.65);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.85);
      border-color: rgba(99, 102, 241, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);

      .chevron-arrow {
        transform: translateX(-3px);
        color: #4f46e5;
      }
    }

    .card-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: var(--accent-glow, #6366f1);
      color: #ffffff;
      box-shadow: 0 3px 8px rgba(6, 182, 212, 0.25);

      &.danger {
        background: #ef4444;
        box-shadow: 0 3px 8px rgba(239, 68, 68, 0.25);
      }
    }

    .card-details {
      flex: 1;
      display: flex;
      flex-direction: column;

      .card-title {
        font-size: 12px;
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
      transition: transform 0.2s ease, color 0.2s ease;
    }

    &.logout-card {
      &:hover {
        background: rgba(254, 242, 242, 0.85);
        border-color: rgba(239, 68, 68, 0.2);

        .card-details .card-title {
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
