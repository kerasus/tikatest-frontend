<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">ارسال پیام</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-form @submit.prevent="onSubmit">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="form.receiver_id"
                    label="گیرنده *"
                    outlined
                    required
                    type="number" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.subject" label="موضوع" outlined />
                </div>
                <div class="col-12">
                  <q-input v-model="form.body" label="متن پیام *" outlined type="textarea" rows="5" required />
                </div>
              </div>

              <div class="q-mt-md">
                <q-btn type="submit" color="primary" label="ارسال پیام" :loading="saving" />
                <q-btn flat label="انصراف" :to="{ name: 'Student.Message.List' }" class="q-ml-sm" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { message } from 'src/repositories/message'

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  receiver_id: null,
  subject: '',
  body: ''
})

const saving = ref(false)

async function onSubmit () {
  saving.value = true
  try {
    await message.sendToStudent(form)
    $q.notify({
      icon: 'check',
      message: 'پیام با موفقیت ارسال شد.',
      color: 'positive'
    })
    router.push({ name: 'Student.Message.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ارسال پیام.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>
