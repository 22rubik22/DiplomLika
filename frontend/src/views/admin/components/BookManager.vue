<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-[#5e1104] text-xl font-semibold">Управление книгами</h3>
        <button 
          @click="openModal()" 
          class="bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <i class="fas fa-plus text-sm"></i>
          Добавить книгу
        </button>
      </div>
  
      <!-- Фильтры и поиск -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6456]"></i>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Поиск по названию..."
            class="form-input pl-10 w-full"
            @input="searchBooks"
          >
        </div>
        
        <select v-model="filters.author_id" class="form-input" @change="loadBooks">
          <option :value="null">Все авторы</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
        
        <select v-model="filters.genre_id" class="form-input" @change="loadBooks">
          <option :value="null">Все жанры</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
        
        <select v-model="filters.status" class="form-input" @change="loadBooks">
          <option :value="null">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="featured">Рекомендуемые</option>
          <option value="new">Новинки</option>
          <option value="bestseller">Бестселлеры</option>
        </select>
      </div>
  
      <!-- Таблица книг -->
      <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#f3d8ce]/30">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-[#7f8330]/5 to-[#5e1104]/5 border-b border-[#7f8330]/20">
              <th class="text-left p-4 text-[#5e1104] font-semibold">ID</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Обложка</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Название</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Автор</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Жанр</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Цена</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Остаток</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Статус</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
             </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
              <td class="p-4 text-[#6c6456]">{{ book.id }}</td>
              <td class="p-4">
                <div class="w-12 h-16 rounded-lg bg-gradient-to-br from-[#7f8330]/20 to-[#5e1104]/20 flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="book.cover_image" 
                    :src="getFullImageUrl(book.cover_image)" 
                    :alt="book.title"
                    class="w-full h-full object-cover"
                  >
                  <i v-else class="fas fa-book text-[#7f8330] text-xl"></i>
                </div>
              </td>
              <td class="p-4 font-medium text-[#5e1104]">{{ book.title }}</td>
              <td class="p-4 text-[#6c6456]">{{ book.authors?.name || '—' }}</td>
              <td class="p-4 text-[#6c6456]">{{ book.genre?.name || '—' }}</td>
              <td class="p-4 font-medium text-[#5e1104]">{{ formatPrice(book.price) }} ₽</td>
              <td class="p-4">
                <span :class="book.is_in_stock ? 'text-green-600' : 'text-red-500'">
                  {{ book.is_in_stock ? 'В наличии' : 'Нет в наличии' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex flex-wrap gap-1">
                  <span v-if="book.is_featured" class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    <i class="fas fa-star"></i> Рек.
                  </span>
                  <span v-if="book.is_new" class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    Новинка
                  </span>
                  <span v-if="book.is_bestseller" class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    Бестселлер
                  </span>
                </div>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button 
                    @click="openModal(book)" 
                    class="text-[#7f8330] hover:text-[#5e1104] transition p-1.5 rounded-lg hover:bg-[#7f8330]/10"
                    title="Редактировать"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteBook(book)" 
                    class="text-red-500 hover:text-red-700 transition p-1.5 rounded-lg hover:bg-red-50"
                    title="Удалить"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Пагинация -->
        <div v-if="pagination.last_page > 1" class="px-4 py-3 border-t border-[#7f8330]/10 flex justify-between items-center">
          <div class="text-sm text-[#6c6456]">
            Показано {{ books.length }} из {{ pagination.total }} книг
          </div>
          <div class="flex gap-2">
            <button 
              @click="loadBooks(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
            >
              ←
            </button>
            <span class="px-3 py-1 bg-[#7f8330] text-white rounded-lg">
              {{ pagination.current_page }}
            </span>
            <button 
              @click="loadBooks(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно -->
      <BookForm 
        v-if="showModal"
        :book="editingBook"
        :authors="authors"
        :genres="genres"
        @close="closeModal"
        @saved="onBookSaved"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { bookApi } from '@/api/books'
  import { authorApi } from '@/api/authors'
  import { genreApi } from '@/api/genres'
  import { useToast } from '@/composables/useToast'
  import BookForm from './BookForm.vue'
  
  const { success, error } = useToast()
  
  const books = ref([])
  const authors = ref([])
  const genres = ref([])
  const showModal = ref(false)
  const editingBook = ref(null)
  const filters = ref({
    search: '',
    author_id: null,
    genre_id: null,
    status: null
  })
  const searchTimeout = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })
  
  const getFullImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://ivybook.ru'
    return `${baseUrl}${path}`
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  
  const loadAuthors = async () => {
    try {
      const response = await authorApi.getAuthors()
      if (response.data.success) {
        authors.value = response.data.data
      }
    } catch (err) {
      console.error('Error loading authors:', err)
    }
  }
  
  const loadGenres = async () => {
    try {
      const response = await genreApi.getGenres()
      if (response.data.success) {
        genres.value = response.data.data
      }
    } catch (err) {
      console.error('Error loading genres:', err)
    }
  }
  
  const loadBooks = async (page = 1) => {
    try {
      const params = {
        page,
        per_page: 20,
        ...filters.value
      }
      
      if (params.status === 'active') params.is_active = true
      if (params.status === 'inactive') params.is_active = false
      if (params.status === 'featured') params.featured = true
      if (params.status === 'new') params.new = true
      if (params.status === 'bestseller') params.bestseller = true
      delete params.status
      
      const response = await bookApi.getBooks(params)
      if (response.data.success) {
        books.value = response.data.data.data
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        }
      }
    } catch (err) {
      console.error('Error loading books:', err)
      error('Ошибка при загрузке книг')
    }
  }
  
  const searchBooks = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
      loadBooks()
    }, 500)
  }
  
  const openModal = (book = null) => {
    editingBook.value = book
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    editingBook.value = null
  }
  
  const onBookSaved = () => {
    loadBooks()
    closeModal()
  }
  
  const deleteBook = async (book) => {
    if (confirm(`Вы уверены, что хотите удалить книгу "${book.title}"?`)) {
      try {
        const response = await bookApi.deleteBook(book.id)
        if (response.data.success) {
          success('Книга успешно удалена')
          await loadBooks()
        }
      } catch (err) {
        console.error('Error deleting book:', err)
        error(err.response?.data?.message || 'Ошибка при удалении книги')
      }
    }
  }
  
  onMounted(() => {
    loadAuthors()
    loadGenres()
    loadBooks()
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
  </style>