<template>
  <div class="max-w-md mx-auto">
    <h1 class="page-title">Регистрация</h1>
    
    <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
      <form @submit.prevent="handleRegister">
        <div class="space-y-5">
          <div>
            <label class="block text-[#5e1104] mb-2">Имя <span class="text-red-500">*</span></label>
            <input 
              v-model="form.name"
              type="text" 
              class="form-input"
              placeholder="Иван"
              required
            >
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</p>
          </div>
          
          <div>
            <label class="block text-[#5e1104] mb-2">Email <span class="text-red-500">*</span></label>
            <input 
              v-model="form.email"
              type="email" 
              class="form-input"
              placeholder="example@mail.ru"
              required
            >
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</p>
          </div>
          
          <div>
            <label class="block text-[#5e1104] mb-2">Телефон</label>
            <input 
              v-model="form.phone"
              type="tel" 
              class="form-input"
              placeholder="+7 (999) 123-45-67"
            >
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone[0] }}</p>
          </div>

          <div>
            <label class="block text-[#5e1104] mb-2">Город</label>
            <input 
              v-model="form.city"
              type="text" 
              class="form-input"
              placeholder="Москва"
            >
            <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city[0] }}</p>
          </div>

          <div>
            <label class="block text-[#5e1104] mb-2">Адрес</label>
            <input 
              v-model="form.address_line"
              type="text" 
              class="form-input"
              placeholder="ул. Примерная, д. 1, кв. 1"
            >
            <p v-if="errors.address_line" class="text-red-500 text-sm mt-1">{{ errors.address_line[0] }}</p>
          </div>
          
          <div>
            <label class="block text-[#5e1104] mb-2">Пароль <span class="text-red-500">*</span></label>
            <input 
              v-model="form.password"
              type="password" 
              class="form-input"
              placeholder="Не менее 8 символов"
              required
            >
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password[0] }}</p>
          </div>
          
          <div>
            <label class="block text-[#5e1104] mb-2">Подтвердите пароль <span class="text-red-500">*</span></label>
            <input 
              v-model="form.password_confirmation"
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

          <!-- Общая ошибка -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {{ generalError }}
          </div>

          <button 
            type="submit"
            class="btn-primary w-full py-3"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Регистрация...
            </span>
            <span v-else>Зарегистрироваться</span>
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
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  address_line: '',
  password: '',
  password_confirmation: '',
  agree: false
})

const loading = ref(false)
const errors = ref({})
const generalError = ref('')

const passwordError = computed(() => {
  return form.value.password && 
         form.value.password_confirmation && 
         form.value.password !== form.value.password_confirmation
})

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.email &&
         form.value.password &&
         form.value.password_confirmation &&
         !passwordError.value &&
         form.value.agree
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  errors.value = {}
  generalError.value = ''
  
  // Подготавливаем данные для отправки
  const userData = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone || null,
    city: form.value.city || null,
    address_line: form.value.address_line || null,
    password: form.value.password,
    password_confirmation: form.value.password_confirmation
  }
  
  try {
    const result = await authStore.register(userData)
    
    if (result.success) {
      // Регистрация успешна, пользователь уже авторизован
      router.push('/')
    } else if (result.errors) {
      // Обработка ошибок валидации от бэкенда
      errors.value = result.errors
    } else {
      // Общая ошибка
      generalError.value = result.message || 'Ошибка регистрации. Попробуйте позже.'
    }
  } catch (error) {
    console.error('Registration error:', error)
    generalError.value = 'Произошла ошибка при регистрации. Попробуйте позже.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  background-color: #fefaf7;
}

.form-input:focus {
  outline: none;
  border-color: #7f8330;
  box-shadow: 0 0 0 3px rgba(127, 131, 48, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #7f8330 0%, #5e1104 100%);
  color: white;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(94, 17, 4, 0.2);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #5e1104;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #7f8330, #5e1104);
  border-radius: 2px;
}
</style>