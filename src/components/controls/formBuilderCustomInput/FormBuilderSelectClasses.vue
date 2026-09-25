<template>
  <div class="row q-col-gutter-md">
    <div
      v-if="!schoolId"
      class="col-xs-12">
      <form-builder-select-school
        v-model="localSchoolId"
        label="مدرسه"
        name="school_id"
        clearable />
    </div>
    <div class="col-md-4 col-xs-12">
      <form-builder-select-academic-field
        v-model="fieldId"
        label="رشته تحصیلی"
        name="field_id"
        clearable
        :schoolId="schoolId"
        :disable="!schoolId" />
    </div>
    <div class="col-md-4 col-xs-12">
      <form-builder-select-academic-level
        v-model="levelId"
        label="پایه"
        name="level_id"
        clearable
        :schoolId="schoolId"
        :fieldId="fieldId"
        :disable="!schoolId || !fieldId" />
    </div>
    <div class="col-md-4 col-xs-12">
      <form-builder-select-school-class
        v-model="selectedClass"
        label="کلاس"
        name="class_id"
        clearable
        :emit-value="false"
        :map-options="false"
        :schoolId="schoolId"
        :fieldId="fieldId"
        :levelId="levelId"
        :disable="!schoolId || !fieldId || !levelId" />
    </div>
    <div class="col-12">
      <q-btn
        color="primary"
        icon="add"
        label="افزودن"
        :disable="!selectedClass?.id || isInList(selectedClass?.id)"
        @click="addClass" />
    </div>
    <div class="col-12">
      <q-list
        bordered
        separator>
        <q-item
          v-for="item in selectedClasses"
          :key="item.id">
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption>
              {{ item.academic_level?.academic_field?.name }} - {{ item.academic_level?.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              color="negative"
              icon="delete"
              size="sm"
              @click="removeClass(item.id)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import FormBuilderSelectSchool from './FormBuilderSelectSchool.vue'
import FormBuilderSelectAcademicField from './FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from './FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectSchoolClass from './FormBuilderSelectSchoolClass.vue'
import SchoolClassAPI from 'src/repositories/schoolClass'
import type { SchoolClassType } from 'src/repositories/schoolClass'

defineOptions({
  name: 'FormBuilderSelectClasses'
})

const props = defineProps({
  value: {
    default: () => [],
    type: Array as () => number[]
  },
  schoolId: {
    default: null,
    type: Number
  }
})

const emits = defineEmits(['update:value'])

const localSchoolId = ref<number | null>(null)
const fieldId = ref<number | null>(null)
const levelId = ref<number | null>(null)
const selectedClass = ref<SchoolClassType | null>(null)

const selectedClasses = ref<SchoolClassType[]>([])

const schoolClassAPI = new SchoolClassAPI()

watch(localSchoolId, () => {
  fieldId.value = null
  levelId.value = null
  selectedClass.value = null
})

watch(fieldId, () => {
  levelId.value = null
  selectedClass.value = null
})

watch(levelId, () => {
  selectedClass.value = null
})

async function fetchClassData (id: number): Promise<SchoolClassType | null> {
  try {
    return await schoolClassAPI.get(id)
  } catch {
    return null
  }
}

async function addClass () {
  if (!selectedClass.value) return
  if (isInList(selectedClass.value?.id)) return

  selectedClasses.value.push(selectedClass.value)

  emits(
    'update:value',
    selectedClasses.value.map((c) => c.id)
  )

  selectedClass.value = null
}

function isInList (classId: number | null): boolean {
  if (!classId) return false
  return selectedClasses.value.some((c) => c.id === classId)
}

function removeClass (classId: number) {
  selectedClasses.value = selectedClasses.value.filter((c) => c.id !== classId)
  emits(
    'update:value',
    selectedClasses.value.map((c) => c.id)
  )
}

onMounted(() => {
  localSchoolId.value = props.schoolId
})
</script>
