<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-[#5e1104] text-xl font-semibold">Управление жанрами</h3>
        <button 
          @click="openModal()" 
          class="bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <i class="fas fa-plus text-sm"></i>
          Добавить жанр
        </button>
      </div>
  
      <!-- Таблица жанров -->
      <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#f3d8ce]/30">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-[#7f8330]/5 to-[#5e1104]/5 border-b border-[#7f8330]/20">
              <th class="text-left p-4 text-[#5e1104] font-semibold">ID</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Название</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Slug</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Родитель</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Порядок</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Статус</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="genre in genres" :key="genre.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
              <td class="p-4 text-[#6c6456]">{{ genre.id }}</td>
              <td class="p-4 font-medium text-[#5e1104]">{{ genre.name }}</td>
              <td class="p-4 text-sm text-[#6c6456] font-mono">{{ genre.slug }}</td>
              <td class="p-4">
                <span v-if="genre.parent" class="text-sm text-[#7f8330]">
                  <i class="fas fa-folder-open mr-1 text-xs"></i>
                  {{ genre.parent.name }}
                </span>
                <span v-else class="text-sm text-[#6c6456]">—</span>
              </td>
              <td class="p-4 text-[#6c6456]">{{ genre.sort_order }}</td>
              <td class="p-4">
                <button 
                  @click="toggleActive(genre)"
                  class="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  :class="genre.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                >
                  <i :class="genre.is_active ? 'fas fa-check-circle' : 'fas fa-circle'" class="mr-1 text-xs"></i>
                  {{ genre.is_active ? 'Активен' : 'Неактивен' }}
                </button>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button 
                    @click="openModal(genre)" 
                    class="text-[#7f8330] hover:text-[#5e1104] transition p-1.5 rounded-lg hover:bg-[#7f8330]/10"
                    title="Редактировать"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteGenre(genre)" 
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
      </div>
  
      <!-- Модальное окно для создания/редактирования жанра -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-2xl p-0 w-full max-w-lg shadow-2xl transform transition-all animate-modal-slide">
          <!-- Заголовок модалки -->
          <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20">
            <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
              <i :class="editingGenre ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ editingGenre ? 'Редактировать жанр' : 'Создать новый жанр' }}
            </h3>
            <p class="text-sm text-[#6c6456] mt-1">
              {{ editingGenre ? 'Измените данные жанра' : 'Заполните информацию о новом жанре' }}
            </p>
          </div>
          
          <form @submit.prevent="saveGenre" class="p-6">
            <div class="space-y-5">
              <!-- Название -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-tag mr-2 text-sm"></i>
                  Название <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.name"
                  type="text"
                  class="form-input w-full"
                  :class="{ 'border-red-500 focus:border-red-500': errors.name }"
                  placeholder="Например: Классическая литература"
                  required
                  @input="generateSlug"
                >
                <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
              </div>
              
              <!-- Slug -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-link mr-2 text-sm"></i>
                  URL-идентификатор (Slug)
                </label>
                <div class="relative">
                  <input 
                    v-model="form.slug"
                    type="text"
                    class="form-input w-full font-mono text-sm"
                    placeholder="klassicheskaya-literatura"
                  >
                  <button 
                    type="button"
                    @click="generateSlug(true)"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f8330] hover:text-[#5e1104] text-sm"
                    title="Сгенерировать из названия"
                  >
                    <i class="fas fa-sync-alt"></i>
                  </button>
                </div>
                <p class="text-xs text-[#6c6456] mt-1">
                  <i class="fas fa-info-circle mr-1"></i>
                  Уникальный идентификатор для URL. Оставьте пустым для автоматической генерации
                </p>
              </div>
              
              <!-- Родительский жанр -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-folder-tree mr-2 text-sm"></i>
                  Родительский жанр
                </label>
                <select v-model="form.parent_id" class="form-input w-full">
                  <option :value="null">— Нет (корневой жанр) —</option>
                  <option v-for="genre in genreOptions" :key="genre.id" :value="genre.id" class="py-1">
                    {{ ' '.repeat(genre.level) + '↳ ' }}{{ genre.name }}
                  </option>
                </select>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <!-- Порядок сортировки -->
                <div>
                  <label class="block text-[#5e1104] font-medium mb-2">
                    <i class="fas fa-sort-numeric-down mr-2 text-sm"></i>
                    Порядок
                  </label>
                  <input 
                    v-model.number="form.sort_order"
                    type="number"
                    class="form-input w-full"
                    min="0"
                  >
                  <p class="text-xs text-[#6c6456] mt-1">Чем меньше, тем выше</p>
                </div>
                
                <!-- Активность -->
                <div>
                  <label class="block text-[#5e1104] font-medium mb-2">
                    <i class="fas fa-toggle-on mr-2 text-sm"></i>
                    Статус
                  </label>
                  <div class="relative">
                    <select v-model="form.is_active" class="form-input w-full">
                      <option :value="true">Активен</option>
                      <option :value="false">Неактивен</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Описание -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-align-left mr-2 text-sm"></i>
                  Описание
                </label>
                <textarea 
                  v-model="form.description"
                  rows="3"
                  class="form-input w-full resize-none"
                  placeholder="Краткое описание жанра..."
                ></textarea>
              </div>
              
              <!-- Кнопки действий -->
              <div class="flex gap-3 pt-4">
                <button 
                  type="submit"
                  class="flex-1 bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  :disabled="loading"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <i v-else :class="editingGenre ? 'fas fa-save' : 'fas fa-plus'"></i>
                  {{ loading ? 'Сохранение...' : (editingGenre ? 'Сохранить изменения' : 'Создать жанр') }}
                </button>
                <button 
                  type="button"
                  @click="closeModal"
                  class="px-6 py-2.5 border-2 border-[#7f8330]/30 rounded-lg text-[#6c6456] hover:bg-gray-50 hover:border-[#7f8330]/50 transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Toast уведомления -->
      <transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div 
          v-if="toast.show" 
          class="fixed bottom-4 right-4 z-50"
        >
          <div class="px-5 py-3 rounded-xl shadow-lg text-white flex items-center gap-2" :class="{
            'bg-gradient-to-r from-green-500 to-green-600': toast.type === 'success',
            'bg-gradient-to-r from-red-500 to-red-600': toast.type === 'error',
            'bg-gradient-to-r from-yellow-500 to-yellow-600': toast.type === 'warning',
            'bg-gradient-to-r from-blue-500 to-blue-600': toast.type === 'info'
          }">
            <i :class="{
              'fas fa-check-circle': toast.type === 'success',
              'fas fa-exclamation-circle': toast.type === 'error',
              'fas fa-exclamation-triangle': toast.type === 'warning',
              'fas fa-info-circle': toast.type === 'info'
            }"></i>
            {{ toast.message }}
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { genreApi } from '@/api/genres'
  import { useToast } from '@/composables/useToast'
  
  const { toast, success, error } = useToast()
  
  const genres = ref([])
  const showModal = ref(false)
  const editingGenre = ref(null)
  const loading = ref(false)
  const errors = ref({})
  const form = ref({
    name: '',
    slug: '',
    parent_id: null,
    description: '',
    sort_order: 0,
    is_active: true
  })
  
  const genreOptions = ref([])
  
  // Функция для транслитерации и генерации slug
  const generateSlug = (force = false) => {
    if (force || !form.value.slug || form.value.slug === '') {
      if (!form.value.name) return
      
      let slug = form.value.name
        .toLowerCase()
        // Транслитерация
        .replace(/[а-яё]/g, function(char) {
          const translit = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
            'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          }
          return translit[char] || char
        })
        // Заменяем все не буквенно-цифровые символы на тире
        .replace(/[^a-z0-9]+/g, '-')
        // Убираем тире в начале и конце
        .replace(/^-+|-+$/g, '')
        // Убираем множественные тире
        .replace(/-+/g, '-')
      
      form.value.slug = slug
    }
  }
  
  // Следим за изменением названия для автоматической генерации slug
  watch(() => form.value.name, () => {
    if (!form.value.slug || form.value.slug === '' || form.value.slug === generateSlugFromName()) {
      generateSlug()
    }
  })
  
  const generateSlugFromName = () => {
    if (!form.value.name) return ''
    return form.value.name
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const translit = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
          'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        }
        return translit[char] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')
  }
  
  // Загрузка жанров
  const loadGenres = async () => {
    try {
      const response = await genreApi.getGenres()
      if (response.data.success) {
        genres.value = response.data.data
        buildGenreOptions()
      }
    } catch (err) {
      console.error('Error loading genres:', err)
      error('Ошибка при загрузке жанров')
    }
  }
  
  // Построение дерева жанров для селекта
  const buildGenreOptions = () => {
    const options = []
    const addGenres = (items, level = 0) => {
      items.forEach(item => {
        if (editingGenre.value && item.id === editingGenre.value.id) return
        options.push({ ...item, level })
        if (item.children && item.children.length) {
          addGenres(item.children, level + 1)
        }
      })
    }
    
    const rootGenres = genres.value.filter(g => !g.parent_id)
    addGenres(rootGenres)
    genreOptions.value = options
  }
  
  // Открыть модальное окно
  const openModal = (genre = null) => {
    editingGenre.value = genre
    errors.value = {}
    
    if (genre) {
      form.value = {
        name: genre.name,
        slug: genre.slug,
        parent_id: genre.parent_id,
        description: genre.description || '',
        sort_order: genre.sort_order,
        is_active: genre.is_active
      }
    } else {
      form.value = {
        name: '',
        slug: '',
        parent_id: null,
        description: '',
        sort_order: 0,
        is_active: true
      }
    }
    showModal.value = true
    buildGenreOptions()
  }
  
  // Закрыть модальное окно
  const closeModal = () => {
    showModal.value = false
    editingGenre.value = null
    errors.value = {}
    form.value = {
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      sort_order: 0,
      is_active: true
    }
  }
  
  // Сохранить жанр
  const saveGenre = async () => {
    loading.value = true
    errors.value = {}
    
    try {
      const data = {
        name: form.value.name,
        slug: form.value.slug || null,
        parent_id: form.value.parent_id,
        description: form.value.description,
        sort_order: form.value.sort_order,
        is_active: form.value.is_active
      }
      
      let response
      if (editingGenre.value) {
        response = await genreApi.updateGenre(editingGenre.value.id, data)
        if (response.data.success) {
          success('Жанр успешно обновлен')
        }
      } else {
        response = await genreApi.createGenre(data)
        if (response.data.success) {
          success('Жанр успешно создан')
        }
      }
      
      await loadGenres()
      closeModal()
    } catch (err) {
      console.error('Error saving genre:', err)
      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
        const errorMessage = Object.values(errors.value).flat().join('\n')
        error(errorMessage)
      } else if (err.response?.data?.message) {
        error(err.response.data.message)
      } else {
        error('Ошибка при сохранении жанра')
      }
    } finally {
      loading.value = false
    }
  }
  
  // Переключить активность
  const toggleActive = async (genre) => {
    try {
      const response = await genreApi.toggleActive(genre.id)
      if (response.data.success) {
        genre.is_active = response.data.is_active
        success(`Жанр ${genre.is_active ? 'активирован' : 'деактивирован'}`)
      }
    } catch (err) {
      console.error('Error toggling genre:', err)
      error('Ошибка при изменении статуса')
    }
  }
  
  // Удалить жанр
  const deleteGenre = async (genre) => {
    if (confirm(`Вы уверены, что хотите удалить жанр "${genre.name}"?`)) {
      try {
        const response = await genreApi.deleteGenre(genre.id)
        if (response.data.success) {
          success('Жанр успешно удален')
          await loadGenres()
        }
      } catch (err) {
        console.error('Error deleting genre:', err)
        error(err.response?.data?.message || 'Ошибка при удалении жанра')
      }
    }
  }
  
  onMounted(() => {
    loadGenres()
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
  
  .form-input.border-red-500 {
    border-color: #ef4444;
  }
  
  .form-input.border-red-500:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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