export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null as String | null
  }),
  getters: {
    isLogin(state) {
      return !!state.token;
    }
  },
  actions: {
    setToken(val = null) {
      this.token = val;
    },
    removeToken() {
      this.token = null;
    }
  },
  persist: true,
})