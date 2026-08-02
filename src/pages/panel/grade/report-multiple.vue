<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">گزارش نمرات چند درس</h4>
      </div>
    </div>

    <!--    <q-card class="q-mb-md">-->
    <!--      <q-card-section>-->
    <!--        <div class="row q-col-gutter-md">-->
    <!--          <div class="col-12 col-md-6">-->
    <!--            <q-select-->
    <!--              v-model="selectedLessons"-->
    <!--              :options="lessonOptions"-->
    <!--              option-value="id"-->
    <!--              option-label="name"-->
    <!--              label="دروس"-->
    <!--              outlined-->
    <!--              dense-->
    <!--              multiple-->
    <!--              emit-value-->
    <!--              map-options-->
    <!--              use-chips />-->
    <!--          </div>-->
    <!--          <div class="col-12 col-md-4">-->
    <!--            <q-btn-->
    <!--              color="primary"-->
    <!--              label="مشاهده گزارش"-->
    <!--              :loading="loading"-->
    <!--              class="full-height"-->
    <!--              @click="loadReport" />-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </q-card-section>-->
    <!--    </q-card>-->

    <!--    <div v-if="reports.length > 0">-->
    <!--      <div-->
    <!--        v-for="(report, index) in reports"-->
    <!--        :key="report.lesson_id.toString() + index.toString()"-->
    <!--        class="q-mb-md">-->
    <!--        <q-card>-->
    <!--          <q-card-section>-->
    <!--            <div class="text-h6 q-mb-md">{{ report.lesson_name }}</div>-->

    <!--            <div class="row q-col-gutter-md q-mb-md text-center">-->
    <!--              <div class="col-6 col-md-2">-->
    <!--                <q-chip-->
    <!--                  color="primary"-->
    <!--                  text-color="white"-->
    <!--                  class="full-width">-->
    <!--                  <div class="column">-->
    <!--                    <span class="text-h6">{{ report.stats?.count }}</span>-->
    <!--                    <span class="text-caption">تعداد نمره</span>-->
    <!--                  </div>-->
    <!--                </q-chip>-->
    <!--              </div>-->
    <!--              <div class="col-6 col-md-2">-->
    <!--                <q-chip-->
    <!--                  color="green"-->
    <!--                  text-color="white"-->
    <!--                  class="full-width">-->
    <!--                  <div class="column">-->
    <!--                    <span class="text-h6">{{ report.stats?.average }}</span>-->
    <!--                    <span class="text-caption">میانگین</span>-->
    <!--                  </div>-->
    <!--                </q-chip>-->
    <!--              </div>-->
    <!--              <div class="col-6 col-md-2">-->
    <!--                <q-chip-->
    <!--                  color="blue"-->
    <!--                  text-color="white"-->
    <!--                  class="full-width">-->
    <!--                  <div class="column">-->
    <!--                    <span class="text-h6">{{ report.stats?.highest }}</span>-->
    <!--                    <span class="text-caption">بالاترین</span>-->
    <!--                  </div>-->
    <!--                </q-chip>-->
    <!--              </div>-->
    <!--              <div class="col-6 col-md-2">-->
    <!--                <q-chip-->
    <!--                  color="orange"-->
    <!--                  text-color="white"-->
    <!--                  class="full-width">-->
    <!--                  <div class="column">-->
    <!--                    <span class="text-h6">{{ report.stats?.lowest }}</span>-->
    <!--                    <span class="text-caption">پایین ترین</span>-->
    <!--                  </div>-->
    <!--                </q-chip>-->
    <!--              </div>-->
    <!--              <div class="col-6 col-md-2">-->
    <!--                <q-chip-->
    <!--                  color="purple"-->
    <!--                  text-color="white"-->
    <!--                  class="full-width">-->
    <!--                  <div class="column">-->
    <!--                    <span class="text-h6">{{ report.stats?.pass_rate }}%</span>-->
    <!--                    <span class="text-caption">درصد قبولی</span>-->
    <!--                  </div>-->
    <!--                </q-chip>-->
    <!--              </div>-->
    <!--            </div>-->

    <!--            <q-table-->
    <!--              :rows="report.results"-->
    <!--              :columns="columns"-->
    <!--              row-key="id"-->
    <!--              flat>-->
    <!--              <template #body-cell-student="props">-->
    <!--                <q-td :props="props">-->
    <!--                  {{ props.row.student?.full_name || '-' }}-->
    <!--                </q-td>-->
    <!--              </template>-->
    <!--            </q-table>-->
    <!--          </q-card-section>-->
    <!--        </q-card>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div-->
    <!--      v-if="!reports.length && !loading"-->
    <!--      class="text-center q-pa-lg">-->
    <!--      <q-icon-->
    <!--        name="grading"-->
    <!--        size="100px"-->
    <!--        color="grey-5" />-->
    <!--      <p class="text-subtitle1 q-mt-md">درسی را انتخاب کنید تا گزارش نمایش داده شود</p>-->
    <!--    </div>-->
  </q-page>
</template>
