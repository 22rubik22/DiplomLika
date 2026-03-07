<template>
  <div>
    <h1 class="page-title">О нас</h1>
    
    <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
      <p class="text-lg leading-relaxed mb-8">
        «Плющ Бермана & Книги» — это не просто магазин, а культурное пространство, 
        созданное для ценителей прекрасного. Мы верим, что книга должна быть совершенна 
        как в содержании, так и в форме.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-[#7f8330]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-leaf text-2xl text-[#7f8330]"></i>
          </div>
          <h3 class="text-[#5e1104] text-xl mb-3">Наша философия</h3>
          <p class="text-[#6c6456]">
            Соединяем литературное наследие с эстетикой модерна, создавая уникальные книжные коллекции.
          </p>
        </div>
        
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-[#7f8330]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-book text-2xl text-[#7f8330]"></i>
          </div>
          <h3 class="text-[#5e1104] text-xl mb-3">Коллекции</h3>
          <p class="text-[#6c6456]">
            Тщательно отобранные издания с уникальным дизайном, иллюстрациями и переплетами.
          </p>
        </div>
        
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-[#7f8330]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-calendar text-2xl text-[#7f8330]"></i>
          </div>
          <h3 class="text-[#5e1104] text-xl mb-3">События</h3>
          <p class="text-[#6c6456]">
            Регулярные встречи с авторами, презентации книг и лекции об искусстве книги.
          </p>
        </div>
      </div>

      <!-- Наша команда -->
      <div class="mt-16">
        <h2 class="text-[#5e1104] text-2xl mb-8 text-center">Наша команда</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="member in team" :key="member.name" class="text-center">
            <div class="w-32 h-32 bg-[#f3d8ce] rounded-full mx-auto mb-4 flex items-center justify-center">
              <i class="fas fa-user text-4xl text-[#7f8330]"></i>
            </div>
            <h3 class="text-[#5e1104] font-medium">{{ member.name }}</h3>
            <p class="text-sm text-[#6c6456]">{{ member.position }}</p>
          </div>
        </div>
      </div>

      <!-- Наши преимущества -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex items-start gap-4">
          <i class="fas fa-check-circle text-2xl text-[#7f8330]"></i>
          <div>
            <h3 class="text-[#5e1104] font-medium mb-2">Уникальный ассортимент</h3>
            <p class="text-[#6c6456]">Только отобранные издания, которые сочетают содержание и форму</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <i class="fas fa-check-circle text-2xl text-[#7f8330]"></i>
          <div>
            <h3 class="text-[#5e1104] font-medium mb-2">Индивидуальный подход</h3>
            <p class="text-[#6c6456]">Помогаем подобрать книгу под ваши вкусы и интересы</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <i class="fas fa-check-circle text-2xl text-[#7f8330]"></i>
          <div>
            <h3 class="text-[#5e1104] font-medium mb-2">Культурные события</h3>
            <p class="text-[#6c6456]">Регулярные встречи и лекции в уютном пространстве</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <i class="fas fa-check-circle text-2xl text-[#7f8330]"></i>
          <div>
            <h3 class="text-[#5e1104] font-medium mb-2">Подарочные издания</h3>
            <p class="text-[#6c6456]">Книги, которые станут настоящим произведением искусства в вашей библиотеке</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const team = [
  { name: 'Анна Белова', position: 'Основатель, искусствовед' },
  { name: 'Дмитрий Соколов', position: 'Куратор коллекций' },
  { name: 'Елена Волкова', position: 'Организатор мероприятий' },
  { name: 'Михаил Петров', position: 'Эксперт по букинистике' }
]
</script>