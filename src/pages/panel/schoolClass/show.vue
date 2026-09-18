<template>
  <div class="school-class-rooms-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">مدیریت اتاق‌های اسکای‌روم کلاس</div>
            <div class="text-caption text-grey">
              {{ className || 'در حال بارگذاری...' }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن اتاق جدید"
              @click="openRoomDialog(null)" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div
          v-if="loading"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="80px" />
        </div>
        <div
          v-else-if="rooms.length === 0"
          class="text-center q-pa-lg">
          <q-icon
            name="hotel"
            size="80px"
            color="grey-4" />
          <p class="text-subtitle1 q-mt-md text-grey">هیچ اتاقی ثبت نشده است.</p>
        </div>
        <q-list
          v-else
          bordered>
          <q-expansion-item
            v-for="room in rooms"
            :key="room.id"
            :label="room.name || `اتاق ${room.id}`"
            header-class="q-py-sm"
            :default-opened="false">
            <template v-slot:header>
              <div class="row items-center full-width">
                <div class="col">
                  <div class="text-subtitle2">{{ room.name || `اتاق ${room.id}` }}</div>
                </div>
                <div class="col-auto q-ml-sm">
                  <q-btn
                    flat
                    dense
                    round
                    icon="edit"
                    color="primary"
                    size="sm"
                    @click.stop="openRoomDialog(room)">
                    <q-tooltip>ویرایش اتاق</q-tooltip>
                  </q-btn>
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click.stop="confirmDeleteRoom(room)">
                    <q-tooltip>حذف اتاق</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>

            <div class="q-pa-md">
              <div class="text-subtitle2 q-mb-sm">زمان‌بندی برگزاری کلاس‌ها</div>

              <div
                v-if="getSchedules(room.id!).length === 0"
                class="text-center text-grey q-py-md">
                هیچ زمان‌بندی ثبت نشده.
              </div>

              <q-list
                v-else
                bordered>
                <q-item
                  v-for="schedule in getSchedules(room.id!)"
                  :key="schedule.id"
                  dense
                  class="q-mb-xs">
                  <q-item-section>
                    <div class="row items-center q-col-gutter-md">
                      <div class="col">
                        <div v-if="!editSchedules[schedule.id!]">
                          <div class="text-body2">
                            {{ schedule.title }}
                          </div>
                          <div class="text-caption text-grey">
                            روز: {{ dayOfWeekLabel(schedule.day_of_week) }}
                            | تاریخ: {{ schedule.held_date || '-' }}
                            | از {{ schedule.start_time }} تا {{ schedule.end_time }}
                          </div>
                          <div class="text-caption">
                            <q-chip
                              :color="schedule.is_active ? 'positive' : 'grey'"
                              text-color="white"
                              dense
                              size="sm"
                              square>
                              {{ schedule.is_active ? 'فعال' : 'غیرفعال' }}
                            </q-chip>
                          </div>
                        </div>
                        <div v-else>
                          <q-form @submit.prevent="saveSchedule(schedule)">
                            <div class="row q-col-gutter-md items-end">
                              <div class="col-12 col-md-3">
                                <q-input
                                  v-model="editForms[schedule.id!].title"
                                  label="عنوان"
                                  outlined
                                  dense
                                  clearable />
                              </div>
                              <div class="col-12 col-md-2">
                                <q-select
                                  v-model="editForms[schedule.id!].day_of_week"
                                  :options="dayOfWeekOptions"
                                  label="روز"
                                  outlined
                                  dense
                                  clearable
                                  emit-value
                                  map-options />
                              </div>
                              <div class="col-12 col-md-2">
                                <q-input
                                  v-model="editForms[schedule.id!].held_date"
                                  label="تاریخ برگزاری"
                                  outlined
                                  dense
                                  clearable />
                              </div>
                              <div class="col-12 col-md-1">
                                <q-input
                                  v-model="editForms[schedule.id!].start_time"
                                  label="ساعت شروع"
                                  outlined
                                  dense />
                              </div>
                              <div class="col-12 col-md-1">
                                <q-input
                                  v-model="editForms[schedule.id!].end_time"
                                  label="ساعت پایان"
                                  outlined
                                  dense />
                              </div>
                              <div class="col-12 col-md-2 flex items-end">
                                <q-checkbox
                                  v-model="editForms[schedule.id!].is_active"
                                  label="فعال" />
                              </div>
                              <div class="col-auto flex items-end q-ml-sm">
                                <q-btn
                                  type="submit"
                                  color="primary"
                                  label="ذخیره"
                                  :loading="savingId === schedule.id"
                                  size="sm" />
                              </div>
                            </div>
                          </q-form>
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-btn
                          v-if="!editSchedules[schedule.id!]"
                          flat
                          dense
                          round
                          icon="edit"
                          color="primary"
                          size="sm"
                          @click.stop="initEditSchedule(schedule)">
                          <q-tooltip>ویرایش</q-tooltip>
                        </q-btn>
                      </div>
                      <div class="col-auto">
                        <q-btn
                          flat
                          dense
                          round
                          icon="delete"
                          color="negative"
                          size="sm"
                          @click.stop="confirmDeleteSchedule(schedule)">
                          <q-tooltip>حذف</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-mt-md">
                <q-btn
                  color="accent"
                  icon="add"
                  label="افزودن زمان‌بندی"
                  dense
                  @click.stop="openScheduleDialog(room.id!)" />
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="roomDialog.show"
      persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">{{ roomDialog.edit ? 'ویرایش اتاق' : 'افزودن اتاق جدید' }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSubmitRoom">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="roomDialog.form.name"
                  label="نام اتاق"
                  outlined
                  clearable />
              </div>
              <div class="col-12">
                <q-input
                  v-model="roomDialog.form.title"
                  label="عنوان"
                  outlined
                  clearable />
              </div>
              <div class="col-12">
                <q-input
                  v-model="roomDialog.form.description"
                  label="توضیحات"
                  outlined
                  type="textarea"
                  clearable />
              </div>
              <div class="col-12">
                <q-input
                  v-model.number="roomDialog.form.max_users"
                  label="ظرفیت حداکثر"
                  outlined
                  type="number"
                  clearable />
              </div>
            </div>
            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                :label="roomDialog.edit ? 'بروزرسانی' : 'ثبت'"
                :loading="savingRoom" />
              <q-btn
                flat
                label="انصراف"
                class="q-ml-sm"
                @click="roomDialog.show = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="scheduleDialog.show"
      persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">افزودن زمان‌بندی جدید</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSubmitSchedule">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="scheduleDialog.form.title"
                  label="عنوان"
                  outlined
                  clearable />
              </div>
              <div class="col-12">
                <q-select
                  v-model="scheduleDialog.form.day_of_week"
                  :options="dayOfWeekOptions"
                  label="روز"
                  outlined
                  clearable
                  emit-value
                  map-options />
              </div>
              <div class="col-12">
                <q-input
                  v-model="scheduleDialog.form.held_date"
                  label="تاریخ برگزاری"
                  outlined
                  clearable />
              </div>
              <div class="col-6">
                <q-input
                  v-model="scheduleDialog.form.start_time"
                  label="ساعت شروع"
                  outlined />
              </div>
              <div class="col-6">
                <q-input
                  v-model="scheduleDialog.form.end_time"
                  label="ساعت پایان"
                  outlined />
              </div>
            </div>
            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                label="ثبت"
                :loading="savingSchedule" />
              <q-btn
                flat
                label="انصراف"
                class="q-ml-sm"
                @click="scheduleDialog.show = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, Notify } from 'quasar'
import SkyroomRoomAPI from 'src/repositories/skyroomRoom'
import SkyroomRoomScheduleAPI from 'src/repositories/skyroomRoomSchedule'
import type { SkyroomRoomType } from 'src/repositories/skyroomRoom'
import type { SkyroomRoomScheduleType } from 'src/repositories/skyroomRoomSchedule'

const skyroomRoomApi = new SkyroomRoomAPI()
const skyroomRoomScheduleApi = new SkyroomRoomScheduleAPI()

const route = useRoute()
const $q = useQuasar()

const classId = parseInt(route.params.class_id as string)
const loading = ref(false)
const rooms = ref<SkyroomRoomType[]>([])
const allSchedules = ref<SkyroomRoomScheduleType[]>([])
const className = ref('')
const savingRoom = ref(false)
const savingSchedule = ref(false)
const savingId = ref<number | null>(null)

const roomDialog = reactive({
  show: false,
  edit: false,
  form: {
    id: null as number | null,
    name: null as string | null,
    title: null as string | null,
    description: null as string | null,
    max_users: 20
  }
})

const scheduleDialog = reactive({
  show: false,
  skyroom_room_id: null as number | null,
  form: {
    title: null as string | null,
    day_of_week: null as number | null,
    held_date: null as string | null,
    start_time: null as string | null,
    end_time: null as string | null
  }
})

const editSchedules = reactive<Record<number, boolean>>({})
const editForms = reactive<Record<number, Partial<SkyroomRoomScheduleType>>>({})

const dayOfWeekOptions = [
  { label: 'شنبه', value: 0 },
  { label: 'یکشنبه', value: 1 },
  { label: 'دوشنبه', value: 2 },
  { label: 'سه‌شنبه', value: 3 },
  { label: 'چهارشنبه', value: 4 },
  { label: 'پنجشنبه', value: 5 },
  { label: 'جمعه', value: 6 }
]

function dayOfWeekLabel (day: number | null): string {
  if (day === null || day === undefined) return '-'
  const labels: Record<number, string> = {
    0: 'شنبه',
    1: 'یکشنبه',
    2: 'دوشنبه',
    3: 'سه‌شنبه',
    4: 'چهارشنبه',
    5: 'پنجشنبه',
    6: 'جمعه'
  }
  return labels[day] || '-'
}

function getSchedules (roomId: number): SkyroomRoomScheduleType[] {
  return allSchedules.value.filter((s) => s.skyroom_room_id === roomId)
}

async function loadRooms () {
  loading.value = true
  try {
    const [roomsRes, schedulesRes] = await Promise.all([
      skyroomRoomApi.index({ class_id: classId, length: 1000 }),
      skyroomRoomScheduleApi.index({ length: 1000 })
    ])
    rooms.value = roomsRes.data
    allSchedules.value = schedulesRes.data
    if (rooms.value.length > 0) {
      className.value = rooms.value[0].class?.name || `کلاس ${classId}`
    }
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اتاق‌ها',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function openRoomDialog (room: SkyroomRoomType | null) {
  if (room) {
    roomDialog.edit = true
    roomDialog.form = {
      id: room.id,
      name: room.name,
      title: room.title,
      description: room.description,
      max_users: room.max_users
    }
  } else {
    roomDialog.edit = false
    roomDialog.form = {
      id: null,
      name: null,
      title: null,
      description: null,
      max_users: 20
    }
  }
  roomDialog.show = true
}

async function onSubmitRoom () {
  savingRoom.value = true
  try {
    if (roomDialog.edit && roomDialog.form.id) {
      await skyroomRoomApi.update(roomDialog.form.id, {
        name: roomDialog.form.name,
        title: roomDialog.form.title,
        description: roomDialog.form.description,
        max_users: roomDialog.form.max_users
      } as any)
      $q.notify({
        icon: 'check',
        message: 'اتاق با موفقیت بروزرسانی شد.',
        color: 'positive'
      })
    } else {
      await skyroomRoomApi.create({
        class_id: classId,
        name: roomDialog.form.name,
        title: roomDialog.form.title,
        description: roomDialog.form.description,
        max_users: roomDialog.form.max_users
      } as any)
      $q.notify({
        icon: 'check',
        message: 'اتاق با موفقیت ثبت شد.',
        color: 'positive'
      })
    }
    roomDialog.show = false
    await loadRooms()
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ذخیره اتاق.',
      color: 'negative'
    })
  } finally {
    savingRoom.value = false
  }
}

function confirmDeleteRoom (room: SkyroomRoomType) {
  $q.dialog({
    title: 'تایید حذف',
    message: `آیا از حذف "${room.name || room.id}" اطمینان دارید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await skyroomRoomApi.delete(room.id!)
      $q.notify({
        icon: 'check',
        message: 'با موفقیت حذف شد.',
        color: 'positive'
      })
      await loadRooms()
    } catch (error: any) {
      $q.notify({
        icon: 'error',
        message: 'خطا در حذف.',
        color: 'negative'
      })
    }
  })
}

function initEditSchedule (schedule: SkyroomRoomScheduleType) {
  editSchedules[schedule.id!] = true
  editForms[schedule.id!] = {
    title: schedule.title,
    day_of_week: schedule.day_of_week,
    held_date: schedule.held_date,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    is_active: schedule.is_active
  }
}

function openScheduleDialog (roomId: number) {
  scheduleDialog.skyroom_room_id = roomId
  scheduleDialog.form = {
    title: null,
    day_of_week: null,
    held_date: null,
    start_time: null,
    end_time: null
  }
  scheduleDialog.show = true
}

async function onSubmitSchedule () {
  savingSchedule.value = true
  try {
    await skyroomRoomScheduleApi.create({
      skyroom_room_id: scheduleDialog.skyroom_room_id,
      title: scheduleDialog.form.title,
      day_of_week: scheduleDialog.form.day_of_week,
      held_date: scheduleDialog.form.held_date,
      start_time: scheduleDialog.form.start_time,
      end_time: scheduleDialog.form.end_time,
      is_active: true
    } as any)
    $q.notify({
      icon: 'check',
      message: 'زمان‌بندی با موفقیت ثبت شد.',
      color: 'positive'
    })
    scheduleDialog.show = false
    await loadRooms()
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت زمان‌بندی.',
      color: 'negative'
    })
  } finally {
    savingSchedule.value = false
  }
}

async function saveSchedule (schedule: SkyroomRoomScheduleType) {
  savingId.value = schedule.id ?? null
  try {
    const form = editForms[schedule.id!]
    await skyroomRoomScheduleApi.update(schedule.id!, {
      title: form.title ?? schedule.title,
      day_of_week: form.day_of_week ?? schedule.day_of_week,
      held_date: form.held_date ?? schedule.held_date,
      start_time: form.start_time ?? schedule.start_time,
      end_time: form.end_time ?? schedule.end_time,
      is_active: form.is_active ?? schedule.is_active
    } as any)
    editSchedules[schedule.id!] = false
    $q.notify({
      icon: 'check',
      message: 'زمان‌بندی با موفقیت بروزرسانی شد.',
      color: 'positive'
    })
    await loadRooms()
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بروزرسانی زمان‌بندی.',
      color: 'negative'
    })
  } finally {
    savingId.value = null
  }
}

function confirmDeleteSchedule (schedule: SkyroomRoomScheduleType) {
  $q.dialog({
    title: 'تایید حذف',
    message: `آیا از حذف زمان‌بندی "${schedule.title || schedule.id}" اطمینان دارید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await skyroomRoomScheduleApi.delete(schedule.id!)
      Notify.create({
        type: 'positive',
        message: 'زمان‌بندی با موفقیت حذف شد.'
      })
      await loadRooms()
    } catch (error: any) {
      $q.notify({
        icon: 'error',
        message: 'خطا در حذف زمان‌بندی.',
        color: 'negative'
      })
    }
  })
}

onMounted(() => {
  loadRooms()
})
</script>

<style lang="scss" scoped>
.school-class-rooms-page {
  width: 100%;
}
</style>
