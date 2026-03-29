<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-[#5e1104] text-xl font-semibold">Управление отзывами</h3>
      </div>
  
      <!-- Фильтры и поиск -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6456]"></i>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Поиск по названию книги или пользователю..."
            class="form-input pl-10 w-full"
            @input="searchReviews"
          >
        </div>
        
        <select v-model="filters.status" class="form-input" @change="loadReviews">
          <option :value="null">Все отзывы</option>
          <option value="pending">На модерации</option>
          <option value="approved">Одобренные</option>
        </select>
        
        <select v-model="filters.rating" class="form-input" @change="loadReviews">
          <option :value="null">Все оценки</option>
          <option value="5">5 звезд</option>
          <option value="4">4 звезды</option>
          <option value="3">3 звезды</option>
          <option value="2">2 звезды</option>
          <option value="1">1 звезда</option>
        </select>
      </div>
  
      <!-- Таблица отзывов -->
      <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#f3d8ce]/30">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-[#7f8330]/5 to-[#5e1104]/5 border-b border-[#7f8330]/20">
              <th class="text-left p-4 text-[#5e1104] font-semibold">ID</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Книга</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Пользователь</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Оценка</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Заголовок</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Статус</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Дата</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in reviews" :key="review.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
              <td class="p-4 text-[#6c6456]">{{ review.id }}</td>
              <td class="p-4">
                <div class="font-medium text-[#5e1104]">{{ review.book?.title || '—' }}</div>
                <div class="text-xs text-[#6c6456]">Автор: {{ review.book?.author?.name || '—' }}</div>
              </td>
              <td class="p-4">
                <div class="font-medium text-[#5e1104]">{{ review.user?.name || '—' }}</div>
                <div class="text-xs text-[#6c6456]">{{ review.user?.email || '—' }}</div>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1">
                  <span class="text-yellow-500">★</span>
                  <span class="font-medium text-[#5e1104]">{{ review.rating }}</span>
                </div>
              </td>
              <td class="p-4">
                <div class="max-w-xs">
                  <div class="font-medium text-[#5e1104] truncate" :title="review.title">
                    {{ review.title || 'Без заголовка' }}
                  </div>
                  <div class="text-sm text-[#6c6456] truncate mt-1" :title="review.comment">
                    {{ review.comment || '—' }}
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                >
                  <i :class="review.is_approved ? 'fas fa-check-circle' : 'fas fa-clock'"></i>
                  {{ review.is_approved ? 'Одобрен' : 'На модерации' }}
                </span>
              </td>
              <td class="p-4 text-sm text-[#6c6456]">{{ formatDate(review.created_at) }}</td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button 
                    @click="openModal(review)" 
                    class="text-[#7f8330] hover:text-[#5e1104] transition p-1.5 rounded-lg hover:bg-[#7f8330]/10"
                    title="Просмотр"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="!review.is_approved"
                    @click="approveReview(review)" 
                    class="text-green-600 hover:text-green-700 transition p-1.5 rounded-lg hover:bg-green-50"
                    title="Одобрить"
                  >
                    <i class="fas fa-check-circle"></i>
                  </button>
                  <button 
                    @click="rejectReview(review)" 
                    class="text-red-500 hover:text-red-700 transition p-1.5 rounded-lg hover:bg-red-50"
                    title="Отклонить/Удалить"
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
            Показано {{ reviews.length }} из {{ pagination.total }} отзывов
          </div>
          <div class="flex gap-2">
            <button 
              @click="loadReviews(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
            >
              ←
            </button>
            <span class="px-3 py-1 bg-[#7f8330] text-white rounded-lg">
              {{ pagination.current_page }}
            </span>
            <button 
              @click="loadReviews(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно деталей отзыва -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-2xl p-0 w-full max-w-2xl shadow-2xl transform transition-all animate-modal-slide">
          <!-- Заголовок -->
          <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
                  <i class="fas fa-star"></i>
                  Детали отзыва
                </h3>
                <p class="text-sm text-[#6c6456] mt-1">
                  ID: {{ selectedReview?.id }}
                </p>
              </div>
              <button @click="closeModal" class="text-[#6c6456] hover:text-[#5e1104]">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          
          <div class="p-6" v-if="selectedReview">
            <!-- Информация о книге -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                <i class="fas fa-book"></i> Книга
              </h4>
              <div class="space-y-2">
                <p><span class="text-[#6c6456]">Название:</span> {{ selectedReview.book?.title || '—' }}</p>
                <p><span class="text-[#6c6456]">Автор:</span> {{ selectedReview.book?.author?.name || '—' }}</p>
              </div>
            </div>
            
            <!-- Информация о пользователе -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                <i class="fas fa-user"></i> Пользователь
              </h4>
              <div class="space-y-2">
                <p><span class="text-[#6c6456]">Имя:</span> {{ selectedReview.user?.name || '—' }}</p>
                <p><span class="text-[#6c6456]">Email:</span> {{ selectedReview.user?.email || '—' }}</p>
              </div>
            </div>
            
            <!-- Отзыв -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-[#5e1104] mb-3 flex items-center gap-2">
                <i class="fas fa-comment"></i> Отзыв
              </h4>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="text-[#6c6456]">Оценка:</span>
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-500">★</span>
                    <span class="font-medium text-[#5e1104]">{{ selectedReview.rating }}</span>
                  </div>
                </div>
                <div>
                  <span class="text-[#6c6456]">Заголовок:</span>
                  <p class="mt-1 font-medium text-[#5e1104]">{{ selectedReview.title || 'Без заголовка' }}</p>
                </div>
                <div>
                  <span class="text-[#6c6456]">Комментарий:</span>
                  <p class="mt-1 text-[#6c6456] leading-relaxed">{{ selectedReview.comment || '—' }}</p>
                </div>
                <div class="pt-2 border-t border-[#7f8330]/10">
                  <p class="text-xs text-[#6c6456]">
                    Создан: {{ formatDate(selectedReview.created_at) }}
                  </p>
                  <p v-if="selectedReview.updated_at !== selectedReview.created_at" class="text-xs text-[#6c6456]">
                    Обновлен: {{ formatDate(selectedReview.updated_at) }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex gap-3 pt-6">
              <button 
                v-if="!selectedReview.is_approved"
                @click="approveReview(selectedReview); closeModal()" 
                class="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <i class="fas fa-check-circle"></i>
                Одобрить отзыв
              </button>
              <button 
                @click="rejectReview(selectedReview); closeModal()" 
                class="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <i class="fas fa-trash-alt"></i>
                Отклонить отзыв
              </button>
              <button 
                @click="closeModal" 
                class="px-6 py-2.5 border-2 border-[#7f8330]/30 rounded-lg text-[#6c6456] hover:bg-gray-50 transition-all"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { reviewApi } from '@/api/reviews'
  import { useToast } from '@/composables/useToast'
  
  const { success, error } = useToast()
  
  const reviews = ref([])
  const showModal = ref(false)
  const selectedReview = ref(null)
  const filters = ref({
    search: '',
    status: null,
    rating: null
  })
  const searchTimeout = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })
  
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
  
  const loadReviews = async (page = 1) => {
    try {
      const params = {
        page,
        per_page: 20
      }
      
      if (filters.value.status === 'pending') {
        params.status = 'pending'
      } else if (filters.value.status === 'approved') {
        params.status = 'approved'
      }
      
      // Поиск (будем фильтровать на клиенте, так как API не поддерживает поиск)
      const response = await reviewApi.getAllReviews(params)
      if (response.data.success) {
        let data = response.data.data.data
        
        // Фильтрация по оценке на клиенте
        if (filters.value.rating) {
          data = data.filter(r => r.rating === parseInt(filters.value.rating))
        }
        
        // Поиск на клиенте
        if (filters.value.search) {
          const search = filters.value.search.toLowerCase()
          data = data.filter(r => 
            r.book?.title?.toLowerCase().includes(search) ||
            r.user?.name?.toLowerCase().includes(search) ||
            r.user?.email?.toLowerCase().includes(search)
          )
        }
        
        reviews.value = data
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err)
      error('Ошибка при загрузке отзывов')
    }
  }
  
  const searchReviews = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
      loadReviews()
    }, 500)
  }
  
  const approveReview = async (review) => {
    try {
      const response = await reviewApi.approveReview(review.id)
      if (response.data.success) {
        review.is_approved = true
        success(`Отзыв на книгу "${review.book?.title}" одобрен`)
      }
    } catch (err) {
      console.error('Error approving review:', err)
      error(err.response?.data?.message || 'Ошибка при одобрении отзыва')
    }
  }
  
  const rejectReview = async (review) => {
    if (confirm(`Вы уверены, что хотите отклонить отзыв на книгу "${review.book?.title}"?`)) {
      try {
        const response = await reviewApi.rejectReview(review.id)
        if (response.data.success) {
          success(`Отзыв на книгу "${review.book?.title}" отклонен`)
          await loadReviews()
        }
      } catch (err) {
        console.error('Error rejecting review:', err)
        error(err.response?.data?.message || 'Ошибка при отклонении отзыва')
      }
    }
  }
  
  const openModal = (review) => {
    selectedReview.value = review
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedReview.value = null
  }
  
  onMounted(() => {
    loadReviews()
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
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%237f8330' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25rem;
    padding-right: 2.5rem;
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