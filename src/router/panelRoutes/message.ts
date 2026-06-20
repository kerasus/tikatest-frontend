export const index = [
  {
    path: 'messages',
    name: 'Panel.Message.List',
    meta: {
      pageCategory: 'پیام‌ها'
    },
    component: () => import('src/pages/panel/message/list.vue')
  },
  {
    path: 'messages/create',
    name: 'Panel.Message.Create',
    meta: {
      pageCategory: 'پیام‌ها'
    },
    component: () => import('src/pages/panel/message/create.vue')
  }
]
