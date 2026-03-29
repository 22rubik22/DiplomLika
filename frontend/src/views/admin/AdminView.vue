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
         


          <!-- Жанры (новая вкладка) -->
          <div v-if="activeTab === 'genres'">
            <GenreManager />
          </div>

          <div v-if="activeTab === 'authors'">
  <AuthorManager />
</div>

<div v-if="activeTab === 'books'">
  <BookManager />
</div>

<div v-if="activeTab === 'orders'">
  <OrderManager />
</div>

<div v-if="activeTab === 'reviews'">
  <ReviewManager />
</div>

<div v-if="activeTab === 'events'">
    <EventManager />
  </div>

  <div v-if="activeTab === 'bookcrossing'">
    <BookcrossingManager />
  </div>
         
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GenreManager from './components/GenreManager.vue'
import AuthorManager from './components/AuthorManager.vue'
import BookManager from './components/BookManager.vue'
import OrderManager from './components/OrderManager.vue'
import ReviewManager from './components/ReviewManager.vue'
import EventManager from './components/EventManager.vue'
import BookcrossingManager from './components/BookcrossingManager.vue'

const activeTab = ref('books')

const adminMenu = [
  { id: 'books', name: 'Книги', icon: 'fas fa-book' },
  { id: 'authors', name: 'Авторы', icon: 'fas fa-users' },
  { id: 'genres', name: 'Жанры', icon: 'fas fa-tags' },
  { id: 'reviews', name: 'Отзывы', icon: 'fas fa-star' },
  { id: 'orders', name: 'Заказы', icon: 'fas fa-shopping-cart' },
  { id: 'bookcrossing', name: 'Буккроссинг', icon: 'fas fa-exchange-alt' },
  { id: 'events', name: 'Мероприятия', icon: 'fas fa-calendar-alt' }
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