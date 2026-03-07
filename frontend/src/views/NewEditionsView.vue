<template>
    <div>
      <h1 class="page-title">Новые переиздания</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <p class="text-lg text-[#6c6456] mb-8">
          Лимитированные и подарочные издания классических произведений
        </p>
        
        <div class="space-y-8">
          <div 
            v-for="book in newEditions" 
            :key="book.id"
            class="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-6 border border-[#7f8330]/10 rounded-xl hover:shadow-md transition-shadow"
          >
            <div class="bg-gradient-to-br from-[#f3d8ce] to-[#f8e6df] rounded-lg flex items-center justify-center p-4">
              <img :src="book.image" :alt="book.title" class="w-32 h-40 object-contain">
            </div>
            
            <div>
              <h3 class="text-[#5e1104] text-2xl font-['Playfair_Display'] mb-3">{{ book.title }}</h3>
              <p class="text-[#7f8330] mb-2">{{ book.author }}</p>
              <p class="text-[#6c6456] mb-4">{{ book.description }}</p>
              
              <div class="flex items-center gap-4">
                <span class="text-2xl text-[#5e1104] font-medium">{{ formatPrice(book.price) }} ₽</span>
                <span class="bg-[#7f8330] text-white px-3 py-1 rounded-full text-sm">
                  Лимитированное издание
                </span>
              </div>
              
              <div class="flex gap-3 mt-4">
                <button @click="addToCart(book)" class="btn-primary px-6 py-2">
                  В корзину
                </button>
                <button @click="goToProduct(book.id)" class="btn px-6 py-2">
                  Подробнее
                </button>
              </div>
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
  
  const newEditions = ref([
    {
      id: 1,
      title: 'Преступление и наказание',
      author: 'Ф.М. Достоевский',
      price: 2900,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg',
      description: 'Лимитированное издание к 160-летию романа. С иллюстрациями в стиле модерн, обложка с тиснением, нумерованный экземпляр.'
    },
    {
      id: 2,
      title: 'Мастер и Маргарита',
      author: 'М. Булгаков',
      price: 3200,
      image: 'https://covers.books2you.ru/covers2/9785699970955.jpg',
      description: 'Подарочное издание с комментариями, цветными иллюстрациями и шелковым переплетом. Тираж ограничен.'
    },
    {
      id: 3,
      title: 'Война и мир',
      author: 'Л.Н. Толстой',
      price: 4500,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg',
      description: 'Двухтомное издание в кожаном переплете с золотым обрезом. Репродукции исторических документов и карт.'
    }
  ])
  
  const addToCart = (book) => {
    console.log('Добавлено в корзину:', book)
  }
  
  const goToProduct = (id) => {
    router.push(`/product/${id}`)
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>