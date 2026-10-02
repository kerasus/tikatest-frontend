<template>
  <q-btn
    v-if="userManager.me"
    color="primary"
    flat
    class="icon-button">
    <q-avatar
      size="30px"
      class="shadow-4">
      <img
        :src="userManager.me?.picture || '/images/blankProfile.png'"
        alt="avatar">
    </q-avatar>
    <q-menu
      anchor="bottom left"
      self="top left"
      :offset="[0, 12]"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="profile-menu-card shadow-10">
      <div class="profile-card">
        <!-- هدر گرادیانی فانتزی -->
        <div class="profile-card__header">
          <div class="header-pattern" />
        </div>

        <!-- بخش آواتار و اطلاعات -->
        <div class="profile-card__body">
          <q-avatar
            size="68px"
            class="profile-card__avatar shadow-4">
            <img
              :src="userManager.me?.picture || '/images/blankProfile.png'"
              alt="avatar">
          </q-avatar>

          <div class="profile-card__name">
            {{ userManager.me?.first_name }} {{ userManager.me?.last_name }}
          </div>

          <!-- بج نقش‌ها -->
          <div class="profile-card__roles">
            <span
              v-for="(r, idx) in userManager.me?.roles"
              :key="idx"
              class="role-badge">
              {{ translateRole(r.name) }}
            </span>
          </div>

          <q-separator class="q-my-sm full-width profile-card__separator" />

          <!-- لینک‌های دسترسی سریع منو -->
          <div class="profile-card__links full-width">
            <q-btn
              v-close-popup
              flat
              no-caps
              align="left"
              class="menu-item-btn"
              icon="account_circle"
              label="پروفایل کاربری"
              :to="{name: userManager.isStudent ? 'Student.Profile' : 'Panel.Profile'}" />
            <q-btn
              v-if="false"
              v-close-popup
              flat
              no-caps
              align="left"
              class="menu-item-btn"
              icon="tune"
              label="تنظیمات" />
          </div>

          <q-separator class="q-my-sm full-width profile-card__separator" />

          <!-- دکمه خروج خوشگل -->
          <q-btn
            v-close-popup
            flat
            no-caps
            class="logout-action-btn full-width"
            @click="logout">
            <div class="row items-center justify-between full-width no-wrap">
              <span class="text-weight-bold">خروج از حساب</span>
              <q-icon
                name="logout"
                size="18px" />
            </div>
          </q-btn>
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


function translateRole (roleName: string): string {
  const target = userRoleOptions.find((role) => role.value === roleName)
  if (!target) {
    return '-'
  }

  return target.label
}

function logout () {
  userManager.logout()
  router.push({ name: 'Auth.Login' })
}
</script>

<style scoped lang="scss">
.profile-card {
  width: 250px;
  display: flex;
  flex-direction: column;

  /* هدر شیک با گرادیان تم جدید هیرو */
  &__header {
    height: 60px;
    background: linear-gradient(135deg, $secondary 0%, $primary 100%);
    position: relative;
    overflow: hidden;

    .header-pattern {
      position: absolute;
      inset: 0;
      opacity: 0.15;
      background-image: radial-gradient(#fff 1.5px, transparent 1.5px);
      background-size: 10px 10px;
    }
  }

  &__body {
    padding: 0 $space-4 $space-3 $space-4;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* آواتار نیمه‌شناور روی هدر */
  &__avatar {
    margin-top: -34px;
    background: #ffffff;
    transition: transform 0.25s ease;

    &:hover {
      transform: scale(1.05) rotate(2deg);
    }

    img {
      object-fit: cover;
    }
  }

  &__name {
    font-size: 0.95rem;
    font-weight: 700;
    color: $neutral-dark;
    margin-top: $space-2;
    line-height: 1.3;
  }

  &__roles {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    margin-top: 6px;

    .role-badge {
      font-size: 0.72rem;
      font-weight: 600;
      color: $secondary;
      background: rgba($secondary, 0.09);
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid rgba($secondary, 0.18);
    }
  }

  &__separator {
    opacity: 0.6;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .menu-item-btn {
      color: $neutral-30;
      border-radius: 10px;
      font-size: 0.82rem;
      padding: 6px 10px;
      transition: all 0.2s ease;

      :deep(.q-icon) {
        font-size: 19px;
        margin-right: 8px;
        color: $neutral-40;
        transition: color 0.2s ease;
      }

      &:hover {
        background: rgba($primary, 0.08);
        color: $primary;

        :deep(.q-icon) {
          color: $primary;
        }
      }
    }
  }

  /* دکمه خروج تمیز با هاور نرم */
  .logout-action-btn {
    border-radius: 12px;
    background: #fff0f2;
    color: $error;
    padding: 8px 14px;
    font-size: 0.82rem;
    transition: all 0.25s ease;

    &:hover {
      background: $error;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(238, 66, 102, 0.35);
      transform: translateY(-1px);
    }
  }
}
</style>
