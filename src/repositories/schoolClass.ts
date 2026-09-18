import BaseAPI from './BaseAPI'
import { SkyroomRoomType } from './skyroomRoom'
import { AcademicLevelType } from 'src/repositories/academicLevel'

export type { ListType } from './BaseAPI'
export type SchoolClassType = {
  id: number | null;
  school_id: number | null;
  academic_level_id: number | null;
  name: string | null;
  academic_level?: AcademicLevelType;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
};

export default class SchoolClassAPI extends BaseAPI<SchoolClassType> {
  constructor () {
    super('/classes')
    this.defaultObject = {
      id: null,
      school_id: null,
      academic_level_id: null,
      name: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      skyroomRooms: (classId: number | string) => `${this.baseEndpoint}/${classId}/skyroom-rooms`
    }
  }

  async getSkyroomRooms (classId: number | string, params?: any): Promise<SkyroomRoomType[]> {
    const endpoint = (this.endpoints as any).skyroomRooms(classId)
    const response = await this.getAxiosInstanceWithToken().get(endpoint, { params })
    return response.data
  }
}

export const schoolClass = new SchoolClassAPI()
