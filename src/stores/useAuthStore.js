import { defineStore } from 'pinia'
import { ref } from 'vue'

const useAuthStore = defineStore(
  'authStore',
  () => {
    const token = ref('')
    function setToken(value) {
      token.value = value
    }
    function removeToken() {
      token.value = ''
      localStorage.removeItem('authStore')
    }
    return {
      token,
      setToken,
      removeToken
    }
  },
  {
    persist: true
  }
)

export default useAuthStore
