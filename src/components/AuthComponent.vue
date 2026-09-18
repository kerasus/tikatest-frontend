<template>
  <div class="auth-component">
    <q-form @submit.prevent="onClickLoginBtn">
      <div class="auth-component__username">
        <q-input
          ref="usernameInput"
          v-model="username"
          label="نام کاربری"
          @keyup.enter="focusNext('passwordInput')" />
      </div>
      <div class="auth-component__password">
        <q-input
          ref="passwordInput"
          v-model="password"
          label="کلمه عبور"
          :type="passwordVisibility ? 'text' : 'password'"
          @keyup.enter="onClickLoginBtn">
          <template #append>
            <q-btn
              flat
              :icon="passwordVisibility ? 'visibility' : 'visibility_off'"
              @click="onClickPasswordVisibility" />
          </template>
        </q-input>
      </div>
      <div class="auth-component__action-area">
        <q-btn
          label="ورود"
          color="primary"
          :loading="loginLoading"
          @click="onClickLoginBtn" />
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
const userManager = useUser()
const i18nManager = useI18n()
const appConfigManager = useAppConfig()
const currentSchoolManager = useCurrentSchool()

const loginLoading = ref(false)
const username = ref<string | null>(null)
const password = ref<string | null>(null)
const passwordVisibility = ref<boolean>(false)

const usernameInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)

const onClickPasswordVisibility = () => {
  passwordVisibility.value = !passwordVisibility.value
}

function isValidAuthPayload () {
  let state = true
  if (!username.value || !password.value) {
    state = false
  }

  return state
}

function onClickLoginBtn () {
  if (!isValidAuthPayload()) {
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
        classes: 'snack--negative snack--inline-action',
        icon: 'info',
        message: i18nManager.t(error.message),
        timeout: 20000,
        actions: [
          {
            icon: 'close',
            class: 'icon-button',
            handler: () => {
              /* ... */
            }
          }
        ]
      })
    })
    .finally(() => {
      loginLoading.value = false
    })
}

async function redirectAfterLogin () {
  const currentSchoolName = currentSchoolManager.currentSchoolName.value
  let defaultRoute = { name: 'Panel.AdminDashboard', params: { school: currentSchoolName, role: 'student' } }
  if (userManager.isAdmin) {
    defaultRoute = { name: 'Panel.AdminDashboard', params: { school: 'system', role: 'admin' } }
  } else if (
    userManager.isManager
    || userManager.isTeacher
    || userManager.isStaff
  ) {
    const role = userManager.isManager ? 'manager'
      : userManager.isTeacher ? 'teacher' : 'staff'
    defaultRoute = { name: 'Panel.SchoolDashboard', params: { school: currentSchoolName, role } }
  } else if (userManager.isStudent) {
    defaultRoute = { name: 'Student.Dashboard', params: { school: currentSchoolName, role: 'student' } }
  }

  const redirectLocation = appConfigManager.redirectAfterLogin || defaultRoute
  await router.push(redirectLocation)
}

function focusNext (refName: string) {
  const nextInput = refName === 'passwordInput' ? passwordInput.value : null
  if (nextInput) {
    nextInput.focus()
  }
}
</script>

<style scoped lang="scss">
.auth-component {
  .auth-component__username {
    margin-bottom: $space-8;
  }
  .auth-component__password {
    margin-bottom: $space-10;
  }
  .auth-component__action-area {
    .q-btn {
      width: 100%;
    }
  }
}
</style>
