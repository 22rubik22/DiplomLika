<template>
    <div>
      <h1 class="page-title">Корзина покупок</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div v-if="cartItems.length" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-[#7f8330]/10">
                <th class="text-left p-4 text-[#5e1104] font-medium">Товар</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Цена</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Количество</th>
                <th class="text-left p-4 text-[#5e1104] font-medium">Сумма</th>
                <th class="p-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartItems" :key="item.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3">
                <td class="p-4">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-20 bg-[#f3d8ce] rounded-lg flex items-center justify-center">
                      <img :src="item.image" :alt="item.title" class="w-12 object-contain">
                    </div>
                    <span class="font-medium">{{ item.title }}</span>
                  </div>
                </td>
                <td class="p-4">{{ formatPrice(item.price) }} ₽</td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      class="w-8 h-8 border border-[#7f8330] rounded-lg hover:bg-[#7f8330]/10"
                      :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="w-8 text-center">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="w-8 h-8 border border-[#7f8330] rounded-lg hover:bg-[#7f8330]/10"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="p-4 font-medium text-[#5e1104]">{{ formatPrice(item.price * item.quantity) }} ₽</td>
                <td class="p-4">
                  <button @click="removeItem(item.id)" class="text-[#5e1104] hover:text-[#7f8330]">
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <!-- Итоговая сумма -->
          <div class="mt-8 pt-6 border-t border-[#7f8330]/10 text-right">
            <h3 class="text-2xl text-[#5e1104] mb-4">
              Итого: {{ formatPrice(total) }} ₽
            </h3>
            <button @click="goToCheckout" class="btn-primary px-10 py-3">
              Оформить заказ
            </button>
          </div>
        </div>
  
        <!-- Пустая корзина -->
        <div v-else class="text-center py-16">
          <i class="fas fa-shopping-basket text-6xl text-[#7f8330]/30 mb-4"></i>
          <p class="text-xl text-[#6c6456] mb-4">Корзина пуста</p>
          <router-link to="/catalog" class="inline-block btn-primary px-8 py-3">
            Перейти в каталог
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Состояние корзины (в реальном проекте будет в Pinia)
  const cartItems = ref([
    {
      id: 1,
      title: 'Сад земных наслаждений',
      price: 2450,
      quantity: 1,
      image: 'https://covers.books2you.ru/covers2/9785699970955.jpg'
    },
    {
      id: 2,
      title: 'Искусство и природа',
      price: 3200,
      quantity: 1,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg'
    }
  ])
  
  const total = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })
  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      item.quantity = newQuantity
    }
  }
  
  const removeItem = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }
  
  const goToCheckout = () => {
    router.push('/checkout')
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>