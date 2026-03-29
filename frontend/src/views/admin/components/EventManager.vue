<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-[#5e1104] text-xl font-semibold">Управление мероприятиями</h3>
      <button 
        @click="openModal()" 
        class="bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
      >
        <i class="fas fa-plus text-sm"></i>
        Добавить мероприятие
      </button>
    </div>

    <!-- Фильтры -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6c6456]"></i>
        <input 
          v-model="filters.search"
          type="text"
          placeholder="Поиск по названию..."
          class="form-input pl-10 w-full"
          @input="searchEvents"
        >
      </div>
      
      <select v-model="filters.event_type" class="form-input" @change="loadEvents">
        <option :value="null">Все типы</option>
        <option value="author_meeting">Авторская встреча</option>
        <option value="presentation">Презентация</option>
        <option value="lecture">Лекция</option>
        <option value="workshop">Мастер-класс</option>
      </select>
      
      <select v-model="filters.status" class="form-input" @change="loadEvents">
        <option :value="null">Все статусы</option>
        <option value="upcoming">Предстоящие</option>
        <option value="past">Прошедшие</option>
      </select>
    </div>

    <!-- Таблица мероприятий -->
    <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-[#f3d8ce]/30">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-[#7f8330]/5 to-[#5e1104]/5 border-b border-[#7f8330]/20">
            <th class="text-left p-4 text-[#5e1104] font-semibold">ID</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Название</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Тип</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Дата и время</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Место</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Участники</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Цена</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Статус</th>
            <th class="text-left p-4 text-[#5e1104] font-semibold">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id" class="border-b border-[#7f8330]/10 hover:bg-[#7f8330]/3 transition-colors">
            <td class="p-4 text-[#6c6456]">{{ event.id }}</td>
            <td class="p-4">
              <div class="font-medium text-[#5e1104]">{{ event.title }}</div>
              <div class="text-xs text-[#6c6456">Автор: {{ event.author?.name || '—' }}</div>
            </td>
            <td class="p-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="getEventTypeClass(event.event_type)">
                {{ getEventTypeName(event.event_type) }}
              </span>
            </td>
            <td class="p-4 text-sm text-[#6c6456]">
              <div>{{ formatDate(event.start_date) }}</div>
              <div v-if="event.end_date" class="text-xs">до {{ formatDate(event.end_date, true) }}</div>
            </td>
            <td class="p-4 text-[#6c6456]">{{ event.location }}</td>
            <td class="p-4">
              <div class="text-sm">
                <span class="font-medium text-[#5e1104]">{{ event.registered_count || 0 }}</span>
                <span class="text-[#6c6456]"> / {{ event.max_participants || '∞' }}</span>
              </div>
              <div v-if="event.is_full" class="text-xs text-red-500">Мест нет</div>
            </td>
            <td class="p-4">
              <span v-if="event.price > 0" class="font-medium text-[#5e1104]">{{ event.price }} ₽</span>
              <span v-else class="text-green-600">Бесплатно</span>
            </td>
            <td class="p-4">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ event.is_active ? 'Активно' : 'Неактивно' }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex gap-2">
                <button 
                  @click="openRegistrationsModal(event)" 
                  class="text-blue-600 hover:text-blue-700 transition p-1.5 rounded-lg hover:bg-blue-50"
                  title="Список участников"
                >
                  <i class="fas fa-users"></i>
                </button>
                <button 
                  @click="openModal(event)" 
                  class="text-[#7f8330] hover:text-[#5e1104] transition p-1.5 rounded-lg hover:bg-[#7f8330]/10"
                  title="Редактировать"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="deleteEvent(event)" 
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
          Показано {{ events.length }} из {{ pagination.total }} мероприятий
        </div>
        <div class="flex gap-2">
          <button 
            @click="loadEvents(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
          >
            ←
          </button>
          <span class="px-3 py-1 bg-[#7f8330] text-white rounded-lg">
            {{ pagination.current_page }}
          </span>
          <button 
            @click="loadEvents(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-1 border border-[#7f8330]/30 rounded-lg hover:bg-[#7f8330]/10 disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для создания/редактирования мероприятия -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-2xl p-0 w-full max-w-3xl shadow-2xl transform transition-all animate-modal-slide max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20 sticky top-0 bg-white">
          <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
            <i :class="editingEvent ? 'fas fa-edit' : 'fas fa-calendar-plus'"></i>
            {{ editingEvent ? 'Редактировать мероприятие' : 'Добавить мероприятие' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveEvent" class="p-6">
          <div class="space-y-5">
            <!-- Название -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">
                Название <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.title"
                type="text"
                class="form-input w-full"
                :class="{ 'border-red-500': errors.title }"
                required
                @input="generateSlug"
              >
              <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title[0] }}</p>
            </div>
            
            <!-- Slug -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">URL-идентификатор (Slug)</label>
              <div class="relative">
                <input 
                  v-model="form.slug"
                  type="text"
                  class="form-input w-full font-mono text-sm"
                >
                <button 
                  type="button"
                  @click="generateSlug(true)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f8330] hover:text-[#5e1104] text-sm"
                >
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Тип мероприятия -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  Тип мероприятия <span class="text-red-500">*</span>
                </label>
                <select v-model="form.event_type" class="form-input w-full" required>
                  <option value="author_meeting">Авторская встреча</option>
                  <option value="presentation">Презентация</option>
                  <option value="lecture">Лекция</option>
                  <option value="workshop">Мастер-класс</option>
                </select>
              </div>
              
              <!-- Автор -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">Связанный автор</label>
                <select v-model="form.author_id" class="form-input w-full">
                  <option :value="null">Не выбран</option>
                  <option v-for="author in authors" :key="author.id" :value="author.id">
                    {{ author.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Дата начала -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">
                  Дата и время начала <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.start_date"
                  type="datetime-local"
                  class="form-input w-full"
                  required
                >
              </div>
              
              <!-- Дата окончания -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">Дата и время окончания</label>
                <input 
                  v-model="form.end_date"
                  type="datetime-local"
                  class="form-input w-full"
                >
              </div>
            </div>
            
            <!-- Место проведения -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">
                Место проведения <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.location"
                type="text"
                class="form-input w-full"
                placeholder="Адрес, зал..."
                required
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Максимум участников -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">Максимум участников</label>
                <input 
                  v-model.number="form.max_participants"
                  type="number"
                  class="form-input w-full"
                  placeholder="Неограниченно"
                  min="1"
                >
              </div>
              
              <!-- Цена -->
              <div>
                <label class="block text-[#5e1104] font-medium mb-2">Цена билета</label>
                <input 
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  class="form-input w-full"
                  placeholder="0 - бесплатно"
                  min="0"
                >
              </div>
            </div>
            
            <!-- Описание -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">
                Описание <span class="text-red-500">*</span>
              </label>
              <textarea 
                v-model="form.description"
                rows="5"
                class="form-input w-full resize-none"
                placeholder="Полное описание мероприятия..."
                required
              ></textarea>
            </div>
            
            <!-- Изображение -->
            <div>
              <label class="block text-[#5e1104] font-medium mb-2">URL изображения</label>
              <input 
                v-model="form.image"
                type="url"
                class="form-input w-full"
                placeholder="https://..."
              >
            </div>
            
            <!-- Активность -->
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="form.is_active" class="w-4 h-4 text-[#7f8330]">
                <span class="text-[#5e1104]">Активно (отображается на сайте)</span>
              </label>
            </div>
            
            <!-- Кнопки -->
            <div class="flex gap-3 pt-4">
              <button 
                type="submit"
                class="flex-1 bg-gradient-to-r from-[#7f8330] to-[#5e1104] text-white py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                :disabled="loading"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                {{ loading ? 'Сохранение...' : (editingEvent ? 'Сохранить' : 'Создать') }}
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

    <!-- Модальное окно со списком участников -->
    <div v-if="showRegistrationsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeRegistrationsModal">
      <div class="bg-white rounded-2xl p-0 w-full max-w-4xl shadow-2xl transform transition-all animate-modal-slide max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-r from-[#7f8330]/10 to-[#5e1104]/10 px-6 py-4 rounded-t-2xl border-b border-[#7f8330]/20 sticky top-0 bg-white">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold text-[#5e1104] flex items-center gap-2">
                <i class="fas fa-users"></i>
                Участники мероприятия
              </h3>
              <p class="text-sm text-[#6c6456] mt-1">{{ selectedEvent?.title }}</p>
            </div>
            <button @click="closeRegistrationsModal" class="text-[#6c6456] hover:text-[#5e1104]">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Статистика -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-[#6c6456]">Всего участников:</span>
                <span class="ml-2 font-bold text-[#5e1104]">{{ registrations.length }}</span>
              </div>
              <div>
                <span class="text-[#6c6456]">Максимум мест:</span>
                <span class="ml-2 font-bold text-[#5e1104]">{{ selectedEvent?.max_participants || '∞' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Таблица участников -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left p-3 text-[#6c6456]">Участник</th>
                  <th class="text-left p-3 text-[#6c6456]">Кол-во билетов</th>
                  <th class="text-left p-3 text-[#6c6456]">Статус</th>
                  <th class="text-left p-3 text-[#6c6456]">Дата регистрации</th>
                  <th class="text-left p-3 text-[#6c6456]">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reg in registrations" :key="reg.id" class="border-b">
                  <td class="p-3">
                    <div class="font-medium text-[#5e1104]">{{ reg.user?.name }}</div>
                    <div class="text-xs text-[#6c6456]">{{ reg.user?.email }}</div>
                    <div class="text-xs text-[#6c6456]">{{ reg.user?.phone || '—' }}</div>
                  </td>
                  <td class="p-3">{{ reg.attendees_count }}</td>
                  <td class="p-3">
                    <span 
                      class="px-2 py-1 rounded-full text-xs"
                      :class="reg.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                    >
                      {{ reg.status === 'confirmed' ? 'Подтвержден' : 'Ожидает' }}
                    </span>
                  </td>
                  <td class="p-3 text-sm text-[#6c6456]">{{ formatDate(reg.created_at) }}</td>
                  <td class="p-3">
                    <div class="flex gap-2">
                      <button 
                        v-if="reg.status !== 'confirmed'"
                        @click="confirmRegistration(reg)"
                        class="text-green-600 hover:text-green-700"
                        title="Подтвердить"
                      >
                        <i class="fas fa-check-circle"></i>
                      </button>
                      <button 
                        @click="cancelRegistration(reg)"
                        class="text-red-500 hover:text-red-700"
                        title="Отменить регистрацию"
                      >
                        <i class="fas fa-times-circle"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventApi } from '@/api/events'
import { authorApi } from '@/api/authors'
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

const events = ref([])
const authors = ref([])
const showModal = ref(false)
const showRegistrationsModal = ref(false)
const editingEvent = ref(null)
const selectedEvent = ref(null)
const registrations = ref([])
const loading = ref(false)
const errors = ref({})

const filters = ref({
  search: '',
  event_type: null,
  status: null
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
  slug: '',
  description: '',
  event_type: 'author_meeting',
  author_id: null,
  start_date: '',
  end_date: '',
  location: '',
  max_participants: null,
  price: 0,
  image: '',
  is_active: true
})

const getEventTypeName = (type) => {
  const types = {
    author_meeting: 'Авторская встреча',
    presentation: 'Презентация',
    lecture: 'Лекция',
    workshop: 'Мастер-класс'
  }
  return types[type] || type
}

const getEventTypeClass = (type) => {
  const classes = {
    author_meeting: 'bg-purple-100 text-purple-700',
    presentation: 'bg-blue-100 text-blue-700',
    lecture: 'bg-green-100 text-green-700',
    workshop: 'bg-orange-100 text-orange-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date, onlyTime = false) => {
  if (!date) return '—'
  const d = new Date(date)
  if (onlyTime) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const generateSlug = (force = false) => {
  if (force || !form.value.slug || form.value.slug === '') {
    if (!form.value.title) return
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
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

const loadEvents = async (page = 1) => {
  try {
    const params = { page, per_page: 20 }
    
    if (filters.value.event_type) params.event_type = filters.value.event_type
    if (filters.value.status === 'upcoming') params.upcoming = true
    
    const response = await eventApi.getEvents(params)
    if (response.data.success) {
      let data = response.data.data.data
      
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        data = data.filter(e => e.title.toLowerCase().includes(search))
      }
      
      events.value = data
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total
      }
    }
  } catch (err) {
    console.error('Error loading events:', err)
    error('Ошибка при загрузке мероприятий')
  }
}

const searchEvents = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => loadEvents(), 500)
}

const openModal = (event = null) => {
  editingEvent.value = event
  errors.value = {}
  
  if (event) {
    form.value = {
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      event_type: event.event_type,
      author_id: event.author_id || null,
      start_date: event.start_date ? event.start_date.slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.slice(0, 16) : '',
      location: event.location,
      max_participants: event.max_participants,
      price: event.price || 0,
      image: event.image || '',
      is_active: event.is_active
    }
  } else {
    form.value = {
      title: '',
      slug: '',
      description: '',
      event_type: 'author_meeting',
      author_id: null,
      start_date: '',
      end_date: '',
      location: '',
      max_participants: null,
      price: 0,
      image: '',
      is_active: true
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEvent.value = null
}

const saveEvent = async () => {
  loading.value = true
  errors.value = {}
  
  try {
    const data = {
      title: form.value.title,
      slug: form.value.slug || null,
      description: form.value.description,
      event_type: form.value.event_type,
      author_id: form.value.author_id,
      start_date: form.value.start_date,
      end_date: form.value.end_date || null,
      location: form.value.location,
      max_participants: form.value.max_participants || null,
      price: form.value.price,
      image: form.value.image || null,
      is_active: form.value.is_active
    }
    
    if (editingEvent.value) {
      await eventApi.updateEvent(editingEvent.value.id, data)
      success('Мероприятие обновлено')
    } else {
      await eventApi.createEvent(data)
      success('Мероприятие создано')
    }
    
    await loadEvents()
    closeModal()
  } catch (err) {
    console.error('Error saving event:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      error(Object.values(errors.value).flat().join('\n'))
    } else {
      error('Ошибка при сохранении мероприятия')
    }
  } finally {
    loading.value = false
  }
}

const deleteEvent = async (event) => {
  if (confirm(`Вы уверены, что хотите удалить мероприятие "${event.title}"?`)) {
    try {
      await eventApi.deleteEvent(event.id)
      success('Мероприятие удалено')
      await loadEvents()
    } catch (err) {
      error(err.response?.data?.message || 'Ошибка при удалении')
    }
  }
}

const openRegistrationsModal = async (event) => {
  selectedEvent.value = event
  try {
    const response = await eventApi.getEventRegistrations(event.id)
    if (response.data.success) {
      registrations.value = response.data.data.registrations
      showRegistrationsModal.value = true
    }
  } catch (err) {
    console.error('Error loading registrations:', err)
    error('Ошибка при загрузке участников')
  }
}

const closeRegistrationsModal = () => {
  showRegistrationsModal.value = false
  selectedEvent.value = null
  registrations.value = []
}

const confirmRegistration = async (registration) => {
  try {
    await eventApi.confirmRegistration(registration.id)
    registration.status = 'confirmed'
    success('Регистрация подтверждена')
  } catch (err) {
    error('Ошибка при подтверждении')
  }
}

const cancelRegistration = async (registration) => {
  if (confirm('Отменить регистрацию?')) {
    try {
      await eventApi.cancelRegistration(registration.id)
      registrations.value = registrations.value.filter(r => r.id !== registration.id)
      success('Регистрация отменена')
      // Обновляем счетчик участников
      if (selectedEvent.value) {
        selectedEvent.value.registered_count--
      }
    } catch (err) {
      error('Ошибка при отмене')
    }
  }
}

onMounted(() => {
  loadAuthors()
  loadEvents()
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