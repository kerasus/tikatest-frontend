<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 760px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">ویرایش کلاس</div>
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
        <q-form @submit.prevent="saveClass">
          <q-input
            v-model="form.name"
            label="نام کلاس *"
            outlined
            :rules="[(value) => !!value || 'نام کلاس الزامی است']" />
          <div class="row justify-end q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ذخیره نام کلاس"
              :loading="savingClass" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1 q-mb-md">درس‌های کلاس</div>
        <div class="row q-col-gutter-sm items-start">
          <div class="col-12 col-sm">
            <form-builder-select-lesson
              v-model:value="selectedLessonId"
              :school-id="schoolId"
              :field-id="fieldId"
              :level-id="levelId"
              label="انتخاب درس"
              outlined
              clearable />
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              color="positive"
              icon="add"
              label="افزودن درس"
              class="full-width"
              :disable="!selectedLessonId"
              :loading="addingLesson"
              @click="addLesson" />
          </div>
        </div>

        <div
          v-if="loadingLessons"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="40px" />
        </div>
        <q-list
          v-else-if="classLessons.length"
          bordered
          separator
          class="q-mt-md rounded-borders">
          <q-item
            v-for="item in classLessons"
            :key="item.id ?? item.lesson_id">
            <q-item-section>
              <q-item-label>{{ item.lesson?.name || 'درس' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                :loading="removingLessonId === item.id"
                @click="removeLesson(item)">
                <q-tooltip>حذف درس از کلاس</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-else
          class="text-center text-grey q-pa-lg">هنوز درسی به این کلاس اضافه نشده است.</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="text-subtitle1">اتاق‌های اسکای‌روم کلاس</div>
            <div class="text-caption text-grey">هر اتاق باید به یکی از اکانت‌های اسکای‌روم مدرسه متصل باشد.</div>
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
          v-if="!loadingRooms && skyroomAccounts.length === 0"
          rounded
          class="bg-orange-1 text-orange-10 q-mb-md">
          ابتدا برای این مدرسه یک اکانت اسکای‌روم ثبت کنید.
        </q-banner>

        <div
          v-if="loadingRooms"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="40px" />
        </div>
        <q-list
          v-else-if="skyroomRooms.length"
          bordered
          separator
          class="rounded-borders">
          <q-item
            v-for="room in skyroomRooms"
            :key="room.id ?? room.name">
            <q-item-section avatar>
              <q-icon
                name="video_camera_front"
                color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ room.title }}</q-item-label>
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
                  @click="openRoomDialog(room)" />
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  @click="removeRoom(room)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-else
          class="text-center text-grey q-pa-lg">هنوز اتاق اسکای‌رومی برای این کلاس ثبت نشده است.</div>
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
                option-label="label"
                option-value="value"
                :options="skyroomAccountOptions"
                label="اکانت اسکای‌روم *"
                :rules="[(value) => !!value || 'انتخاب اکانت الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="roomDialog.form.title"
                outlined
                label="عنوان نمایشی *"
                :rules="[(value) => !!value || 'عنوان الزامی است']" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="roomDialog.form.name"
                outlined
                dir="ltr"
                label="نام لاتین اتاق *"
                :rules="[(value) => !!value || 'نام اتاق الزامی است']" />
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
            <div class="col-12 col-sm-4"><q-toggle
              v-model="roomDialog.form.status"
              label="اتاق فعال" /></div>
            <div class="col-12 col-sm-4"><q-toggle
              v-model="roomDialog.form.guest_login"
              label="ورود مهمان" /></div>
            <div class="col-12 col-sm-4"><q-toggle
              v-model="roomDialog.form.op_login_first"
              label="ورود اول اپراتور" /></div>
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
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import SchoolClassAPI, { type SchoolClassType } from 'src/repositories/schoolClass'
import ClassLessonAPI, { type ClassLessonType } from 'src/repositories/classLesson'
import SkyroomRoomAPI, { type SkyroomRoomType } from 'src/repositories/skyroomRoom'
import SchoolSkyroomAccountAPI, { type SchoolSkyroomAccountType } from 'src/repositories/schoolSkyroomAccount'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'

const props = defineProps<{
  modelValue: boolean
  schoolClass: SchoolClassType | null
  schoolId: number | null
  fieldId: number | null
  levelId: number | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'updated'): void
}>()

const $q = useQuasar()
const classApi = new SchoolClassAPI()
const roomApi = new SkyroomRoomAPI()

const savingClass = ref(false)
const loadingLessons = ref(false)
const addingLesson = ref(false)
const removingLessonId = ref<number | null>(null)
const selectedLessonId = ref<number | null>(null)
const classLessons = ref<ClassLessonType[]>([])
const loadingRooms = ref(false)
const savingRoom = ref(false)
const skyroomRooms = ref<SkyroomRoomType[]>([])
const skyroomAccounts = ref<SchoolSkyroomAccountType[]>([])
const form = reactive({ name: '' })

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const skyroomAccountOptions = computed(() => skyroomAccounts.value.map((account) => ({
  label: `${account.title} (${account.username})`,
  value: account.id
})))

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

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible || !props.schoolClass?.id) return
    form.name = props.schoolClass.name || ''
    selectedLessonId.value = null
    await Promise.all([loadClassLessons(), loadSkyroomData()])
  }
)

async function loadClassLessons () {
  const classId = props.schoolClass?.id
  if (!classId) return
  loadingLessons.value = true
  try {
    const response = await new ClassLessonAPI(classId).index({ length: 1000 })
    classLessons.value = response.data
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در بارگذاری درس‌های کلاس', color: 'negative' })
  } finally {
    loadingLessons.value = false
  }
}

async function loadSkyroomData () {
  const classId = props.schoolClass?.id
  if (!classId || !props.schoolId) return
  loadingRooms.value = true
  try {
    const accountApi = new SchoolSkyroomAccountAPI(props.schoolId)
    const [rooms, accountsResponse] = await Promise.all([
      classApi.getSkyroomRooms(classId),
      accountApi.index({ length: 1000, is_active: true })
    ])
    skyroomRooms.value = rooms
    skyroomAccounts.value = accountsResponse.data
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در بارگذاری اطلاعات اسکای‌روم کلاس', color: 'negative' })
  } finally {
    loadingRooms.value = false
  }
}

async function saveClass () {
  if (!props.schoolClass?.id || !form.name.trim()) return
  savingClass.value = true
  try {
    await classApi.update(props.schoolClass.id, {
      ...classApi.defaultObject,
      academic_level_id: props.schoolClass.academic_level_id,
      name: form.name.trim()
    })
    $q.notify({ icon: 'check', message: 'نام کلاس با موفقیت بروزرسانی شد.', color: 'positive' })
    emit('updated')
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در بروزرسانی کلاس.', color: 'negative' })
  } finally {
    savingClass.value = false
  }
}

async function addLesson () {
  const classId = props.schoolClass?.id
  if (!classId || !selectedLessonId.value) return
  if (classLessons.value.some((item) => item.lesson_id === selectedLessonId.value)) {
    $q.notify({ icon: 'info', message: 'این درس قبلاً به کلاس اضافه شده است.', color: 'info' })
    return
  }
  addingLesson.value = true
  try {
    const classLessonApi = new ClassLessonAPI(classId)
    await classLessonApi.create({
      ...classLessonApi.defaultObject,
      class_id: classId,
      lesson_id: selectedLessonId.value
    })
    selectedLessonId.value = null
    await loadClassLessons()
    $q.notify({ icon: 'check', message: 'درس با موفقیت به کلاس اضافه شد.', color: 'positive' })
    emit('updated')
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در افزودن درس به کلاس.', color: 'negative' })
  } finally {
    addingLesson.value = false
  }
}

async function removeLesson (item: ClassLessonType) {
  const classId = props.schoolClass?.id
  if (!classId || !item.id) return
  removingLessonId.value = item.id
  try {
    await new ClassLessonAPI(classId).delete(item.id)
    await loadClassLessons()
    $q.notify({ icon: 'check', message: 'درس از کلاس حذف شد.', color: 'positive' })
    emit('updated')
  } catch (error) {
    console.error(error)
    $q.notify({ icon: 'error', message: 'خطا در حذف درس از کلاس.', color: 'negative' })
  } finally {
    removingLessonId.value = null
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
  if (!classId || !roomDialog.form.skyroom_account_id || !roomDialog.form.name || !roomDialog.form.title) return
  savingRoom.value = true
  try {
    const payload: SkyroomRoomType = {
      ...roomApi.defaultObject,
      class_id: classId,
      skyroom_account_id: roomDialog.form.skyroom_account_id,
      skyroom_id: roomDialog.form.skyroom_id || null,
      name: roomDialog.form.name.trim(),
      title: roomDialog.form.title.trim(),
      description: roomDialog.form.description || null,
      max_users: Number(roomDialog.form.max_users),
      guest_login: roomDialog.form.guest_login,
      op_login_first: roomDialog.form.op_login_first,
      status: roomDialog.form.status
    }
    if (roomDialog.edit && roomDialog.form.id) {
      await roomApi.update(roomDialog.form.id, payload)
    } else {
      await roomApi.create(payload)
    }
    roomDialog.show = false
    await loadSkyroomData()
    $q.notify({ type: 'positive', message: 'اتاق اسکای‌روم با موفقیت ذخیره شد.' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در ذخیره اتاق اسکای‌روم' })
  } finally {
    savingRoom.value = false
  }
}

function removeRoom (room: SkyroomRoomType) {
  if (!room.id) return
  $q.dialog({
    title: 'حذف اتاق اسکای‌روم',
    message: `آیا از حذف «${room.title}» مطمئن هستید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await roomApi.delete(room.id!)
      await loadSkyroomData()
      $q.notify({ type: 'positive', message: 'اتاق اسکای‌روم حذف شد.' })
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'خطا در حذف اتاق اسکای‌روم' })
    }
  })
}
</script>
