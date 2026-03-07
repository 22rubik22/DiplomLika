<template>
    <div>
      <h1 class="page-title">Администрирование</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <!-- Боковое меню админа -->
          <div>
            <ul class="space-y-2">
              <li v-for="item in adminMenu" :key="item.id">
                <button
                  @click="activeTab = item.id"
                  class="w-full text-left px-4 py-3 rounded-lg transition-colors"
                  :class="activeTab === item.id ? 'bg-[#7f8330] text-white' : 'text-[#6c6456] hover:bg-[#7f8330]/5'"
                >
                  <i :class="item.icon" class="w-6 inline-block"></i>
                  {{ item.name }}
                </button>
              </li>
            </ul>
          </div>
  
          <!-- Контент вкладок -->
          <div>
            <!-- Товары -->
            <div v-if="activeTab === 'products'">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-[#5e1104] text-xl">Управление каталогом книг</h3>
                <button class="btn-primary px-5 py-2">
                  <i class="fas fa-plus mr-2"></i>Добавить книгу
                </button>
              </div>
  
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-[#7f8330]/10">
                      <th class="text-left p-3 text-[#5e1104]">ID</th>
                      <th class="text-left p-3 text-[#5e1104]">Название</th>
                      <th class="text-left p-3 text-[#5e1104]">Автор</th>
                      <th class="text-left p-3 text-[#5e1104]">Цена</th>
                      <th class="text-left p-3 text-[#5e1104]">Наличие</th>
                      <th class="text-left p-3 text-[#5e1104]">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in products" :key="product.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3">
                      <td class="p-3">{{ product.id }}</td>
                      <td class="p-3">{{ product.title }}</td>
                      <td class="p-3">{{ product.author }}</td>
                      <td class="p-3">{{ formatPrice(product.price) }} ₽</td>
                      <td class="p-3">
                        <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          В наличии
                        </span>
                      </td>
                      <td class="p-3">
                        <button class="text-[#7f8330] mr-3">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-[#5e1104]">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
  
            <!-- Заказы -->
            <div v-if="activeTab === 'orders'">
              <h3 class="text-[#5e1104] text-xl mb-6">Управление заказами</h3>
              
              <div class="space-y-4">
                <div v-for="order in orders" :key="order.id" class="border border-[#7f8330]/10 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="font-medium text-[#5e1104]">Заказ #{{ order.id }}</span>
                      <span class="text-sm text-[#6c6456] ml-3">{{ order.date }}</span>
                    </div>
                    <select 
                      v-model="order.status"
                      class="px-3 py-1 border border-[#7f8330]/30 rounded-lg text-sm"
                    >
                      <option value="new">Новый</option>
                      <option value="processing">В обработке</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменён</option>
                    </select>
                  </div>
                  
                  <p class="text-sm text-[#6c6456] mb-2">
                    Клиент: {{ order.customer }} • Сумма: {{ formatPrice(order.total) }} ₽
                  </p>
                  
                  <button class="text-[#7f8330] text-sm hover:underline">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Пользователи -->
            <div v-if="activeTab === 'users'">
              <h3 class="text-[#5e1104] text-xl mb-6">Управление пользователями</h3>
              
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-[#7f8330]/10">
                    <th class="text-left p-3 text-[#5e1104]">ID</th>
                    <th class="text-left p-3 text-[#5e1104]">Имя</th>
                    <th class="text-left p-3 text-[#5e1104]">Email</th>
                    <th class="text-left p-3 text-[#5e1104]">Роль</th>
                    <th class="text-left p-3 text-[#5e1104]">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id" class="border-b border-[#7f8330]/10">
                    <td class="p-3">{{ user.id }}</td>
                    <td class="p-3">{{ user.name }}</td>
                    <td class="p-3">{{ user.email }}</td>
                    <td class="p-3">
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="p-3">
                      <button class="text-[#7f8330] mr-3">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="text-[#5e1104]">
                        <i class="fas fa-ban"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const activeTab = ref('products')
  
  const adminMenu = [
    { id: 'products', name: 'Товары', icon: 'fas fa-book' },
    { id: 'orders', name: 'Заказы', icon: 'fas fa-shopping-bag' },
    { id: 'users', name: 'Пользователи', icon: 'fas fa-users' },
    { id: 'categories', name: 'Категории', icon: 'fas fa-tags' },
    { id: 'reviews', name: 'Отзывы', icon: 'fas fa-star' }
  ]
  
  const products = ref([
    { id: 1, title: 'Сад земных наслаждений', author: 'Иванов А.А.', price: 2450 },
    { id: 2, title: 'Искусство и природа', author: 'Петров Б.Б.', price: 3200 },
    { id: 3, title: 'Преступление и наказание', author: 'Достоевский Ф.М.', price: 2900 }
  ])
  
  const orders = ref([
    { id: 12345, date: '15.01.2026', customer: 'Иванов Иван', total: 2450, status: 'new' },
    { id: 12346, date: '20.01.2026', customer: 'Петров Петр', total: 3200, status: 'processing' },
    { id: 12347, date: '25.01.2026', customer: 'Сидорова Анна', total: 5700, status: 'delivered' }
  ])
  
  const users = ref([
    { id: 1, name: 'Иван Иванов', email: 'ivan@mail.ru', role: 'Пользователь' },
    { id: 2, name: 'Анна Белова', email: 'anna@mail.ru', role: 'Администратор' },
    { id: 3, name: 'Петр Сидоров', email: 'petr@mail.ru', role: 'Менеджер' }
  ])
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>