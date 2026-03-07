<template>
    <div>
      <h1 class="page-title">Избранное</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div v-if="favorites.length" class="books-grid">
          <div 
            v-for="book in favorites" 
            :key="book.id"
            class="book-card"
          >
            <div class="book-image">
              <img :src="book.image" :alt="book.title">
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <p class="book-price">{{ formatPrice(book.price) }} ₽</p>
              
              <div class="flex gap-2 mt-4">
                <button 
                  @click="addToCart(book)"
                  class="btn flex-1 py-2"
                >
                  В корзину
                </button>
                <button 
                  @click="removeFromFavorites(book.id)"
                  class="w-10 h-10 border border-[#7f8330] rounded-lg hover:bg-[#7f8330]/10 text-[#5e1104]"
                >
                  <i class="fas fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-16">
          <i class="far fa-heart text-6xl text-[#7f8330]/30 mb-4"></i>
          <p class="text-xl text-[#6c6456] mb-4">В избранном пока нет товаров</p>
          <router-link to="/catalog" class="inline-block btn-primary px-8 py-3">
            Перейти в каталог
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const favorites = ref([
    {
      id: 1,
      title: 'Сад земных наслаждений',
      author: 'Иллюстрированное издание',
      price: 2450,
      image: 'https://covers.books2you.ru/covers2/9785699970955.jpg'
    },
    {
      id: 2,
      title: 'Искусство и природа',
      author: 'Анна Белова',
      price: 3200,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg'
    }
  ])
  
  const addToCart = (book) => {
    console.log('Добавлено в корзину:', book)
    // Здесь будет логика добавления в корзину
  }
  
  const removeFromFavorites = (id) => {
    favorites.value = favorites.value.filter(book => book.id !== id)
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>
  
  <style scoped>
  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
  }
  
  .book-card {
    @apply bg-white rounded-xl overflow-hidden shadow-[0_5px_25px_rgba(0,0,0,0.05)] 
           transition-all duration-700 border border-[#f3d8ce]/50 
           hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2.5;
  }
  
  .book-image {
    @apply h-64 bg-gradient-to-br from-[#f3d8ce] to-[#f8e6df] 
           flex items-center justify-center overflow-hidden;
  }
  
  .book-image img {
    @apply w-2/3 h-auto object-contain filter 
           drop-shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-700 
           group-hover:scale-105;
  }
  
  .book-info {
    @apply p-5;
  }
  
  .book-title {
    @apply font-['Playfair_Display'] text-lg text-[#5e1104] mb-1 leading-tight;
  }
  
  .book-author {
    @apply text-sm text-[#6c6456] mb-3;
  }
  
  .book-price {
    @apply text-xl text-[#5e1104] font-medium;
  }
  </style>