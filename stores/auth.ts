export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: ''
  }),
  getters: {
    isLogin(state) {
      return !!state.token;
    }
  },
  actions: {
    setToken(val = '') {
      this.token = val;
    },
    removeToken() {
      this.token = '';
    }
  },
  persist: true,
})