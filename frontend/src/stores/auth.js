import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false
  }),
  
  actions: {
    async register(userData) {
      this.loading = true
      try {
        const response = await api.post('/register', userData)
        if (response.data.success) {
          this.user = response.data.user
          this.isAuthenticated = true
          return { success: true }
        }
      } catch (error) {
        console.error('Register error:', error)
        return {
          success: false,
          errors: error.response?.data?.errors || { general: ['Ошибка регистрации'] }
        }
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials) {
      this.loading = true
      try {
        const response = await api.post('/login', credentials)
        if (response.data.success) {
          this.user = response.data.user
          this.isAuthenticated = true
          return { success: true }
        }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Ошибка входа'
        }
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      try {
        await api.post('/logout')
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    
    async checkAuth() {
      try {
        const response = await api.get('/check')
        this.isAuthenticated = response.data.authenticated
        this.user = response.data.user
        return response.data.authenticated
      } catch (error) {
        console.error('Check auth error:', error)
        this.isAuthenticated = false
        this.user = null
        return false
      }
    },
    
    async fetchUser() {
      if (!this.isAuthenticated) return
      try {
        const response = await api.get('/me')
        if (response.data.success) {
          this.user = response.data.user
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
  },
  
  getters: {
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userRole: (state) => state.user?.role || '',
    isAdmin: (state) => state.user?.role === 'admin'
  }
})