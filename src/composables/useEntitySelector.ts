import { watch, type Ref } from 'vue'

export interface FetchByIdsParams {
  id_in: (number | string)[]
  school_id?: number
}

export interface UseEntitySelectorOptions<T extends { id: number | string }> {
  /**
   * رفرنس به مقداری که در کامپوننت انتخاب شده (props.value)
   */
  value: () => unknown
  /**
   * شناسه مدرسه در صورت وجود
   */
  schoolId?: () => number | null | undefined
  /**
   * رفرنس به آرایه آپشن‌های فیلتر شده کامپوننت
   */
  filteredOptions: Ref<T[]>
  /**
   * متد واکشی داده‌ها از API بر اساس id_in و school_id
   */
  fetchByIds: (params: FetchByIdsParams) => Promise<{ data?: T[] } | T[]>
  /**
   * نام اختیاری انتیتی برای لاگ ارور تمیزتر در کنسول
   */
  entityName?: string
}

export function useEntitySelector<T extends { id: number | string }> (
  options: UseEntitySelectorOptions<T>
) {
  const { value, schoolId, filteredOptions, fetchByIds, entityName = 'entity' } = options

  // استخراج و نرمال‌سازی تمیز آیدی‌ها (بدون ورود هرگونه boolean یا دیتای نامعتبر)
  const extractId = (item: unknown): number | string | null => {
    if (typeof item === 'number') return item
    if (typeof item === 'string' && item.trim() !== '') return item
    if (item && typeof item === 'object' && 'id' in item) {
      const objId = (item as { id: unknown }).id
      if (typeof objId === 'number') return objId
      if (typeof objId === 'string' && objId.trim() !== '') return objId
    }
    return null
  }

  const normalizeIds = (rawVal: unknown): (number | string)[] => {
    if (Array.isArray(rawVal)) {
      return rawVal
        .flat()
        .map(extractId)
        .filter((id): id is number | string => id !== null)
    }

    const singleId = extractId(rawVal)
    return singleId !== null ? [singleId] : []
  }

  watch(
    [value, ...(schoolId ? [schoolId] : [])],
    async () => {
      const currentVal = value()
      const currentSchoolId = schoolId ? schoolId() : undefined

      const ids = normalizeIds(currentVal)
      if (ids.length === 0) return

      try {
        const response = await fetchByIds({
          id_in: ids,
          school_id: currentSchoolId ?? undefined
        })

        // پشتیبانی هم‌زمان از { data: [...] } و آرایه خالص [...]
        const incomingData: T[] = Array.isArray(response)
          ? response
          : response?.data || []

        const existingIds = new Set(filteredOptions.value.map((opt) => opt.id))
        const uniqueItems = incomingData.filter((item) => !existingIds.has(item.id))

        if (uniqueItems.length > 0) {
          filteredOptions.value = [...filteredOptions.value, ...uniqueItems]
        }
      } catch (error) {
        console.error(`[useEntitySelector] Error fetching selected ${entityName}:`, error)
      }
    },
    { immediate: true }
  )

  return {
    normalizeIds
  }
}
