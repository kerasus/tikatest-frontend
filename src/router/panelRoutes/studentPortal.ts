export const index = [
  {
    path: 'online-exams',
    name: 'Student.Exam.List',
    meta: {
      pageCategory: 'آزمون آنلاین'
    },
    component: () => import('src/pages/panel/student/onlineExams.vue')
  },
  {
    path: 'online-exams/:id',
    name: 'Student.Exam.Show',
    meta: {
      pageCategory: 'جزئیات آزمون'
    },
    component: () => import('src/pages/panel/student/exam-detail.vue')
  },
  {
    path: 'online-exams/:id/attempt',
    name: 'Student.Exam.Attempt',
    meta: {
      pageCategory: 'شرکت در آزمون',
      layoutConfig: {
        layoutHeaderType: 'onlineExam',
        layoutLeftDrawerType: 'onlineExam',
        layoutLeftDrawerWidth: 360,
        layoutLeftDrawerBehavior: 'default',
        layoutLeftDrawerOverlay: false
      }
    },
    component: () => import('pages/panel/student/attempt.vue')
  },
  {
    path: 'online-exams/:id/result',
    name: 'Student.Exam.Result',
    meta: {
      pageCategory: 'نتیجه آزمون',
      layoutConfig: {
        layoutHeaderType: 'onlineExam',
        layoutLeftDrawerType: 'onlineExam',
        layoutLeftDrawerWidth: 360,
        layoutLeftDrawerBehavior: 'default',
        layoutLeftDrawerOverlay: false
      }
    },
    component: () => import('src/pages/panel/student/exam-result.vue')
  },
  {
    path: 'my-homeworks',
    name: 'Student.Homework.List',
    meta: {
      pageCategory: 'تکالیف'
    },
    component: () => import('pages/panel/student/myHomeworks.vue')
  },
  {
    path: 'my-homeworks/:id',
    name: 'Student.Homework.Show',
    meta: {
      pageCategory: 'مشاهده تکلیف'
    },
    component: () => import('src/pages/panel/student/homework-view.vue')
  },
  {
    path: 'my-grades',
    name: 'Student.Grade.List',
    meta: {
      pageCategory: 'نمرات'
    },
    component: () => import('pages/panel/student/myGrades.vue')
  },
  {
    path: '',
    name: 'Student.Dashboard',
    meta: {
      pageCategory: 'پیشخوان'
    },
    component: () => import('src/pages/panel/student/dashboard.vue')
  },
  {
    path: 'report-card',
    name: 'Student.ReportCard',
    meta: {
      pageCategory: 'کارنامه'
    },
    component: () => import('src/pages/panel/student/report-card.vue')
  },
  {
    path: 'disciplinary',
    name: 'Student.Disciplinary.List',
    meta: {
      pageCategory: 'موارد انضباطی'
    },
    component: () => import('src/pages/panel/student/disciplinary.vue')
  },
  {
    path: 'absences',
    name: 'Student.Absences',
    meta: {
      pageCategory: 'غیبت‌ها'
    },
    component: () => import('src/pages/panel/student/absences.vue')
  },
  {
    path: 'messages',
    name: 'Student.Message.List',
    meta: {
      pageCategory: 'مشاهده پیام‌ها'
    },
    component: () => import('src/pages/panel/student/messages.vue')
  },
  {
    path: 'messages/send',
    name: 'Student.Message.Create',
    meta: {
      pageCategory: 'ارسال پیام'
    },
    component: () => import('src/pages/panel/student/messages-send.vue')
  },
  {
    path: 'messages/sent',
    name: 'Student.Message.Sent',
    meta: {
      pageCategory: 'پیام‌های ارسال شده'
    },
    component: () => import('src/pages/panel/student/messages-sent.vue')
  },
  {
    path: 'messages/received',
    name: 'Student.Message.Received',
    meta: {
      pageCategory: 'پیام‌های دریافتی'
    },
    component: () => import('src/pages/panel/student/messages-received.vue')
  },
  {
    path: 'study-sessions',
    name: 'Student.StudySessions.List',
    meta: {
      pageCategory: 'ساعات مطالعه'
    },
    component: () => import('src/pages/panel/student/study-sessions.vue')
  },
  {
    path: 'study-sessions/create',
    name: 'Student.StudySessions.Create',
    meta: {
      pageCategory: 'ثبت ساعت مطالعه'
    },
    component: () => import('src/pages/panel/student/study-session-create.vue')
  },
  {
    path: 'calendar',
    name: 'Student.Calendar',
    meta: {
      pageCategory: 'تقویم اجرایی'
    },
    component: () => import('src/pages/panel/student/calendar.vue')
  }
]
