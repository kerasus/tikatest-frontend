<template>
  <div class="auth-component">
    <q-form
      class="q-gutter-y-lg"
      @submit.prevent="onClickLoginBtn">

      <!-- محفظه شیشه‌ای برای اینپوت‌ها -->
      <div class="glass-form-container">

        <!-- فیلد نام کاربری -->
        <div class="auth-component__username">
          <label class="custom-label">نام کاربری</label>
          <q-input
            ref="usernameInput"
            v-model="username"
            outlined
            dense
            placeholder="نام کاربری خود را وارد کنید"
            class="ultra-glass-input"
            @keyup.enter="focusNext('passwordInput')">
            <template #prepend>
              <q-icon
                name="account_circle"
                size="22px"
                class="glass-icon" />
            </template>
          </q-input>
        </div>

        <!-- فیلد کلمه عبور -->
        <div class="auth-component__password q-mt-md">
          <label class="custom-label">کلمه عبور</label>
          <q-input
            ref="passwordInput"
            v-model="password"
            :type="passwordVisibility ? 'text' : 'password'"
            outlined
            dense
            autocomplete
            placeholder="********"
            class="ultra-glass-input"
            @keyup.enter="onClickLoginBtn">
            <template #prepend>
              <q-icon
                name="vpn_key"
                size="22px"
                class="glass-icon" />
            </template>
            <template #append>
              <q-btn
                flat
                dense
                round
                :icon="passwordVisibility ? 'visibility' : 'visibility_off'"
                class="glass-visibility-btn"
                @click="onClickPasswordVisibility" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- دکمه ورود کریستالی -->
      <div class="auth-component__action-area">
        <q-btn
          label="ورود"
          type="submit"
          unelevated
          :loading="loginLoading"
          class="crystal-login-btn full-width">
          <template v-slot:loading>
            <q-spinner-ios />
          </template>
        </q-btn>
      </div>

    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useAppConfig } from 'src/stores/appConfig'
import { axiosInstanceManager } from 'src/boot/axios'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

const $q = useQuasar()
const router = useRouter()
const i18nManager = useI18n()
const userStoreManager = useUser()
const appConfigManager = useAppConfig()
const currentSchoolManager = useCurrentSchool()

const loginLoading = ref(false)
const username = ref<string | null>(null)
const password = ref<string | null>(null)
const passwordVisibility = ref<boolean>(false)

const usernameInput = ref<any>(null)
const passwordInput = ref<any>(null)

const onClickPasswordVisibility = () => {
  passwordVisibility.value = !passwordVisibility.value
}

function isValidAuthPayload () {
  return !!(username.value && password.value)
}

function onClickLoginBtn () {
  if (!isValidAuthPayload()) {
    $q.notify({ color: 'warning', message: 'اطلاعات را کامل کنید', position: 'top' })
    return
  }
  loginLoading.value = true
  axiosInstanceManager.setCredentials(username.value ?? '', password.value ?? '', '111111')
  axiosInstanceManager
    .obtainMainToken()
    .then(async () => {
      await redirectAfterLogin()
    })
    .catch((error) => {
      $q.notify({
        message: i18nManager.t(error.message || 'خطا در ورود'),
        color: 'negative',
        icon: 'report_problem'
      })
    })
    .finally(() => {
      loginLoading.value = false
    })
}

async function redirectAfterLogin () {
  let routeName = 'Panel.Dashboard'
  let routeParamSchool = currentSchoolManager.currentSchoolSlug.value
  let routeParamRole = userStoreManager.mainRoleForPath

  const redirectLocation = appConfigManager.redirectAfterLogin
    || { name: routeName, params: { school: routeParamSchool, role: routeParamRole } }

  await router.push(redirectLocation)
}

function focusNext (refName: string) {
  if (refName === 'passwordInput' && passwordInput.value) {
    passwordInput.value.focus()
  }
}
</script>

<style scoped lang="scss">
.auth-component {
  max-width: 360px;
  margin: 0 auto;

  .custom-label {
    display: block;
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 6px;
    margin-right: 4px;
    font-weight: 500;
  }

  /* استایل اینپوت شیشه‌ای غلیظ */
  .ultra-glass-input {
    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.3) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 14px !important;
      border: 1.5px solid rgba(124, 58, 237, 0.3);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4),
                  0 8px 20px rgba(0, 0, 0, 0.03);
      transition: all 0.4s ease;

      &:before { border: none !important; }
      &:after { border: none !important; }

      &:hover {
        background: rgba(255, 255, 255, 0.45) !important;
        border-color: rgba(124, 58, 237, 0.6);
        border-width: 1.8px;
      }
    }

    :deep(.q-field__control--focused) {
      background: rgba(255, 255, 255, 0.6) !important;
      border-color: #7c3aed !important;
      box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1),
                  0 12px 24px rgba(124, 58, 237, 0.05) !important;
    }

    .glass-icon {
      color: #7c3aed;
      opacity: 0.7;
    }

    :deep(.q-field__native) {
      color: #1e293b;
      font-weight: 500;
    }
  }

  /* دکمه ورود کریستالی و درخشان */
  .crystal-login-btn {
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 1.05rem;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.6);
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(0) scale(0.98);
    }
  }

  .glass-visibility-btn {
    color: #94a3b8;
    &:hover { color: #7c3aed; }
  }
}
</style>
