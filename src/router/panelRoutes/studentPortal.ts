export const index = [
  {
    path: '',
    name: 'Student.Dashboard',
    meta: {
      pageCategory: 'پیشخوان'
    },
    component: () => import('src/pages/panel/student/dashboard.vue')
  },
  {
    path: 'grades',
    name: 'Student.Grade.List',
    meta: {
      pageCategory: 'نمرات'
    },
    component: () => import('src/pages/panel/student/grades.vue')
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
    path: 'quizzes',
    name: 'Student.Quiz.List',
    meta: {
      pageCategory: 'آزمون آنلاین'
    },
    component: () => import('src/pages/panel/student/quizzes.vue')
  },
  {
    path: 'quizzes/:id',
    name: 'Student.Quiz.Show',
    meta: {
      pageCategory: 'جزئیات آزمون'
    },
    component: () => import('src/pages/panel/student/quiz-detail.vue')
  },
  {
    path: 'quizzes/:id/attempt',
    name: 'Student.Quiz.Attempt',
    meta: {
      pageCategory: 'شرکت در آزمون'
    },
    component: () => import('src/pages/panel/quiz/attempt.vue')
  },
  {
    path: 'quizzes/:id/result',
    name: 'Student.Quiz.Result',
    meta: {
      pageCategory: 'نتیجه آزمون'
    },
    component: () => import('src/pages/panel/student/quiz-result.vue')
  },
  {
    path: 'homework',
    name: 'Student.Homework.List',
    meta: {
      pageCategory: 'تکالیف'
    },
    component: () => import('src/pages/panel/student/homework.vue')
  },
  {
    path: 'homework/:id',
    name: 'Student.Homework.Show',
    meta: {
      pageCategory: 'مشاهده تکلیف'
    },
    component: () => import('src/pages/panel/student/homework-view.vue')
  },
  {
    path: 'homework/:id/submit',
    name: 'Student.Homework.Submit',
    meta: {
      pageCategory: 'ارسال تکلیف'
    },
    component: () => import('src/pages/panel/student/homework-submit.vue')
  },
  {
    path: 'homework/submissions',
    name: 'Student.Homework.Submissions',
    meta: {
      pageCategory: 'تکالیف ارسال شده'
    },
    component: () => import('src/pages/panel/student/homework-submissions.vue')
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
