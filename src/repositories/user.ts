import BaseAPI from './BaseAPI'
import type { AxiosResponse } from 'axios'

export type UserRolesForPathType = 'admin' | 'manager' | 'teacher' | 'student' | 'staff'
export type UserRolesType = 'Admin' | 'Manager' | 'Teacher' | 'Student' | 'Staff' | 'Assembler' | 'MoldingWorker' | 'ColoringWorker' | 'FabricCutter'

export const userRoleOptions = [
  { label: 'مدیرکل', value: 'admin' },
  { label: 'مدیر', value: 'manager' },
  { label: 'معلم', value: 'teacher' },
  { label: 'دانش آموز', value: 'student' },
  { label: 'کارمند', value: 'staff' }
]

export type RoleType = {
  id: number | null;
  name: string | null;
  label: string | null;
  guard_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type UserSchoolType = {
  id: number | null;
  code: string | null;
  name: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  type: 'school' | 'institute' | null;
  account_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  pivot: {
    role: string | null;
  };
}

export interface UserType {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  username: string | null;
  mobile: string | null;
  roles_list: string[];
  roles: RoleType[];
  email_verified_at: string | null;
  mobile_verified_at: string | null;
  birth_date: string | null;
  address: string | null;
  description: string | null;
  picture: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export function getUserRoleLabel (roleName: string): string {
  const targetRole = userRoleOptions.find((item)=>item.value === roleName)
  if (targetRole) {
    return targetRole.label
  }

  return roleName
}

export default class UserAPI extends BaseAPI<UserType> {
  constructor () {
    super('/users')
    this.defaultObject = {
      id: null,
      first_name: null,
      last_name: null,
      email: null,
      username: null,
      mobile: null,
      roles: [],
      roles_list: [],
      email_verified_at: null,
      mobile_verified_at: null,
      birth_date: null,
      address: null,
      description: null,
      picture: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      assignRole: (userId: number) => `${this.baseEndpoint}/${userId}/assign-role`,
      removeRole: (userId: number) => `${this.baseEndpoint}/${userId}/remove-role`,
      resetPassword: (userId: number) => `${this.baseEndpoint}/${userId}/reset-password`,
      getSchools: (userId: number) => `${this.baseEndpoint}/${userId}/schools`,
      assignSchool: (userId: number) => `${this.baseEndpoint}/${userId}/schools`,
      removeSchool: (userId: number) => `${this.baseEndpoint}/${userId}/schools`,
      getByRole: (role: string) => `${this.baseEndpoint}/role/${role}`
    }
  }

  async assignRole (userId: number, role: string): Promise<{ message: string, data: { user: UserType }}> {
    try {
      const response: AxiosResponse<{ message: string, data: { user: UserType }}> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.assignRole(userId), { role })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }

  async removeRole (userId: number, role: string): Promise<{ message: string, data: { user: UserType }}> {
    try {
      const response: AxiosResponse<{ message: string, data: { user: UserType }}> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.removeRole(userId), { role })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }

  async getSchools (userId: number): Promise<UserSchoolType[]> {
    try {
      const response = await this.getAxiosInstanceWithToken().get(this.endpoints.getSchools(userId))
      return response.data || []
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on getSchools')
      }
    }
  }

  async assignSchool (userId: number, schoolId: number, role?: string): Promise<{ message: string, data: { user: UserType }}> {
    try {
      const payload: any = { school_id: schoolId }
      if (role) {
        payload.role = role
      }
      const response: AxiosResponse<{ message: string, data: { user: UserType }}> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.assignSchool(userId), payload)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on assignSchool')
      }
    }
  }

  async removeSchool (userId: number, schoolId: number): Promise<{ message: string, data: { user: UserType }}> {
    try {
      const response: AxiosResponse<{ message: string, data: { user: UserType }}> = await this.getAxiosInstanceWithToken()
        .delete(this.endpoints.removeSchool(userId), { data: { school_id: schoolId } })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on removeSchool')
      }
    }
  }

  async getByRole (role: string): Promise<UserType[]> {
    try {
      const response = await this.getAxiosInstanceWithToken().get(this.endpoints.getByRole(role))
      return response.data || []
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on getByRole')
      }
    }
  }
}

export const user = new UserAPI()
