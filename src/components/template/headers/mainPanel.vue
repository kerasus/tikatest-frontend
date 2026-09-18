<script setup lang="ts">
import { useQuasar } from 'quasar'
import moment from 'jalali-moment'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useAppLayout } from 'stores/appLayout'
import { ref, onMounted, onUnmounted } from 'vue'
import { userRoleOptions } from 'src/repositories/user'
import { useHeaderBreadCrumbs } from 'src/stores/headerBreadCrumbs'

withDefaults(defineProps<{ floated?: boolean }>(), {
  floated: false
})

const $q = useQuasar()
const router = useRouter()
const userManager = useUser()
const appLayoutStore = useAppLayout()
const headerBreadCrumbsStore = useHeaderBreadCrumbs()
const formattedDate = ref('')
const formattedTime = ref('')

function updateDateTime () {
  const now = moment()
  formattedDate.value = now.format('jYYYY/jMM/jDD')
  formattedTime.value = now.format('HH:mm')
}

function translateRole (roleName: string): string {
  const target = userRoleOptions.find((role) => role.value === roleName)
  if (!target) {
    return '-'
  }

  return target.label
}

let timer: any
onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function toggleLeftDrawerMini () {
  appLayoutStore.layoutLeftDrawerMiniToOverlay = $q.screen.lt.md
  appLayoutStore.layoutLeftDrawerMini = !appLayoutStore.layoutLeftDrawerMini
}

function toggleLeftDrawerVisible () {
  appLayoutStore.layoutLeftDrawerMiniToOverlay = false
  appLayoutStore.layoutLeftDrawerVisible = !appLayoutStore.layoutLeftDrawerVisible
}

function logout () {
  userManager.logout()
  router.push({ name: 'Auth.Login' })
}
</script>

<template>
  <div
    class="main-dashboard-wrapper"
    :class="{ floated: floated }">
    <q-toolbar class="main-dashboard">
      <q-toolbar-title class="main-dashboard__main-section">
        <div class="main-dashboard__right-section">
          <div class="toggle-mini-btn">
            <q-btn
              class="icon-button drawer-btn gt-sm"
              color="primary"
              flat
              :icon="
                appLayoutStore.layoutLeftDrawerMini
                  ? 'keyboard_double_arrow_left'
                  : 'keyboard_double_arrow_right'
              "
              @click="toggleLeftDrawerMini" />
            <q-btn
              class="icon-button drawer-btn lt-md"
              color="primary"
              flat
              icon="menu"
              @click="toggleLeftDrawerVisible" />
          </div>
          <div class="pageCategory">
            {{ headerBreadCrumbsStore.pageCategory }}
          </div>
          <div class="breadCrumbs">
            <q-breadcrumbs active-color="color-text2">
              <q-breadcrumbs-el
                v-for="(breadCrumb, breadCrumbIndex) in headerBreadCrumbsStore.breadCrumbs"
                :key="breadCrumbIndex"
                :to="breadCrumb.to ? breadCrumb.to : undefined">
                {{ breadCrumb.label }}
              </q-breadcrumbs-el>
            </q-breadcrumbs>
          </div>
        </div>
        <div class="main-dashboard__center-section" />
        <div class="main-dashboard__left-section">
          <div class="time">
            {{ formattedDate }}
            <q-icon name="remove" />
            {{ formattedTime }}
          </div>
          <!-- <q-btn icon="notifications" class="icon-button" @click="toggleRightDrawer">
            <q-badge floating rounded color="red"> 2 </q-badge>
          </q-btn> -->
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
          <q-btn
            v-else
            icon="login"
            color="primary"
            outline
            :to="{ name: 'Auth.Login' }" />
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </div>
</template>

<style scoped lang="scss">
.main-dashboard-wrapper {
  $header-height: 50px;
  //background: $gray-100;
  background: transparent;
  min-height: $header-height;
  padding: $space-2;
  .main-dashboard {
    border-radius: 1rem;
    padding: $space-3 $space-4 $space-3 $space-16;
    transition:
      box-shadow 0.25s ease-in,
      background-color 0.25s ease-in;
    position: relative;
    .toggle-mini-btn {
      position: absolute;
      left: $space-3;
      top: 50%;
      transform: translateY(-50%);
    }
    .main-dashboard__main-section {
      height: $header-height;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .main-dashboard__right-section {
        display: flex;
        flex-direction: column;
        gap: $space-2;
        .pageCategory {
          color: $color-text1;
          @include typo-title-3;
        }
      }
      .main-dashboard__left-section {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: $space-2;
        .q-btn {
          color: $neutral-30;
          background: $neutral-95;
        }
        .time {
          color: $color-text2;
          margin-right: $space-2;
          direction: rtl;
          @include typo-body-3;
        }
      }
    }
  }
  &.floated {
    .main-dashboard {
      box-shadow:
        inset 0 0 1px 1px rgba(254, 254, 254, 0.9),
        0 20px 27px 0 rgba(0, 0, 0, 0.05) !important;
      backdrop-filter: saturate(200%) blur(30px);
      background-color: rgba(255, 255, 255, 0.4) !important;
    }
  }
}
:global(.search-in-menu__input) {
  position: sticky;
  top: $spacing-none;
  padding-top: $space-3;
  background: $neutral-100;
  z-index: 1;
}
.search-input {
  margin: 10px;
}

.profile-menu {
  min-width: 200px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  .q-avatar {
  }
  .profile-menu-user-info {
    .profile-menu-user-fullname {
    }
    .profile-menu-user-roles {
    }
  }
  .logout-btn {
    width: 100%;
  }
}

/* تنظیمات کارت منو */
:deep(.profile-menu-card) {
  border-radius: 20px !important;
  overflow: hidden;
  border: 1px solid rgba($secondary, 0.12);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

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
