<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h5">
              تقویم اجرایی
            </div>

            <div class="text-caption text-grey-7 q-mt-xs">
              مدیریت رویدادهای تقویم مدرسه
            </div>
          </div>

          <div class="col-12 col-md-auto">
            <form-builder-select-school
              v-model="selectedSchoolId"
              label="انتخاب مدرسه"
              name="school_id"
              clearable />
          </div>

          <div class="col-12 col-md-auto">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن رویداد"
              :disable="!selectedSchoolId"
              @click="openEventDialog()" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Calendar -->
    <q-card>
      <q-card-section>
        <div
          v-if="loading"
          class="flex flex-center"
          style="min-height: 600px">
          <q-spinner
            color="primary"
            size="60px" />
        </div>

        <div
          v-else
          class="calendar-wrapper">
          <jalali-calendar
            :events-list="calendarEvents"
            :vacations-list="vacations"
            disable-past-days
            add-event-button
            @day-click="onDayClick"
            @on-event-click="onEventClicked" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Event Dialog -->
    <q-dialog
      v-model="eventDialog.show"
      persistent>
      <q-card
        class="event-dialog"
        style="width: 650px; max-width: 95vw">
        <q-card-section>
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">
                {{ eventDialog.edit ? 'ویرایش رویداد' : 'افزودن رویداد جدید' }}
              </div>
            </div>

            <div class="col-auto">
              <q-btn
                v-close-popup
                flat
                round
                dense
                icon="close" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmitEvent">
            <div class="row q-col-gutter-md">
              <!-- Title -->
              <div class="col-12">
                <q-input
                  v-model="eventDialog.form.title"
                  label="عنوان *"
                  outlined
                  autofocus
                  :rules="[
                    (value) => !!value || 'عنوان الزامی است'
                  ]" />
              </div>

              <!-- Description -->
              <div class="col-12">
                <q-input
                  v-model="eventDialog.form.description"
                  label="توضیحات"
                  outlined
                  type="textarea"
                  autogrow />
              </div>

              <!-- Start -->
              <div class="col-12 col-md-6">
                <form-builder-date-time
                  v-model:value="eventDialog.form.starts_at"
                  label="شروع" />
              </div>

              <!-- End -->
              <div class="col-12 col-md-6">
                <form-builder-date-time
                  v-model:value="eventDialog.form.ends_at"
                  label="پایان" />
              </div>

              <!-- All Day -->
              <div class="col-12">
                <q-toggle
                  v-model="eventDialog.form.all_day"
                  label="رویداد تمام‌روز است" />
              </div>

              <!-- Type -->
              <div class="col-12 col-md-6">
                <q-select
                  v-model="eventDialog.form.type"
                  :options="eventTypeOptions"
                  label="نوع رویداد"
                  outlined
                  emit-value
                  map-options />
              </div>

              <!-- Status -->
              <div class="col-12 col-md-6">
                <q-select
                  v-model="eventDialog.form.status"
                  :options="eventStatusOptions"
                  label="وضعیت"
                  outlined
                  emit-value
                  map-options />
              </div>

              <!-- Location -->
              <div class="col-12">
                <q-input
                  v-model="eventDialog.form.location"
                  label="مکان"
                  outlined
                  clearable />
              </div>

              <!-- Color -->
              <div class="col-12 col-md-6">
                <div class="text-body2 q-mb-sm">
                  رنگ رویداد
                </div>

                <q-color
                  v-model="eventDialog.form.color"
                  class="my-picker"
                  format-model="hex" />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row items-center justify-between">
              <div>
                <q-btn
                  v-if="eventDialog.edit"
                  flat
                  color="negative"
                  icon="delete"
                  label="حذف رویداد"
                  :loading="deleting"
                  @click="confirmDeleteEvent" />
              </div>

              <div class="row q-gutter-sm">
                <q-btn
                  flat
                  label="انصراف"
                  :disable="saving || deleting"
                  @click="eventDialog.show = false" />

                <q-btn
                  type="submit"
                  color="primary"
                  :label="eventDialog.edit ? 'ذخیره تغییرات' : 'ثبت رویداد'"
                  :loading="saving"
                  :disable="deleting" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import moment from 'jalali-moment'
import { Dialog, Notify } from 'quasar'
import { onMounted, reactive, ref, watch } from 'vue'
import { jalaliCalendar as JalaliCalendar } from 'vue3-jalali-calendar'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'

import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'

import { calendar } from 'src/repositories/calendar'
import type { CalendarType } from 'src/repositories/calendar'

import {
  calendarEvent,
  type CalendarEventDataType,
  type CalendarEventStatus,
  type CalendarEventType,
  type CalendarEventCreateType,
  type CalendarEventUpdateType
} from 'src/repositories/calendarEvent'

interface CalendarItem {
  id: number | null
  name: string | null
  type: CalendarType | null
  school_id: number | null
  user_id: number | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

interface EventForm {
  title: string | null
  description: string | null
  starts_at: string | null
  ends_at: string | null
  all_day: boolean
  type: CalendarEventType
  status: CalendarEventStatus
  location: string | null
  color: string | null
}

interface CalendarEventItem {
  startDateTime: ReturnType<typeof moment>
  endDateTime: ReturnType<typeof moment> | null
  title: string
  color?: string
  classes?: string
  eventId: number
}

interface VacationItem {
  date: ReturnType<typeof moment>
  title?: string
  description?: string
}

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const selectedSchoolId = ref<number | null>(null)

const calendarEvents = ref<CalendarEventItem[]>([])
const backendEvents = ref<CalendarEventDataType[]>([])
const calendars = ref<CalendarItem[]>([])

const vacations = ref<VacationItem[]>([])

const eventDialog = reactive({
  show: false,
  edit: false,
  editingId: null as number | null,

  form: {
    title: null,
    description: null,
    starts_at: null,
    ends_at: null,
    all_day: false,
    type: 'general' as CalendarEventType,
    status: 'active' as CalendarEventStatus,
    location: null,
    color: null
  } as EventForm
})

const eventTypeOptions = [
  { label: 'عمومی', value: 'general' },
  { label: 'کلاس', value: 'class' },
  { label: 'امتحان', value: 'exam' },
  { label: 'تکلیف', value: 'homework' },
  { label: 'جلسه', value: 'meeting' },
  { label: 'تعطیل', value: 'holiday' },
  { label: 'ملی', value: 'national' },
  { label: 'مذهبی', value: 'religious' },
  { label: 'یادآوری', value: 'reminder' }
]

const eventStatusOptions = [
  { label: 'فعال', value: 'active' },
  { label: 'لغو شده', value: 'cancelled' }
]

/**
 * Convert backend datetime to local datetime-local value.
 */
function toDateTimeLocal (value: string | null): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const pad = (number: number) => String(number).padStart(2, '0')

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('-') + 'T' + [
    pad(date.getHours()),
    pad(date.getMinutes())
  ].join(':')
}

/**
 * Convert datetime-local to API datetime.
 */
function toApiDateTime (value: string | null): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

/**
 * Convert backend datetime to Jalali Moment.
 *
 * The calendar package expects jalali-moment objects
 * for startDateTime and endDateTime.
 */
function toJalaliMoment (value: string | null) {
  if (!value) {
    return null
  }

  const parsed = moment(value)

  return parsed.isValid()
    ? parsed
    : null
}

/**
 * Convert a Jalali Moment returned by the calendar
 * to a local datetime-local value.
 */
function jalaliMomentToDateTimeLocal (
  value: ReturnType<typeof moment> | null
): string | null {
  if (!value || !value.isValid()) {
    return null
  }

  return toDateTimeLocal(value.toDate().toISOString())
}

/**
 * Create the event object expected by vue3-jalali-calendar.
 *
 * The package documents startDateTime, endDateTime,
 * title, classes and color as event properties.
 *
 * eventId is kept as an internal field so we can map
 * a clicked calendar event back to the backend event.
 */
function formatEvent (
  event: CalendarEventDataType
): CalendarEventItem | null {
  if (!event.id) {
    return null
  }

  const startDateTime = toJalaliMoment(event.starts_at)

  if (!startDateTime) {
    return null
  }

  let endDateTime = toJalaliMoment(event.ends_at)

  if (!endDateTime) {
    endDateTime = startDateTime.clone().endOf('day')
  }

  if (event.all_day) {
    startDateTime.startOf('day')

    if (!endDateTime) {
      endDateTime = startDateTime.clone().endOf('day')
    }
  } else if (!endDateTime) {
    endDateTime = startDateTime.clone().add(1, 'hour')
  }

  return {
    startDateTime,
    endDateTime,
    title: event.title ?? '',
    color: event.color || undefined,
    eventId: event.id
  }
}

/**
 * Reset event form.
 */
function resetEventForm (
  date: ReturnType<typeof moment> | null = null
) {
  const startMoment = date
    ? date.clone()
    : moment()

  /*
   * When the user clicks a day, start with 09:00.
   * The selected Jalali day is preserved.
   */
  if (date) {
    startMoment.hour(9)
    startMoment.minute(0)
    startMoment.second(0)
    startMoment.millisecond(0)
  }

  eventDialog.edit = false
  eventDialog.editingId = null

  eventDialog.form = {
    title: null,
    description: null,
    starts_at: jalaliMomentToDateTimeLocal(startMoment),
    ends_at: null,
    all_day: false,
    type: 'general',
    status: 'active',
    location: null,
    color: '#1976D2'
  }
}

/**
 * Open event dialog.
 */
function openEventDialog (
  event: CalendarEventDataType | null = null,
  startDate: ReturnType<typeof moment> | null = null
) {
  if (event) {
    eventDialog.edit = true
    eventDialog.editingId = event.id

    eventDialog.form = {
      title: event.title,
      description: event.description,
      starts_at: toDateTimeLocal(event.starts_at),
      ends_at: toDateTimeLocal(event.ends_at),
      all_day: event.all_day,
      type: event.type ?? 'general',
      status: event.status ?? 'active',
      location: event.location,
      color: event.color
    }
  } else {
    resetEventForm(startDate)
  }

  eventDialog.show = true
}

/**
 * Load calendars.
 *
 * Calendars are only used for determining which events
 * should be displayed.
 *
 * Calendar creation/resolution is handled by the backend.
 */
async function loadCalendars () {
  try {
    const response = await calendar.index({
      length: 1000
    })

    calendars.value = response.data ?? []
  } catch (error) {
    console.error(error)

    Notify.create({
      type: 'negative',
      message: 'خطا در بارگذاری تقویم‌ها'
    })
  }
}

/**
 * Get calendars visible on the current page.
 */
function getVisibleCalendarIds (): number[] {
  const ids: number[] = []

  for (const item of calendars.value) {
    if (!item.id || !item.is_active) {
      continue
    }

    const isGlobalCalendar =
      item.school_id === null &&
      item.user_id === null &&
      (
        item.type === 'national' ||
        item.type === 'religious'
      )

    const isSelectedSchoolCalendar =
      selectedSchoolId.value !== null &&
      item.type === 'school' &&
      item.school_id === selectedSchoolId.value &&
      item.user_id === null

    if (isGlobalCalendar || isSelectedSchoolCalendar) {
      ids.push(item.id)
    }
  }

  return ids
}

/**
 * Load events.
 */
async function loadEvents () {
  try {
    const response = await calendarEvent.index({
      length: 1000
    })

    const allEvents = response.data ?? []
    console.log('allEvents', allEvents)
    const visibleCalendarIds = getVisibleCalendarIds()

    backendEvents.value = allEvents.filter((event) => {
      if (!event.calendar_id) {
        return false
      }

      return visibleCalendarIds.includes(event.calendar_id)
    })

    calendarEvents.value = backendEvents.value
      .filter((event) => event.status !== 'cancelled')
      .map(formatEvent)
      .filter(
        (event): event is CalendarEventItem => event !== null
      )
    console.log('calendarEvents.value', calendarEvents.value)
  } catch (error) {
    console.error(error)

    Notify.create({
      type: 'negative',
      message: 'خطا در بارگذاری رویدادها'
    })
  }
}

/**
 * Load all calendar data.
 */
async function loadAll () {
  loading.value = true

  try {
    await loadCalendars()
    await loadEvents()
  } finally {
    loading.value = false
  }
}

/**
 * Handle clicking on an empty calendar day.
 *
 * vue3-jalali-calendar emits a Jalali Moment object.
 */
function onDayClick (date: ReturnType<typeof moment>) {
  if (!date || !date.isValid()) {
    return
  }

  if (!selectedSchoolId.value) {
    Notify.create({
      type: 'warning',
      message: 'ابتدا یک مدرسه انتخاب کنید.'
    })

    return
  }

  openEventDialog(null, date)
}

/**
 * Handle clicking on an existing event.
 *
 * eventId is added to our local EventObject so that
 * the calendar event can be mapped back to the API model.
 */
function onEventClicked (event: CalendarEventItem) {
  if (!event?.eventId) {
    return
  }

  const backendEvent = backendEvents.value.find(
    (item) => item.id === event.eventId
  )

  if (!backendEvent) {
    return
  }

  openEventDialog(backendEvent)
}

/**
 * Submit event.
 */
async function onSubmitEvent () {
  if (!eventDialog.form.title?.trim()) {
    Notify.create({
      type: 'warning',
      message: 'عنوان رویداد را وارد کنید.'
    })

    return
  }

  if (!eventDialog.form.starts_at) {
    Notify.create({
      type: 'warning',
      message: 'زمان شروع رویداد را وارد کنید.'
    })

    return
  }

  if (
    eventDialog.form.ends_at &&
    new Date(eventDialog.form.ends_at).getTime() <
      new Date(eventDialog.form.starts_at).getTime()
  ) {
    Notify.create({
      type: 'warning',
      message: 'زمان پایان نمی‌تواند قبل از زمان شروع باشد.'
    })

    return
  }

  /*
   * School is required when creating a school event.
   *
   * The backend performs the authoritative authorization check.
   */
  if (!eventDialog.edit && !selectedSchoolId.value) {
    Notify.create({
      type: 'warning',
      message: 'ابتدا یک مدرسه انتخاب کنید.'
    })

    return
  }

  saving.value = true

  try {
    if (eventDialog.edit && eventDialog.editingId) {
      const payload: CalendarEventUpdateType = {
        title: eventDialog.form.title.trim(),
        description: eventDialog.form.description,
        starts_at: toApiDateTime(eventDialog.form.starts_at) as string,
        ends_at: toApiDateTime(eventDialog.form.ends_at),
        all_day: eventDialog.form.all_day,
        type: eventDialog.form.type,
        status: eventDialog.form.status,
        location: eventDialog.form.location,
        color: eventDialog.form.color,
        source: 'manual',
        is_recurring: false,
        metadata: null
      }

      await calendarEvent.updateEvent(
        eventDialog.editingId,
        payload
      )

      Notify.create({
        type: 'positive',
        message: 'رویداد با موفقیت بروزرسانی شد.'
      })
    } else {
      const payload: CalendarEventCreateType = {
        title: eventDialog.form.title.trim(),
        description: eventDialog.form.description,

        starts_at: toApiDateTime(
          eventDialog.form.starts_at
        ) as string,

        ends_at: toApiDateTime(
          eventDialog.form.ends_at
        ),

        all_day: eventDialog.form.all_day,

        type: eventDialog.form.type,
        status: eventDialog.form.status,

        location: eventDialog.form.location,
        color: eventDialog.form.color,

        source: 'manual',

        is_recurring: false,
        recurrence_rule: null,
        recurrence_until: null,

        metadata: null,

        /*
         * No calendar_id.
         * Backend resolves the correct calendar.
         */
        school_id: selectedSchoolId.value
      }

      await calendarEvent.createEvent(payload)

      Notify.create({
        type: 'positive',
        message: 'رویداد با موفقیت ثبت شد.'
      })
    }

    eventDialog.show = false

    await loadAll()
  } catch (error: any) {
    console.error(error)

    Notify.create({
      type: 'negative',
      message: error?.message || 'خطا در ذخیره رویداد.'
    })
  } finally {
    saving.value = false
  }
}

function confirmDeleteEvent () {
  if (!eventDialog.editingId) {
    return
  }

  Dialog.create({
    title: 'حذف رویداد',
    message: `آیا از حذف رویداد «${eventDialog.form.title || ''}» اطمینان دارید؟`,
    cancel: {
      label: 'انصراف',
      flat: true
    },
    ok: {
      label: 'حذف',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    await deleteEvent()
  })
}

async function deleteEvent () {
  if (!eventDialog.editingId) {
    return
  }

  deleting.value = true

  try {
    await calendarEvent.delete(eventDialog.editingId)

    Notify.create({
      type: 'positive',
      message: 'رویداد با موفقیت حذف شد.'
    })

    eventDialog.show = false

    await loadAll()
  } catch (error: any) {
    console.error(error)

    Notify.create({
      type: 'negative',
      message: error?.message || 'خطا در حذف رویداد.'
    })
  } finally {
    deleting.value = false
  }
}

watch(
  selectedSchoolId,
  async () => {
    await loadAll()
  }
)

onMounted(() => {
  loadAll()
})
</script>

<style scoped>
.calendar-wrapper {
  width: 100%;
  min-height: 600px;
}

</style>
