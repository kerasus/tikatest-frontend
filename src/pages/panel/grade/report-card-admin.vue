<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">کارنامه دانش آموز</h4>
      </div>
    </div>

    <q-card class="q-mb-md">
      <!--      <q-card-section>-->
      <!--        <div class="row q-col-gutter-md">-->
      <!--          <div class="col-12 col-md-4">-->
      <!--            <q-select-->
      <!--              v-model="selectedStudent"-->
      <!--              :options="studentOptions"-->
      <!--              option-value="id"-->
      <!--              option-label="full_name"-->
      <!--              label="دانش آموز"-->
      <!--              outlined-->
      <!--              dense-->
      <!--              clearable-->
      <!--              emit-value-->
      <!--              map-options />-->
      <!--          </div>-->
      <!--          <div class="col-12 col-md-4">-->
      <!--            <q-btn-->
      <!--              color="primary"-->
      <!--              label="مشاهده کارنامه"-->
      <!--              :loading="loading"-->
      <!--              class="full-height"-->
      <!--              @click="loadReportCard" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </q-card-section>-->
    </q-card>

    <!--    <q-card v-if="reportCard.length > 0">-->
    <!--      <q-card-section>-->
    <!--        <q-table-->
    <!--          :rows="reportCard"-->
    <!--          :columns="columns"-->
    <!--          row-key="id"-->
    <!--          flat>-->
    <!--          <template #body-cell-lesson="props">-->
    <!--            <q-td :props="props">-->
    <!--              {{ props.row.exam?.lesson?.name || '-' }}-->
    <!--            </q-td>-->
    <!--          </template>-->
    <!--        </q-table>-->
    <!--      </q-card-section>-->
    <!--    </q-card>-->

    <div class="text-center q-pa-lg">
      <q-icon
        name="grading"
        size="100px"
        color="grey-5" />
      <p class="text-subtitle1 q-mt-md">کارنامه ای برای این دانش آموز یافت نشد</p>
    </div>

    <div class="text-center q-pa-lg">
      <q-icon
        name="person"
        size="100px"
        color="grey-5" />
      <p class="text-subtitle1 q-mt-md">دانش آموزی را انتخاب کنید تا کارنامه نمایش داده شود</p>
    </div>
  </q-page>
</template>
