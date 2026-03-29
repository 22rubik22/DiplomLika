<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-[#5e1104] text-xl font-semibold">Управление буккроссингом</h3>
        <button 
          @click="openModal()" 
          class="bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <i class="fas fa-plus text-sm"></i>
          Добавить книгу
        </button>
      </div>
  
      <!-- Фильтры -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6456]"></i>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Поиск по названию или автору..."
            class="form-input pl-10 w-full"
            @input="searchBooks"
          >
        </div>
        
        <select v-model="filters.status" class="form-input" @change="loadBooks">
          <option :value="null">Все статусы</option>
          <option value="available">Доступна</option>
          <option value="taken">Взята</option>
          <option value="reserved">Забронирована</option>
        </select>
        
        <input 
          v-model="filters.location"
          type="text"
          placeholder="Поиск по местоположению..."
          class="form-input"
          @input="searchBooks"
        >
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
              <th class="text-left p-4 text-[#5e1104] font-semibold">Владелец</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Местоположение</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Статус</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Кто взял</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
              <td class="p-4 text-[#6c6456]">{{ book.id }}</td>
              <td class="p-4">
                <div class="w-12 h-16 rounded-lg bg-gradient-to-br from-[#7f8330]/20 to-[#5e1104]/20 flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="book.image" 
                    :src="getFullImageUrl(book.image)" 
                    :alt="book.title"
                    class="w-full h-full object-cover"
                  >
                  <i v-else class="fas fa-book text-[#7f8330] text-xl"></i>
                </div>
              </td>
              <td class="p-4 font-medium text-[#5e1104]">{{ book.title }}</td>
              <td class="p-4 text-[#6c6456]">{{ book.author }}</td>
              <td class="p-4">
                <div class="text-sm">
                  <div class="font-medium text-[#5e1104]">{{ book.owner?.name || '—' }}</div>
                  <div class="text-xs text-[#6c6456]">{{ book.owner?.email || '' }}</div>
                </div>
              </td>
              <td class="p-4 text-[#6c6456]">{{ book.location || '—' }}</td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(book.status)"
                >
                  <i :class="getStatusIcon(book.status)"></i>
                  {{ getStatusName(book.status) }}
                </span>
              </td>
              <td class="p-4">
                <div v-if="book.taken_by" class="text-sm">
                  <div class="font-medium text-[#5e1104]">{{ book.taken_by?.name || '—' }}</div>
                  <div class="text-xs text-[#6c6456]">{{ formatDate(book.taken_at) }}</div>
                </div>
                <span v-else class="text-[#6c6456]">—</span>
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
                    v-if="book.status === 'taken'"
                    @click="forceReturn(book)" 
                    class="text-orange-600 hover:text-orange-700 transition p-1.5 rounded-lg hover:bg-orange-50"
                    title="Принудительный возврат"
                  >
                    <i class="fas fa-undo-alt"></i>
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
  
      <!-- Модальное окно для создания/редактирования -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-2xl p-0 w-full max-w-2xl shadow-2xl transform transition-all animate-modal-slide">
          <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20">
            <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
              <i :class="editingBook ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ editingBook ? 'Редактировать книгу' : 'Добавить книгу в буккроссинг' }}
            </h3>
          </div>
          
          <form @submit.prevent="saveBook" class="p-6">
            <div class="space-y-5">
              <!-- Название -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  Название книги <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.title"
                  type="text"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.title }"
                  required
                >
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title[0] }}</p>
              </div>
              
              <!-- Автор -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  Автор <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.author"
                  type="text"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.author }"
                  required
                >
                <p v-if="errors.author" class="text-red-500 text-xs mt-1">{{ errors.author[0] }}</p>
              </div>
              
              <!-- Местоположение -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">Местоположение</label>
                <input 
                  v-model="form.location"
                  type="text"
                  class="form-input w-full"
                  placeholder="Где находится книга"
                >
              </div>
              
              <!-- Статус (только для редактирования) -->
              <div v-if="editingBook">
                <label class="block text-[#5e1104] font-medium mb-2">Статус</label>
                <select v-model="form.status" class="form-input w-full">
                  <option value="available">Доступна</option>
                  <option value="taken">Взята</option>
                  <option value="reserved">Забронирована</option>
                </select>
              </div>
              
              <!-- Описание -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">Описание</label>
                <textarea 
                  v-model="form.description"
                  rows="4"
                  class="form-input w-full resize-none"
                  placeholder="Краткое описание книги, состояние..."
                ></textarea>
              </div>
              
              <!-- URL изображения -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">URL изображения</label>
                <input 
                  v-model="form.image"
                  type="url"
                  class="form-input w-full"
                  placeholder="https://..."
                >
              </div>
              
              <!-- Кнопки -->
              <div class="flex gap-3 pt-4">
                <button 
                  type="submit"
                  class="flex-1 bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  :disabled="loading"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  {{ loading ? 'Сохранение...' : (editingBook ? 'Сохранить' : 'Добавить') }}
                </button>
                <button 
                  type="button"
                  @click="closeModal"
                  class="px-6 py-2.5 border-2 border-[#7f8330]/30 rounded-lg text-[#6c6456] hover:bg-gray-50"
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Модальное окно просмотра деталей -->
      <div v-if="showDetailsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeDetailsModal">
        <div class="bg-white rounded-2xl p-0 w-full max-w-2xl shadow-2xl transform transition-all animate-modal-slide">
          <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold text-[#5e1104]">Детали книги</h3>
              <button @click="closeDetailsModal" class="text-[#6c6456] hover:text-[#5e1104]">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          
          <div class="p-6" v-if="selectedBook">
            <div class="flex gap-6">
              <!-- Обложка -->
              <div class="w-32 flex-shrink-0">
                <div class="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-[#7f8330]/20 to-[#5e1104]/20 flex items-center justify-center">
                  <img 
                    v-if="selectedBook.image" 
                    :src="getFullImageUrl(selectedBook.image)" 
                    :alt="selectedBook.title"
                    class="w-full h-full object-cover"
                  >
                  <i v-else class="fas fa-book text-4xl text-[#7f8330]"></i>
                </div>
              </div>
              
              <!-- Информация -->
              <div class="flex-1 space-y-3">
                <div>
                  <h4 class="text-xl font-bold text-[#5e1104]">{{ selectedBook.title }}</h4>
                  <p class="text-[#7f8330] font-medium">{{ selectedBook.author }}</p>
                </div>
                
                <div>
                  <span class="text-[#6c6456]">Статус:</span>
                  <span class="ml-2 px-2 py-1 rounded-full text-xs" :class="getStatusClass(selectedBook.status)">
                    {{ getStatusName(selectedBook.status) }}
                  </span>
                </div>
                
                <div v-if="selectedBook.location">
                  <span class="text-[#6c6456]">Местоположение:</span>
                  <span class="ml-2 text-[#5e1104]">{{ selectedBook.location }}</span>
                </div>
                
                <div v-if="selectedBook.owner">
                  <span class="text-[#6c6456]">Владелец:</span>
                  <span class="ml-2 text-[#5e1104]">{{ selectedBook.owner.name }}</span>
                </div>
                
                <div v-if="selectedBook.taken_by">
                  <span class="text-[#6c6456]">Взял:</span>
                  <span class="ml-2 text-[#5e1104]">{{ selectedBook.taken_by.name }}</span>
                  <div class="text-xs text-[#6c6456]">{{ formatDate(selectedBook.taken_at) }}</div>
                </div>
                
                <div v-if="selectedBook.description">
                  <span class="text-[#6c6456]">Описание:</span>
                  <p class="mt-1 text-[#6c6456]">{{ selectedBook.description }}</p>
                </div>
                
                <div class="text-xs text-[#6c6456] pt-2">
                  Добавлена: {{ formatDate(selectedBook.created_at) }}
                  <span v-if="selectedBook.released_at"><br>Возвращена: {{ formatDate(selectedBook.released_at) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex gap-3 pt-6 mt-4 border-t border-[#7f8330]/10">
              <button 
                @click="openModal(selectedBook); closeDetailsModal()" 
                class="flex-1 bg-[#7f8330] text-white py-2 rounded-lg hover:bg-[#5e1104] transition"
              >
                <i class="fas fa-edit mr-2"></i>Редактировать
              </button>
              <button 
                v-if="selectedBook.status === 'taken'"
                @click="forceReturn(selectedBook); closeDetailsModal()" 
                class="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <i class="fas fa-undo-alt mr-2"></i>Принудительный возврат
              </button>
              <button 
                @click="deleteBook(selectedBook); closeDetailsModal()" 
                class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                <i class="fas fa-trash-alt mr-2"></i>Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { bookcrossingApi } from '@/api/bookcrossing'
  import { useToast } from '@/composables/useToast'
  
  const { success, error } = useToast()
  
  const books = ref([])
  const showModal = ref(false)
  const showDetailsModal = ref(false)
  const editingBook = ref(null)
  const selectedBook = ref(null)
  const loading = ref(false)
  const errors = ref({})
  
  const filters = ref({
    search: '',
    status: null,
    location: ''
  })
  
  const searchTimeout = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })
  
  const form = ref({
    title: '',
    author: '',
    description: '',
    location: '',
    image: '',
    status: 'available'
  })
  
  const getFullImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://ivybook.ru'
    return `${baseUrl}${path}`
  }
  
  const getStatusName = (status) => {
    const names = {
      available: 'Доступна',
      taken: 'Взята',
      reserved: 'Забронирована'
    }
    return names[status] || status
  }
  
  const getStatusClass = (status) => {
    const classes = {
      available: 'bg-green-100 text-green-700',
      taken: 'bg-red-100 text-red-700',
      reserved: 'bg-yellow-100 text-yellow-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }
  
  const getStatusIcon = (status) => {
    const icons = {
      available: 'fas fa-check-circle',
      taken: 'fas fa-hand-holding-heart',
      reserved: 'fas fa-clock'
    }
    return icons[status] || 'fas fa-circle'
  }
  
  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const loadBooks = async (page = 1) => {
    try {
      const params = {
        page,
        per_page: 20
      }
      
      if (filters.value.status) params.status = filters.value.status
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.location) params.location = filters.value.location
      
      const response = await bookcrossingApi.getBooks(params)
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
    searchTimeout.value = setTimeout(() => loadBooks(), 500)
  }
  
  const openModal = (book = null) => {
    editingBook.value = book
    errors.value = {}
    
    if (book) {
      form.value = {
        title: book.title,
        author: book.author,
        description: book.description || '',
        location: book.location || '',
        image: book.image || '',
        status: book.status
      }
    } else {
      form.value = {
        title: '',
        author: '',
        description: '',
        location: '',
        image: '',
        status: 'available'
      }
    }
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    editingBook.value = null
    form.value = {
      title: '',
      author: '',
      description: '',
      location: '',
      image: '',
      status: 'available'
    }
  }
  
  const saveBook = async () => {
    loading.value = true
    errors.value = {}
    
    try {
      const data = {
        title: form.value.title,
        author: form.value.author,
        description: form.value.description || null,
        location: form.value.location || null,
        image: form.value.image || null
      }
      
      if (editingBook.value) {
        // Для админа - обновление
        if (form.value.status) data.status = form.value.status
        await bookcrossingApi.updateBook(editingBook.value.id, data)
        success('Книга обновлена')
      } else {
        await bookcrossingApi.addBook(data)
        success('Книга добавлена в буккроссинг')
      }
      
      await loadBooks()
      closeModal()
    } catch (err) {
      console.error('Error saving book:', err)
      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
        error(Object.values(errors.value).flat().join('\n'))
      } else {
        error('Ошибка при сохранении')
      }
    } finally {
      loading.value = false
    }
  }
  
  const deleteBook = async (book) => {
    if (confirm(`Вы уверены, что хотите удалить книгу "${book.title}" из буккроссинга?`)) {
      try {
        await bookcrossingApi.deleteBook(book.id)
        success('Книга удалена')
        await loadBooks()
      } catch (err) {
        error(err.response?.data?.message || 'Ошибка при удалении')
      }
    }
  }
  
  const forceReturn = async (book) => {
    if (confirm(`Принудительно вернуть книгу "${book.title}"?`)) {
      try {
        await bookcrossingApi.forceReturn(book.id)
        success('Книга принудительно возвращена')
        await loadBooks()
      } catch (err) {
        error(err.response?.data?.message || 'Ошибка при возврате')
      }
    }
  }
  
  const openDetails = (book) => {
    selectedBook.value = book
    showDetailsModal.value = true
  }
  
  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedBook.value = null
  }
  
  onMounted(() => {
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
  
  select.form-input {
    cursor: pointer;
  }
  
  @keyframes modalSlide {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-modal-slide {
    animation: modalSlide 0.2s ease-out;
  }
  </style>