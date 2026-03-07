<template>
    <div class="max-w-md mx-auto">
      <h1 class="page-title">Регистрация</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <form @submit.prevent="handleRegister">
          <div class="space-y-5">
            <div>
              <label class="block text-[#5e1104] mb-2">ФИО</label>
              <input 
                v-model="form.fullName"
                type="text" 
                class="form-input"
                placeholder="Иванов Иван Иванович"
                required
              >
            </div>
            
            <div>
              <label class="block text-[#5e1104] mb-2">Email</label>
              <input 
                v-model="form.email"
                type="email" 
                class="form-input"
                placeholder="example@mail.ru"
                required
              >
            </div>
            
            <div>
              <label class="block text-[#5e1104] mb-2">Телефон</label>
              <input 
                v-model="form.phone"
                type="tel" 
                class="form-input"
                placeholder="+7 (999) 123-45-67"
              >
            </div>
            
            <div>
              <label class="block text-[#5e1104] mb-2">Пароль</label>
              <input 
                v-model="form.password"
                type="password" 
                class="form-input"
                placeholder="Не менее 6 символов"
                required
              >
            </div>
            
            <div>
              <label class="block text-[#5e1104] mb-2">Подтвердите пароль</label>
              <input 
                v-model="form.passwordConfirmation"
                type="password" 
                class="form-input"
                :class="{ 'border-red-500': passwordError }"
                required
              >
              <p v-if="passwordError" class="text-red-500 text-sm mt-1">
                Пароли не совпадают
              </p>
            </div>
  
            <div class="flex items-start gap-2">
              <input 
                type="checkbox" 
                v-model="form.agree"
                class="mt-1 w-4 h-4 text-[#7f8330]"
                required
              >
              <label class="text-sm text-[#6c6456]">
                Я согласен с 
                <a href="#" class="text-[#7f8330] hover:underline">условиями использования</a>
                и
                <a href="#" class="text-[#7f8330] hover:underline">политикой конфиденциальности</a>
              </label>
            </div>
  
            <button 
              type="submit"
              class="btn-primary w-full py-3"
              :disabled="!isFormValid"
            >
              Зарегистрироваться
            </button>
  
            <div class="text-center mt-4">
              <span class="text-[#6c6456]">Уже есть аккаунт?</span>
              <router-link to="/login" class="text-[#7f8330] hover:underline ml-2">
                Войти
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const form = ref({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    agree: false
  })
  
  const passwordError = computed(() => {
    return form.value.password && 
           form.value.passwordConfirmation && 
           form.value.password !== form.value.passwordConfirmation
  })
  
  const isFormValid = computed(() => {
    return form.value.fullName &&
           form.value.email &&
           form.value.password &&
           form.value.passwordConfirmation &&
           !passwordError.value &&
           form.value.agree
  })
  
  const handleRegister = () => {
    if (!isFormValid.value) return
    
    console.log('Регистрация:', {
      fullName: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone
    })
    // Здесь будет логика регистрации
    alert('Регистрация успешна! Проверьте email для подтверждения.')
    router.push('/login')
  }
  </script>