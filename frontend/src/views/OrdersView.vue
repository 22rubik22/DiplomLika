<template>
    <div>
      <h1 class="page-title">Мои заказы</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <!-- Фильтры -->
        <div class="flex flex-wrap gap-4 mb-6">
          <select 
            v-model="statusFilter"
            class="px-4 py-2 border border-[#7f8330]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[#7f8330]"
          >
            <option value="">Все статусы</option>
            <option value="new">Новые</option>
            <option value="processing">В обработке</option>
            <option value="delivered">Доставленные</option>
            <option value="cancelled">Отменённые</option>
          </select>
          
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Поиск по номеру заказа..."
            class="flex-1 min-w-[200px] px-4 py-2 border border-[#7f8330]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[#7f8330]"
          >
        </div>
  
        <!-- Таблица заказов -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-[#7f8330]/10">
                <th class="text-left p-4 text-[#5e1104] font-medium">Номер заказа</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Дата</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Товары</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Сумма</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Статус</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3"
              >
                <td class="p-4 font-medium">#{{ order.id }}</td>
                <td class="p-4">{{ order.date }}</td>
                <td class="p-4">
                  <ul class="list-disc list-inside text-sm">
                    <li v-for="item in order.items" :key="item.id">
                      {{ item.title }} ({{ item.quantity }} шт.)
                    </li>
                  </ul>
                </td>
                <td class="p-4 font-medium text-[#5e1104]">{{ formatPrice(order.total) }} ₽</td>
                <td class="p-4">
                  <span 
                    class="px-3 py-1 rounded-full text-sm"
                    :class="orderStatusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex gap-2">
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
                      Повторить
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Пагинация -->
        <div class="flex justify-center gap-2 mt-8">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 rounded-lg border border-[#7f8330]/30 hover:bg-[#7f8330]/10 transition-colors"
            :class="{ 'bg-[#7f8330] text-white hover:bg-[#7f8330]': currentPage === page }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const statusFilter = ref('')
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 5
  
  // Данные заказов (в реальном проекте будут из API)
  const orders = ref([
    {
      id: '12345',
      date: '15.01.2026',
      items: [
        { id: 1, title: 'Сад земных наслаждений', quantity: 1 }
      ],
      total: 2450,
      status: 'Доставлен',
      canRepeat: true
    },
    {
      id: '12346',
      date: '20.01.2026',
      items: [
        { id: 2, title: 'Искусство и природа', quantity: 1 }
      ],
      total: 3200,
      status: 'В обработке',
      canRepeat: false
    },
    {
      id: '12347',
      date: '25.01.2026',
      items: [
        { id: 3, title: 'Преступление и наказание', quantity: 1 },
        { id: 4, title: 'Мастер и Маргарита', quantity: 1 }
      ],
      total: 5700,
      status: 'Новый',
      canRepeat: true
    }
  ])
  
  const filteredOrders = computed(() => {
    return orders.value
      .filter(order => {
        // Фильтр по статусу
        if (statusFilter.value) {
          const statusMap = {
            'new': 'Новый',
            'processing': 'В обработке',
            'delivered': 'Доставлен',
            'cancelled': 'Отменён'
          }
          if (order.status !== statusMap[statusFilter.value]) return false
        }
        
        // Поиск по номеру заказа
        if (searchQuery.value && !order.id.includes(searchQuery.value)) {
          return false
        }
        
        return true
      })
      .slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
  })
  
  const totalPages = computed(() => {
    return Math.ceil(orders.value.length / itemsPerPage)
  })
  
  const orderStatusClass = (status) => {
    const classes = {
      'Доставлен': 'bg-green-100 text-green-700',
      'В обработке': 'bg-yellow-100 text-yellow-700',
      'Новый': 'bg-blue-100 text-blue-700',
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