<template>
    <div>
      <h1 class="page-title">Каталог книг</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <!-- Фильтры и поиск -->
        <div class="flex flex-col md:flex-row gap-5 mb-8">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Поиск по названию или автору..." 
            class="flex-1 px-5 py-3 border border-[#7f8330]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[#7f8330] focus:ring-3 focus:ring-[#7f8330]/10 transition-all"
          >
          <select 
            v-model="selectedCategory"
            class="px-5 py-3 border border-[#7f8330]/30 rounded-lg bg-white/80 focus:outline-none focus:border-[#7f8330] md:w-64"
          >
            <option value="">Все категории</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button 
            @click="applyFilters"
            class="btn-primary px-8 py-3"
          >
            Найти
          </button>
        </div>
  
        <!-- Сетка книг -->
        <div v-if="filteredBooks.length" class="books-grid">
          <BookCard 
            v-for="book in filteredBooks" 
            :key="book.id"
            :book="book"
            :show-details="true"
            @click="goToProduct(book.id)"
            @add-to-cart="addToCart"
            @show-details="goToProduct(book.id)"
          />
        </div>
        
        <!-- Сообщение, если книг нет -->
        <div v-else class="text-center py-16">
          <i class="fas fa-book-open text-6xl text-[#7f8330]/30 mb-4"></i>
          <p class="text-xl text-[#6c6456]">Книги не найдены</p>
          <button @click="resetFilters" class="text-[#5e1104] underline mt-4">
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import BookCard from '@/components/ui/BookCard.vue'
  
  const router = useRouter()
  const searchQuery = ref('')
  const selectedCategory = ref('')
  
  const categories = [
    'Художественная литература',
    'Научная литература',
    'Детские книги',
    'Искусство',
    'Поэзия',
    'Философия'
  ]
  
  const books = ref([
    {
      id: 1,
      title: 'Сад земных наслаждений',
      author: 'Иллюстрированное издание',
      price: 3200,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg',
      category: 'Искусство'
    },
    {
      id: 2,
      title: 'Искусство и природа',
      author: 'Анна Белова',
      price: 2450,
      image: 'https://covers.books2you.ru/covers2/9785699970955.jpg',
      category: 'Искусство'
    },
    {
      id: 3,
      title: 'Преступление и наказание',
      author: 'Ф.М. Достоевский',
      price: 2900,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg',
      category: 'Художественная литература'
    },
    {
      id: 4,
      title: 'Мастер и Маргарита',
      author: 'М. Булгаков',
      price: 2800,
      image: 'https://covers.books2you.ru/covers2/9785699970955.jpg',
      category: 'Художественная литература'
    },
    {
      id: 5,
      title: 'История искусства',
      author: 'Э. Гомбрих',
      price: 4500,
      image: 'https://covers.books2you.ru/covers2/9785171476303.jpg',
      category: 'Научная литература'
    }
  ])
  
  const filteredBooks = computed(() => {
    return books.value.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = !selectedCategory.value || book.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
  })
  
  const applyFilters = () => {
    // Фильтрация уже происходит через computed
    console.log('Применены фильтры')
  }
  
  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
  }
  
  const goToProduct = (id) => {
    router.push(`/product/${id}`)
  }
  
  const addToCart = (book) => {
    console.log('Добавлено в корзину:', book)
    // Здесь будет логика добавления в корзину
  }
  </script>
  
  <style scoped>
  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
  }
  </style>