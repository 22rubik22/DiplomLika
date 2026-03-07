<template>
    <div>
      <h1 class="page-title">Контакты</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Контактная информация -->
          <div>
            <h3 class="text-[#5e1104] text-xl mb-6">Как нас найти</h3>
            
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <i class="fas fa-map-marker-alt text-xl text-[#7f8330] w-6"></i>
                <div>
                  <p class="font-medium text-[#5e1104]">Адрес</p>
                  <p class="text-[#6c6456]">Санкт-Петербург, ул. Модерна, 12</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <i class="fas fa-phone text-xl text-[#7f8330] w-6"></i>
                <div>
                  <p class="font-medium text-[#5e1104]">Телефон</p>
                  <a href="tel:88122345678" class="text-[#6c6456] hover:text-[#7f8330]">8 (812) 234-56-78</a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <i class="fas fa-envelope text-xl text-[#7f8330] w-6"></i>
                <div>
                  <p class="font-medium text-[#5e1104]">Email</p>
                  <a href="mailto:ivy@books.ru" class="text-[#6c6456] hover:text-[#7f8330]">ivy@books.ru</a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <i class="fas fa-clock text-xl text-[#7f8330] w-6"></i>
                <div>
                  <p class="font-medium text-[#5e1104]">Часы работы</p>
                  <p class="text-[#6c6456]">Пн-Сб: 11:00-21:00</p>
                  <p class="text-[#6c6456]">Вс: 12:00-20:00</p>
                </div>
              </div>
            </div>
  
            <!-- Социальные сети -->
            <div class="mt-8">
              <h4 class="text-[#5e1104] mb-4">Мы в соцсетях</h4>
              <div class="flex gap-4">
                <a 
                  v-for="social in socials" 
                  :key="social.name"
                  :href="social.url"
                  class="w-12 h-12 border border-[#7f8330] rounded-lg flex items-center justify-center text-[#7f8330] hover:bg-[#7f8330] hover:text-white transition-colors"
                  target="_blank"
                >
                  <i :class="social.icon" class="text-xl"></i>
                </a>
              </div>
            </div>
  
            <!-- Форма обратной связи -->
            <div class="mt-8">
              <h4 class="text-[#5e1104] mb-4">Напишите нам</h4>
              <form @submit.prevent="sendMessage">
                <div class="space-y-4">
                  <input 
                    v-model="feedback.name"
                    type="text"
                    placeholder="Ваше имя"
                    class="form-input"
                    required
                  >
                  <input 
                    v-model="feedback.email"
                    type="email"
                    placeholder="Email для ответа"
                    class="form-input"
                    required
                  >
                  <textarea 
                    v-model="feedback.message"
                    placeholder="Сообщение"
                    rows="4"
                    class="form-input"
                    required
                  ></textarea>
                  <button type="submit" class="btn-primary w-full py-3">
                    Отправить
                  </button>
                </div>
              </form>
            </div>
          </div>
  
          <!-- Карта -->
          <div>
            <div class="bg-[#7f8330]/5 h-[500px] rounded-xl flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-map text-6xl text-[#7f8330] mb-4"></i>
                <p class="text-[#6c6456]">Здесь будет интерактивная карта</p>
                <p class="text-sm text-[#6c6456] mt-2">ул. Модерна, 12, Санкт-Петербург</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const socials = [
    { name: 'Pinterest', icon: 'fab fa-pinterest', url: '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
    { name: 'Telegram', icon: 'fab fa-telegram', url: '#' },
    { name: 'VK', icon: 'fab fa-vk', url: '#' }
  ]
  
  const feedback = ref({
    name: '',
    email: '',
    message: ''
  })
  
  const sendMessage = () => {
    console.log('Отправка сообщения:', feedback.value)
    alert('Сообщение отправлено! Мы ответим вам в ближайшее время.')
    feedback.value = { name: '', email: '', message: '' }
  }
  </script>