import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { reactive, computed } from 'vue'
import { UserRolesForPathType, UserRolesType, type UserType } from 'src/repositories/user'

const userKey = 'user-data'

export const useUser = defineStore('user', () => {
  const router = useRouter()

  const isClient = typeof window !== 'undefined'
  const state = reactive<{
    refresh: string | null;
    token: string | null;
    user: UserType | null;
  }>({
    token: null,
    refresh: null,
    user: null
  })

  // persist user with localStorage
  if (isClient) {
    loadUserDataFromLocalstorage()
  }

  // Getters
  const token = computed(() => state.token)
  const refreshTokenValue = computed(() => state.refresh)
  const me = computed(() => state.user ?? null)
  const isManager = computed(() => hasRole(state.user, 'Manager'))
  const isAdmin = computed(() => hasRole(state.user, 'Admin'))
  const isTeacher = computed(() => hasRole(state.user, 'Teacher'))
  const isStudent = computed(() => hasRole(state.user, 'Student'))
  const isAccountant = computed(() => hasRole(state.user, 'Accountant'))
  const isMiddleWorker = computed(() => hasRole(state.user, 'MiddleWorker'))
  const isWarehouseKeeper = computed(() => hasRole(state.user, 'WarehouseKeeper'))
  const isFabricCutter = computed(() => hasRole(state.user, 'FabricCutter'))
  const isColoringWorker = computed(() => hasRole(state.user, 'ColoringWorker'))
  const isMoldingWorker = computed(() => hasRole(state.user, 'MoldingWorker'))
  const isAssembler = computed(() => hasRole(state.user, 'Assembler'))
  const mainRole = computed<UserRolesType | null>(() => {
    if (isAdmin.value) {
      return 'Admin'
    }
    if (isManager.value) {
      return 'Manager'
    }
    if (isTeacher.value) {
      return 'Teacher'
    }
    if (isStudent.value) {
      return 'Student'
    }
    return null
  })
  const mainRoleForPath = computed<UserRolesForPathType | null>(() => {
    if (isAdmin.value) {
      return 'admin'
    }
    if (isManager.value) {
      return 'manager'
    }
    if (isTeacher.value) {
      return 'teacher'
    }
    if (isStudent.value) {
      return 'student'
    }
    return null
  })

  function hasRole (user: UserType | null, role: string): boolean {
    if (!user) {
      return false
    }

    return user.roles_list
      .map((item) => item.toLowerCase())
      .includes(role.toLowerCase())
  }

  // Mutations
  async function logout () {
    if (isClient) {
      sessionStorage.clear()
      localStorage.clear()
    }

    state.token = null
    state.refresh = null
    state.user = null

    await router.push({ name: 'Auth.Login' })
  }

  function setUser (data: UserType | null) {
    state.user = data
    if (isClient) {
      localStorage.setItem(userKey, JSON.stringify(data))
    }
  }

  function loadUserDataFromLocalstorage () {
    const data = localStorage.getItem(userKey)
    if (typeof data === 'string') {
      setUser(JSON.parse(data))
    }
  }

  return {
    state,

    // Getters
    me,
    token,
    hasRole,
    mainRole,
    isAdmin,
    isManager,
    isTeacher,
    isStudent,
    isAccountant,
    isMiddleWorker,
    isWarehouseKeeper,
    isFabricCutter,
    isColoringWorker,
    isMoldingWorker,
    isAssembler,
    mainRoleForPath,
    refreshTokenValue,

    // Mutations
    logout,
    setUser,

    // Actions
    loadUserDataFromLocalstorage
  }
})
