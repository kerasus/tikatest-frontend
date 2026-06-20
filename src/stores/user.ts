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
  const isAccountant = computed(() => hasRole(state.user, 'Accountant'))
  const isMoldingWorker = computed(() => hasRole(state.user, 'MoldingWorker'))
  const isColoringWorker = computed(() => hasRole(state.user, 'ColoringWorker'))
  const isFabricCutter = computed(() => hasRole(state.user, 'FabricCutter'))
  const isAssembler = computed(() => hasRole(state.user, 'Assembler'))
  const isMiddleWorker = computed(() => hasRole(state.user, 'MiddleWorker'))
  const isWarehouseKeeper = computed(() => hasRole(state.user, 'WarehouseKeeper'))
  const mainRole = computed<UserRolesType | null>(() => {
    if (isManager.value) {
      return 'Manager'
    }
    if (isAccountant.value) {
      return 'Accountant'
    }
    if (isWarehouseKeeper.value) {
      return 'WarehouseKeeper'
    }
    if (isMiddleWorker.value) {
      return 'MiddleWorker'
    }
    if (isAssembler.value) {
      return 'Assembler'
    }
    if (isFabricCutter.value) {
      return 'FabricCutter'
    }
    if (isMoldingWorker.value) {
      return 'MoldingWorker'
    }
    if (isColoringWorker.value) {
      return 'ColoringWorker'
    }

    return null
  })
  const mainRoleForPath = computed<UserRolesForPathType | null>(() => {
    if (isManager.value) {
      return 'manager'
    }
    if (isAccountant.value) {
      return 'accountant'
    }
    if (isWarehouseKeeper.value) {
      return 'warehouse-keeper'
    }
    if (isMiddleWorker.value) {
      return 'middle'
    }
    if (isAssembler.value) {
      return 'assembler'
    }
    if (isFabricCutter.value) {
      return 'fabric-cutter'
    }
    if (isMoldingWorker.value) {
      return 'molding'
    }
    if (isColoringWorker.value) {
      return 'coloring'
    }

    return null
  })

  function hasRole (user: UserType | null, role: string): boolean {
    if (!user) {
      return false
    }

    return user.roles_list.includes(role)
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
    isManager,
    isAssembler,
    isAccountant,
    isMiddleWorker,
    isFabricCutter,
    mainRoleForPath,
    isMoldingWorker,
    isColoringWorker,
    isWarehouseKeeper,
    refreshTokenValue,

    // Mutations
    logout,
    setUser,

    // Actions
    loadUserDataFromLocalstorage
  }
})
