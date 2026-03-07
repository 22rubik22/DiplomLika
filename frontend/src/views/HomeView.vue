<template>
  <div>
    <h1 class="font-['Playfair_Display'] text-4xl md:text-5xl text-[#5e1104] mb-10 pb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r after:from-[#7f8330] after:to-[#b59b6d]">
      Книги, обвитые плющом времени
    </h1>
    
    <div class="bg-white rounded-xl p-8 md:p-10 mb-10 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
      <p class="text-lg leading-relaxed mb-8">
        Добро пожаловать в «Плющ Бермана & Книги» — уникальное пространство, где каждая книга представляет собой произведение искусства. Мы тщательно отбираем издания, сочетающие в себе глубокое содержание и изысканную форму.
      </p>
      
      <!-- Сетка книг -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <BookCard 
          v-for="book in featuredBooks" 
          :key="book.id"
          :book="book"
          @click="goToProduct(book.id)"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BookCard from '@/components/ui/BookCard.vue'

const router = useRouter()

const featuredBooks = ref([
  {
    id: 1,
    title: 'Сад земных наслаждений',
    author: 'Иллюстрированное издание, 2022',
    price: 2450,
    image: 'https://covers.books2you.ru/covers2/9785699970955.jpg'
  },
  // Добавьте остальные книги по аналогии
])

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

const addToCart = (book) => {
  console.log('Добавлено в корзину:', book)
  // Здесь будет логика добавления в корзину
}
</script>