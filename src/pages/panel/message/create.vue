<template>
  <div class="message-create-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ارسال پیام جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.school_id"
                :options="schoolOptions"
                option-value="id"
                option-label="name"
                label="انتخاب مدرسه"
                outlined
                emit-value
                map-options
                clearable
                dense
                @update:model-value="onSchoolChange" />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.field_id"
                :options="fieldOptions"
                option-value="id"
                option-label="name"
                label="انتخاب رشته *"
                outlined
                emit-value
                map-options
                clearable
                :disable="!form.school_id"
                dense
                @update:model-value="onFieldChange" />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.level_id"
                :options="levelOptions"
                option-value="id"
                option-label="name"
                label="انتخاب پایه *"
                outlined
                emit-value
                map-options
                clearable
                :disable="!form.field_id"
                dense
                @update:model-value="onLevelChange" />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.class_id"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="انتخاب کلاس *"
                outlined
                emit-value
                map-options
                clearable
                :disable="!form.level_id"
                dense
                @update:model-value="onClassChange" />
            </div>
          </div>

          <q-separator
            v-if="showStudentList"
            class="q-my-md" />

          <div
            v-if="showStudentList"
            class="row q-col-gutter-md">
            <div class="col-12">
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.subject"
                    label="موضوع"
                    outlined
                    dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.recipient_types"
                    :options="recipientTypeOptions"
                    option-value="value"
                    option-label="label"
                    label="گیرندگان"
                    outlined
                    emit-value
                    map-options
                    multiple
                    dense />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.body"
                    label="متن پیام *"
                    outlined
                    type="textarea"
                    rows="4"
                    :rules="[v => !!v || 'متن پیام الزامی است']" />
                </div>
                <div class="col-12 col-md-6">
                  <q-checkbox
                    v-model="form.is_sms"
                    label="ارسال به صورت پیامک"
                    dense />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.message_type"
                    label="نوع پیام"
                    outlined
                    placeholder="inner, sms, inner-sms"
                    dense />
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="row items-center q-mb-sm">
                <div class="col-auto">
                  <q-checkbox
                    v-model="selectAll"
                    dense
                    @update:model-value="toggleSelectAll" />
                </div>
                <div class="col-auto text-subtitle2">
                  انتخاب همه
                </div>
              </div>

              <q-list
                bordered
                separator>
                <q-item
                  v-for="student in studentOptions"
                  :key="student.id"
                  dense>
                  <q-item-section avatar>
                    <q-checkbox
                      v-model="student.selected"
                      dense />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ student.full_name }}</q-item-label>
                    <q-item-label caption>{{ student.username || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ارسال پیام"
              :loading="saving"
              :disable="!canSubmit" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Message.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { message } from 'src/repositories/message'
import StudentAPI from 'src/repositories/student'
import SchoolAPI from 'src/repositories/school'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import SchoolClassAPI from 'src/repositories/schoolClass'

const router = useRouter()
const $q = useQuasar()

const studentApi = new StudentAPI()
const schoolApi = new SchoolAPI()
const fieldApi = new AcademicFieldAPI()
const levelApi = new AcademicLevelAPI()
const classApi = new SchoolClassAPI()

const saving = ref(false)
const showStudentList = ref(false)
const selectAll = ref(true)

const schoolOptions = ref<any[]>([])
const fieldOptions = ref<any[]>([])
const levelOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const studentOptions = ref<any[]>([])

const form = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  level_id: null as number | null,
  class_id: null as number | null,
  subject: '',
  body: '',
  is_sms: false,
  message_type: 'inner',
  recipient_types: [] as string[]
})

const recipientTypeOptions = [
  { value: 'student', label: 'دانش‌آموز' },
  { value: 'father', label: 'پدر' },
  { value: 'mother', label: 'مادر' }
]

const canSubmit = computed(() => {
  if (!form.class_id || studentOptions.value.length === 0) return false
  const selectedStudents = studentOptions.value.filter((s) => s.selected)
  if (selectedStudents.length === 0) return false
  return !!form.body
})

watch(
  () => studentOptions.value.map((s) => s.selected),
  (selectedStates) => {
    selectAll.value = selectedStates.every((s) => s === true)
  }
)

function toggleSelectAll (checked: boolean) {
  studentOptions.value.forEach((student) => {
    student.selected = checked
  })
}

async function loadSchools () {
  try {
    const result = await schoolApi.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

async function loadFields (schoolId: number) {
  try {
    const result = await fieldApi.index({ length: 100, school_id: schoolId })
    fieldOptions.value = result.data
    form.field_id = null
    form.level_id = null
    form.class_id = null
    levelOptions.value = []
    classOptions.value = []
    studentOptions.value = []
    showStudentList.value = false
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

async function loadLevels (fieldId: number) {
  try {
    const result = await levelApi.index({ length: 100, field_id: fieldId })
    levelOptions.value = result.data
    form.level_id = null
    form.class_id = null
    classOptions.value = []
    studentOptions.value = []
    showStudentList.value = false
  } catch (error) {
    console.error('Error loading levels:', error)
  }
}

async function loadClasses (levelId: number) {
  try {
    const result = await classApi.index({ length: 100, level_id: levelId })
    classOptions.value = result.data
    form.class_id = null
    studentOptions.value = []
    showStudentList.value = false
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

async function loadStudents (classId: number) {
  try {
    const result = await studentApi.index({ length: 1000, class_id: classId })
    studentOptions.value = (result.data || []).map((item: any) => ({
      id: item.id,
      full_name: item.full_name || `${item.first_name} ${item.last_name}`,
      username: item.username,
      selected: true
    }))
    showStudentList.value = true
    selectAll.value = true
  } catch (error) {
    console.error('Error loading students:', error)
  }
}

function onSchoolChange (schoolId: number | null) {
  if (schoolId) {
    loadFields(schoolId)
  } else {
    fieldOptions.value = []
    levelOptions.value = []
    classOptions.value = []
    studentOptions.value = []
    showStudentList.value = false
    form.field_id = null
    form.level_id = null
    form.class_id = null
  }
}

function onFieldChange (fieldId: number | null) {
  if (fieldId) {
    loadLevels(fieldId)
  } else {
    levelOptions.value = []
    classOptions.value = []
    studentOptions.value = []
    showStudentList.value = false
    form.level_id = null
    form.class_id = null
  }
}

function onLevelChange (levelId: number | null) {
  if (levelId) {
    loadClasses(levelId)
  } else {
    classOptions.value = []
    studentOptions.value = []
    showStudentList.value = false
    form.class_id = null
  }
}

function onClassChange (classId: number | null) {
  if (classId) {
    loadStudents(classId)
  } else {
    studentOptions.value = []
    showStudentList.value = false
  }
}

async function onSubmit () {
  saving.value = true
  try {
    const selectedStudents = studentOptions.value.filter((s) => s.selected)
    if (selectedStudents.length === 0) {
      $q.notify({
        icon: 'error',
        message: 'حداقل یک دانش آموز انتخاب کنید.',
        color: 'negative'
      })
      return
    }

    const receiverIds = selectedStudents.map((s) => s.id)
    const recipientTypes = selectedStudents.map((student) => ({
      user_id: student.id,
      is_student: form.recipient_types.includes('student') || form.recipient_types.length === 0,
      is_father: form.recipient_types.includes('father'),
      is_mother: form.recipient_types.includes('mother')
    }))

    await message.create({
      school_id: form.school_id,
      subject: form.subject,
      body: form.body,
      is_sms: form.is_sms,
      message_type: form.message_type,
      receiver_ids: receiverIds,
      recipient_types: recipientTypes
    } as any)

    $q.notify({
      icon: 'check',
      message: 'پیام با موفقیت ارسال شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Message.List' })
  } catch (error: any) {
    const message = error?.response?.data?.message || 'خطا در ارسال پیام.'
    $q.notify({
      icon: 'error',
      message,
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSchools()
})
</script>

<style lang="scss" scoped>
.message-create-page {
  width: 100%;
  margin: 0 auto;
}
</style>
