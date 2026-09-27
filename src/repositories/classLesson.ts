import BaseAPI from './BaseAPI'
import type { LessonType } from 'src/repositories/lesson'
import type { SchoolClassType } from 'src/repositories/schoolClass'

export type ClassLessonType = {
  id: number | null
  class_id: number | null
  lesson_id: number | null
  lesson?: LessonType | null
  school_class?: SchoolClassType | null
  created_at: string | null
  updated_at: string | null
}

export default class ClassLessonAPI extends BaseAPI<ClassLessonType> {
  constructor (classId: number) {
    super(`/classes/${classId}/lessons`)
    this.defaultObject = {
      id: null,
      class_id: null,
      lesson_id: null,
      lesson: null,
      school_class: null,
      created_at: null,
      updated_at: null
    }
  }
}
