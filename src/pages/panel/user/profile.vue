<template>
  <div class="profile-page q-pa-md q-pa-lg-lg">
    <!-- پس‌زمینه تزئینی امبینت نوری -->
    <div class="ambient-glow glow-top-right" />
    <div class="ambient-glow glow-bottom-left" />

    <!-- هدر کریستالی فانتزی با کاور آرورا و آواتار شناور -->
    <div class="glass-card profile-header-card q-mb-lg">
      <div class="aurora-cover">
        <div class="cover-mesh" />
        <div class="sparkle sparkle-1" />
        <div class="sparkle sparkle-2" />
      </div>

      <div class="profile-header-content q-px-lg q-pb-md">
        <!-- آواتار با حلقه درخشان فانتزی -->
        <div class="avatar-container">
          <div class="avatar-ring">
            <q-avatar
              size="108px"
              class="profile-avatar">
              <img
                :src="avatarPreview || user?.picture || '/images/blankProfile.png'"
                alt="Avatar">
            </q-avatar>
          </div>

          <!-- دکمه مخفی آپلود فایل -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            class="hidden"
            @change="onFilePicked">

          <q-btn
            round
            dense
            icon="photo_camera"
            class="avatar-camera-btn"
            :loading="saving"
            @click="triggerFileInput">
            <q-tooltip
              anchor="top middle"
              self="bottom middle">
              تغییر عکس پروفایل
            </q-tooltip>
          </q-btn>
        </div>

        <!-- متادیتا و بج‌های شیشه‌ای کاربر -->
        <div class="user-meta">
          <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
            <h1 class="user-fullname q-ma-none">
              {{ user?.first_name }} {{ user?.last_name }}
            </h1>
            <span
              v-if="user?.username"
              class="user-tag">
              @{{ user.username }}
            </span>
          </div>

          <div class="roles-chips q-mt-xs row items-center q-gutter-xs">
            <span
              v-for="(role, idx) in user?.roles"
              :key="idx"
              class="glass-badge role-badge">
              <q-icon
                name="stars"
                size="14px"
                class="q-mr-xs text-primary" />
              {{ getUserRoleLabel(role.name || '') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- گرید اصلی فرم (استایل ویوید و شیشه‌ای) -->
    <div class="row q-col-gutter-lg">
      <!-- ستون اطلاعات قابل ویرایش (اکشن‌ها) -->
      <div class="col-12 col-md-5">
        <div class="glass-card action-card">
          <div class="card-header q-pa-md">
            <div class="header-icon-box bg-primary-gradient">
              <q-icon
                name="edit_note"
                size="22px"
                color="white" />
            </div>
            <div>
              <div class="text-subtitle1 text-weight-bolder text-dark">
                تنظیمات شخصی
              </div>
              <div class="text-caption text-grey-7">
                ویرایش شماره موبایل و تصویر نمایه
              </div>
            </div>
          </div>

          <div class="glass-divider" />

          <div class="card-body q-pa-md">
            <!-- فیلد شماره موبایل -->
            <div class="q-mb-md">
              <label class="custom-label">
                <q-icon
                  name="smartphone"
                  size="16px"
                  class="q-mr-xs text-primary" />
                شماره تلفن همراه
              </label>
              <q-input
                v-model="mobileInput"
                outlined
                dense
                dir="ltr"
                mask="###########"
                placeholder="0912xxxxxxx"
                class="glass-input"
                :rules="[val => !val || val.length === 11 || 'شماره موبایل باید ۱۱ رقم باشد']">
                <template #prepend>
                  <q-icon
                    name="call"
                    color="primary"
                    size="20px" />
                </template>
              </q-input>
            </div>

            <!-- وضعیت انتخاب تصویر تازه -->
            <transition name="pop">
              <div
                v-if="selectedFile"
                class="new-photo-pill q-pa-sm q-mb-md">
                <div class="row items-center q-gutter-xs ellipsis">
                  <q-icon
                    name="image"
                    color="primary"
                    size="20px" />
                  <span
                    class="text-caption text-weight-bold ellipsis"
                    style="max-width: 170px">
                    {{ selectedFile.name }}
                  </span>
                </div>
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  size="xs"
                  color="negative"
                  class="glass-icon-btn"
                  @click="cancelSelectedPhoto" />
              </div>
            </transition>

            <!-- دکمه شیشه‌ای-نئونی ذخیره -->
            <q-btn
              class="vivid-save-btn full-width q-py-sm q-mt-sm"
              icon="check_circle"
              label="بروزرسانی مشخصات"
              :loading="saving"
              :disable="!hasChanges"
              @click="saveProfile" />
          </div>
        </div>
      </div>

      <!-- ستون اطلاعات هویتی و پرونده (Readonly کریستالی) -->
      <div class="col-12 col-md-7">
        <div class="glass-card readonly-card">
          <div class="card-header q-pa-md justify-between">
            <div class="row items-center q-gutter-sm">
              <div class="header-icon-box bg-secondary-gradient">
                <q-icon
                  name="verified_user"
                  size="20px"
                  color="white" />
              </div>
              <div>
                <div class="text-subtitle1 text-weight-bolder text-dark">
                  پرونده هویتی
                </div>
                <div class="text-caption text-grey-7">
                  اطلاعات رسمی و تایید شده سامانه
                </div>
              </div>
            </div>

            <span class="glass-badge lock-badge">
              <q-icon
                name="lock"
                size="13px"
                class="q-mr-xs text-grey-7" />
              قفل سیستمی
            </span>
          </div>

          <div class="glass-divider" />

          <div class="card-body q-pa-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <div class="crystal-field">
                  <div class="field-label-group">
                    <q-icon
                      name="person"
                      size="15px"
                      class="field-icon" />
                    <span>نام</span>
                  </div>
                  <div class="field-val">{{ user?.first_name || '—' }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="crystal-field">
                  <div class="field-label-group">
                    <q-icon
                      name="family_restroom"
                      size="15px"
                      class="field-icon" />
                    <span>نام خانوادگی</span>
                  </div>
                  <div class="field-val">{{ user?.last_name || '—' }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="crystal-field">
                  <div class="field-label-group">
                    <q-icon
                      name="alternate_email"
                      size="15px"
                      class="field-icon" />
                    <span>نام کاربری</span>
                  </div>
                  <div class="field-val dir-ltr">{{ user?.username || '—' }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="crystal-field">
                  <div class="field-label-group">
                    <q-icon
                      name="badge"
                      size="15px"
                      class="field-icon" />
                    <span>کد ملی</span>
                  </div>
                  <div class="field-val dir-ltr">{{ user?.national_id || '—' }}</div>
                </div>
              </div>

              <div class="col-12">
                <div class="crystal-field">
                  <div class="field-label-group">
                    <q-icon
                      name="mail"
                      size="15px"
                      class="field-icon" />
                    <span>نشانی الکترونیکی</span>
                  </div>
                  <div class="field-val dir-ltr">{{ user?.email || '—' }}</div>
                </div>
              </div>
            </div>

            <!-- جعبه هشدار شیشه‌ای طلایی -->
            <div class="fantasy-notice q-pa-sm q-mt-md">
              <div class="notice-icon-box">
                <q-icon
                  name="auto_awesome"
                  size="18px"
                  class="text-amber-8" />
              </div>
              <div class="text-caption text-grey-9 lh-15">
                برای ویرایش نام، نام‌خانوادگی یا کد ملی با مدیر سیستم تماس بگیرید.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <bale-connection-card />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUser } from 'src/stores/user'
import UserAPI, { type UserType, getUserRoleLabel } from 'src/repositories/user'
import BaleConnectionCard from 'src/components/bale/BaleConnectionCard.vue'

const $q = useQuasar()
const userManager = useUser()
const userAPI = new UserAPI()

const fileInputRef = ref<HTMLInputElement | null>(null)
const saving = ref(false)

// وضعیت فرم
const mobileInput = ref('')
const selectedFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

// اطلاعات یوزر فعلی
const user = computed<UserType | null>(() => userManager.me)

onMounted(() => {
  syncInitialData()
  refreshProfile()
})

function syncInitialData () {
  if (user.value) {
    mobileInput.value = user.value.mobile || ''
  }
}

const hasChanges = computed(() => {
  const mobileChanged = mobileInput.value !== (user.value?.mobile || '')
  const photoChanged = selectedFile.value !== null
  return mobileChanged || photoChanged
})

function triggerFileInput () {
  fileInputRef.value?.click()
}

function onFilePicked (event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    $q.notify({
      type: 'negative',
      message: 'حجم تصویر نباید بیشتر از ۲ مگابایت باشد.'
    })
    return
  }

  selectedFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

function cancelSelectedPhoto () {
  selectedFile.value = null
  avatarPreview.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function saveProfile () {
  if (!user.value?.id) return

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('mobile', mobileInput.value)

    if (selectedFile.value) {
      formData.append('picture', selectedFile.value)
    }

    const newUserData = await userAPI.update(user.value.id, formData)

    $q.notify({
      type: 'positive',
      message: 'پروفایل با موفقیت درخشید! ذخیره شد ✨'
    })

    if (newUserData) {
      userManager.setUser(newUserData)
    }

    selectedFile.value = null
  } catch (error: any) {
    const message = error.response?.data?.message || 'خطا در ذخیره‌سازی اطلاعات'
    $q.notify({
      type: 'negative',
      message
    })
  } finally {
    saving.value = false
  }
}

async function refreshProfile () {
  try {
    const freshData = await userAPI.me()
    userManager.setUser(freshData)
  } catch (e) {
    // خطا هندلینگ سایلنت در بک‌گراند
  }
}
</script>

<style scoped lang="scss">
.profile-page {
  position: relative;
}

/* هاله‌های نوری محیطی در پس‌زمینه */
.ambient-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.45;
}

.glow-top-right {
  top: -40px;
  right: -40px;
  background: radial-gradient(circle, rgba($secondary, 0.5) 0%, transparent 70%);
}

.glow-bottom-left {
  bottom: 20px;
  left: -40px;
  background: radial-gradient(circle, rgba($primary, 0.4) 0%, transparent 70%);
}

/* کارت شیشه‌ای اصلی */
.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 36px -12px rgba(32, 56, 117, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

/* هدر کاور آرورا و فانتزی */
.profile-header-card {
  .aurora-cover {
    height: 130px;
    background: linear-gradient(125deg, #4f46e5 0%, #06b6d4 45%, #ec4899 100%);
    position: relative;
    overflow: hidden;

    .cover-mesh {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.35) 0%, transparent 40%),
                  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.25) 0%, transparent 35%);
      mix-blend-mode: overlay;
    }

    .sparkle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      filter: blur(1px);
    }
    .sparkle-1 {
      width: 60px;
      height: 60px;
      top: 15px;
      left: 18%;
    }
    .sparkle-2 {
      width: 90px;
      height: 90px;
      bottom: -30px;
      right: 25%;
    }
  }

  .profile-header-content {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    position: relative;

    .avatar-container {
      position: relative;
      margin-top: -55px;
      flex-shrink: 0;

      .avatar-ring {
        padding: 4px;
        border-radius: 50%;
        background: linear-gradient(135deg, #06b6d4, #ec4899, #6366f1);
        box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);

        .profile-avatar {
          background: #ffffff;
          img {
            object-fit: cover;
          }
        }
      }

      .avatar-camera-btn {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: rgba(255, 255, 255, 0.92) !important;
        color: #4f46e5 !important;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

        &:hover {
          transform: scale(1.12) rotate(6deg);
        }
      }
    }

    .user-meta {
      flex: 1;
      padding-bottom: 4px;

      .user-fullname {
        font-size: 1.35rem;
        font-weight: 850;
        color: #0f172a;
        letter-spacing: -0.3px;
      }

      .user-tag {
        font-size: 0.82rem;
        font-weight: 600;
        color: #64748b;
        direction: ltr;
        background: rgba(0, 0, 0, 0.04);
        padding: 2px 8px;
        border-radius: 8px;
      }
    }
  }
}

/* بج‌های کریستالی */
.glass-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.role-badge {
  color: #334155;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.lock-badge {
  background: rgba(148, 163, 184, 0.12);
  color: #475569;
  border-color: rgba(148, 163, 184, 0.25);
}

/* هدر کارت‌ها */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.22);
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
}

.bg-secondary-gradient {
  background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
}

.glass-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.06), transparent);
}

.custom-label {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
}

/* اینپوت شیشه‌ای */
.glass-input :deep(.q-field__control) {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(203, 213, 225, 0.6);
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: #ffffff;
  }
}
.glass-input :deep(.q-field--focused .q-field__control) {
  border-color: #6366f1 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

/* جعبه تصویر تازه */
.new-photo-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
}

/* دکمه ویوید سیو */
.vivid-save-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%) !important;
  color: #ffffff !important;
  border-radius: 14px;
  font-weight: 750;
  font-size: 0.92rem;
  letter-spacing: -0.2px;
  box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover:not([disabled]) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -4px rgba(99, 102, 241, 0.45);
  }

  &[disabled] {
    opacity: 0.55 !important;
    background: #cbd5e1 !important;
    box-shadow: none !important;
  }
}

/* فیلدهای بلوری فقط خواندنی */
.crystal-field {
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.75);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(99, 102, 241, 0.25);
  }

  .field-label-group {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.73rem;
    font-weight: 600;
    color: #64748b;

    .field-icon {
      color: #94a3b8;
    }
  }

  .field-val {
    font-size: 0.92rem;
    font-weight: 750;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
}

/* باکس هشدار فانتزی */
.fantasy-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  background: rgba(254, 243, 199, 0.4);
  border: 1px solid rgba(245, 158, 11, 0.25);
  backdrop-filter: blur(8px);

  .notice-icon-box {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: rgba(245, 158, 11, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

.lh-15 {
  line-height: 1.5;
}

/* ترنزیشن پاپ */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
