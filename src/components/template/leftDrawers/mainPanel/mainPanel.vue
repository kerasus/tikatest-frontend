<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useAppLayout } from 'stores/appLayout'
import { useAppConfig } from 'stores/appConfig'
import ListItem from './components/listItem.vue'
import { computed, ref, watch, Ref } from 'vue'
import { UserRolesType } from 'src/repositories/user'

const $q = useQuasar()
const route = useRoute()
const i18nManager = useI18n()
const userManager = useUser()
const appLayoutStore = useAppLayout()
const appConfigManager = useAppConfig()

const searchValue = ref('')

const allowedLinks = computed(() => topLinks.value
  .filter((link) => {
    return !link.forRoles ? true : link.forRoles.some((role) => userManager.hasRole(userManager.me, role))
  }))
const filterLinks = computed(() => {
  if (searchValue.value === null) {
    return allowedLinks.value
  }
  return allowedLinks.value
    .map((link) => {
      if (link.child) {
        const filteredChildren = link.child.filter((child) =>
          i18nManager.t(child.title).includes(searchValue.value)
        )
        if (filteredChildren.length > 0) {
          return { ...link, child: filteredChildren }
        }
      }
      if ((link.title).includes(searchValue.value)) {
        return link
      }
      return null
    })
    .filter((link) => link !== null)
})
const currentRouteName = computed(() => route.name)

type ListItemType = {
  icon: string;
  iconColor?: string;
  title: string;
  mainRouteName?: string;
  route?: { name: string, params?: Record<string, string> };
  forRoles?: UserRolesType[];
  child?: ListItemType[];
};

const topLinks = ref<ListItemType[]>([
  {
    icon: 'dashboard',
    title: 'پیشخوان',
    forRoles: [ 'Student' ],
    route: { name: 'Student.Dashboard' }
  },
  {
    icon: 'grading',
    title: 'نمرات',
    forRoles: [ 'Student' ],
    child: [
      { icon: '', title: 'مشاهده نمرات', route: { name: 'Student.Grade.List' } },
      { icon: '', title: 'کارنامه', route: { name: 'Student.ReportCard' } }
    ]
  },
  {
    icon: 'gavel',
    title: 'موارد انضباطی',
    forRoles: [ 'Student' ],
    child: [
      { icon: '', title: 'مشاهده غیبت‌ها', route: { name: 'Student.Absences' } },
      { icon: '', title: 'مشاهده موارد انضباطی', route: { name: 'Student.Disciplinary.List' } }
    ]
  },
  {
    icon: 'sms',
    title: 'مدیریت پیام',
    forRoles: [ 'Student' ],
    child: [
      { icon: '', title: 'ارسال پیام', route: { name: 'Student.Message.Create' } },
      { icon: '', title: 'مشاهده پیام‌ها', route: { name: 'Student.Message.List' } }
    ]
  },
  {
    icon: 'quiz',
    title: 'آزمون آنلاین',
    forRoles: [ 'Student' ],
    route: { name: 'Student.Quiz.List' }
  },
  {
    icon: 'assignment',
    title: 'ساعت مطالعه و تکالیف',
    forRoles: [ 'Student' ],
    child: [
      { icon: '', title: 'مشاهده تکالیف', route: { name: 'Student.Homework.List' } },
      { icon: '', title: 'ثبت ساعت مطالعه', route: { name: 'Student.StudySessions.Create' } },
      { icon: '', title: 'مشاهده ساعات مطالعه ثبت شده', route: { name: 'Student.StudySessions.List' } }
    ]
  },
  {
    icon: 'calendar_today',
    title: 'تقویم اجرایی',
    forRoles: [ 'Student' ],
    route: { name: 'Student.Calendar' }
  },
  {
    icon: 'dashboard',
    title: 'پیشخوان',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    route: { name: 'Panel.Dashboard' }
  },
  {
    icon: 'school',
    title: 'مدیریت مدارس',
    forRoles: [ 'Admin' ],
    child: [
      { icon: '', title: 'لیست مدارس', route: { name: 'Panel.School.List' } },
      { icon: '', title: 'افزودن مدرسه', route: { name: 'Panel.School.Create' } }
    ]
  },
  {
    icon: 'menu_book',
    title: 'مدیریت دروس',
    forRoles: [ 'Admin' ],
    child: [
      { icon: 'list', title: 'لیست دروس', route: { name: 'Panel.Lesson.List' } },
      { icon: 'person_add', title: 'افزودن درس', route: { name: 'Panel.Lesson.Create' } }
    ]
  },
  {
    icon: 'person',
    title: 'مدیریت کاربران',
    forRoles: [ 'Admin' ],
    child: [
      { icon: 'list', title: 'لیست کاربران', route: { name: 'Panel.User.List' } },
      { icon: 'person_add', title: 'افزودن کاربر', route: { name: 'Panel.User.Create' } },
      { icon: 'school', title: 'معلمان', route: { name: 'Panel.User.Teachers' } },
      { icon: 'admin_panel_settings', title: 'مدیران', route: { name: 'Panel.User.Managers' } },
      { icon: 'work', title: 'کارکنان', route: { name: 'Panel.User.Staff' } },
      { icon: 'group_work', title: 'نقش‌های کاربران', route: { name: 'Panel.User.Roles' } }
    ]
  },
  {
    icon: 'school',
    title: 'دانش آموزان',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    route: { name: 'Panel.Student.List' }
  },
  {
    icon: 'grading',
    title: 'نمرات',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    child: [
      { icon: '', title: 'ثبت نمره', route: { name: 'Panel.Grade.Create' } },
      { icon: '', title: 'مشاهده نمرات', route: { name: 'Panel.Grade.List' } },
      { icon: '', title: 'کارنامه', route: { name: 'Panel.ReportCard' } },
      { icon: '', title: 'گزارش نمرات تک درس', route: { name: 'Panel.GradeReport.Lesson' } },
      { icon: '', title: 'گزارش نمرات چند درس', route: { name: 'Panel.GradeReport.Multiple' } }
    ]
  },
  {
    icon: 'sms',
    title: 'مدیریت پیام',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    child: [
      { icon: '', title: 'ارسال پیام', route: { name: 'Panel.Message.Create' } },
      { icon: '', title: 'مشاهده پیام های ارسالی', route: { name: 'Panel.Message.Sent' } },
      { icon: '', title: 'مشاهده پیام های دریافتی', route: { name: 'Panel.Message.Received' } }
    ]
  },
  {
    icon: 'gavel',
    title: 'موارد انضباطی',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    child: [
      { icon: '', title: 'ثبت غیبت', route: { name: 'Panel.Disciplinary.Absence.Create' } },
      { icon: '', title: 'مشاهده غیبت های ثبت شده', route: { name: 'Panel.Disciplinary.Absence.List' } },
      { icon: '', title: 'تعریف مورد انضباطی', route: { name: 'Panel.DisciplinaryCase.Create' } },
      { icon: '', title: 'ثبت مورد انضباطی', route: { name: 'Panel.Disciplinary.Create' } },
      { icon: '', title: 'مشاهده موارد انضباطی ثبت شده', route: { name: 'Panel.Disciplinary.List' } }
    ]
  },
  {
    icon: 'quiz',
    title: 'آزمون آنلاین',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    child: [
      { icon: '', title: 'ثبت آزمون', route: { name: 'Panel.Quiz.Create' } },
      { icon: '', title: 'مشاهده آزمون ها', route: { name: 'Panel.Quiz.List' } }
    ]
  },
  {
    icon: 'calendar_today',
    title: 'تقویم اجرایی',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    route: { name: 'Panel.Calendar' }
  },
  {
    icon: 'assignment',
    title: 'تکالیف',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    child: [
      { icon: '', title: 'ثبت تکلیف', route: { name: 'Panel.Homework.Create' } },
      { icon: '', title: 'مشاهده تکالیف', route: { name: 'Panel.Homework.List' } }
    ]
  },
  {
    icon: 'menu_book',
    title: 'ساعت مطالعه دانش آموزان',
    forRoles: [ 'Manager', 'Teacher', 'Admin' ],
    child: [
      { icon: '', title: 'گزارش کلی', route: { name: 'Panel.StudyHours.General' } },
      { icon: '', title: 'گزارش انفرادی', route: { name: 'Panel.StudyHours.Individual' } }
    ]
  }
])

const bottomLinks: Ref<Array<ListItemType>> = ref([
  // { icon: 'ph:chats-circle', title: 'menu.leftDrawer.forum', route: { name: 'Panel.Forum' } }
])

// function toggleLeftDrawer() {
//   appLayoutStore.layoutLeftDrawerMiniToOverlay = $q.screen.lt.md;
//   appLayoutStore.layoutLeftDrawerMini = !appLayoutStore.layoutLeftDrawerMini;
//   // appLayoutStore.layoutLeftDrawerVisible = !appLayoutStore.layoutLeftDrawerVisible
// }

function getWorkerProductionPageTitle (userRole: UserRolesType): string {
  if (userRole === 'Assembler') {
    return 'ثبت مونتاژ کاری جدید'
  } else if (userRole === 'MoldingWorker') {
    return 'ثبت اتوکاری جدید'
  } else if (userRole === 'ColoringWorker') {
    return 'ثبت رنگ کاری جدید'
  } else if (userRole === 'FabricCutter') {
    return 'ثبت برش کاری جدید'
  }

  return '-'
}

watch(currentRouteName, () => {
  if ($q.screen.lt.md) {
    appLayoutStore.layoutLeftDrawerVisible = false
  }
}, {
  immediate: true
})
</script>

<template>
  <div class="left-drawer__toggle-mini">
    <!-- <q-btn
      class="icon-button drawer-btn"
      color="primary"
      flat
      :icon="
        appLayoutStore.layoutLeftDrawerMini
          ? 'keyboard_double_arrow_left'
          : 'keyboard_double_arrow_right'
      "
      @click="toggleLeftDrawer"
    /> -->
  </div>
  <div
    class="left-drawer"
    :class="{ 'left-drawer--mini': appLayoutStore.layoutLeftDrawerMini }">
    <div class="left-drawer__inner">
      <div class="left-drawer__logo-section">
        <div class="left-drawer__logo-section-img">
          <q-img :src="appLayoutStore.layoutLeftDrawerMini ? '/images/logo.png' : '/images/logo.png'" />
        </div>
        <div
          v-if="false"
          class="left-drawer__logo-section-title" />
      </div>
      <q-separator />
      <q-scroll-area class="scroll-area">
        <q-list padding>
          <list-item
            :items="filterLinks"
            :mini="appLayoutStore.layoutLeftDrawerMini" />
        </q-list>
        <q-list padding>
          <q-item
            v-for="link in bottomLinks"
            :key="link.title"
            v-ripple
            exact
            :to="link.route"
            clickable
            class="menu-item">
            <q-item-section avatar>
              <q-icon
                :name="link.icon"
                :color="link.iconColor" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ (link.title) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="left-drawer__copyright-section">
        <div class="app-version">
          v: {{ appConfigManager.version }}
        </div>
        <div class="copy-right">
          <span> Copyright TikaTest co. </span>
          <span> &copy; {{ new Date().getFullYear() }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-drawer__toggle-mini {
  position: absolute;
  right: 0;
  transform: translateX(calc(50% - 2px));
  top: $space-14;
  z-index: 2;
}
.left-drawer {
  background: $gray-100;
  width: 100%;
  height: 100%;
  position: relative;
  .q-separator {
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0)
    );
    background-color: transparent;
  }
  .left-drawer__inner {
    background: $gray-100;
    padding: $space-4 $space-2;
    border-radius: 0 $radius-6 $radius-6 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    .left-drawer__logo-section {
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      gap: $space-2;
      margin-bottom: $space-9;
      min-height: $space-7;
      padding-left: $space-4;
      .left-drawer__logo-section-img {
        width: 100%;
      }
      .left-drawer__logo-section-title {
        //color: $neutral-100;
        display: flex;
        align-items: center;
      }
    }
    :deep(.scroll-area) {
      flex: 1;
      .q-scrollarea__container {
        .q-scrollarea__content {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
    .left-drawer__copyright-section {
      padding-left: $space-4;
      color: #67748e;
      font-size: 11px;
      direction: rtl;
      text-align: left;
      .app-version {
      }
      .copy-right {
      }
    }
  }
  &.left-drawer--mini {
    .left-drawer__inner {
      .left-drawer__logo-section {
        justify-content: center;
        padding: unset;
        .left-drawer__logo-section-img {
          width: $space-10;
        }
        .left-drawer__logo-section-title {
          display: none;
        }
      }
      :deep(.scroll-area) {
        flex: 1;
        .q-scrollarea__container {
          .q-scrollarea__content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
      }
      .left-drawer__copyright-section {
        display: flex;
        flex-direction: column;
        span {
          text-align: justify;
        }
      }
    }
  }
}
:deep(.q-expansion-item--expanded) {
  color: $primary;
  .q-expansion-item__container {
    .q-icon {
      color: $primary;
    }
  }
}
</style>
