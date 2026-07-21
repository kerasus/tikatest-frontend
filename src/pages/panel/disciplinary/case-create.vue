<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">تعریف مورد انضباطی</h4>
      </div>
    </div>

    <q-card style="max-width: 700px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.name"
                label="نام مورد انضباطی *"
                outlined
                :rules="[val => !!val || 'نام مورد انضباطی الزامی است']" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.description"
                label="توضیحات"
                outlined
                type="textarea" />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت مورد"
              :loading="saving"
              class="q-ml-sm" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.DisciplinaryCase.List' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { disciplinaryCase } from 'src/repositories/disciplinaryCase'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)

const form = reactive({
  name: '',
  description: ''
})

const onSubmit = async () => {
  saving.value = true
  try {
    await disciplinaryCase.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'مورد انضباطی با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.DisciplinaryCase.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت مورد.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
</style>