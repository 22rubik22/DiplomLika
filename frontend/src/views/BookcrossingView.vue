<template>
    <div>
      <h1 class="page-title">Буккроссинг</h1>
      
      <div class="space-y-8">
        <!-- Баннер -->
        <div class="bg-gradient-to-r from-[#7f8330]/20 to-[#5e1104]/20 rounded-xl p-10 text-center">
          <i class="fas fa-exchange-alt text-5xl text-[#7f8330] mb-4"></i>
          <h2 class="text-3xl text-[#5e1104] font-['Playfair_Display'] mb-4">Освободи книги</h2>
          <p class="text-lg text-[#6c6456] max-w-2xl mx-auto mb-6">
            Принеси прочитанную книгу в наш магазин и выбери новую для чтения. Бесплатно и экологично.
          </p>
          <button @click="participate" class="btn-primary px-8 py-3">
            Участвовать
          </button>
        </div>
        
        <!-- Как это работает -->
        <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
          <h3 class="text-[#5e1104] text-2xl mb-6">Как это работает</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div v-for="(step, index) in steps" :key="index" class="text-center">
              <div class="w-12 h-12 bg-[#7f8330] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                {{ index + 1 }}
              </div>
              <h4 class="text-[#5e1104] font-medium mb-2">{{ step.title }}</h4>
              <p class="text-sm text-[#6c6456]">{{ step.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- Доступные книги -->
        <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
          <h3 class="text-[#5e1104] text-2xl mb-6">Доступные для обмена книги</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="book in availableBooks" 
              :key="book.id"
              class="text-center p-3 border border-[#7f8330]/10 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              @click="requestBook(book)"
            >
              <div class="h-24 bg-[#f3d8ce] rounded-lg mb-2 flex items-center justify-center">
                <i class="fas fa-book text-3xl text-[#7f8330]/30"></i>
              </div>
              <h4 class="text-sm font-medium text-[#5e1104]">{{ book.title }}</h4>
              <p class="text-xs text-[#6c6456]">{{ book.author }}</p>
            </div>
          </div>
        </div>
        
        <!-- Правила -->
        <div class="bg-[#7f8330]/5 rounded-xl p-6">
          <h3 class="text-[#5e1104] text-lg mb-4">Правила буккроссинга</h3>
          <ul class="space-y-2 text-[#6c6456]">
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Книги должны быть в хорошем состоянии</li>
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Один человек может взять не более 2 книг в месяц</li>
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Учебники и техническая литература не принимаются</li>
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>После прочтения книгу можно вернуть или оставить себе</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const steps = [
    {
      title: 'Принесите книгу',
      description: 'Выберите книгу в хорошем состоянии и принесите в наш магазин'
    },
    {
      title: 'Оцените ассортимент',
      description: 'Посмотрите, какие книги доступны для обмена'
    },
    {
      title: 'Выберите книгу',
      description: 'Возьмите понравившуюся книгу бесплатно'
    },
    {
      title: 'Поделитесь впечатлениями',
      description: 'Оставьте отзыв о книге и расскажите друзьям'
    }
  ]
  
  const availableBooks = ref([
    { id: 1, title: 'Мастер и Маргарита', author: 'М. Булгаков' },
    { id: 2, title: '1984', author: 'Дж. Оруэлл' },
    { id: 3, title: 'Маленький принц', author: 'А. Сент-Экзюпери' },
    { id: 4, title: 'Портрет Дориана Грея', author: 'О. Уайльд' },
    { id: 5, title: 'Над пропастью во ржи', author: 'Д. Сэлинджер' },
    { id: 6, title: 'Три товарища', author: 'Э.М. Ремарк' }
  ])
  
  const participate = () => {
    alert('Спасибо за интерес к буккроссингу! Приходите в наш магазин с книгой.')
  }
  
  const requestBook = (book) => {
    alert(`Книга "${book.title}" зарезервирована для вас. Пожалуйста, заберите её в магазине в течение 3 дней.`)
  }
  </script>