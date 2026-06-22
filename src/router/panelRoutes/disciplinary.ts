export const index = [
  {
    path: 'disciplinary',
    name: 'Panel.Disciplinary.List',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/list.vue')
  },
  {
    path: 'disciplinary/create',
    name: 'Panel.Disciplinary.Create',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/create.vue')
  },
  {
    path: 'disciplinary/:id',
    name: 'Panel.Disciplinary.Show',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/show.vue')
  },
  {
    path: 'disciplinary/absences',
    name: 'Panel.Disciplinary.Absence.List',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/absence-list.vue')
  },
  {
    path: 'disciplinary/absences/create',
    name: 'Panel.Disciplinary.Absence.Create',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/absence-create.vue')
  },
  {
    path: 'disciplinary-cases',
    name: 'Panel.DisciplinaryCase.List',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/case-list.vue')
  },
  {
    path: 'disciplinary-cases/create',
    name: 'Panel.DisciplinaryCase.Create',
    meta: { pageCategory: 'امور انضباطی' },
    component: () => import('src/pages/panel/disciplinary/case-create.vue')
  }
]
