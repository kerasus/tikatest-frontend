<template>
  <div class="profile-page q-pa-md q-pa-lg-lg">
    <!-- هدر / کاور گرادیان با آواتار شناور -->
    <q-card
      flat
      class="profile-header-card shadow-2">
      <div class="profile-cover">
        <div class="cover-overlay" />
      </div>

      <div class="profile-header-content q-px-lg q-pb-md">
        <!-- آواتار و دکمه تغییر عکس -->
        <div class="avatar-wrapper">
          <q-avatar
            size="110px"
            class="profile-avatar shadow-5">
            <img
              :src="avatarPreview || user?.picture || '/images/blankProfile.png'"
              alt="Avatar">
          </q-avatar>

          <!-- دکمه مخفی آپلود فایل -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            class="hidden"
            @change="onFilePicked">

          <q-btn
            round
            color="primary"
            icon="photo_camera"
            size="sm"
            class="avatar-edit-btn"
            :loading="saving"
            @click="triggerFileInput">
            <q-tooltip
              anchor="top middle"
              self="bottom middle">تغییر تصویر پروفایل</q-tooltip>
          </q-btn>
        </div>

        <!-- نام، نام‌کاربری و نقش‌ها -->
        <div class="user-meta q-mt-sm">
          <div class="row items-center q-gutter-sm">
            <h1 class="user-fullname q-ma-none">
              {{ user?.first_name }} {{ user?.last_name }}
            </h1>
            <span
              v-if="user?.username"
              class="user-username">@{{ user.username }}</span>
          </div>

          <div class="roles-chips q-mt-xs">
            <q-badge
              v-for="(role, idx) in user?.roles"
              :key="idx"
              rounded
              class="role-pill q-mr-xs">
              {{ getUserRoleLabel(role.name || '') }}
            </q-badge>
          </div>
        </div>
      </div>
    </q-card>

    <!-- محتوای فرم -->
    <div class="row q-col-gutter-lg q-mt-md">
      <!-- ستون اطلاعات قابل ویرایش (عکس و شماره موبایل) -->
      <div class="col-12 col-md-5">
        <q-card
          flat
          class="content-card shadow-1">
          <q-card-section class="card-title-row">
            <div class="row items-center q-gutter-sm">
              <q-icon
                name="edit"
                color="primary"
                size="22px" />
              <span class="text-subtitle1 text-weight-bold text-neutral-dark">اطلاعات قابل ویرایش</span>
            </div>
            <span class="text-caption text-grey-7">فقط عکس و شماره موبایل قابل تغییر است</span>
          </q-card-section>

          <q-separator class="q-my-none" />

          <q-card-section class="q-pt-md">
            <!-- شماره موبایل (تنها فیلد اینپوت باز) -->
            <div class="q-mb-md">
              <label class="input-label text-weight-medium text-grey-9 q-mb-xs block">
                شماره تلفن همراه
              </label>
              <q-input
                v-model="mobileInput"
                outlined
                dense
                dir="ltr"
                mask="###########"
                placeholder="0912xxxxxxx"
                class="custom-input"
                :rules="[val => !val || val.length === 11 || 'شماره موبایل باید ۱۱ رقم باشد']">
                <template #prepend>
                  <q-icon
                    name="phone_iphone"
                    color="primary" />
                </template>
              </q-input>
            </div>

            <!-- اطلاعات فایل انتخاب‌شده جدید -->
            <transition name="fade">
              <div
                v-if="selectedFile"
                class="new-photo-notice q-pa-sm q-mb-md row items-center justify-between">
                <div class="row items-center q-gutter-xs">
                  <q-icon
                    name="image"
                    color="secondary"
                    size="18px" />
                  <span
                    class="text-caption text-weight-medium ellipsis"
                    style="max-width: 180px">
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
                  @click="cancelSelectedPhoto" />
              </div>
            </transition>

            <q-btn
              color="primary"
              label="ذخیره تغییرات"
              icon="save"
              unelevated
              class="full-width save-btn q-py-sm q-mt-sm"
              :loading="saving"
              :disable="!hasChanges"
              @click="saveProfile" />
          </q-card-section>
        </q-card>
      </div>

      <!-- ستون اطلاعات هویتی و سیستمی (صرفاً جهت نمایش - Readonly) -->
      <div class="col-12 col-md-7">
        <q-card
          flat
          class="content-card shadow-1">
          <q-card-section class="card-title-row">
            <div class="row items-center q-gutter-sm">
              <q-icon
                name="badge"
                color="secondary"
                size="22px" />
              <span class="text-subtitle1 text-weight-bold text-neutral-dark">اطلاعات هویتی و پرونده</span>
            </div>
            <div class="row items-center text-grey-6 text-caption q-gutter-xs">
              <q-icon
                name="lock"
                size="14px" />
              <span>غیرقابل ویرایش توسط کاربر</span>
            </div>
          </q-card-section>

          <q-separator class="q-my-none" />

          <q-card-section class="q-pt-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="readonly-field">
                  <span class="field-title">نام</span>
                  <div class="field-value">{{ user?.first_name || '-' }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="readonly-field">
                  <span class="field-title">نام خانوادگی</span>
                  <div class="field-value">{{ user?.last_name || '-' }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="readonly-field">
                  <span class="field-title">نام کاربری</span>
                  <div class="field-value dir-ltr text-right">{{ user?.username || '-' }}</div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="readonly-field">
                  <span class="field-title">کد ملی</span>
                  <div class="field-value dir-ltr text-right">{{ user?.national_id || '-' }}</div>
                </div>
              </div>

              <div class="col-12">
                <div class="readonly-field">
                  <span class="field-title">پست الکترونیک (ایمیل)</span>
                  <div class="field-value dir-ltr text-right">{{ user?.email || '-' }}</div>
                </div>
              </div>
            </div>

            <!-- راهنما / نوتیس -->
            <div class="info-alert q-pa-sm q-mt-lg row items-center q-gutter-sm">
              <q-icon
                name="info"
                color="secondary"
                size="20px" />
              <span class="text-caption text-grey-8">
                برای تغییر مشخصات شناسنامه‌ای، کد ملی یا اصلاح نام، لطفاً به مدیر سیستم مدرسه مراجعه فرمایید.
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUser } from 'src/stores/user'
import UserAPI, { type UserType, getUserRoleLabel } from 'src/repositories/user'

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
})

function syncInitialData () {
  if (user.value) {
    mobileInput.value = user.value.mobile || ''
  }
}

// چک کردن اینکه آیا کاربر چیزی رو تغییر داده که دکمه ذخیره فعال بشه؟
const hasChanges = computed(() => {
  const mobileChanged = mobileInput.value !== (user.value?.mobile || '')
  const photoChanged = selectedFile.value !== null
  return mobileChanged || photoChanged
})

// تریگر کردن اینپوت مخفی فایل
function triggerFileInput () {
  fileInputRef.value?.click()
}

// انتخاب فایل و ساخت لایو پریویو
function onFilePicked (event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // اعتبارسنجی سایز (حداکثر ۲ مگابایت)
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

// ذخیره تغییرات
async function saveProfile () {
  if (!user.value?.id) return

  saving.value = true
  try {
    const formData = new FormData()
    // ترفند حیاتی لاراول برای خواندن فایل‌ها در درخواست‌های ویرایش
    formData.append('_method', 'PUT')
    formData.append('mobile', mobileInput.value)

    if (selectedFile.value) {
      formData.append('picture', selectedFile.value)
    }

    // ارسال به آدرس /api/users/{id}
    const response = await userAPI.getAxiosInstanceWithToken().post(
      userAPI.endpoints.byId(user.value.id),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    $q.notify({
      type: 'positive',
      message: 'مشخصات با موفقیت به‌روزرسانی شد.'
    })

    // سینک اطلاعات با استور Pinia تا عکس در هدر هم بلافاصله عوض شود
    if (response.data?.data) {
      userManager.setUser(response.data)
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
  const freshData = await userAPI.me()
  userManager.setUser(freshData)
}
</script>

<style scoped lang="scss">
.profile-page {
  max-width: 1100px;
  margin: 0 auto;
}

/* کارت هدر با کاور گرادیانی */
.profile-header-card {
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);

  .profile-cover {
    height: 120px;
    background: linear-gradient(135deg, $secondary 0%, $primary 100%);
    position: relative;

    .cover-overlay {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px);
      background-size: 14px 14px;
    }
  }

  .profile-header-content {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    position: relative;

    .avatar-wrapper {
      position: relative;
      margin-top: -55px;

      .profile-avatar {
        background: #ffffff;
        img {
          object-fit: cover;
        }
      }

      .avatar-edit-btn {
        position: absolute;
        bottom: 4px;
        right: 4px;
        padding: 0;
        width: 40px !important;
        max-width: 40px !important;
        min-width: 40px !important;
        height: 40px !important;
        border: 2px solid #ffffff;
      }
    }

    .user-meta {
      flex: 1;

      .user-fullname {
        font-size: 1.3rem;
        font-weight: 800;
        color: $neutral-dark;
      }

      .user-username {
        font-size: 0.85rem;
        color: $neutral-40;
        direction: ltr;
      }

      .role-pill {
        background: rgba($secondary, 0.1);
        color: $secondary;
        border: 1px solid rgba($secondary, 0.2);
        font-size: 0.75rem;
        padding: 4px 10px;
      }
    }
  }
}

/* کارت‌های محتوا */
.content-card {
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);

  .card-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
  }
}

/* استایل فیلدهای فقط‌خواندنی */
.readonly-field {
  background: $neutral-99;
  border: 1px dashed $neutral-80;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .field-title {
    font-size: 0.75rem;
    color: $neutral-40;
    font-weight: 500;
  }

  .field-value {
    font-size: 0.92rem;
    color: $neutral-dark;
    font-weight: 600;
  }
}

.save-btn {
  border-radius: 12px;
  font-weight: 700;
}

.new-photo-notice {
  background: rgba($secondary, 0.08);
  border: 1px solid rgba($secondary, 0.2);
  border-radius: 10px;
}

.info-alert {
  background: rgba($primary, 0.07);
  border: 1px solid rgba($primary, 0.18);
  border-radius: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
