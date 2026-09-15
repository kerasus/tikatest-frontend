import BaseAPI from './BaseAPI'
import type { AcademicTermType } from './academicTerm'
import type { ExamCategoryType } from './examCategory'

export type ExamCategoryTermLimitType = {
  id: number | null
  exam_category_id: number | null
  term_id: number | null
  max_occurrences: number | null
  created_at: string | null
  updated_at: string | null
  exam_category?: ExamCategoryType | null
  term?: AcademicTermType | null
}

export type ExamCategoryTermLimitPayload = Pick<
  ExamCategoryTermLimitType,
  'exam_category_id' | 'term_id' | 'max_occurrences'
>

export default class ExamCategoryTermLimitAPI extends BaseAPI<ExamCategoryTermLimitType> {
  constructor () {
    super('/exam-category-term-limits')
    this.defaultObject = {
      id: null,
      exam_category_id: null,
      term_id: null,
      max_occurrences: null,
      created_at: null,
      updated_at: null
    }
  }

  async all (filters: Record<string, unknown> = {}): Promise<ExamCategoryTermLimitType[]> {
    const items: ExamCategoryTermLimitType[] = []
    let page = 1
    let lastPage = 1

    do {
      const response = await this.index({ ...filters, length: 100, page })
      items.push(...response.data)
      lastPage = response.last_page
      page++
    } while (page <= lastPage)

    return items
  }
}

export const examCategoryTermLimit = new ExamCategoryTermLimitAPI()
