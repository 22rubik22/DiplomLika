<template>
    <div>
      <h1 class="page-title">Личный кабинет</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <!-- Боковое меню -->
          <div>
            <div class="text-center mb-6">
              <div class="w-24 h-24 bg-[#f3d8ce] rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="fas fa-user text-4xl text-[#7f8330]"></i>
              </div>
              <h3 class="text-[#5e1104] font-medium">{{ user.name }}</h3>
              <p class="text-sm text-[#6c6456]">{{ user.email }}</p>
            </div>
            
            <nav class="space-y-2">
              <router-link 
                v-for="item in menuItems" 
                :key="item.path"
                :to="item.path"
                class="block px-4 py-3 rounded-lg transition-colors"
                :class="[$route.path === item.path ? 'bg-[#7f8330]/10 text-[#5e1104]' : 'text-[#6c6456] hover:bg-[#7f8330]/5']"
              >
                <i :class="item.icon" class="w-6 inline-block"></i>
                {{ item.name }}
              </router-link>
            </nav>
          </div>
  
          <!-- Основной контент -->
          <div>
            <h3 class="text-[#5e1104] text-xl mb-6">Последние заказы</h3>
            
            <div v-if="recentOrders.length" class="space-y-4">
              <div 
                v-for="order in recentOrders" 
                :key="order.id"
                class="border border-[#7f8330]/10 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <span class="font-medium text-[#5e1104]">Заказ #{{ order.id }}</span>
                    <span class="text-sm text-[#6c6456] ml-3">{{ order.date }}</span>
                  </div>
                  <span 
                    class="px-3 py-1 rounded-full text-sm"
                    :class="orderStatusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </div>
                
                <div class="text-sm text-[#6c6456] mb-2">
                  {{ order.items }} • {{ formatPrice(order.total) }} ₽
                </div>
                
                <div class="flex gap-3 mt-3">
                  <button 
                    @click="viewOrderDetails(order.id)"
                    class="text-[#7f8330] hover:underline text-sm"
                  >
                    Подробнее
                  </button>
                  <button 
                    v-if="order.canRepeat"
                    @click="repeatOrder(order.id)"
                    class="text-[#7f8330] hover:underline text-sm"
                  >
                    Повторить заказ
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-[#6c6456]">
              <p>У вас пока нет заказов</p>
              <router-link to="/catalog" class="text-[#7f8330] hover:underline mt-2 inline-block">
                Перейти в каталог
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Данные пользователя (в реальном проекте будут из Pinia)
  const user = ref({
    name: 'Иван Иванов',
    email: 'ivan@mail.ru'
  })
  
  const menuItems = [
    { path: '/account', name: 'Обзор', icon: 'fas fa-home' },
    { path: '/orders', name: 'Мои заказы', icon: 'fas fa-shopping-bag' },
    { path: '/favorites', name: 'Избранное', icon: 'fas fa-heart' },
    { path: '/profile/edit', name: 'Настройки профиля', icon: 'fas fa-cog' },
    { path: '/logout', name: 'Выйти', icon: 'fas fa-sign-out-alt' }
  ]
  
  const recentOrders = ref([
    {
      id: '12345',
      date: '15 января 2026',
      items: 'Сад земных наслаждений (1 шт.)',
      total: 2450,
      status: 'Доставлен',
      canRepeat: true
    },
    {
      id: '12346',
      date: '20 января 2026',
      items: 'Искусство и природа (1 шт.)',
      total: 3200,
      status: 'В обработке',
      canRepeat: false
    }
  ])
  
  const orderStatusClass = (status) => {
    const classes = {
      'Доставлен': 'bg-green-100 text-green-700',
      'В обработке': 'bg-yellow-100 text-yellow-700',
      'Отменён': 'bg-red-100 text-red-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }
  
  const viewOrderDetails = (orderId) => {
    router.push(`/orders/${orderId}`)
  }
  
  const repeatOrder = (orderId) => {
    console.log('Повтор заказа:', orderId)
    // Здесь будет логика повторения заказа
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>