export const index = [
  {
    path: 'messages',
    name: 'Panel.Message.List',
    meta: { pageCategory: 'پیام‌ها' },
    component: () => import('src/pages/panel/message/list.vue')
  },
  {
    path: 'messages/create',
    name: 'Panel.Message.Create',
    meta: { pageCategory: 'پیام‌ها' },
    component: () => import('src/pages/panel/message/create.vue')
  },
  {
    path: 'messages/sent',
    name: 'Panel.Message.Sent',
    meta: { pageCategory: 'پیام‌ها' },
    component: () => import('src/pages/panel/message/sent.vue')
  },
  {
    path: 'messages/received',
    name: 'Panel.Message.Received',
    meta: { pageCategory: 'پیام‌ها' },
    component: () => import('src/pages/panel/message/received.vue')
  }
]
