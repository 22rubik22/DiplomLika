<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="close">
      <div class="bg-white rounded-2xl p-0 w-full max-w-4xl shadow-2xl transform transition-all animate-modal-slide max-h-[90vh] overflow-y-auto">
        <!-- Заголовок -->
        <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20 sticky top-0 bg-white z-10">
          <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
            <i :class="book ? 'fas fa-edit' : 'fas fa-book'"></i>
            {{ book ? 'Редактировать книгу' : 'Добавить новую книгу' }}
          </h3>
          <p class="text-sm text-[#6c6456] mt-1">
            {{ book ? 'Измените данные книги' : 'Заполните информацию о новой книге' }}
          </p>
        </div>
        
        <form @submit.prevent="saveBook" class="p-6">
          <div class="space-y-6">
            <!-- Изображения книги -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-3">
                <i class="fas fa-images mr-2 text-sm"></i>
                Изображения книги
              </label>
              
              <!-- Загрузка новых изображений -->
              <div class="mb-4">
                <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#7f8330] text-white rounded-lg hover:bg-[#5e1104] transition">
                  <i class="fas fa-upload"></i>
                  Загрузить изображения
                  <input 
                    type="file"
                    multiple
                    accept="image/*"
                    class="hidden"
                    @change="handleImagesUpload"
                  >
                </label>
                <p class="text-xs text-[#6c6456] mt-2">
                  <i class="fas fa-info-circle mr-1"></i>
                  Поддерживаемые форматы: JPG, PNG, GIF, WebP. Максимум 5MB на файл
                </p>
              </div>
              
              <!-- Список изображений -->
              <div v-if="images.length > 0 || existingImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- Существующие изображения -->
                <div v-for="image in existingImages" :key="image.id" class="relative group">
                  <div class="relative aspect-square rounded-lg overflow-hidden border-2 border-[#7f8330]/20">
                    <img 
                      :src="getFullImageUrl(image.image_path)" 
                      :alt="image.id"
                      class="w-full h-full object-cover"
                    >
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        @click="setPrimaryImage(image.id)"
                        class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
                        :class="{ 'bg-yellow-600 ring-2 ring-yellow-300': image.is_primary }"
                        title="Сделать основным"
                      >
                        <i class="fas fa-star"></i>
                      </button>
                      <button 
                        type="button"
                        @click="deleteImage(image.id)"
                        class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        title="Удалить"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div v-if="image.is_primary" class="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Основное
                  </div>
                </div>
                
                <!-- Новые загружаемые изображения -->
                <div v-for="(image, index) in images" :key="index" class="relative group">
                  <div class="relative aspect-square rounded-lg overflow-hidden border-2 border-[#7f8330]/20">
                    <img 
                      :src="image.preview" 
                      :alt="'Preview ' + index"
                      class="w-full h-full object-cover"
                    >
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        @click="removeNewImage(index)"
                        class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        title="Удалить"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div v-if="index === 0 && existingImages.length === 0" class="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Будет основным
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Основная информация -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-heading mr-2 text-sm"></i>
                  Название книги <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.title"
                  type="text"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.title }"
                  placeholder="Например: Преступление и наказание"
                  required
                  @input="generateSlug"
                >
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title[0] }}</p>
              </div>
              
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
                    placeholder="prestuplenie-i-nakazanie"
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
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-user mr-2 text-sm"></i>
                  Автор <span class="text-red-500">*</span>
                </label>
                <select v-model="form.author_id" class="form-input w-full" :class="{ 'border-red-500': errors.author_id }" required>
                  <option :value="null">Выберите автора</option>
                  <option v-for="author in authors" :key="author.id" :value="author.id">
                    {{ author.name }}
                  </option>
                </select>
                <p v-if="errors.author_id" class="text-red-500 text-xs mt-1">{{ errors.author_id[0] }}</p>
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-tag mr-2 text-sm"></i>
                  Жанр
                </label>
                <select v-model="form.genre_id" class="form-input w-full">
                  <option :value="null">Выберите жанр</option>
                  <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                    {{ genre.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-tag mr-2 text-sm"></i>
                  ISBN
                </label>
                <input 
                  v-model="form.isbn"
                  type="text"
                  class="form-input w-full"
                  placeholder="978-5-17-123456-7"
                >
                <p v-if="errors.isbn" class="text-red-500 text-xs mt-1">{{ errors.isbn[0] }}</p>
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-building mr-2 text-sm"></i>
                  Издательство
                </label>
                <input 
                  v-model="form.publisher"
                  type="text"
                  class="form-input w-full"
                  placeholder="Издательство"
                >
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-calendar mr-2 text-sm"></i>
                  Год издания
                </label>
                <input 
                  v-model.number="form.publication_year"
                  type="number"
                  class="form-input w-full"
                  placeholder="2024"
                  min="1000"
                  :max="new Date().getFullYear()"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-file-alt mr-2 text-sm"></i>
                  Количество страниц
                </label>
                <input 
                  v-model.number="form.pages"
                  type="number"
                  class="form-input w-full"
                  placeholder="500"
                  min="1"
                >
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-language mr-2 text-sm"></i>
                  Язык
                </label>
                <input 
                  v-model="form.language"
                  type="text"
                  class="form-input w-full"
                  placeholder="Русский"
                >
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-book mr-2 text-sm"></i>
                  Тип обложки
                </label>
                <select v-model="form.cover_type" class="form-input w-full">
                  <option value="hard">Твердая</option>
                  <option value="soft">Мягкая</option>
                  <option value="leather">Кожаная</option>
                  <option value="special">Специальная</option>
                </select>
              </div>
            </div>
            
            <!-- Цена и наличие -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-ruble-sign mr-2 text-sm"></i>
                  Цена <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.price }"
                  placeholder="1000"
                  required
                  min="0"
                >
                <p v-if="errors.price" class="text-red-500 text-xs mt-1">{{ errors.price[0] }}</p>
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-ruble-sign mr-2 text-sm"></i>
                  Старая цена (со скидкой)
                </label>
                <input 
                  v-model.number="form.old_price"
                  type="number"
                  step="0.01"
                  class="form-input w-full"
                  placeholder="1500"
                  min="0"
                >
              </div>
              
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  <i class="fas fa-boxes mr-2 text-sm"></i>
                  Количество <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model.number="form.quantity"
                  type="number"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.quantity }"
                  placeholder="100"
                  required
                  min="0"
                >
                <p v-if="errors.quantity" class="text-red-500 text-xs mt-1">{{ errors.quantity[0] }}</p>
              </div>
            </div>
            
            <!-- Описания -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">
                <i class="fas fa-quote-left mr-2 text-sm"></i>
                Краткое описание
              </label>
              <textarea 
                v-model="form.short_description"
                rows="2"
                class="form-input w-full resize-none"
                placeholder="Краткое описание книги (до 500 символов)"
                maxlength="500"
              ></textarea>
              <p class="text-xs text-[#6c6456] mt-1">{{ form.short_description?.length || 0 }}/500</p>
            </div>
            
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">
                <i class="fas fa-align-left mr-2 text-sm"></i>
                Полное описание
              </label>
              <textarea 
                v-model="form.description"
                rows="5"
                class="form-input w-full resize-none"
                placeholder="Полное описание книги, содержание, отзывы критиков..."
              ></textarea>
            </div>
            
            <!-- Статусы -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-3">
                <i class="fas fa-flag-checkered mr-2 text-sm"></i>
                Статусы книги
              </label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.is_active" class="w-4 h-4 text-[#7f8330]">
                  <span class="text-[#5e1104]">Активна</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.is_featured" class="w-4 h-4 text-[#7f8330]">
                  <span class="text-[#5e1104]">Рекомендуемая</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.is_new" class="w-4 h-4 text-[#7f8330]">
                  <span class="text-[#5e1104]">Новинка</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.is_bestseller" class="w-4 h-4 text-[#7f8330]">
                  <span class="text-[#5e1104]">Бестселлер</span>
                </label>
              </div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex gap-3 pt-4 sticky bottom-0 bg-white py-4">
              <button 
                type="submit"
                class="flex-1 bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="loading"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                <i v-else :class="book ? 'fas fa-save' : 'fas fa-plus'"></i>
                {{ loading ? 'Сохранение...' : (book ? 'Сохранить изменения' : 'Создать книгу') }}
              </button>
              <button 
                type="button"
                @click="close"
                class="px-6 py-2.5 border-2 border-[#7f8330]/30 rounded-lg text-[#6c6456] hover:bg-gray-50 hover:border-[#7f8330]/50 transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { bookApi, bookImageApi } from '@/api/books'
  import { useToast } from '@/composables/useToast'
  
  const props = defineProps({
    book: {
      type: Object,
      default: null
    },
    authors: {
      type: Array,
      required: true
    },
    genres: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['close', 'saved'])
  
  const { success, error } = useToast()
  
  const loading = ref(false)
  const errors = ref({})
  const images = ref([])
  const existingImages = ref([])
  
  const form = ref({
    title: '',
    slug: '',
    author_id: null,
    genre_id: null,
    isbn: '',
    description: '',
    short_description: '',
    publisher: '',
    publication_year: null,
    pages: null,
    language: 'Русский',
    cover_type: 'hard',
    format: '',
    weight: null,
    price: null,
    old_price: null,
    quantity: 0,
    is_featured: false,
    is_new: false,
    is_bestseller: false,
    is_active: true
  })
  
  const getFullImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://ivybook.ru'
    const cleanPath = path.startsWith('/storage') ? path : `/storage/${path.replace(/^\/+/, '')}`
    return `${baseUrl}${cleanPath}`
  }
  
  // Генерация slug
  const generateSlug = (force = false) => {
    if (force || !form.value.slug || form.value.slug === '') {
      if (!form.value.title) return
      
      let slug = form.value.title
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
  
  // Загрузка существующих изображений
  const loadImages = async () => {
    if (props.book?.id) {
      try {
        const response = await bookImageApi.getImages(props.book.id)
        if (response.data.success) {
          existingImages.value = response.data.data
        }
      } catch (err) {
        console.error('Error loading images:', err)
      }
    }
  }
  
  // Заполняем форму при редактировании
  const initForm = () => {
    if (props.book) {
      // Извлекаем author_id из объекта authors
      const authorId = props.book.authors?.id || null
      const genreId = props.book.genre?.id || null
      
      form.value = {
        title: props.book.title || '',
        slug: props.book.slug || '',
        author_id: authorId,
        genre_id: genreId,
        isbn: props.book.isbn || '',
        description: props.book.description || '',
        short_description: props.book.short_description || '',
        publisher: props.book.publisher || '',
        publication_year: props.book.publication_year || null,
        pages: props.book.pages || null,
        language: props.book.language || 'Русский',
        cover_type: props.book.cover_type || 'hard',
        format: props.book.format || '',
        weight: props.book.weight || null,
        price: props.book.price || null,
        old_price: props.book.old_price || null,
        quantity: props.book.quantity || 0,
        is_featured: props.book.is_featured || false,
        is_new: props.book.is_new || false,
        is_bestseller: props.book.is_bestseller || false,
        is_active: props.book.is_active !== undefined ? props.book.is_active : true
      }
      loadImages()
    }
  }
  
  // Инициализируем форму при монтировании или изменении props.book
  watch(() => props.book, () => {
    initForm()
  }, { immediate: true })
  
  // Обработка загрузки изображений
  const handleImagesUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        error(`Файл ${file.name} превышает 5MB`)
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        images.value.push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    })
    event.target.value = ''
  }
  
  // Удалить новое изображение
  const removeNewImage = (index) => {
    images.value.splice(index, 1)
  }
  
  // Удалить существующее изображение
  const deleteImage = async (imageId) => {
    if (confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        await bookImageApi.deleteImage(imageId)
        existingImages.value = existingImages.value.filter(img => img.id !== imageId)
        success('Изображение удалено')
      } catch (err) {
        error('Ошибка при удалении изображения')
      }
    }
  }
  
  // Установить основное изображение
  const setPrimaryImage = async (imageId) => {
    try {
      await bookImageApi.setPrimary(imageId)
      existingImages.value.forEach(img => {
        img.is_primary = img.id === imageId
      })
      success('Основное изображение установлено')
    } catch (err) {
      error('Ошибка при установке основного изображения')
    }
  }
  
  const saveBook = async () => {
    loading.value = true
    errors.value = {}
    
    try {
      const data = {
        title: form.value.title,
        slug: form.value.slug || null,
        author_id: form.value.author_id,
        genre_id: form.value.genre_id,
        isbn: form.value.isbn || null,
        description: form.value.description || null,
        short_description: form.value.short_description || null,
        publisher: form.value.publisher || null,
        publication_year: form.value.publication_year || null,
        pages: form.value.pages || null,
        language: form.value.language || null,
        cover_type: form.value.cover_type,
        format: form.value.format || null,
        weight: form.value.weight || null,
        price: form.value.price,
        old_price: form.value.old_price || null,
        quantity: form.value.quantity,
        is_featured: form.value.is_featured,
        is_new: form.value.is_new,
        is_bestseller: form.value.is_bestseller,
        is_active: form.value.is_active
      }
      
      let bookId
      if (props.book) {
        await bookApi.updateBook(props.book.id, data)
        bookId = props.book.id
        success('Книга успешно обновлена')
      } else {
        const response = await bookApi.createBook(data)
        bookId = response.data.data.id
        success('Книга успешно создана')
      }
      
      // Загружаем изображения
      for (let i = 0; i < images.value.length; i++) {
        const image = images.value[i]
        const formData = new FormData()
        formData.append('image', image.file)
        
        const isPrimary = (existingImages.value.length === 0 && i === 0)
        formData.append('is_primary', isPrimary ? '1' : '0')
        formData.append('sort_order', existingImages.value.length + i)
        
        try {
          await bookImageApi.uploadImage(bookId, formData)
        } catch (err) {
          console.error('Error uploading image:', err)
          if (err.response?.data?.errors) {
            error(`Ошибка загрузки изображения: ${Object.values(err.response.data.errors).flat().join(', ')}`)
          } else {
            error('Ошибка при загрузке изображения')
          }
        }
      }
      
      emit('saved')
    } catch (err) {
      console.error('Error saving book:', err)
      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
        const errorMessage = Object.values(errors.value).flat().join('\n')
        error(errorMessage)
      } else if (err.response?.data?.message) {
        error(err.response.data.message)
      } else {
        error('Ошибка при сохранении книги')
      }
    } finally {
      loading.value = false
    }
  }
  
  const close = () => {
    emit('close')
  }
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