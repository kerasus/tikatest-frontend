import BaseAPI from './BaseAPI'
import { AcademicLevelType } from 'src/repositories/academicLevel'

export type { ListType } from './BaseAPI'
export type LessonType = {
  id: number | null;
  name: string | null;
  academic_level_id: number | null;
  order: number | null;
  coefficient: number | null;
  is_report_card: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  academic_level?: AcademicLevelType;
};

export default class LessonAPI extends BaseAPI<LessonType> {
  constructor () {
    super('/lessons')
    this.defaultObject = {
      id: null,
      name: null,
      academic_level_id: null,
      order: 0,
      coefficient: 1,
      is_report_card: false,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}

export const lesson = new LessonAPI()
