<template>
    <div>
      <h1 class="page-title">Авторские встречи</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <!-- Предстоящие встречи -->
        <div class="mb-12">
          <h3 class="text-[#5e1104] text-2xl mb-6">Предстоящие встречи</h3>
          
          <div class="space-y-4">
            <div 
              v-for="meeting in upcomingMeetings" 
              :key="meeting.id"
              class="flex flex-col md:flex-row gap-6 p-6 border border-[#7f8330]/10 rounded-xl hover:shadow-md transition-shadow"
            >
              <div class="md:w-32 h-32 bg-[#f3d8ce] rounded-xl flex items-center justify-center">
                <i class="fas fa-user text-4xl text-[#7f8330]"></i>
              </div>
              
              <div class="flex-1">
                <h4 class="text-[#5e1104] text-xl font-['Playfair_Display'] mb-2">{{ meeting.title }}</h4>
                <p class="text-[#7f8330] mb-3">с {{ meeting.author }}</p>
                
                <div class="flex flex-wrap gap-4 text-sm text-[#6c6456] mb-4">
                  <span><i class="far fa-calendar-alt mr-2"></i>{{ meeting.date }}</span>
                  <span><i class="far fa-clock mr-2"></i>{{ meeting.time }}</span>
                  <span><i class="fas fa-map-marker-alt mr-2"></i>{{ meeting.location }}</span>
                </div>
                
                <p class="text-[#6c6456] mb-4">{{ meeting.description }}</p>
                
                <div class="flex gap-3">
                  <button @click="registerForMeeting(meeting.id)" class="btn-primary px-6 py-2">
                    Записаться
                  </button>
                  <button class="btn px-6 py-2">
                    Подробнее
                  </button>
                </div>
              </div>
              
              <div class="md:w-32 text-center">
                <span class="inline-block bg-[#7f8330] text-white px-4 py-2 rounded-full text-sm">
                  {{ meeting.seatsLeft }} мест
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Прошедшие встречи -->
        <div>
          <h3 class="text-[#5e1104] text-2xl mb-6">Прошедшие встречи</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="meeting in pastMeetings" 
              :key="meeting.id"
              class="flex gap-4 p-4 border border-[#7f8330]/10 rounded-lg opacity-75"
            >
              <div class="w-16 h-16 bg-[#f3d8ce] rounded-lg flex items-center justify-center">
                <i class="fas fa-user text-2xl text-[#7f8330]"></i>
              </div>
              
              <div>
                <h4 class="text-[#5e1104] font-medium">{{ meeting.title }}</h4>
                <p class="text-sm text-[#7f8330]">{{ meeting.author }}</p>
                <p class="text-xs text-[#6c6456] mt-1">{{ meeting.date }}</p>
                <a href="#" class="text-[#7f8330] text-sm hover:underline mt-2 inline-block">
                  Видеозапись
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Пригласить автора -->
        <div class="mt-12 p-6 bg-[#7f8330]/5 rounded-xl text-center">
          <i class="fas fa-microphone-alt text-3xl text-[#7f8330] mb-4"></i>
          <h3 class="text-[#5e1104] text-xl mb-2">Хотите предложить автора?</h3>
          <p class="text-[#6c6456] mb-4">Напишите нам, какого писателя или поэта вы хотели бы увидеть</p>
          <button @click="suggestAuthor" class="btn-primary px-6 py-2">
            Предложить автора
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const upcomingMeetings = ref([
    {
      id: 1,
      title: 'Презентация новой книги',
      author: 'Сергей Довлатов',
      date: '25 марта 2026',
      time: '18:00',
      location: 'Основной зал',
      description: 'Презентация новой книги и автограф-сессия. Вход свободный.',
      seatsLeft: 15
    },
    {
      id: 2,
      title: 'Мастер-класс по иллюстрации',
      author: 'Анна Белова',
      date: '2 апреля 2026',
      time: '15:00',
      location: 'Лекторий',
      description: 'Практическое занятие по созданию книжных иллюстраций в стиле модерн.',
      seatsLeft: 8
    }
  ])
  
  const pastMeetings = ref([
    {
      id: 3,
      title: 'Лекция "Книга как искусство"',
      author: 'Дмитрий Соколов',
      date: '10 февраля 2026'
    },
    {
      id: 4,
      title: 'Встреча с поэтами',
      author: 'Мария Степанова, Дмитрий Воденников',
      date: '25 января 2026'
    }
  ])
  
  const registerForMeeting = (meetingId) => {
    alert(`Вы записаны на встречу. Мы отправили подтверждение на ваш email.`)
  }
  
  const suggestAuthor = () => {
    alert('Форма для предложения автора появится в ближайшее время. Пока вы можете написать нам на ivy@books.ru')
  }
  </script>