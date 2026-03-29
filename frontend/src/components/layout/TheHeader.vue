<template>
  <header class="bg-[#f1e8e0]/92 backdrop-blur-md sticky top-0 z-50 border-b border-[#7f8330]/20 py-6 px-4 md:px-8">
    <div class="container mx-auto max-w-7xl">
      <!-- Верхняя часть хедера -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-5 mb-6">
        <div class="flex flex-col md:flex-row items-center gap-5">
          <router-link to="/" class="font-['Playfair_Display'] text-3xl md:text-4xl text-[#5e1104] tracking-wide">
            Плющ Бермана<span class="text-[#8b4513] italic"> & Книги</span>
          </router-link>
          <div class="hidden md:block h-10 w-px bg-[#7f8330]/30"></div>
          <div class="font-['Cormorant_Garamond'] italic text-[#6c6456] max-w-xs text-center md:text-left leading-relaxed">
            Где эстетика модерна встречается с мудростью страниц
          </div>
        </div>
        
        <!-- Иконки пользователя и корзины -->
        <div class="flex gap-5 items-center">
          <!-- Авторизованный пользователь -->
          <div v-if="authStore.isAuthenticated" class="relative group">
            <button 
              @click="toggleDropdown" 
              class="text-2xl text-[#7f8330] hover:text-[#5e1104] transition-all hover:-translate-y-1 focus:outline-none"
            >
              <i class="fas fa-user-circle"></i>
            </button>
            
            <!-- Выпадающее меню -->
            <div 
              v-show="showDropdown" 
              class="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl border border-[#7f8330]/20 overflow-hidden z-50"
              @click.stop
            >
              <div class="px-4 py-3 border-b border-[#7f8330]/10">
                <p class="text-sm font-medium text-[#5e1104]">{{ authStore.user?.name }}</p>
                <p class="text-xs text-[#6c6456] mt-1">{{ authStore.user?.email }}</p>
                <p class="text-xs text-[#7f8330] mt-1 capitalize">Роль: {{ authStore.user?.role === 'admin' ? 'Администратор' : 'Покупатель' }}</p>
              </div>
              <div class="py-2">
                <router-link 
                  to="/profile" 
                  class="flex items-center px-4 py-2 text-sm text-[#6c6456] hover:bg-[#7f8330]/5 hover:text-[#5e1104] transition-colors"
                  @click="showDropdown = false"
                >
                  <i class="fas fa-user w-5"></i>
                  <span class="ml-2">Профиль</span>
                </router-link>
                <router-link 
                  to="/orders" 
                  class="flex items-center px-4 py-2 text-sm text-[#6c6456] hover:bg-[#7f8330]/5 hover:text-[#5e1104] transition-colors"
                  @click="showDropdown = false"
                >
                  <i class="fas fa-shopping-bag w-5"></i>
                  <span class="ml-2">Мои заказы</span>
                </router-link>
                <router-link 
                  v-if="authStore.user?.role === 'admin'"
                  to="/admin" 
                  class="flex items-center px-4 py-2 text-sm text-[#6c6456] hover:bg-[#7f8330]/5 hover:text-[#5e1104] transition-colors"
                  @click="showDropdown = false"
                >
                  <i class="fas fa-cog w-5"></i>
                  <span class="ml-2">Админ-панель</span>
                </router-link>
                <hr class="my-1 border-[#7f8330]/10">
                <button 
                  @click="handleLogout" 
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <i class="fas fa-sign-out-alt w-5"></i>
                  <span class="ml-2">Выйти</span>
                </button>
              </div>
            </div>
            
            <!-- Корзина для авторизованных пользователей -->
            <router-link to="/cart" class="ml-5 text-2xl text-[#7f8330] hover:text-[#5e1104] transition-all hover:-translate-y-1 relative">
              <i class="fas fa-shopping-basket"></i>
              <span class="absolute -top-2 -right-2 bg-[#5e1104] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ cartCount }}
              </span>
            </router-link>
          </div>
          
          <!-- Неавторизованный пользователь - иконка входа -->
          <div v-else>
            <router-link to="/login" class="text-2xl text-[#7f8330] hover:text-[#5e1104] transition-all hover:-translate-y-1">
              <i class="fas fa-sign-in-alt"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Навигация -->
      <nav class="mt-5">
        <ul class="flex flex-wrap justify-center gap-1">
          <li v-for="item in navItems" :key="item.path">
            <router-link 
              :to="item.path" 
              class="nav-item inline-block px-6 py-3 text-[#6c6456] font-medium rounded-full transition-all hover:text-[#5e1104] hover:bg-[#7f8330]/8 hover:-translate-y-1"
              active-class="!text-[#5e1104] font-medium bg-[#7f8330]/10"
            >
              {{ item.name }}
            </router-link>
          </li>
          <!-- Отдельная ссылка на админ-панель для администраторов -->
          <li v-if="authStore.isAuthenticated && authStore.user?.role === 'admin'">
            <router-link 
              to="/admin" 
              class="nav-item inline-block px-6 py-3 text-[#7f8330] font-medium rounded-full transition-all hover:text-[#5e1104] hover:bg-[#7f8330]/8 hover:-translate-y-1 border border-[#7f8330]/30"
              active-class="!text-[#5e1104] font-medium bg-[#7f8330]/10"
            >
              <i class="fas fa-cog mr-2"></i>
              Админ-панель
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showDropdown = ref(false)
const cartCount = ref(3)

const navItems = [
  { path: '/', name: 'Главная' },
  { path: '/catalog', name: 'Каталог' },
  { path: '/collections', name: 'Коллекции' },
  { path: '/new-editions', name: 'Переиздания' },
  { path: '/rare-books', name: 'Букинистика' },
  { path: '/bookcrossing', name: 'Буккроссинг' },
  { path: '/author-meetings', name: 'Авторские встречи' },
  { path: '/about', name: 'О нас' }
]

// Переключение выпадающего меню
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Закрыть меню при клике вне
const closeDropdown = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Выход из системы
const handleLogout = async () => {
  await authStore.logout()
  showDropdown.value = false
  router.push('/')
}

// Проверка авторизации при монтировании
onMounted(async () => {
  await authStore.checkAuth()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.nav-item {
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #7f8330, #5e1104);
  transition: width 0.3s ease;
}

.nav-item:hover::before,
.router-link-active::before {
  width: 70%;
}

/* Анимация для выпадающего меню */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>