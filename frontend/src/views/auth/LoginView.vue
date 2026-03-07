<template>
    <div class="max-w-md mx-auto">
      <h1 class="page-title">Вход в личный кабинет</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <form @submit.prevent="handleLogin">
          <div class="space-y-5">
            <div>
              <label class="block text-[#5e1104] mb-2">Email</label>
              <input 
                v-model="form.email"
                type="email" 
                class="form-input"
                placeholder="your@email.com"
                required
              >
            </div>
            
            <div>
              <label class="block text-[#5e1104] mb-2">Пароль</label>
              <input 
                v-model="form.password"
                type="password" 
                class="form-input"
                placeholder="••••••••"
                required
              >
            </div>
  
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.remember" class="w-4 h-4 text-[#7f8330]">
                <span class="text-sm text-[#6c6456]">Запомнить меня</span>
              </label>
              <router-link to="/forgot-password" class="text-sm text-[#7f8330] hover:underline">
                Забыли пароль?
              </router-link>
            </div>
  
            <button 
              type="submit"
              class="btn-primary w-full py-3"
            >
              Войти
            </button>
  
            <div class="text-center mt-4">
              <span class="text-[#6c6456]">Нет аккаунта?</span>
              <router-link to="/register" class="text-[#7f8330] hover:underline ml-2">
                Зарегистрироваться
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const form = ref({
    email: '',
    password: '',
    remember: false
  })
  
  const handleLogin = () => {
    console.log('Вход:', form.value)
    // Здесь будет логика аутентификации
    router.push('/account')
  }
  </script>