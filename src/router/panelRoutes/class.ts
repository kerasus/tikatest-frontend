export const index = [
  {
    path: 'classes',
    name: 'Panel.Class.List',
    meta: {
      pageCategory: 'مدیریت کلاس‌ها'
    },
    component: () => import('src/pages/panel/class/list.vue')
  },
  {
    path: 'classes/create',
    name: 'Panel.Class.Create',
    meta: {
      pageCategory: 'مدیریت کلاس‌ها'
    },
    component: () => import('src/pages/panel/class/create.vue')
  },
  {
    path: 'classes/:id',
    name: 'Panel.Class.Show',
    meta: {
      pageCategory: 'مدیریت کلاس‌ها'
    },
    component: () => import('src/pages/panel/class/show.vue')
  }
]
