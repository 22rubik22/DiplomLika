<template>
    <div>
      <h1 class="page-title">Оформление заказа</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Левая колонка: форма -->
          <div>
            <h3 class="text-[#5e1104] text-xl mb-6">Данные покупателя</h3>
            
            <form @submit.prevent="submitOrder">
              <div class="space-y-5">
                <div>
                  <label class="block text-[#5e1104] mb-2">ФИО</label>
                  <input 
                    v-model="form.fullName"
                    type="text" 
                    class="form-input"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-[#5e1104] mb-2">Телефон</label>
                  <input 
                    v-model="form.phone"
                    type="tel" 
                    class="form-input"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-[#5e1104] mb-2">Email</label>
                  <input 
                    v-model="form.email"
                    type="email" 
                    class="form-input"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-[#5e1104] mb-2">Адрес доставки</label>
                  <textarea 
                    v-model="form.address"
                    class="form-input"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
  
              <h3 class="text-[#5e1104] text-xl mt-8 mb-4">Способ доставки</h3>
              <div class="space-y-3">
                <label v-for="delivery in deliveryMethods" :key="delivery.id" class="flex items-center gap-3 p-3 border border-[#7f8330]/20 rounded-lg cursor-pointer hover:bg-[#7f8330]/5">
                  <input 
                    type="radio" 
                    v-model="form.deliveryMethod"
                    :value="delivery"
                    class="w-4 h-4 text-[#7f8330]"
                  >
                  <span>{{ delivery.name }} ({{ formatPrice(delivery.price) }} ₽)</span>
                </label>
              </div>
  
              <h3 class="text-[#5e1104] text-xl mt-8 mb-4">Способ оплаты</h3>
              <div class="space-y-3">
                <label v-for="payment in paymentMethods" :key="payment.id" class="flex items-center gap-3 p-3 border border-[#7f8330]/20 rounded-lg cursor-pointer hover:bg-[#7f8330]/5">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod"
                    :value="payment"
                    class="w-4 h-4 text-[#7f8330]"
                  >
                  <span>{{ payment.name }}</span>
                </label>
              </div>
            </form>
          </div>
  
          <!-- Правая колонка: итог -->
          <div>
            <div class="bg-[#7f8330]/5 p-6 rounded-xl sticky top-24">
              <h3 class="text-[#5e1104] text-xl mb-4">Ваш заказ</h3>
              
              <div class="space-y-4 mb-6">
                <div v-for="item in cartItems" :key="item.id" class="flex justify-between">
                  <span>{{ item.title }} × {{ item.quantity }}</span>
                  <span class="font-medium">{{ formatPrice(item.price * item.quantity) }} ₽</span>
                </div>
              </div>
  
              <div class="border-t border-[#7f8330]/20 pt-4 space-y-2">
                <div class="flex justify-between">
                  <span>Товары:</span>
                  <span>{{ formatPrice(subtotal) }} ₽</span>
                </div>
                <div class="flex justify-between">
                  <span>Доставка:</span>
                  <span>{{ formatPrice(deliveryPrice) }} ₽</span>
                </div>
                <div class="flex justify-between text-xl font-bold text-[#5e1104] pt-4 border-t border-[#7f8330]/20">
                  <span>Итого:</span>
                  <span>{{ formatPrice(total) }} ₽</span>
                </div>
              </div>
  
              <button 
                @click="submitOrder"
                class="btn-primary w-full mt-8 py-4"
              >
                Подтвердить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Данные формы
  const form = ref({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    deliveryMethod: null,
    paymentMethod: null
  })
  
  const deliveryMethods = [
    { id: 1, name: 'Курьерская доставка', price: 300 },
    { id: 2, name: 'Пункт выдачи', price: 150 },
    { id: 3, name: 'Почта России', price: 200 }
  ]
  
  const paymentMethods = [
    { id: 1, name: 'Банковская карта онлайн' },
    { id: 2, name: 'Наложенный платеж' }
  ]
  
  // Данные корзины (в реальном проекте будут из Pinia)
  const cartItems = ref([
    { id: 1, title: 'Сад земных наслаждений', price: 2450, quantity: 1 },
    { id: 2, title: 'Искусство и природа', price: 3200, quantity: 1 }
  ])
  
  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })
  
  const deliveryPrice = computed(() => {
    return form.value.deliveryMethod?.price || 0
  })
  
  const total = computed(() => {
    return subtotal.value + deliveryPrice.value
  })
  
  const submitOrder = () => {
    console.log('Отправка заказа:', {
      ...form.value,
      items: cartItems.value,
      total: total.value
    })
    // Здесь будет отправка на сервер
    alert('Заказ оформлен! Спасибо за покупку.')
    router.push('/')
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>