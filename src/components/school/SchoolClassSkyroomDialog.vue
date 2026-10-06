<template>
  <q-dialog v-model="dialogVisible">
    <q-card class="school-class-skyroom-dialog">
      <q-card-section class="row items-center">
        <div>
          <div class="text-h6">مدیریت اتاق‌های اسکای‌روم کلاس</div>
          <div class="text-caption text-grey">{{ schoolClass?.name || 'کلاس' }}</div>
        </div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="refresh"
          :loading="loading"
          @click="loadData">
          <q-tooltip>بروزرسانی</q-tooltip>
        </q-btn>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="text-subtitle1">اتاق‌ها و زمان‌بندی برگزاری کلاس</div>
            <div class="text-caption text-grey">اتاق‌های این کلاس و برنامه هفتگی یا تاریخ‌دار آن‌ها را مدیریت کنید.</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="اتاق جدید"
              :disable="skyroomAccounts.length === 0"
              @click="openRoomDialog()" />
          </div>
        </div>

        <q-banner
          v-if="!loading && skyroomAccounts.length === 0"
          rounded
          class="bg-orange-1 text-orange-10 q-mb-md">
          ابتدا برای این مدرسه یک اکانت اسکای‌روم فعال ثبت کنید.
        </q-banner>

        <div
          v-if="loading"
          class="text-center q-pa-xl">
          <q-spinner
            color="primary"
            size="60px" />
        </div>

        <div
          v-else-if="rooms.length === 0"
          class="text-center text-grey q-pa-xl">
          <q-icon
            name="video_camera_front"
            size="72px"
            color="grey-4" />
          <div class="text-subtitle1 q-mt-md">هنوز اتاقی برای این کلاس ثبت نشده است.</div>
        </div>

        <q-list
          v-else
          bordered
          separator
          class="rounded-borders">
          <q-expansion-item
            v-for="room in rooms"
            :key="room.id ?? room.name"
            group="skyroom-rooms">
            <template #header>
              <q-item-section avatar>
                <q-icon
                  name="video_camera_front"
                  color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ room.title || room.name }}</q-item-label>
                <q-item-label caption>
                  {{ room.name }} — {{ room.skyroom_account?.title || 'اکانت نامشخص' }} — ظرفیت {{ room.max_users }} نفر
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row items-center no-wrap">
                  <q-chip
                    :color="room.status ? 'positive' : 'grey'"
                    text-color="white"
                    dense>
                    {{ room.status ? 'فعال' : 'غیرفعال' }}
                  </q-chip>
                  <q-btn
                    flat
                    round
                    dense
                    color="primary"
                    icon="edit"
                    @click.stop="openRoomDialog(room)">
                    <q-tooltip>ویرایش اتاق</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    color="negative"
                    icon="delete"
                    @click.stop="removeRoom(room)">
                    <q-tooltip>حذف اتاق</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </template>

            <q-card flat>
              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <div class="col text-subtitle2">زمان‌بندی‌های اتاق</div>
                  <div class="col-auto">
                    <q-btn
                      color="accent"
                      icon="add"
                      label="زمان‌بندی جدید"
                      dense
                      @click="openScheduleDialog(room)" />
                  </div>
                </div>

                <div
                  v-if="getRoomSchedules(room).length === 0"
                  class="text-center text-grey q-pa-md">
                  هیچ زمان‌بندی برای این اتاق ثبت نشده است.
                </div>

                <q-list
                  v-else
                  bordered
                  separator
                  class="rounded-borders">
                  <q-item
                    v-for="schedule in getRoomSchedules(room)"
                    :key="schedule.id ?? `${schedule.start_time}-${schedule.end_time}`">
                    <q-item-section avatar>
                      <q-icon
                        name="schedule"
                        color="accent" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ schedule.title }}</q-item-label>
                      <q-item-label caption>
                        {{ scheduleLabel(schedule) }} — از {{ schedule.start_time }} تا {{ schedule.end_time }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="row items-center no-wrap">
                        <q-chip
                          :color="schedule.is_active ? 'positive' : 'grey'"
                          text-color="white"
                          dense>
                          {{ schedule.is_active ? 'فعال' : 'غیرفعال' }}
                        </q-chip>
                        <q-btn
                          flat
                          round
                          dense
                          color="primary"
                          icon="edit"
                          @click="openScheduleDialog(room, schedule)">
                          <q-tooltip>ویرایش زمان‌بندی</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          color="negative"
                          icon="delete"
                          @click="removeSchedule(schedule)">
                          <q-tooltip>حذف زمان‌بندی</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="بستن"
          @click="dialogVisible = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="roomDialog.show">
    <q-card style="width: 650px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ roomDialog.edit ? 'ویرایش اتاق اسکای‌روم' : 'اتاق اسکای‌روم جدید' }}</div>
        <q-space />
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="saveRoom">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="roomDialog.form.skyroom_account_id"
                outlined
                emit-value
                map-options
                :options="skyroomAccountOptions"
                label="اکانت اسکای‌روم *"
                :rules="[(value) => !!value || 'انتخاب اکانت الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="roomDialog.form.title"
                outlined
                label="عنوان نمایشی *"
                :rules="[(value) => !!value?.trim() || 'عنوان الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="roomDialog.form.name"
                outlined
                dir="ltr"
                label="نام لاتین اتاق *"
                :rules="[(value) => !!value?.trim() || 'نام اتاق الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="roomDialog.form.skyroom_id"
                outlined
                type="number"
                label="شناسه اتاق در اسکای‌روم" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="roomDialog.form.max_users"
                outlined
                type="number"
                min="1"
                label="حداکثر کاربران *"
                :rules="[(value) => Number(value) > 0 || 'ظرفیت باید بیشتر از صفر باشد']" />
            </div>
            <div class="col-12">
              <q-input
                v-model="roomDialog.form.description"
                outlined
                type="textarea"
                autogrow
                label="توضیحات" />
            </div>
            <div class="col-12 col-sm-4">
              <q-toggle
                v-model="roomDialog.form.status"
                label="اتاق فعال" />
            </div>
            <div class="col-12 col-sm-4">
              <q-toggle
                v-model="roomDialog.form.guest_login"
                label="ورود مهمان" />
            </div>
            <div class="col-12 col-sm-4">
              <q-toggle
                v-model="roomDialog.form.op_login_first"
                label="ورود اول اپراتور" />
            </div>
          </div>
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              flat
              label="انصراف"
              @click="roomDialog.show = false" />
            <q-btn
              type="submit"
              color="primary"
              :label="roomDialog.edit ? 'بروزرسانی' : 'ثبت'"
              :loading="savingRoom" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="scheduleDialog.show">
    <q-card style="width: 620px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div>
          <div class="text-h6">{{ scheduleDialog.edit ? 'ویرایش زمان‌بندی' : 'زمان‌بندی جدید' }}</div>
          <div class="text-caption text-grey">{{ scheduleDialog.roomTitle }}</div>
        </div>
        <q-space />
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="saveSchedule">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="scheduleDialog.form.title"
                outlined
                label="عنوان *"
                :rules="[(value) => !!value?.trim() || 'عنوان الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="scheduleDialog.form.day_of_week"
                outlined
                clearable
                emit-value
                map-options
                :options="dayOfWeekOptions"
                label="روز هفته" />
            </div>
            <div class="col-12 col-sm-6">
              <form-builder-date
                v-model:value="scheduleDialog.form.held_date"
                label="تاریخ برگزاری"
                outlined
                clearable />
            </div>
            <div class="col-12 col-sm-6">
              <form-builder-time
                v-model:value="scheduleDialog.form.start_time"
                label="ساعت شروع"
                outlined
                clearable
                :rules="[(value) => !!value || 'ساعت شروع الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <form-builder-time
                v-model:value="scheduleDialog.form.end_time"
                label="ساعت پایان"
                outlined
                clearable
                :rules="[(value) => !!value || 'ساعت پایان الزامی است']" />
            </div>
            <div class="col-12">
              <q-toggle
                v-model="scheduleDialog.form.is_active"
                label="زمان‌بندی فعال" />
            </div>
          </div>
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              flat
              label="انصراف"
              @click="scheduleDialog.show = false" />
            <q-btn
              type="submit"
              color="primary"
              :label="scheduleDialog.edit ? 'بروزرسانی' : 'ثبت'"
              :loading="savingSchedule" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import SchoolClassAPI, { type SchoolClassType } from 'src/repositories/schoolClass'
import SkyroomRoomAPI, { type SkyroomRoomType } from 'src/repositories/skyroomRoom'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderTime from 'src/components/controls/formBuilderCustomInput/FormBuilderTime.vue'
import SkyroomRoomScheduleAPI, { type SkyroomRoomScheduleType } from 'src/repositories/skyroomRoomSchedule'
import SchoolSkyroomAccountAPI, { type SchoolSkyroomAccountType } from 'src/repositories/schoolSkyroomAccount'

const props = defineProps<{
  modelValue: boolean
  schoolClass: SchoolClassType | null
  schoolId: number | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'updated'): void
}>()

const $q = useQuasar()
const classApi = new SchoolClassAPI()
const roomApi = new SkyroomRoomAPI()
const scheduleApi = new SkyroomRoomScheduleAPI()

const loading = ref(false)
const savingRoom = ref(false)
const savingSchedule = ref(false)
const rooms = ref<SkyroomRoomType[]>([])
const schedules = ref<SkyroomRoomScheduleType[]>([])
const skyroomAccounts = ref<SchoolSkyroomAccountType[]>([])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const skyroomAccountOptions = computed(() => skyroomAccounts.value.map((account) => ({
  label: `${account.title} (${account.username})`,
  value: account.id
})))

const dayOfWeekOptions = [
  { label: 'شنبه', value: 0 },
  { label: 'یکشنبه', value: 1 },
  { label: 'دوشنبه', value: 2 },
  { label: 'سه‌شنبه', value: 3 },
  { label: 'چهارشنبه', value: 4 },
  { label: 'پنجشنبه', value: 5 },
  { label: 'جمعه', value: 6 }
]

const roomDialog = reactive({
  show: false,
  edit: false,
  form: {
    id: null as number | null,
    skyroom_account_id: null as number | null,
    skyroom_id: null as number | null,
    name: '',
    title: '',
    description: '',
    max_users: 20,
    guest_login: false,
    op_login_first: true,
    status: true
  }
})

const scheduleDialog = reactive({
  show: false,
  edit: false,
  roomTitle: '',
  form: {
    id: null as number | null,
    skyroom_room_id: null as number | null,
    title: '',
    day_of_week: null as number | null,
    held_date: null as string | null,
    start_time: '',
    end_time: '',
    is_active: true
  }
})

watch(
  () => [props.modelValue, props.schoolClass?.id, props.schoolId],
  ([visible]) => {
    if (visible) loadData()
  }
)

function dayOfWeekLabel (day: number | null): string {
  return dayOfWeekOptions.find((option) => option.value === day)?.label || '-'
}

function getRoomSchedules (room: SkyroomRoomType): SkyroomRoomScheduleType[] {
  if (!room.id) return []
  return schedules.value.filter((schedule) => schedule.skyroom_room_id === room.id)
}

function scheduleLabel (schedule: SkyroomRoomScheduleType): string {
  const labels = []
  if (schedule.day_of_week !== null) labels.push(dayOfWeekLabel(schedule.day_of_week))
  if (schedule.held_date) labels.push(schedule.held_date)
  return labels.length ? labels.join(' — ') : 'بدون روز یا تاریخ مشخص'
}

async function loadData () {
  const classId = props.schoolClass?.id
  if (!classId || !props.schoolId) return

  loading.value = true
  try {
    const accountApi = new SchoolSkyroomAccountAPI(props.schoolId)
    const [classRooms, accountsResponse] = await Promise.all([
      classApi.getSkyroomRooms(classId),
      accountApi.index({ length: 1000, is_active: true })
    ])
    rooms.value = classRooms
    skyroomAccounts.value = accountsResponse.data

    const scheduleResponses = await Promise.all(
      classRooms
        .filter((room) => room.id)
        .map((room) => scheduleApi.index({ length: 1000, skyroom_room_id: room.id }))
    )
    schedules.value = scheduleResponses.flatMap((response) => response.data)
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در بارگذاری اتاق‌ها و زمان‌بندی‌های کلاس', color: 'negative' })
  } finally {
    loading.value = false
  }
}

function openRoomDialog (room?: SkyroomRoomType) {
  roomDialog.edit = !!room
  roomDialog.form = {
    id: room?.id ?? null,
    skyroom_account_id: room?.skyroom_account_id ?? skyroomAccounts.value[0]?.id ?? null,
    skyroom_id: room?.skyroom_id ?? null,
    name: room?.name ?? '',
    title: room?.title ?? '',
    description: room?.description ?? '',
    max_users: room?.max_users ?? 20,
    guest_login: room?.guest_login ?? false,
    op_login_first: room?.op_login_first ?? true,
    status: room?.status ?? true
  }
  roomDialog.show = true
}

async function saveRoom () {
  const classId = props.schoolClass?.id
  const form = roomDialog.form
  if (!classId || !form.skyroom_account_id || !form.name.trim() || !form.title.trim()) return

  savingRoom.value = true
  try {
    const payload: SkyroomRoomType = {
      ...roomApi.defaultObject,
      class_id: classId,
      skyroom_account_id: form.skyroom_account_id,
      skyroom_id: form.skyroom_id || null,
      name: form.name.trim(),
      title: form.title.trim(),
      description: form.description.trim() || null,
      max_users: Number(form.max_users),
      guest_login: form.guest_login,
      op_login_first: form.op_login_first,
      status: form.status
    }

    if (roomDialog.edit && form.id) {
      await roomApi.update(form.id, payload)
    } else {
      await roomApi.create(payload)
    }

    roomDialog.show = false
    await loadData()
    emit('updated')
    $q.notify({ icon: 'check', message: 'اتاق اسکای‌روم با موفقیت ذخیره شد.', color: 'positive' })
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در ذخیره اتاق اسکای‌روم', color: 'negative' })
  } finally {
    savingRoom.value = false
  }
}

function removeRoom (room: SkyroomRoomType) {
  if (!room.id) return
  $q.dialog({
    title: 'حذف اتاق اسکای‌روم',
    message: `آیا از حذف «${room.title || room.name}» و زمان‌بندی‌های آن مطمئن هستید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await roomApi.delete(room.id!)
      await loadData()
      emit('updated')
      $q.notify({ icon: 'check', message: 'اتاق اسکای‌روم حذف شد.', color: 'positive' })
    } catch (error) {
      console.error(error)
      $q.notify({ icon: 'error', message: 'خطا در حذف اتاق اسکای‌روم', color: 'negative' })
    }
  })
}

function openScheduleDialog (room: SkyroomRoomType, schedule?: SkyroomRoomScheduleType) {
  scheduleDialog.edit = !!schedule
  scheduleDialog.roomTitle = room.title || room.name || 'اتاق اسکای‌روم'
  scheduleDialog.form = {
    id: schedule?.id ?? null,
    skyroom_room_id: room.id,
    title: schedule?.title ?? '',
    day_of_week: schedule?.day_of_week ?? null,
    held_date: schedule?.held_date ?? null,
    start_time: schedule?.start_time ?? '',
    end_time: schedule?.end_time ?? '',
    is_active: schedule?.is_active ?? true
  }
  scheduleDialog.show = true
}

async function saveSchedule () {
  const form = scheduleDialog.form
  if (!form.skyroom_room_id || !form.title.trim() || !form.start_time || !form.end_time) return

  savingSchedule.value = true
  try {
    const payload: SkyroomRoomScheduleType = {
      ...scheduleApi.defaultObject,
      skyroom_room_id: form.skyroom_room_id,
      title: form.title.trim(),
      day_of_week: form.day_of_week,
      held_date: form.held_date || null,
      start_time: form.start_time,
      end_time: form.end_time,
      is_active: form.is_active
    }

    if (scheduleDialog.edit && form.id) {
      await scheduleApi.update(form.id, payload)
    } else {
      await scheduleApi.create(payload)
    }

    scheduleDialog.show = false
    await loadData()
    emit('updated')
    $q.notify({ icon: 'check', message: 'زمان‌بندی با موفقیت ذخیره شد.', color: 'positive' })
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در ذخیره زمان‌بندی', color: 'negative' })
  } finally {
    savingSchedule.value = false
  }
}

function removeSchedule (schedule: SkyroomRoomScheduleType) {
  if (!schedule.id) return
  $q.dialog({
    title: 'حذف زمان‌بندی',
    message: `آیا از حذف «${schedule.title}» مطمئن هستید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await scheduleApi.delete(schedule.id!)
      await loadData()
      emit('updated')
      $q.notify({ icon: 'check', message: 'زمان‌بندی حذف شد.', color: 'positive' })
    } catch (error) {
      console.error(error)
      $q.notify({ icon: 'error', message: 'خطا در حذف زمان‌بندی', color: 'negative' })
    }
  })
}
</script>

<style lang="scss" scoped>
.school-class-skyroom-dialog {
  width: 1050px;
  max-width: 96vw;
  max-height: 92vh;
}
</style>
