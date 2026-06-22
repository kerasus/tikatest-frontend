<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">تقویم اجرایی</h4>

    <q-card>
      <q-card-section>
        <div class="text-center q-pa-lg">
          <q-icon name="calendar_today" size="100px" color="primary" />
          <p class="text-subtitle1 q-mt-md">تقویم اجرایی</p>
          <p class="text-body2 text-grey">این بخش در حال توسعه است</p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
