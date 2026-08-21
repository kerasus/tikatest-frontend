import type { HomeworkType, HomeworkAttachmentType } from 'src/repositories/homework'

export function buildHomeworkFormData (homework: Partial<HomeworkType>): FormData {
  const fd = new FormData()

  fd.append('title', homework.title || '')
  if (homework.description) fd.append('description', homework.description)
  if (homework.lesson_id) fd.append('lesson_id', String(homework.lesson_id))
  if (homework.due_date) fd.append('due_date', homework.due_date)

  const levelIds = homework.academic_level_ids ||
    (homework.academic_levels || []).map((l: any) => l.id).filter((id: any) => id !== null)
  if (levelIds.length > 0) {
    fd.append('academic_level_ids', JSON.stringify(levelIds))
  }

  const classIds = homework.class_ids ||
    (homework.classes || []).map((c: any) => c.id).filter((id: any) => id !== null)
  if (classIds.length > 0) {
    fd.append('class_ids', JSON.stringify(classIds))
  }

  if (homework.attachments && homework.attachments.length > 0) {
    const attachmentsPayload: any[] = []
    homework.attachments.forEach((att: HomeworkAttachmentType, index: number) => {
      const meta = { ...att.content }
      delete meta.file
      attachmentsPayload.push(meta)
      if (att.content?.file) {
        fd.append(`attachments[${index}][file]`, att.content.file)
      }
    })
    fd.append('attachments', JSON.stringify(attachmentsPayload))
  }

  return fd
}

export function createEmptyHomework (): Partial<HomeworkType> {
  return {
    id: null,
    title: null,
    description: null,
    lesson_id: null,
    due_date: null,
    created_by: null,
    academic_levels: [],
    classes: [],
    attachments: []
  }
}

export function validateHomework (homework: Partial<HomeworkType>): boolean {
  const title = String(homework.title || '').trim()
  const hasTitle = title.length > 0
  const hasLesson = homework.lesson_id !== null && homework.lesson_id !== undefined

  return hasTitle && hasLesson
}
