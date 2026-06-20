import BaseAPI from './BaseAPI'
import type { AxiosResponse } from 'axios'

export type WorkerRoleType = 'molding' | 'coloring' | 'fabric-cutter' | 'assembler'
export type UserRolesForPathType = 'manager' | 'accountant' | 'molding' | 'coloring' | 'fabric-cutter' | 'middle' | 'assembler' | 'warehouse-keeper'
export type UserRolesType = 'Manager' | 'ProductManager' | 'Accountant' | 'MoldingWorker' | 'ColoringWorker' | 'FabricCutter' | 'MiddleWorker' | 'Assembler' | 'WarehouseKeeper'

export const userRoleOptions = [
  { label: 'مدیر', value: 'Manager' },
  { label: 'مدیر محصول', value: 'ProductManager' },
  { label: 'حسابدار', value: 'Accountant' },
  { label: 'وسط کار', value: 'MiddleWorker' },
  { label: 'انباردار', value: 'WarehouseKeeper' },
  { label: 'برش کار', value: 'FabricCutter' },
  { label: 'رنگ کار', value: 'ColoringWorker' },
  { label: 'اتو کار', value: 'MoldingWorker' },
  { label: 'مونتاژ کار', value: 'Assembler' }
]

export type RoleType = {
  id: number | null;
  name: string | null;
  label: string | null;
  guard_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type UserType = {
  id: number | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  username: string | null;
  employee_code: string | null;
  mobile: string | null;
  roles_list: string[];
  roles: RoleType[];
  email_verified_at: string | null;
  mobile_verified_at: string | null;
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
      firstname: null,
      lastname: null,
      email: null,
      username: null,
      employee_code: null,
      mobile: null,
      roles: [],
      roles_list: [],
      email_verified_at: null,
      mobile_verified_at: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      assignRole: (userId: number) => `${this.baseEndpoint}/${userId}/assign-role`,
      removeRole: (userId: number) => `${this.baseEndpoint}/${userId}/remove-role`,
      resetPassword: (userId: number) => `${this.baseEndpoint}/${userId}/reset-password`
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

}
