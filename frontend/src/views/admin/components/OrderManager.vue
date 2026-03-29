<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-[#5e1104] text-xl font-semibold">Управление заказами</h3>
      </div>
  
      <!-- Фильтры и поиск -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6456]"></i>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Поиск по номеру заказа, имени или email..."
            class="form-input pl-10 w-full"
            @input="searchOrders"
          >
        </div>
        
        <select v-model="filters.status" class="form-input" @change="loadOrders">
          <option :value="null">Все статусы</option>
          <option value="new">Новый</option>
          <option value="pending">Ожидает оплаты</option>
          <option value="processing">В обработке</option>
          <option value="shipped">Отправлен</option>
          <option value="delivered">Доставлен</option>
          <option value="cancelled">Отменён</option>
          <option value="refunded">Возврат</option>
        </select>
        
        <select v-model="filters.payment_status" class="form-input" @change="loadOrders">
          <option :value="null">Все статусы оплаты</option>
          <option value="pending">Ожидает оплаты</option>
          <option value="paid">Оплачен</option>
          <option value="failed">Ошибка оплаты</option>
          <option value="refunded">Возврат</option>
        </select>
      </div>
  
      <!-- Таблица заказов -->
      <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#f3d8ce]/30">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-[#7f8330]/5 to-[#5e1104]/5 border-b border-[#7f8330]/20">
              <th class="text-left p-4 text-[#5e1104] font-semibold">№ заказа</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Дата</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Клиент</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Сумма</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Статус</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Оплата</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
             </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
              <td class="p-4 font-mono text-[#5e1104] font-medium">{{ order.order_number }}</td>
              <td class="p-4 text-[#6c6456] text-sm">{{ formatDate(order.created_at) }}</td>
              <td class="p-4">
                <div class="font-medium text-[#5e1104]">{{ order.customer_name }}</div>
                <div class="text-xs text-[#6c6456]">{{ order.customer_email }}</div>
                <div class="text-xs text-[#6c6456]">{{ order.customer_phone || '—' }}</div>
              </td>
              <td class="p-4 font-medium text-[#5e1104]">{{ formatPrice(order.total_amount) }} ₽</td>
              <td class="p-4">
                <div class="relative">
                  <select 
                    :value="order.status"
                    @change="updateStatus(order, $event.target.value)"
                    class="px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer"
                    :class="getStatusClass(order.status)"
                  >
                    <option value="new">🆕 Новый</option>
                    <option value="pending">⏳ Ожидает оплаты</option>
                    <option value="processing">⚙️ В обработке</option>
                    <option value="shipped">🚚 Отправлен</option>
                    <option value="delivered">✅ Доставлен</option>
                    <option value="cancelled">❌ Отменён</option>
                    <option value="refunded">🔄 Возврат</option>
                  </select>
                </div>
              </td>
              <td class="p-4">
                <div class="relative">
                  <select 
                    :value="order.payment_status"
                    @change="updatePaymentStatus(order, $event.target.value)"
                    class="px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer"
                    :class="getPaymentStatusClass(order.payment_status)"
                  >
                    <option value="pending">⏳ Ожидает оплаты</option>
                    <option value="paid">✅ Оплачен</option>
                    <option value="failed">❌ Ошибка оплаты</option>
                    <option value="refunded">🔄 Возврат</option>
                  </select>
                </div>
              </td>
              <td class="p-4">
                <button 
                  @click="openModal(order)" 
                  class="text-[#7f8330] hover:text-[#5e1104] transition p-1.5 rounded-lg hover:bg-[#7f8330]/10"
                  title="Просмотр заказа"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Пагинация -->
        <div v-if="pagination.last_page > 1" class="px-4 py-3 border-t border-[#7f8330]/10 flex justify-between items-center">
          <div class="text-sm text-[#6c6456]">
            Показано {{ orders.length }} из {{ pagination.total }} заказов
          </div>
          <div class="flex gap-2">
            <button 
              @click="loadOrders(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
            >
              ←
            </button>
            <span class="px-3 py-1 bg-[#7f8330] text-white rounded-lg">
              {{ pagination.current_page }}
            </span>
            <button 
              @click="loadOrders(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно деталей заказа -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-2xl p-0 w-full max-w-4xl shadow-2xl transform transition-all animate-modal-slide max-h-[90vh] overflow-y-auto">
          <!-- Заголовок -->
          <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20 sticky top-0 bg-white z-10">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
                  <i class="fas fa-shopping-cart"></i>
                  Заказ №{{ selectedOrder?.order_number }}
                </h3>
                <p class="text-sm text-[#6c6456] mt-1">
                  от {{ formatDate(selectedOrder?.created_at) }}
                </p>
              </div>
              <button @click="closeModal" class="text-[#6c6456] hover:text-[#5e1104]">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          
          <div class="p-6" v-if="selectedOrder">
            <!-- Информация о клиенте -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                  <i class="fas fa-user"></i> Информация о клиенте
                </h4>
                <div class="space-y-2 text-sm">
                  <p><span class="text-[#6c6456]">Имя:</span> {{ selectedOrder.customer_name }}</p>
                  <p><span class="text-[#6c6456]">Email:</span> {{ selectedOrder.customer_email }}</p>
                  <p><span class="text-[#6c6456]">Телефон:</span> {{ selectedOrder.customer_phone || '—' }}</p>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                  <i class="fas fa-truck"></i> Доставка
                </h4>
                <div class="space-y-2 text-sm">
                  <p><span class="text-[#6c6456]">Способ:</span> {{ getDeliveryMethodName(selectedOrder.delivery_method) }}</p>
                  <p><span class="text-[#6c6456]">Адрес:</span> {{ selectedOrder.delivery_address }}</p>
                  <p><span class="text-[#6c6456]">Стоимость:</span> {{ formatPrice(selectedOrder.delivery_price) }} ₽</p>
                  <p v-if="selectedOrder.delivery_date"><span class="text-[#6c6456]">Дата доставки:</span> {{ formatDate(selectedOrder.delivery_date) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Информация об оплате -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                <i class="fas fa-credit-card"></i> Оплата
              </h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <p><span class="text-[#6c6456]">Способ оплаты:</span> {{ getPaymentMethodName(selectedOrder.payment_method) }}</p>
                <p>
                  <span class="text-[#6c6456]">Статус:</span>
                  <span :class="getPaymentStatusClass(selectedOrder.payment_status)" class="ml-2 px-2 py-0.5 rounded-full text-xs">
                    {{ getPaymentStatusText(selectedOrder.payment_status) }}
                  </span>
                </p>
                <p><span class="text-[#6c6456]">Сумма заказа:</span> {{ formatPrice(selectedOrder.total_amount - selectedOrder.delivery_price) }} ₽</p>
                <p><span class="text-[#6c6456]">Доставка:</span> {{ formatPrice(selectedOrder.delivery_price) }} ₽</p>
                <p class="font-bold"><span class="text-[#5e1104]">Итого:</span> {{ formatPrice(selectedOrder.total_amount) }} ₽</p>
              </div>
            </div>
            
            <!-- Товары в заказе -->
            <div class="mb-6">
              <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                <i class="fas fa-boxes"></i> Товары в заказе
              </h4>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="text-left p-3 text-[#6c6456] font-medium">Название</th>
                      <th class="text-left p-3 text-[#6c6456] font-medium">Автор</th>
                      <th class="text-center p-3 text-[#6c6456] font-medium">Кол-во</th>
                      <th class="text-right p-3 text-[#6c6456] font-medium">Цена</th>
                      <th class="text-right p-3 text-[#6c6456] font-medium">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedOrder.items" :key="item.id" class="border-b">
                      <td class="p-3 text-[#5e1104]">{{ item.book_title }}</td>
                      <td class="p-3 text-[#6c6456]">{{ item.book_author || '—' }}</td>
                      <td class="p-3 text-center text-[#6c6456]">{{ item.quantity }}</td>
                      <td class="p-3 text-right text-[#6c6456]">{{ formatPrice(item.price) }} ₽</td>
                      <td class="p-3 text-right font-medium text-[#5e1104]">{{ formatPrice(item.total) }} ₽</td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="4" class="p-3 text-right font-medium text-[#5e1104]">Итого:</td>
                      <td class="p-3 text-right font-bold text-[#5e1104]">{{ formatPrice(selectedOrder.total_amount) }} ₽</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <!-- Комментарий -->
            <div v-if="selectedOrder.comment" class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-[#5e1104] mb-2 flex items-center gap-2">
                <i class="fas fa-comment"></i> Комментарий покупателя
              </h4>
              <p class="text-[#6c6456]">{{ selectedOrder.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { orderApi } from '@/api/orders'
  import { useToast } from '@/composables/useToast'
  
  const { success, error } = useToast()
  
  const orders = ref([])
  const showModal = ref(false)
  const selectedOrder = ref(null)
  const filters = ref({
    search: '',
    status: null,
    payment_status: null
  })
  const searchTimeout = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  
  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getStatusClass = (status) => {
    const classes = {
      new: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }
  
  const getPaymentStatusClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }
  
  const getPaymentStatusText = (status) => {
    const texts = {
      pending: 'Ожидает оплаты',
      paid: 'Оплачен',
      failed: 'Ошибка оплаты',
      refunded: 'Возврат'
    }
    return texts[status] || status
  }
  
  const getDeliveryMethodName = (method) => {
    const methods = {
      pickup: 'Самовывоз',
      courier: 'Курьер',
      post: 'Почта'
    }
    return methods[method] || method
  }
  
  const getPaymentMethodName = (method) => {
    const methods = {
      cash: 'Наличные',
      card: 'Банковская карта',
      online: 'Онлайн оплата'
    }
    return methods[method] || method
  }
  
  const loadOrders = async (page = 1) => {
    try {
      const params = {
        page,
        per_page: 20,
        ...filters.value
      }
      
      const response = await orderApi.getAllOrders(params)
      if (response.data.success) {
        orders.value = response.data.data.data
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        }
      }
    } catch (err) {
      console.error('Error loading orders:', err)
      error('Ошибка при загрузке заказов')
    }
  }
  
  const searchOrders = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
      loadOrders()
    }, 500)
  }
  
  const updateStatus = async (order, newStatus) => {
    try {
      const response = await orderApi.updateOrderStatus(order.id, newStatus)
      if (response.data.success) {
        order.status = newStatus
        success(`Статус заказа №${order.order_number} изменен на "${getStatusText(newStatus)}"`)
      }
    } catch (err) {
      console.error('Error updating status:', err)
      error(err.response?.data?.message || 'Ошибка при изменении статуса')
      // Возвращаем старый статус
      await loadOrders()
    }
  }
  
  const updatePaymentStatus = async (order, newPaymentStatus) => {
    try {
      const response = await orderApi.updatePaymentStatus(order.id, newPaymentStatus)
      if (response.data.success) {
        order.payment_status = newPaymentStatus
        success(`Статус оплаты заказа №${order.order_number} изменен`)
      }
    } catch (err) {
      console.error('Error updating payment status:', err)
      error(err.response?.data?.message || 'Ошибка при изменении статуса оплаты')
      await loadOrders()
    }
  }
  
  const getStatusText = (status) => {
    const texts = {
      new: 'Новый',
      pending: 'Ожидает оплаты',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменён',
      refunded: 'Возврат'
    }
    return texts[status] || status
  }
  
  const openModal = (order) => {
    selectedOrder.value = order
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedOrder.value = null
  }
  
  onMounted(() => {
    loadOrders()
  })
  </script>
  
  <style scoped>
  .form-input {
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
  
  select.form-input {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%237f8330' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25rem;
    padding-right: 2.5rem;
  }
  
  @keyframes modalSlide {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-modal-slide {
    animation: modalSlide 0.2s ease-out;
  }
  </style>