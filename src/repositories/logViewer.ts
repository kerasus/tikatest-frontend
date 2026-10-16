import BaseAPI from './BaseAPI'

export interface LogFile {
  name: string
  size: string
  modified_at: string
}

export interface LogEntry {
  timestamp: string
  environment: string
  level: string
  message: string
  stack_trace: string | null
}

export interface ParsedLogs {
  file: string
  total: number
  page: number
  per_page: number
  last_page: number
  logs: LogEntry[]
}

export interface LogFilters {
  file: string
  level?: string
  search?: string
  page?: number
  per_page?: number
}

export default class LogViewerAPI extends BaseAPI<LogEntry> {
  constructor () {
    super('/logs')
    this.endpoints = {
      ...this.endpoints,
      files: `${this.baseEndpoint}/files`
    }
  }

  async files (): Promise<LogFile[]> {
    const response = await this.getAxiosInstanceWithToken().get<{ success: boolean, data: LogFile[] }>(this.endpoints.files)
    return response.data.data
  }

  async entries (filters: LogFilters): Promise<ParsedLogs> {
    const response = await this.getAxiosInstanceWithToken().get<{ success: boolean, data: ParsedLogs }>(this.endpoints.base, {
      params: filters
    })
    return response.data.data
  }

  async clear (filename: string): Promise<void> {
    await this.getAxiosInstanceWithToken().delete(this.endpoints.files, {
      data: { file: filename }
    })
  }
}

export const logViewer = new LogViewerAPI()
