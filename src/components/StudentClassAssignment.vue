<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">مدارس و کلاس‌ها</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <template v-if="!readonly">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="newClassId"
              :options="classOptions"
              option-value="id"
              option-label="name"
              label="انتخاب کلاس"
              outlined
              dense
              clearable
              emit-value
              map-options />
          </div>
          <div class="col-12 col-md-6 flex items-end">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن کلاس"
              :disable="!newClassId"
              @click="assignClass" />
          </div>
        </div>
      </template>

      <template v-if="loading">
        <div class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="100px" />
        </div>
      </template>

      <template v-else-if="localRegistrations.length > 0">
        <q-list
          bordered
          separator>
          <q-item
            v-for="reg in localRegistrations"
            :key="reg.id"
            dense>
            <q-item-section>
              <q-item-label>{{ reg.school_class?.name || '-' }}</q-item-label>
              <q-item-label caption>
                <template v-if="reg.school_class?.academic_level">
                  پایه: {{ reg.school_class.academic_level?.name }}
                </template>
                <template v-if="reg.school_class?.academic_level?.academic_field">
                  <span v-if="reg.school_class?.academic_level"> - </span>
                  رشته: {{ reg.school_class.academic_level.academic_field?.name }}
                </template>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmRemoveClass(reg)">
                <q-tooltip>حذف</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <div
        v-else
        class="text-center text-grey">
        {{ readonly ? 'هیچ کلاسی ثبت نشده است.' : 'هنوز کلاسی ثبت نشده است.' }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { userClassRegistration } from 'src/repositories/userClassRegistration'
import SchoolClassAPI from 'src/repositories/schoolClass'
import type { UserClassRegistrationType } from 'src/repositories/userClassRegistration'

const props = defineProps({
  studentId: {
    type: Number,
    required: true
  },
  registrations: {
    type: Array as () => UserClassRegistrationType[],
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: true
  }
})

const schoolClassApi = new SchoolClassAPI()

const $q = useQuasar()

const loading = ref(false)
const classOptions = ref<any[]>([])
const newClassId = ref<number | null>(null)
const localRegistrations = ref<UserClassRegistrationType[]>([])

function loadClasses () {
  try {
    schoolClassApi.index({ length: 100 }).then((result) => {
      classOptions.value = result.data
    })
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const emit = defineEmits(['updated'])

async function assignClass () {
  if (!newClassId.value) return
  try {
    await userClassRegistration.create({
      student_id: props.studentId,
      class_id: newClassId.value
    } as any)
    $q.notify({
      icon: 'check',
      message: 'کلاس با موفقیت اضافه شد.',
      color: 'positive'
    })
    newClassId.value = null
    emit('updated')
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در اضافه کردن کلاس.',
      color: 'negative'
    })
  }
}

function confirmRemoveClass (reg: UserClassRegistrationType) {
  $q.dialog({
    title: 'تایید حذف',
    message: 'آیا از این کلاس حذف شود؟',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await userClassRegistration.delete(reg.id!)
      $q.notify({
        icon: 'check',
        message: 'کلاس با موفقیت حذف شد.',
        color: 'positive'
      })
      emit('updated')
    } catch (error) {
      $q.notify({
        icon: 'error',
        message: 'خطا در حذف کلاس.',
        color: 'negative'
      })
    }
  })
}

function loadRegistrations () {
  localRegistrations.value = props.registrations
}

onMounted(() => {
  loadRegistrations()
  if (!props.readonly) {
    loadClasses()
  }
})
</script>