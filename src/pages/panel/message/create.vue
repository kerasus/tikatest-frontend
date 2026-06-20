<template>
  <div class="message-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ارسال پیام جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.receiver_id"
                :options="userOptions"
                option-value="id"
                option-label="full_name"
                label="گیرنده *"
                outlined
                emit-value
                map-options
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.subject" label="موضوع" outlined />
            </div>
            <div class="col-12">
              <q-input v-model="form.body" label="متن پیام *" outlined type="textarea" rows="5" required />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn type="submit" color="primary" label="ارسال پیام" :loading="saving" />
            <q-btn flat label="انصراف" :to="{ name: 'Panel.Message.List' }" class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MessageAPI from 'src/repositories/message'
import UserAPI from 'src/repositories/user'

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  receiver_id: null,
  subject: '',
  body: ''
})

const userOptions = ref<any[]>([])
const saving = ref(false)

async function loadUsers () {
  const result = await UserAPI.prototype.index({ length: 100 })
  userOptions.value = result.data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name || `${item.firstname} ${item.lastname}`,
    ...item
  }))
}

async function onSubmit () {
  saving.value = true
  try {
    await MessageAPI.prototype.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'پیام با موفقیت ارسال شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Message.List' })
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

onMounted(() => {
  loadUsers()
})
</script>

<style lang="scss" scoped>
.message-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
