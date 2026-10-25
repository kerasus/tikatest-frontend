<template>
  <div class="my-films-page q-pa-md q-pa-sm-lg">
    <!-- حباب‌های نوری شناور در پس‌زمینه برای عمق‌بخشی به اثر شیشه‌ای -->
    <div class="glass-orb glass-orb--1" />
    <div class="glass-orb glass-orb--2" />
    <div class="glass-orb glass-orb--3" />

    <q-card
      flat
      class="glass-card films-card">
      <!-- هدر شیشه‌ای -->
      <q-card-section class="glass-header row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-sm">
          <div class="row items-center no-wrap q-gutter-md">
            <div class="glass-avatar-box">
              <q-icon
                name="smart_display"
                size="30px"
                class="text-primary-glow" />
            </div>
            <div>
              <div class="text-h6 text-weight-bolder tracking-wide text-gradient">
                فیلم‌های آموزشی من
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                آرشیو ویدئوها به تفکیک دوره، عنوان درس و پایه تحصیلی
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-auto row items-center q-gutter-sm">
          <q-btn
            unelevated
            class="glass-btn glass-btn--primary"
            icon="refresh"
            label="بروزرسانی"
            :loading="loading"
            @click="loadFilms">
            <template #loading>
              <q-spinner-dots size="20px" />
            </template>
          </q-btn>
        </div>
      </q-card-section>

      <q-separator class="glass-separator" />

      <!-- بدنه اصلی -->
      <q-card-section class="q-pa-md q-pa-sm-lg">
        <!-- حالت در حال بارگذاری -->
        <div
          v-if="loading"
          class="loading-container column items-center justify-center q-py-xl q-gutter-md">
          <div class="relative-position">
            <q-spinner-puff
              color="purple-4"
              size="70px" />
            <q-icon
              name="movie_filter"
              size="28px"
              color="primary"
              class="absolute-center" />
          </div>
          <div class="text-body2 text-grey-6 text-weight-medium">
            در حال بارگذاری لیست ویدئوها...
          </div>
        </div>

        <!-- پیام خطا -->
        <div
          v-else-if="errorMessage"
          class="glass-state-box text-center q-pa-xl">
          <div class="icon-ring icon-ring--negative q-mx-auto">
            <q-icon
              name="wifi_off"
              size="36px"
              color="negative" />
          </div>
          <div class="text-subtitle1 text-weight-bold q-mt-md">ارتباط ناموفق بود</div>
          <div class="text-caption text-grey-6 q-mt-xs text-wrap-balance max-w-sm q-mx-auto">
            {{ errorMessage }}
          </div>
          <q-btn
            unelevated
            class="glass-btn q-mt-lg"
            color="primary"
            icon="replay"
            label="تلاش مجدد"
            @click="loadFilms" />
        </div>

        <!-- لیست خالی -->
        <div
          v-else-if="treeNodes.length === 0"
          class="glass-state-box text-center q-pa-xl">
          <div class="icon-ring q-mx-auto">
            <q-icon
              name="video_library"
              size="38px"
              color="grey-5" />
          </div>
          <div class="text-subtitle1 text-weight-bold q-mt-md">هنوز فیلمی بارگذاری نشده است</div>
          <div class="text-caption text-grey-6 q-mt-xs">
            برای کلاس‌های ثبت‌نامی شما فعلاً فایل ویدئویی قرار داده نشده است.
          </div>
        </div>

        <!-- درخت شیشه‌ای مدرن -->
        <q-tree
          v-else
          ref="treeRef"
          v-model:expanded="expandedNodes"
          :nodes="treeNodes"
          node-key="id"
          label-key="label"
          children-key="children"
          class="modern-films-tree">
          <template #default-header="{ node, expanded }">
            <div
              class="tree-row row items-center no-wrap full-width"
              :class="{
                'tree-row--film': node.type === 'file',
                'tree-row--folder': node.type !== 'file',
                'tree-row--expanded': expanded && node.type !== 'file'
              }"
              @click.stop="handleNodeRowClick(node)">

              <!-- آیکون وضعیت یا فولدر -->
              <div
                class="node-icon-wrapper q-mr-sm"
                :class="`icon-bg--${node.color || 'primary'}`">
                <q-icon
                  :name="node.icon"
                  size="20px"
                  :class="`text-${node.color || 'primary'}`" />
              </div>

              <!-- عنوان و مشخصات -->
              <div class="col ellipsis q-py-xs">
                <div
                  class="node-title ellipsis"
                  :class="{
                    'text-weight-bold text-dark': node.type !== 'file',
                    'text-weight-medium text-grey-9': node.type === 'file'
                  }">
                  {{ node.label }}
                </div>
                <div
                  v-if="node.subtitle"
                  class="node-subtitle text-caption text-grey-6 ellipsis">
                  {{ node.subtitle }}
                </div>
              </div>

              <!-- بخش اکشن سمت چپ سطر -->
              <div class="row items-center no-wrap q-ml-sm q-gutter-x-xs">
                <!-- اگر فیلم باشد: دکمه پلی شیشه‌ای -->
                <template v-if="node.type === 'file'">
                  <div class="play-action-pill row items-center no-wrap">
                    <q-icon
                      name="play_arrow"
                      size="18px" />
                    <span class="text-caption text-weight-bold q-ml-xs gt-xs">پخش ویدیو</span>
                  </div>
                </template>

                <!-- اگر پوشه یا شاخه باشد: نشانگر کوچک باز/بسته بودن -->
                <template v-else-if="node.children && node.children.length > 0">
                  <q-icon
                    name="expand_more"
                    size="22px"
                    class="folder-chevron text-grey-5 transition-transform"
                    :class="{ 'rotate-180 text-primary': expanded }" />
                </template>
              </div>
            </div>
          </template>
        </q-tree>
      </q-card-section>
    </q-card>

    <!-- دیالوگ سینمایی پخش فیلم -->
    <q-dialog
      v-model="filmDialog"
      maximized
      transition-show="fade"
      transition-hide="fade"
      @hide="closeFilm">
      <q-card class="cinema-dialog bg-black text-white">
        <q-toolbar class="cinema-toolbar">
          <div class="row items-center no-wrap ellipsis q-gutter-sm">
            <q-avatar
              size="34px"
              color="purple-9"
              text-color="white"
              icon="movie" />
            <div class="text-subtitle1 text-weight-bold ellipsis">
              {{ selectedFilm?.label || 'پخش ویدیو' }}
            </div>
          </div>

          <q-space />

          <div class="row items-center q-gutter-x-sm">
            <!-- دکمه دانلود فیلم -->
            <q-btn
              flat
              round
              dense
              color="grey-4"
              icon="download"
              class="cinema-action-btn"
              aria-label="دانلود ویدیو"
              @click="downloadCurrentFilm">
              <q-tooltip class="bg-grey-9 text-caption">دانلود ویدیو</q-tooltip>
            </q-btn>

            <!-- دکمه بستن -->
            <q-btn
              v-close-popup
              flat
              round
              dense
              color="grey-4"
              icon="close"
              class="cinema-close-btn"
              aria-label="بستن" />
          </div>
        </q-toolbar>


        <div class="cinema-body">
          <video
            v-if="selectedFilm?.file"
            :key="selectedFilm.file.path"
            class="cinema-video"
            :src="resolveFileUrl(selectedFilm.file.url || selectedFilm.file.path)"
            controls
            autoplay
            controlslist="nodownload"
            playsinline>
            مرورگر شما قادر به پخش این فرمت ویدیویی نیست.
          </video>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar, type QTree } from 'quasar'
import { useUser } from 'src/stores/user'
import SchoolClassAPI, {
  type ClassesFilesTreeMap,
  type ClassFilesLeafNode,
  type FtpDirectoryItem,
  type FtpFileItem
} from 'src/repositories/schoolClass'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

type FilmTreeNodeType = 'season' | 'lesson' | 'grade' | 'directory' | 'file'

interface FilmTreeNode {
  id: string
  label: string
  type: FilmTreeNodeType
  icon: string
  color: string
  subtitle?: string
  children?: FilmTreeNode[]
  file?: FtpFileItem
}

const $q = useQuasar()
const userStoreManager = useUser()
const schoolClassAPI = new SchoolClassAPI()
const currentSchoolManager = useCurrentSchool()

const treeRef = ref<QTree | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const treeNodes = ref<FilmTreeNode[]>([])
const expandedNodes = ref<string[]>([])
const filmDialog = ref(false)
const selectedFilm = ref<FilmTreeNode | null>(null)

const currentSchoolId = computed(() => currentSchoolManager.currentSchool.value?.id ?? null)

function normalizePath (path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+$/, '')
}

function isPathInside (path: string, directoryPath: string): boolean {
  const normalizedPath = normalizePath(path)
  const normalizedDirectory = normalizePath(directoryPath)

  return normalizedPath === normalizedDirectory || normalizedPath.startsWith(`${normalizedDirectory}/`)
}

function formatFileSize (size: number): string {
  if (!Number.isFinite(size) || size <= 0) return 'حجم نامشخص'

  const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت']
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / Math.pow(1024, unitIndex)

  return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(value)} ${units[unitIndex]}`
}

function formatTimestamp (timestamp: number): string | null {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null

  const milliseconds = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp
  const date = new Date(milliseconds)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

function getFileSubtitle (file: FtpFileItem): string {
  const details = [formatFileSize(file.size)]
  const formattedDate = formatTimestamp(file.timestamp)
  if (formattedDate) details.push(formattedDate)

  return details.join(' • ')
}

function createDirectoryNode (directory: FtpDirectoryItem, nodePrefix: string): FilmTreeNode {
  return {
    id: `${nodePrefix}:directory:${normalizePath(directory.path)}`,
    label: directory.name,
    type: 'directory',
    icon: 'folder_open',
    color: 'amber-8',
    children: []
  }
}

function createFileNode (file: FtpFileItem, nodePrefix: string): FilmTreeNode {
  return {
    id: `${nodePrefix}:file:${normalizePath(file.path)}`,
    label: file.name,
    type: 'file',
    icon: 'play_circle_filled',
    color: 'deep-purple-6',
    subtitle: getFileSubtitle(file),
    file
  }
}

function buildLeafNodes (leaf: ClassFilesLeafNode, nodePrefix: string): FilmTreeNode[] {
  const rootNodes: FilmTreeNode[] = []
  const directoryNodes = new Map<string, FilmTreeNode>()
  const sortedDirectories = [...(leaf.directories || [])]
    .sort((first, second) => normalizePath(first.path).length - normalizePath(second.path).length)

  sortedDirectories.forEach((directory) => {
    // ... این بخش پوشه‌ها دست نخورده باقی بمونه ...
  })

  // ✅ سورت کاهشی فیلم‌ها (جدیدترین به قدیمی‌ترین):
  const sortedFiles = [...(leaf.files || [])].sort((a, b) => {
    const timeA = Number(a.timestamp) || 0
    const timeB = Number(b.timestamp) || 0

    // اگر تایم‌استمپ متفاوت بود، عدد بزرگتر اول بیاد (کاهشی)
    if (timeB !== timeA) {
      return timeB - timeA
    }

    // در صورت برابری تایم‌استمپ، سورت الفبایی معکوس روی نام فایل
    return b.name.localeCompare(a.name, 'fa')
  })

  // پیمایش فایل‌های مرتب‌شده:
  sortedFiles.forEach((file) => {
    const parentDirectory = sortedDirectories
      .filter((directory) => isPathInside(file.path, directory.path))
      .sort((first, second) => normalizePath(second.path).length - normalizePath(first.path).length)[0]
    const fileNode = createFileNode(file, nodePrefix)

    if (parentDirectory) {
      directoryNodes.get(normalizePath(parentDirectory.path))?.children?.push(fileNode)
    } else {
      rootNodes.push(fileNode)
    }
  })

  return rootNodes
}

function toFaDigits (value: string | number): string {
  return new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(Number(value))
}

function seasonLabelFA (seasonKey: string): string {
  const match = seasonKey.match(/^(\d{4})-(\d{1,2})$/)
  if (!match) return seasonKey

  const year = match[1]
  const month = Number(match[2])

  const seasonMap: Record<number, string> = {
    1: 'بهار',
    4: 'تابستان',
    7: 'پاییز',
    10: 'زمستان'
  }

  const seasonName = seasonMap[month]
  if (!seasonName) return seasonKey

  return `${seasonName} ${toFaDigits(year)}`
}

function buildTreeNodes (tree: ClassesFilesTreeMap): FilmTreeNode[] {
  return Object.entries(tree).map(([season, lessons]) => {
    const seasonId = `season:${season}`

    return {
      id: seasonId,
      label: seasonLabelFA(season),
      type: 'season',
      icon: 'auto_stories',
      color: 'deep-purple-7',
      children: Object.entries(lessons).map(([lesson, grades]) => {
        const lessonId = `${seasonId}:lesson:${lesson}`

        return {
          id: lessonId,
          label: lesson,
          type: 'lesson',
          icon: 'menu_book',
          color: 'teal-8',
          children: Object.entries(grades).map(([grade, leaf]) => {
            const gradeId = `${lessonId}:grade:${grade}`

            return {
              id: gradeId,
              label: `پایه ${grade}`,
              type: 'grade',
              icon: 'school',
              color: 'indigo-7',
              subtitle: `${new Intl.NumberFormat('fa-IR').format(leaf.files?.length || 0)} ویدیو موجود است`,
              children: buildLeafNodes(leaf, gradeId)
            }
          })
        }
      })
    }
  })
}

function getClassIds (): number[] {
  const schoolId = currentSchoolId.value

  return Array.from(new Set(
    (userStoreManager.me?.term_enrollments || [])
      .filter((enrollment) => !schoolId || enrollment.school_id === schoolId)
      .map((enrollment) => enrollment.class_id)
      .filter((classId): classId is number => typeof classId === 'number' && classId > 0)
  ))
}

function getErrorMessage (error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }

  return error instanceof Error ? error.message : 'خطایی در دریافت فیلم‌ها رخ داد.'
}

async function loadFilms () {
  const schoolId = currentSchoolId.value
  const classIds = getClassIds()

  errorMessage.value = ''
  treeNodes.value = []

  if (!schoolId) {
    errorMessage.value = 'مدرسه جاری مشخص نشده است.'
    return
  }

  if (classIds.length === 0) return

  loading.value = true
  try {
    const response = await schoolClassAPI.getClassesFilesTree({
      school_id: schoolId,
      class_ids: classIds
    })

    if (!response.success) {
      throw new Error(response.message || 'امکان دریافت فیلم‌ها وجود ندارد.')
    }

    treeNodes.value = buildTreeNodes(response.tree || {})
    console.log(treeNodes.value)
    // در ابتدا اولین سطح (دوره‌ها) باز باشند
    expandedNodes.value = treeNodes.value.map((node) => node.id)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

/**
 * مدیریت کلیک روی کل ردیف نود:
 * - اگر فایل باشد: پلیر باز می‌شود.
 * - اگر پوشه/شاخه باشد: اکشن Expand/Collapse برای آن نود تاگل می‌شود.
 */
function handleNodeRowClick (node: FilmTreeNode) {
  if (node.type === 'file') {
    openFilm(node)
    return
  }

  const key = node.id

  // راهکار ۱: استفاده از متد مستقیم و استاندارد QTree
  if (treeRef.value) {
    const isCurrentlyExpanded = treeRef.value.isExpanded(key)
    treeRef.value.setExpanded(key, !isCurrentlyExpanded)
    return
  }

  // راهکار پشتیبان (با ایجاد یک آرایه کاملاً جدید جهت تحریک کامل Reactivity در Vue):
  const index = expandedNodes.value.indexOf(key)
  if (index > -1) {
    expandedNodes.value = expandedNodes.value.filter((k) => k !== key)
  } else {
    expandedNodes.value = [...expandedNodes.value, key]
  }
}

function openFilm (node: FilmTreeNode) {
  if (!node.file) return
  selectedFilm.value = node
  filmDialog.value = true
}

function closeFilm () {
  selectedFilm.value = null
}

function resolveFileUrl (path: string): string {
  if (!path) return ''
  if (/^(https?:|blob:|data:)/i.test(path) || path.startsWith('/')) return path
  if (typeof window === 'undefined') return path

  return new URL(path, `${window.location.origin}/`).href
}

function downloadCurrentFilm () {
  if (!selectedFilm.value?.file) return

  const file = selectedFilm.value.file
  const fileUrl = resolveFileUrl(file.url || file.path)
  if (!fileUrl) return

  // ایجاد تگ a موقت برای تریگر دانلود مستقیم با حفظ نام فایل
  const link = document.createElement('a')
  link.href = fileUrl
  link.download = file.name || selectedFilm.value.label || 'video.mp4'
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(loadFilms)
</script>

<style scoped lang="scss">
.my-films-page {
  position: relative;
  min-height: calc(100vh - 110px);
  overflow: hidden;
  background-color: #f7f9fc;
}

/* گوی‌های نوری شیشه‌ای (Ambient Light Orbs) */
.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(85px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.65;
}

.glass-orb--1 {
  width: 380px;
  height: 380px;
  top: -60px;
  right: -50px;
  background: radial-gradient(circle, rgba(124, 77, 255, 0.28) 0%, rgba(124, 77, 255, 0) 70%);
}

.glass-orb--2 {
  width: 440px;
  height: 440px;
  bottom: 5%;
  left: -80px;
  background: radial-gradient(circle, rgba(0, 191, 165, 0.2) 0%, rgba(0, 191, 165, 0) 70%);
}

.glass-orb--3 {
  width: 320px;
  height: 320px;
  top: 45%;
  right: 25%;
  background: radial-gradient(circle, rgba(255, 110, 64, 0.14) 0%, rgba(255, 110, 64, 0) 70%);
}

/* کارت اصلی شیشه‌ای */
.glass-card {
  position: relative;
  z-index: 1;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 16px 40px -12px rgba(90, 75, 130, 0.12),
              0 2px 10px rgba(0, 0, 0, 0.03);
}

.glass-header {
  padding: 22px 28px;
}

.glass-separator {
  background: rgba(0, 0, 0, 0.05);
}

.glass-avatar-box {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(98, 0, 234, 0.06));
  border: 1px solid rgba(124, 77, 255, 0.2);
  box-shadow: 0 8px 16px rgba(124, 77, 255, 0.1);
}

.text-gradient {
  background: linear-gradient(135deg, #372865 0%, #6200ea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* دکمه شیشه‌ای */
.glass-btn {
  border-radius: 14px;
  padding: 8px 18px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-btn--primary {
  background: rgba(103, 58, 183, 0.1);
  color: #5e35b1;
  border: 1px solid rgba(103, 58, 183, 0.22);
}

.glass-btn--primary:hover {
  background: #5e35b1;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(94, 53, 177, 0.3);
  transform: translateY(-1px);
}

/* وضعیت خالی یا خطا */
.glass-state-box {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px dashed rgba(103, 58, 183, 0.22);
}

.icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
}

.icon-ring--negative {
  background: rgba(244, 67, 54, 0.08);
}

/* درخت Quasar سفارشی */
.modern-films-tree {
  font-size: 0.95rem;

  :deep(.q-tree__node-header) {
    padding: 3px 0;
    margin-bottom: 5px;
    border-radius: 16px;
    transition: background 0.2s ease;
  }

  /* پنهان کردن فلش پیش‌فرض Quasar چون کل ردیف کلیک‌پذیر و اکسپند می‌شود */
  :deep(.q-tree__arrow) {
    display: none;
  }

  :deep(.q-tree__node-body) {
    padding-right: 18px;
  }
}

/* ردیف اختصاصی سطر درخت */
.tree-row {
  min-height: 46px;
  padding: 8px 14px;
  border-radius: 14px;
  cursor: pointer;
  user-select: none;
  transition: all 0.22s ease-in-out;
  border: 1px solid transparent;
}

.tree-row--folder {
  background: rgba(255, 255, 255, 0.5);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(103, 58, 183, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transform: translateX(-3px);
  }
}

.tree-row--expanded {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(103, 58, 183, 0.18);
  box-shadow: 0 4px 14px rgba(103, 58, 183, 0.06);
}

.tree-row--film {
  background: linear-gradient(135deg, rgba(243, 237, 254, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%);
  border: 1px solid rgba(124, 77, 255, 0.18);
  margin: 4px 0;

  &:hover {
    background: linear-gradient(135deg, rgba(237, 228, 255, 0.95) 0%, #ffffff 100%);
    border-color: rgba(124, 77, 255, 0.4);
    box-shadow: 0 6px 18px rgba(124, 77, 255, 0.14);
    transform: translateX(-4px);

    .play-action-pill {
      background: #6200ea;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(98, 0, 234, 0.3);
    }
  }
}

.node-icon-wrapper {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.icon-bg--primary { background: rgba(103, 58, 183, 0.1); }
.icon-bg--teal-8 { background: rgba(0, 150, 136, 0.12); }
.icon-bg--indigo-7 { background: rgba(63, 81, 181, 0.12); }
.icon-bg--amber-8 { background: rgba(255, 179, 0, 0.14); }
.icon-bg--deep-purple-6 { background: rgba(124, 77, 255, 0.15); }

.play-action-pill {
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(98, 0, 234, 0.08);
  color: #6200ea;
  transition: all 0.22s ease;
}

.folder-chevron {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* دیالوگ سینمایی */
.cinema-dialog {
  display: flex;
  flex-direction: column;
  background: #090a0f !important;
}

.cinema-toolbar {
  background: rgba(20, 22, 33, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 20px;
}

.cinema-close-btn {
  background: rgba(255, 255, 255, 0.06);
  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
}

.cinema-body {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 0;
}

.cinema-video {
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 100px);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  outline: none;
  background: #000;
}

.cinema-action-btn,
.cinema-close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(124, 77, 255, 0.3);
    border-color: rgba(124, 77, 255, 0.5);
    color: #ffffff !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 599px) {
  .my-films-page {
    padding: 8px;
  }

  .glass-card {
    border-radius: 20px;
  }

  .glass-header {
    padding: 16px;
  }

  .cinema-body {
    padding: 0;
  }

  .cinema-video {
    border-radius: 0;
    max-height: 100vh;
  }
}
</style>
