<script setup lang="ts">
import { useQuasar } from 'quasar'
import moment from 'jalali-moment'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useAppLayout } from 'stores/appLayout'
import { userRoleOptions } from 'src/repositories/user'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useOnlineExamSession } from 'src/stores/onlineExamSession'

withDefaults(defineProps<{ floated?: boolean }>(), {
  floated: false
})

const $q = useQuasar()
const router = useRouter()
const userManager = useUser()
const appLayoutStore = useAppLayout()
const onlineExamStore = useOnlineExamSession()

const formattedDate = ref('')

function updateDateTime () {
  const now = moment()
  formattedDate.value = now.format('jYYYY/jMM/jDD')
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

const layoutFooterHeight = computed(() => appLayoutStore.layoutFooterHeight + 'px')
const remainingTimeText = computed(() => {
  const remaining = onlineExamStore.remainingTime
  if (remaining == null) return '--:--'
  const safe = Math.max(0, Math.floor(remaining))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const progressPercent = computed(() => {
  const total = onlineExamStore.durationLimit
  const remaining = onlineExamStore.remainingTime
  if (!total || remaining == null) return 0
  const elapsed = Math.max(0, total - remaining)
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
})

const session = computed(() => onlineExamStore.sessionData)

const formatDuration = (seconds: number | null | undefined) => {
  if (seconds == null) return '-'
  const safe = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safe / 3600)
  const mins = Math.floor((safe % 3600) / 60)
  const secs = safe % 60

  return [hours, mins, secs].map((part) => part.toString().padStart(2, '0')).join(':')
}

function goToExamList () {
  router.push({ name: 'Student.Exam.List' })
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
                !appLayoutStore.layoutLeftDrawerVisible
                  ? 'keyboard_double_arrow_left'
                  : 'keyboard_double_arrow_right'
              "
              @click="toggleLeftDrawerVisible" />
            <q-btn
              class="icon-button drawer-btn lt-md"
              color="primary"
              flat
              icon="menu"
              @click="toggleLeftDrawerVisible" />
          </div>

          <div class="exam-info-and-progressbar">
            <div class="exam-info">
              <div class="exam-title">
                {{ onlineExamStore.examTitle }}
              </div>
              <div
                v-if="onlineExamStore.isActive"
                class="remaining-info">
                زمان باقی‌مانده:
                {{ remainingTimeText }}
              </div>
              <div
                v-else-if="onlineExamStore.isResultMode && session"
                class="result-time-info">
                <span class="exam-session-status">{{ onlineExamStore.statusLabel }}</span>
              </div>
            </div>
            <div v-if="onlineExamStore.isActive">
              <q-linear-progress
                :value="progressPercent / 100"
                size="8px"
                color="primary"
                class="q-mt-xs" />
            </div>
          </div>
        </div>
        <div class="main-dashboard__left-section">
          <q-btn
            v-if="onlineExamStore.isActive || onlineExamStore.isResultMode"
            icon="assignment"
            color="primary"
            flat
            class="icon-button"
            label="لیست آزمون‌ها"
            @click="goToExamList" />

          <q-btn
            v-if="userManager.me"
            icon="account_circle"
            color="primary"
            flat
            class="icon-button">
            <q-menu
              transition-show="jump-down"
              transition-hide="jump-up"
              style="min-width: 260px">
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar size="56px">
                    <img
                      src="/images/blankProfile.png"
                      alt="avatar">
                  </q-avatar>
                  <div class="q-mr-md">
                    <div class="text-subtitle1 text-blue-grey-9">
                      {{ userManager.me?.first_name }} {{ userManager.me?.last_name }}
                    </div>
                    <div class="text-caption text-blue-grey-7">
                      {{ userManager.me.roles.map((r) => translateRole(r.name)).join(', ') }}
                    </div>
                  </div>
                </q-card-section>

                <q-separator />

                <q-list padding>
                  <q-item
                    v-if="onlineExamStore.isActive"
                    v-close-popup
                    clickable
                    @click="goToExamList">
                    <q-item-section avatar>
                      <q-icon name="assignment" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>لیست آزمون‌ها</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click="logout">
                    <q-item-section avatar>
                      <q-icon
                        name="logout"
                        color="red" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-red">خروج</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
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
  padding: $space-4 $space-4 $space-4 $space-10;
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
    .exam-info-and-progressbar {
      .exam-info {
        display: flex;
        gap: $space-2;
        .exam-title {
          color: $color-text1;
          @include typo-title-3;
        }
        .remaining-info {
          color: $color-text2;
          @include typo-body-3;
        }
        .result-time-info {
          display: flex;
          flex-wrap: wrap;
          gap: $space-2;
          color: $color-text2;
          @include typo-body-3;
        }
        .exam-session-status {
          color: $color-text3;
          @include typo-title-3;
        }
      }
    }
    .main-dashboard__main-section {
      height: $header-height;
      display: flex;
      align-items: center;
      justify-content: space-between;
      $left-section-width: 200px;
      .main-dashboard__right-section {
        width: calc(100% - #{$left-section-width});
        display: flex;
        flex-direction: column;
        gap: $space-2;
      }
      .main-dashboard__left-section {
        width: $left-section-width;
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
  min-width: 260px;
  .q-avatar {
    margin: 0 auto;
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
</style>
