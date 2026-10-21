import BaseAPI from './BaseAPI'
import type { HomeworkSubmissionType } from './homework'

export type HomeworkClassStudentType = {
  student: { id: number; name: string; national_code: string | null; mobile: string | null }
  enrollment_id: number
  has_seen: boolean
  has_submitted: boolean
  is_reviewed: boolean
  state: 'reviewed' | 'submitted' | 'seen' | 'not_seen'
  submission: HomeworkSubmissionType | null
}

export type HomeworkClassSubmissionsType = {
  class_id: number
  class_name: string
  total_students: number
  reviewed_count: number
  submitted_count: number
  seen_count: number
  not_seen_count: number
  students: HomeworkClassStudentType[]
}

export type HomeworkLevelSubmissionsType = {
  academic_level_id: number
  academic_level_name: string
  classes: HomeworkClassSubmissionsType[]
}

export type GroupedHomeworkSubmissionsType = {
  homework_id: number
  homework_title: string | null
  term_id: number | null
  levels: HomeworkLevelSubmissionsType[]
}

export default class HomeworkSubmissionAPI extends BaseAPI<HomeworkSubmissionType> {
  constructor () {
    super('/homework-submissions')
  }

  async getGroupedByClass (homeworkId: number): Promise<GroupedHomeworkSubmissionsType> {
    const response = await this.getAxiosInstanceWithToken().get(
      `${this.baseEndpoint}/homework/${homeworkId}/grouped-by-class`
    )
    return response.data
  }

  async sendFeedback (submissionId: number, feedback: string | null) {
    const response = await this.getAxiosInstanceWithToken().put(`${this.baseEndpoint}/${submissionId}/feedback`, {
      feedback
    })
    return response.data
  }

  async markAsSeen (submissionId: number) {
    const response = await this.getAxiosInstanceWithToken().put(`${this.baseEndpoint}/${submissionId}/seen`)
    return response.data
  }
}
