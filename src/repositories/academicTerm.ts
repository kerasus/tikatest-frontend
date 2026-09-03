import BaseAPI, { ListType } from './BaseAPI'

export type AcademicTermType = {
  id: number | null;
  school_id: number | null;
  name: string | null;
  type: 'school_year' | 'seasonal' | 'sub_term' | null;
  academic_year: string | null;
  season: string | null;
  period: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  parent_id: number | null;
  parent_term?: AcademicTermType | null;
  children?: AcademicTermType[];
  school?: { id: number; name: string } | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TermListType = ListType<AcademicTermType>;

export default class TermAPI extends BaseAPI<AcademicTermType> {
  constructor () {
    super('/academic-terms')
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      type: 'sub_term',
      academic_year: null,
      season: null,
      period: null,
      starts_at: null,
      ends_at: null,
      is_active: false,
      parent_id: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const termAPI = new TermAPI()
