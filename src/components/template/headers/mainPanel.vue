<template>
  <header
    class="main-dashboard-wrapper"
    :class="{ floated: floated, 'is-floated': floated }">
    <div class="main-dashboard">
      <!-- بخش راست: دکمه سایدبار + (دسته‌بندی در بالا و بردکرامبز در زیر آن) -->
      <div class="nav-cluster">
        <q-btn
          class="compact-action-btn gt-sm"
          flat
          round
          dense
          color="primary"
          :icon="
            appLayoutStore.layoutLeftDrawerMini
              ? 'keyboard_double_arrow_left'
              : 'keyboard_double_arrow_right'
          "
          @click="toggleLeftDrawerMini">
          <q-tooltip class="bg-dark text-caption">تغییر حالت منو</q-tooltip>
        </q-btn>

        <q-btn
          class="compact-action-btn lt-md"
          flat
          round
          dense
          color="primary"
          icon="menu"
          @click="toggleLeftDrawerVisible" />

        <!-- دسته صفحه در بالا و Breadcrumbs دقیقاً زیر آن -->
        <div class="nav-titles-stack">
          <div
            v-if="headerBreadCrumbsStore.pageCategory"
            class="nav-category">
            {{ headerBreadCrumbsStore.pageCategory }}
          </div>

          <div
            v-if="headerBreadCrumbsStore.breadCrumbs?.length"
            class="nav-breadcrumbs-row">
            <q-breadcrumbs
              class="compact-breadcrumbs"
              active-color="primary"
              separator="/"
              separator-color="grey-4">
              <q-breadcrumbs-el
                v-for="(breadCrumb, idx) in headerBreadCrumbsStore.breadCrumbs"
                :key="idx"
                :label="breadCrumb.label"
                :to="breadCrumb.to || undefined" />
            </q-breadcrumbs>
          </div>
        </div>
      </div>

      <!-- بخش چپ: تاریخ، ساعت و پروفایل کاربری -->
      <div class="actions-cluster">
        <!-- ویجت زمان فشرده و متناسب با ارتفاع ۶۴ -->
        <div class="compact-time-pill">
          <q-icon
            name="schedule"
            size="14px"
            class="time-icon" />
          <span class="date-txt gt-xs">{{ formattedDate }}</span>
          <span class="sep-dot gt-xs">•</span>
          <span class="time-txt ltr-num">{{ formattedTime }}</span>
        </div>

        <profile-btn
          v-if="userManager.me"
          class="compact-profile" />

        <q-btn
          v-else
          icon="login"
          label="ورود"
          color="primary"
          unelevated
          dense
          class="compact-login-btn"
          :to="{ name: 'Auth.Login' }" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import moment from 'jalali-moment'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useAppLayout } from 'stores/appLayout'
import { ref, onMounted, onUnmounted } from 'vue'
import { useHeaderBreadCrumbs } from 'src/stores/headerBreadCrumbs'
import ProfileBtn from 'src/components/template/headers/components/profileBtn.vue'

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
let timer: ReturnType<typeof setInterval> | null = null

function updateDateTime () {
  const now = moment()
  formattedDate.value = now.format('jYYYY/jMM/jDD')
  formattedTime.value = now.format('HH:mm')
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 30000)
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
</script>

<style scoped lang="scss">
.main-dashboard-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 6px 16px;
  background: transparent;
  transition: all 0.25s ease;

  .main-dashboard {
    height: 64px;
    padding: 0 14px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: 1px solid transparent;
    transition: all 0.25s ease;
  }

  /* افکت شیشه‌ای نرم در اسکرول */
  &.floated,
  &.is-floated {
    padding-top: 6px;
    padding-bottom: 6px;

    .main-dashboard {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(16px) saturate(170%);
      -webkit-backdrop-filter: blur(16px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow:
        0 8px 20px -6px rgba(0, 0, 0, 0.05),
        0 2px 6px -1px rgba(0, 0, 0, 0.02),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
  }
}

/* --------------------------------------------------
   بخش سمت راست (سایدبار و تیتر دوطبقه)
--------------------------------------------------- */
.nav-cluster {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.compact-action-btn {
  width: 32px;
  height: 32px;
  min-height: 32px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.nav-titles-stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
}

.nav-category {
  font-size: 13.5px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.2px;
}

.nav-breadcrumbs-row {
  line-height: 1;
  min-width: 0;
}

.compact-breadcrumbs {
  font-size: 11px;
  line-height: 1.1;

  :deep(.q-breadcrumbs__el) {
    font-weight: 600;
    color: #64748b;
    padding: 1px 3px;
    border-radius: 4px;
    transition: color 0.15s ease;

    &:hover {
      color: var(--q-primary);
    }
  }

  :deep(.q-breadcrumbs__separator) {
    font-size: 10px;
    color: #cbd5e1;
    margin: 0 2px;
  }
}

/* --------------------------------------------------
   بخش سمت چپ (زمان و پروفایل)
--------------------------------------------------- */
.actions-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.compact-time-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.85);
  font-size: 11.5px;
  color: #475569;
  font-weight: 700;

  .time-icon {
    color: var(--q-primary);
    opacity: 0.8;
  }

  .date-txt {
    color: #64748b;
    font-weight: 600;
  }

  .sep-dot {
    color: #cbd5e1;
    font-size: 8px;
  }

  .time-txt {
    color: #1e293b;
  }
}

.ltr-num {
  direction: ltr;
  unicode-bidi: embed;
}

.compact-login-btn {
  font-size: 12px;
  padding: 3px 12px;
  height: 30px;
  min-height: 30px;
  border-radius: 8px;
  font-weight: 700;
}

:deep(.compact-profile) {
  display: flex;
  align-items: center;
}

/* --------------------------------------------------
   ریسپانسیو موبایل
--------------------------------------------------- */
@media (max-width: 599px) {
  .main-dashboard-wrapper {
    padding: 4px 8px;

    .main-dashboard {
      height: 58px;
      padding: 0 8px;
    }
  }

  .nav-titles-stack {
    max-width: 160px;
  }

  .nav-category {
    font-size: 12.5px;
  }

  .compact-time-pill {
    padding: 3px 7px;
    height: 28px;
    font-size: 11px;
    gap: 4px;
  }
}
</style>
