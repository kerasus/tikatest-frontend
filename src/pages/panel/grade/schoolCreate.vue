<template>
  <div class="grade-school-create-page">
    <q-card>
      <q-card-section>
        <!--        <div class="row items-center q-col-gutter-md">-->
        <!--          <div class="col">-->
        <!--            <div class="text-h6">ثبت نمره برای مدرسه</div>-->
        <!--            <div class="text-caption text-grey">-->
        <!--              {{ school?.name || 'در حال بارگذاری...' }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="col-auto">-->
        <!--            <q-btn-->
        <!--              color="primary"-->
        <!--              icon="refresh"-->
        <!--              label="بروزرسانی"-->
        <!--              :loading="loading"-->
        <!--              @click="resetForm" />-->
        <!--          </div>-->
        <!--        </div>-->
      </q-card-section>

      <q-separator />

      <!--      <q-card-section>-->
      <!--        <q-form @submit.prevent="onSubmit">-->
      <!--          <div class="row q-col-gutter-md">-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-select-->
      <!--                v-model="form.lesson_id"-->
      <!--                :options="lessonOptions"-->
      <!--                option-value="id"-->
      <!--                option-label="name"-->
      <!--                label="درس *"-->
      <!--                outlined-->
      <!--                emit-value-->
      <!--                map-options-->
      <!--                clearable-->
      <!--                :rules="[v => !!v || 'درس الزامی است']"-->
      <!--                @update:model-value="onLessonChange" />-->
      <!--            </div>-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-select-->
      <!--                v-model="form.class_id"-->
      <!--                :options="classOptions"-->
      <!--                option-value="id"-->
      <!--                option-label="name"-->
      <!--                label="کلاس *"-->
      <!--                outlined-->
      <!--                emit-value-->
      <!--                map-options-->
      <!--                clearable-->
      <!--                :rules="[v => !!v || 'کلاس الزامی است']"-->
      <!--                @update:model-value="onClassChange" />-->
      <!--            </div>-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-input-->
      <!--                v-model="form.exam_date"-->
      <!--                label="تاریخ آزمون *"-->
      <!--                outlined-->
      <!--                type="date"-->
      <!--                :rules="[v => !!v || 'تاریخ آزمون الزامی است']" />-->
      <!--            </div>-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-select-->
      <!--                v-model="form.grade_type"-->
      <!--                :options="gradeTypeOptions"-->
      <!--                option-value="value"-->
      <!--                option-label="label"-->
      <!--                label="نوع نمره *"-->
      <!--                outlined-->
      <!--                emit-value-->
      <!--                map-options-->
      <!--                clearable-->
      <!--                :rules="[v => !!v || 'نوع نمره الزامی است']"-->
      <!--                @update:model-value="onGradeTypeChange" />-->
      <!--            </div>-->
      <!--            <div-->
      <!--              v-if="form.grade_type === 'other'"-->
      <!--              class="col-12 col-md-6">-->
      <!--              <q-input-->
      <!--                v-model="form.grade_name_for_other_type"-->
      <!--                label="نام نوع نمره (برای سایر)"-->
      <!--                outlined-->
      <!--                :rules="[v => !!v || 'نام نوع نمره الزامی است']" />-->
      <!--            </div>-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-toggle-->
      <!--                v-model="form.is_descriptive"-->
      <!--                label="نمره تشریحی"-->
      <!--                color="primary" />-->
      <!--            </div>-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-input-->
      <!--                v-model="form.max_score"-->
      <!--                label="حداکثر نمره ممکن"-->
      <!--                outlined-->
      <!--                type="number"-->
      <!--                step="0.01"-->
      <!--                :rules="[v => v > 0 || 'حداکثر نمره باید بزرگتر از 0 باشد']"-->
      <!--                @update:model-value="onMaxPossibleGradeChange" />-->
      <!--            </div>-->
      <!--            <div class="col-12 col-md-6">-->
      <!--              <q-input-->
      <!--                v-model="form.min_passing_score"-->
      <!--                label="حداقل نمره قبولی"-->
      <!--                outlined-->
      <!--                type="number"-->
      <!--                step="0.01" />-->
      <!--            </div>-->
      <!--          </div>-->

      <!--          <div-->
      <!--            v-if="students.length > 0"-->
      <!--            class="q-mt-lg">-->
      <!--            <div class="text-h6 q-mb-md">لیست دانش‌آموزان و نمرات</div>-->
      <!--            <q-table-->
      <!--              :rows="students"-->
      <!--              :columns="studentColumns"-->
      <!--              row-key="id"-->
      <!--              :pagination="{ rowsPerPage: 50 }">-->
      <!--              <template #body-cell-raw_grade="props">-->
      <!--                <q-td :props="props">-->
      <!--                  <q-input-->
      <!--                    v-model="studentGrades[props.row.id]"-->
      <!--                    label="نمره"-->
      <!--                    outlined-->
      <!--                    dense-->
      <!--                    type="number"-->
      <!--                    step="0.01"-->
      <!--                    min="0"-->
      <!--                    class="q-mb-none"-->
      <!--                    style="max-width: 150px;" />-->
      <!--                </q-td>-->
      <!--              </template>-->
      <!--              <template #body-cell-descriptive_value="props">-->
      <!--                <q-td :props="props">-->
      <!--                  <q-select-->
      <!--                    v-model="studentGrades[props.row.id]"-->
      <!--                    :options="descriptiveOptions"-->
      <!--                    option-value="value"-->
      <!--                    option-label="label"-->
      <!--                    label="ارزش‌گذاری"-->
      <!--                    outlined-->
      <!--                    dense-->
      <!--                    emit-value-->
      <!--                    map-options-->
      <!--                    clearable-->
      <!--                    class="q-mb-none"-->
      <!--                    style="max-width: 200px;" />-->
      <!--                </q-td>-->
      <!--              </template>-->
      <!--            </q-table>-->
      <!--          </div>-->

      <!--          <div class="q-mt-md">-->
      <!--            <q-btn-->
      <!--              type="submit"-->
      <!--              color="primary"-->
      <!--              label="ثبت نمرات"-->
      <!--              :loading="saving"-->
      <!--              :disable="students.length === 0" />-->
      <!--            <q-btn-->
      <!--              flat-->
      <!--              label="انصراف"-->
      <!--              :to="{ name: 'Panel.School.List' }"-->
      <!--              class="q-ml-sm" />-->
      <!--          </div>-->
      <!--        </q-form>-->
      <!--      </q-card-section>-->
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.grade-school-create-page {
  max-width: 100%;
  margin: 0 auto;
}
</style>
