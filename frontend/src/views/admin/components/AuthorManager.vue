<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-[#5e1104] text-xl font-semibold">Управление авторами</h3>
        <button 
          @click="openModal()" 
          class="bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <i class="fas fa-plus text-sm"></i>
          Добавить автора
        </button>
      </div>
  
      <!-- Поиск -->
      <div class="mb-6">
        <div class="relative max-w-md">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6456]"></i>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Поиск авторов по имени..."
            class="form-input pl-10 w-full"
            @input="searchAuthors"
          >
        </div>
      </div>
  
      <!-- Таблица авторов -->
      <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#f3d8ce]/30">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-[#7f8330]/5 to-[#5e1104]/5 border-b border-[#7f8330]/20">
              <th class="text-left p-4 text-[#5e1104] font-semibold">ID</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Фото</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Имя</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Slug</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Годы жизни</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Книг</th>
              <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="author in authors" :key="author.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
              <td class="p-4 text-[#6c6456]">{{ author.id }}</td>
              <td class="p-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#7f8330]/20 to-[#5e1104]/20 flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="author.photo" 
                    :src="getFullImageUrl(author.photo)" 
                    :alt="author.name"
                    class="w-full h-full object-cover"
                  >
                  <i v-else class="fas fa-user text-[#7f8330] text-xl"></i>
                </div>
              </td>
              <td class="p-4 font-medium text-[#5e1104]">{{ author.name }}</td>
              <td class="p-4 text-sm text-[#6c6456] font-mono">{{ author.slug }}</td>
              <td class="p-4 text-[#6c6456]">
                {{ formatYears(author.birth_date, author.death_date) }}
              </td>
              <td class="p-4">
                <span class="px-2 py-1 bg-[#7f8330]/10 text-[#7f8330] rounded-full text-sm">
                  {{ author.books_count || 0 }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button 
                    @click="openModal(author)" 
                    class="text-[#7f8330] hover:text-[#5e1104] transition p-1.5 rounded-lg hover:bg-[#7f8330]/10"
                    title="Редактировать"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteAuthor(author)" 
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
  
      <!-- Модальное окно для создания/редактирования автора -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-2xl p-0 w-full max-w-2xl shadow-2xl transform transition-all animate-modal-slide max-h-[90vh] overflow-y-auto">
          <!-- Заголовок модалки -->
          <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20 sticky top-0 bg-white">
            <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
              <i :class="editingAuthor ? 'fas fa-edit' : 'fas fa-user-plus'"></i>
              {{ editingAuthor ? 'Редактировать автора' : 'Добавить нового автора' }}
            </h3>
            <p class="text-sm text-[#6c6456] mt-1">
              {{ editingAuthor ? 'Измените данные автора' : 'Заполните информацию о новом авторе' }}
            </p>
          </div>
          
          <form @submit.prevent="saveAuthor" class="p-6">
            <div class="space-y-5">
              <!-- Фото -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-camera mr-2 text-sm"></i>
                  Фото автора
                </label>
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[#7f8330]/20 to-[#5e1104]/20 flex items-center justify-center overflow-hidden border-2 border-[#7f8330]/30">
                      <img 
                        v-if="photoPreview" 
                        :src="photoPreview" 
                        alt="Preview"
                        class="w-full h-full object-cover"
                      >
                      <i v-else class="fas fa-user text-[#7f8330] text-4xl"></i>
                    </div>
                    <label class="absolute bottom-0 right-0 bg-[#7f8330] text-white rounded-full p-1.5 cursor-pointer hover:bg-[#5e1104] transition">
                      <i class="fas fa-camera text-xs"></i>
                      <input 
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handlePhotoUpload"
                      >
                    </label>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-[#6c6456]">Рекомендуемый размер: 300x300px</p>
                    <p class="text-xs text-[#6c6456]">Поддерживаемые форматы: JPG, PNG, GIF</p>
                    <button 
                      v-if="photoPreview"
                      type="button"
                      @click="removePhoto"
                      class="text-red-500 text-sm hover:underline mt-1"
                    >
                      Удалить фото
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Имя -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-user mr-2 text-sm"></i>
                  Имя автора <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.name"
                  type="text"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.name }"
                  placeholder="Например: Фёдор Достоевский"
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
                    placeholder="fedor-dostoevskiy"
                  >
                  <button 
                    type="button"
                    @click="generateSlug(true)"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f8330] hover:text-[#5e1104] text-sm"
                    title="Сгенерировать из имени"
                  >
                    <i class="fas fa-sync-alt"></i>
                  </button>
                </div>
                <p class="text-xs text-[#6c6456] mt-1">
                  <i class="fas fa-info-circle mr-1"></i>
                  Уникальный идентификатор для URL
                </p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <!-- Дата рождения -->
                <div>
                  <label class="block text-[#5e1104] font-medium mb-2">
                    <i class="fas fa-birthday-cake mr-2 text-sm"></i>
                    Дата рождения
                  </label>
                  <input 
                    v-model="form.birth_date"
                    type="text"
                    class="form-input w-full"
                    placeholder="ДД.ММ.ГГГГ или ГГГГ-ММ-ДД"
                    @input="formatDateInput"
                    @blur="validateDate"
                  >
                  <p class="text-xs text-[#6c6456] mt-1">
                    <i class="fas fa-info-circle mr-1"></i>
                    Формат: ДД.ММ.ГГГГ или ГГГГ-ММ-ДД
                  </p>
                </div>
                
                <!-- Дата смерти -->
                <div>
                  <label class="block text-[#5e1104] font-medium mb-2">
                    <i class="fas fa-skull mr-2 text-sm"></i>
                    Дата смерти
                  </label>
                  <input 
                    v-model="form.death_date"
                    type="text"
                    class="form-input w-full"
                    placeholder="ДД.ММ.ГГГГ или ГГГГ-ММ-ДД"
                    @input="formatDateInput"
                    @blur="validateDate"
                  >
                  <p class="text-xs text-[#6c6456] mt-1">
                    <i class="fas fa-info-circle mr-1"></i>
                    Формат: ДД.ММ.ГГГГ или ГГГГ-ММ-ДД
                  </p>
                </div>
              </div>
              
              <!-- Биография -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-align-left mr-2 text-sm"></i>
                  Биография
                </label>
                <textarea 
                  v-model="form.bio"
                  rows="5"
                  class="form-input w-full resize-none"
                  placeholder="Краткая биография автора..."
                ></textarea>
              </div>
              
              <!-- Кнопки действий -->
              <div class="flex gap-3 pt-4 sticky bottom-0 bg-white py-4">
                <button 
                  type="submit"
                  class="flex-1 bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  :disabled="loading"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <i v-else :class="editingAuthor ? 'fas fa-save' : 'fas fa-plus'"></i>
                  {{ loading ? 'Сохранение...' : (editingAuthor ? 'Сохранить изменения' : 'Создать автора') }}
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
            'bg-gradient-to-r from-red-500 to-red-600': toast.type === 'error'
          }">
            <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
            {{ toast.message }}
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { authorApi } from '@/api/authors'
  import { useToast } from '@/composables/useToast'
  
  const { toast, success, error } = useToast()
  
  const authors = ref([])
  const showModal = ref(false)
  const editingAuthor = ref(null)
  const loading = ref(false)
  const errors = ref({})
  const searchQuery = ref('')
  const searchTimeout = ref(null)
  const photoFile = ref(null)
  const photoPreview = ref('')
  
  const form = ref({
    name: '',
    slug: '',
    bio: '',
    birth_date: '',
    death_date: '',
    photo: null
  })
  
  // Полный URL для изображения
  const getFullImageUrl = (path) => {
    if (!path) return ''
    // Если путь уже содержит http или https, возвращаем как есть
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // Добавляем базовый URL API
    const baseUrl = import.meta.env.VITE_API_URL || 'http://ivybook.ru'
    return `${baseUrl}${path}`
  }
  
  // Форматирование годов жизни
  const formatYears = (birth, death) => {
    if (!birth) return '—'
    try {
      const birthYear = new Date(birth).getFullYear()
      const deathYear = death ? new Date(death).getFullYear() : ''
      return deathYear ? `${birthYear} — ${deathYear}` : `с ${birthYear}`
    } catch {
      return birth
    }
  }
  
  // Форматирование даты из разных форматов
  const parseDate = (dateString) => {
    if (!dateString) return ''
    
    // Проверяем формат ДД.ММ.ГГГГ
    const dotPattern = /^(\d{2})\.(\d{2})\.(\d{4})$/
    const dotMatch = dateString.match(dotPattern)
    if (dotMatch) {
      return `${dotMatch[3]}-${dotMatch[2]}-${dotMatch[1]}`
    }
    
    // Проверяем формат ГГГГ-ММ-ДД
    const dashPattern = /^(\d{4})-(\d{2})-(\d{2})$/
    if (dashPattern.test(dateString)) {
      return dateString
    }
    
    // Проверяем формат ГГГГ-ММ-ДД с временем
    if (dateString.includes('T')) {
      return dateString.split('T')[0]
    }
    
    return dateString
  }
  
  // Форматирование ввода даты
  const formatDateInput = (event) => {
    let value = event.target.value
    // Автоматическое добавление точек при вводе
    if (value.length === 2 && !value.includes('.') && !value.includes('-')) {
      value = value + '.'
      event.target.value = value
    } else if (value.length === 5 && value[2] === '.' && !value.includes('-')) {
      value = value + '.'
      event.target.value = value
    }
  }
  
  // Валидация даты
  const validateDate = () => {
    if (form.value.birth_date) {
      const parsed = parseDate(form.value.birth_date)
      if (parsed && /^\d{4}-\d{2}-\d{2}$/.test(parsed)) {
        form.value.birth_date = parsed
      } else if (form.value.birth_date) {
        error('Неверный формат даты рождения. Используйте ДД.ММ.ГГГГ или ГГГГ-ММ-ДД')
      }
    }
    
    if (form.value.death_date) {
      const parsed = parseDate(form.value.death_date)
      if (parsed && /^\d{4}-\d{2}-\d{2}$/.test(parsed)) {
        form.value.death_date = parsed
      } else if (form.value.death_date) {
        error('Неверный формат даты смерти. Используйте ДД.ММ.ГГГГ или ГГГГ-ММ-ДД')
      }
    }
  }
  
  // Генерация slug из имени
  const generateSlug = (force = false) => {
    if (force || !form.value.slug || form.value.slug === '') {
      if (!form.value.name) return
      
      let slug = form.value.name
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
      
      form.value.slug = slug
    }
  }
  
  // Следим за изменением имени
  watch(() => form.value.name, () => {
    if (!form.value.slug || form.value.slug === '') {
      generateSlug()
    }
  })
  
  // Обработка загрузки фото
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      photoFile.value = file
      
      // Создаем preview
      const reader = new FileReader()
      reader.onload = (e) => {
        photoPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Удалить фото
  const removePhoto = () => {
    photoFile.value = null
    photoPreview.value = ''
    form.value.photo = null
  }
  
  // Поиск авторов
  const searchAuthors = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value)
    
    searchTimeout.value = setTimeout(() => {
      loadAuthors()
    }, 500)
  }
  
  // Загрузка авторов
  const loadAuthors = async () => {
    try {
      const params = searchQuery.value ? { search: searchQuery.value } : {}
      const response = await authorApi.getAuthors(params)
      if (response.data.success) {
        authors.value = response.data.data
      }
    } catch (err) {
      console.error('Error loading authors:', err)
      error('Ошибка при загрузке авторов')
    }
  }
  
  // Открыть модальное окно
  const openModal = (author = null) => {
    editingAuthor.value = author
    errors.value = {}
    photoFile.value = null
    photoPreview.value = ''
    
    if (author) {
      form.value = {
        name: author.name,
        slug: author.slug,
        bio: author.bio || '',
        birth_date: author.birth_date ? author.birth_date.split('T')[0] : '',
        death_date: author.death_date ? author.death_date.split('T')[0] : '',
        photo: author.photo
      }
      if (author.photo) {
        photoPreview.value = getFullImageUrl(author.photo)
      }
    } else {
      form.value = {
        name: '',
        slug: '',
        bio: '',
        birth_date: '',
        death_date: '',
        photo: null
      }
    }
    showModal.value = true
  }
  
  // Закрыть модальное окно
  const closeModal = () => {
    showModal.value = false
    editingAuthor.value = null
    errors.value = {}
    photoFile.value = null
    photoPreview.value = ''
    form.value = {
      name: '',
      slug: '',
      bio: '',
      birth_date: '',
      death_date: '',
      photo: null
    }
  }
  
  // Сохранить автора
  const saveAuthor = async () => {
    loading.value = true
    errors.value = {}
    
    try {
      const formData = new FormData()
      formData.append('name', form.value.name)
      if (form.value.slug) formData.append('slug', form.value.slug)
      if (form.value.bio) formData.append('bio', form.value.bio)
      if (form.value.birth_date) formData.append('birth_date', form.value.birth_date)
      if (form.value.death_date) formData.append('death_date', form.value.death_date)
      if (photoFile.value) formData.append('photo', photoFile.value)
      
      let response
      if (editingAuthor.value) {
        response = await authorApi.updateAuthor(editingAuthor.value.id, formData)
        if (response.data.success) {
          success('Автор успешно обновлен')
        }
      } else {
        response = await authorApi.createAuthor(formData)
        if (response.data.success) {
          success('Автор успешно создан')
        }
      }
      
      await loadAuthors()
      closeModal()
    } catch (err) {
      console.error('Error saving author:', err)
      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
        const errorMessage = Object.values(errors.value).flat().join('\n')
        error(errorMessage)
      } else if (err.response?.data?.message) {
        error(err.response.data.message)
      } else {
        error('Ошибка при сохранении автора')
      }
    } finally {
      loading.value = false
    }
  }
  
  // Удалить автора
  const deleteAuthor = async (author) => {
    if (confirm(`Вы уверены, что хотите удалить автора "${author.name}"?`)) {
      try {
        const response = await authorApi.deleteAuthor(author.id)
        if (response.data.success) {
          success('Автор успешно удален')
          await loadAuthors()
        }
      } catch (err) {
        console.error('Error deleting author:', err)
        error(err.response?.data?.message || 'Ошибка при удалении автора')
      }
    }
  }
  
  onMounted(() => {
    loadAuthors()
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