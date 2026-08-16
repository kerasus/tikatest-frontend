import { useQuasar } from 'quasar'

export const useHomeworkValidation = () => {
  const $q = useQuasar()

  function validate (form: any): boolean {
    if (!form.title || !String(form.title).trim()) {
      $q.notify({ icon: 'warning', message: 'عنوان تکلیف الزامی است.', color: 'warning' })
      return false
    }

    if (form.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(form.due_date)) {
      $q.notify({ icon: 'warning', message: 'فرمت موعد تحویل صحیح نیست.', color: 'warning' })
      return false
    }

    return true
  }

  return {
    validate
  }
}
