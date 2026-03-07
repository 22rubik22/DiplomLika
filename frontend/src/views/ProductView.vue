<template>
    <div v-if="book">
      <h1 class="page-title">{{ book.title }}</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Изображение книги -->
          <div class="bg-gradient-to-br from-[#f3d8ce] to-[#f8e6df] rounded-xl flex items-center justify-center p-8">
            <img 
              :src="book.image" 
              :alt="book.title"
              class="w-4/5 max-h-96 object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
            >
          </div>
  
          <!-- Информация о книге -->
          <div>
            <h2 class="font-['Playfair_Display'] text-4xl text-[#5e1104] mb-4">{{ book.title }}</h2>
            <p class="text-xl text-[#7f8330] mb-6">{{ book.author }}</p>
            
            <!-- Цена и наличие -->
            <div class="mb-8">
              <div class="flex items-baseline gap-5 mb-3">
                <span class="text-4xl text-[#5e1104] font-medium">{{ formatPrice(book.price) }} ₽</span>
                <span v-if="book.oldPrice" class="text-xl text-[#6c6456] line-through">{{ formatPrice(book.oldPrice) }} ₽</span>
                <span v-if="book.discount" class="bg-[#5e1104] text-white px-4 py-1.5 rounded-full text-sm">
                  Скидка {{ book.discount }}%
                </span>
              </div>
              <p class="text-[#7f8330]">
                <i class="fas fa-check-circle mr-2"></i>
                {{ book.inStock ? 'В наличии' : 'Нет в наличии' }}
              </p>
            </div>
  
            <!-- Количество и кнопки -->
            <div class="mb-8">
              <div class="flex flex-wrap gap-4 items-center">
                <div class="flex items-center gap-3">
                  <button 
                    @click="decrementQuantity"
                    class="w-10 h-10 border border-[#7f8330] rounded-lg hover:bg-[#7f8330]/10 transition-colors"
                    :disabled="quantity <= 1"
                  >
                    -
                  </button>
                  <span class="text-lg w-8 text-center">{{ quantity }}</span>
                  <button 
                    @click="incrementQuantity"
                    class="w-10 h-10 border border-[#7f8330] rounded-lg hover:bg-[#7f8330]/10 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  @click="addToCart"
                  class="btn-primary px-10 py-3"
                  :disabled="!book.inStock"
                >
                  Добавить в корзину
                </button>
                
                <button 
                  @click="toggleFavorite"
                  class="w-12 h-12 border border-[#7f8330] rounded-lg hover:bg-[#7f8330]/10 transition-colors"
                  :class="{ 'text-[#5e1104]': isFavorite }"
                >
                  <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
              </div>
            </div>
  
            <!-- Описание -->
            <div>
              <h3 class="text-[#5e1104] text-xl mb-4">О книге</h3>
              <p class="text-[#6c6456] leading-relaxed">{{ book.description }}</p>
            </div>
  
            <!-- Характеристики -->
            <div class="mt-6 pt-6 border-t border-[#7f8330]/10">
              <dl class="grid grid-cols-2 gap-4">
                <div v-for="(value, key) in book.specs" :key="key">
                  <dt class="text-sm text-[#6c6456]">{{ key }}</dt>
                  <dd class="font-medium text-[#5e1104]">{{ value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Загрузка или ошибка -->
    <div v-else class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-[#7f8330]"></i>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const book = ref(null)
  const quantity = ref(1)
  const isFavorite = ref(false)
  
  // Загрузка данных о книге
  onMounted(() => {
    const bookId = route.params.id
    // Здесь будет запрос к API
    // Пока используем моковые данные
    loadMockBook(bookId)
  })
  
  const loadMockBook = (id) => {
    // Имитация загрузки данных
    book.value = {
      id: parseInt(id),
      title: 'Сад земных наслаждений',
      author: 'Иллюстрированное издание',
      price: 2450,
      oldPrice: 3200,
      discount: 24,
      inStock: true,
      image: 'https://covers.books2you.ru/covers2/9785699970955.jpg',
      description: 'Уникальное иллюстрированное издание с комментариями искусствоведов. Более 150 цветных репродукций, мелованная бумага, шелковый переплет.',
      specs: {
        'Издательство': 'Искусство XXI',
        'Год издания': '2023',
        'Страниц': '320',
        'Переплет': 'Твердый, шелк',
        'Формат': '70x100/16',
        'ISBN': '978-5-699-97095-5'
      }
    }
  }
  
  const incrementQuantity = () => {
    quantity.value++
  }
  
  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--
    }
  }
  
  const addToCart = () => {
    console.log(`Добавлено в корзину: ${book.value.title}, количество: ${quantity.value}`)
    // Здесь будет логика добавления в корзину
  }
  
  const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    console.log(isFavorite.value ? 'Добавлено в избранное' : 'Удалено из избранного')
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>