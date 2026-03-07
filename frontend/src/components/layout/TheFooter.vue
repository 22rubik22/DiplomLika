<template>
    <footer class="bg-[#e2d5c8]/80 mt-24 pt-16 pb-8 border-t border-[#7f8330]/20 relative">
      <!-- Декоративная полоса сверху -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7f8330] to-[#5e1104]"></div>
      
      <div class="container mx-auto max-w-7xl px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <!-- Колонка 1: О магазине -->
          <div>
            <h3 class="font-['Playfair_Display'] text-xl text-[#5e1104] mb-6 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#b59b6d]">
              Плющ Бермана & Книги
            </h3>
            <p class="text-[#6c6456] text-sm leading-relaxed mb-5">
              Магазин, где эстетика встречается с содержанием.
            </p>
            <div class="flex gap-5">
              <a href="#" v-for="social in socials" :key="social.icon" :class="social.color" class="text-2xl hover:text-[#5e1104] transition-colors">
                <i :class="social.icon"></i>
              </a>
            </div>
          </div>
  
          <!-- Колонка 2: Разделы -->
          <div>
            <h3 class="font-['Playfair_Display'] text-xl text-[#5e1104] mb-6 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#b59b6d]">
              Разделы
            </h3>
            <ul class="space-y-3">
              <li v-for="item in sections" :key="item.path">
                <router-link :to="item.path" class="text-[#6c6456] hover:text-[#5e1104] transition-all hover:translate-x-1 inline-flex items-center gap-2">
                  <i :class="item.icon" class="text-sm"></i>
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
  
          <!-- Колонка 3: Помощь -->
          <div>
            <h3 class="font-['Playfair_Display'] text-xl text-[#5e1104] mb-6 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#b59b6d]">
              Помощь
            </h3>
            <ul class="space-y-3">
              <li v-for="item in help" :key="item.path">
                <router-link :to="item.path" class="text-[#6c6456] hover:text-[#5e1104] transition-all hover:translate-x-1 inline-flex items-center gap-2">
                  <i :class="item.icon" class="text-sm"></i>
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
  
          <!-- Колонка 4: Контакты -->
          <div>
            <h3 class="font-['Playfair_Display'] text-xl text-[#5e1104] mb-6 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#b59b6d]">
              Контакты
            </h3>
            <ul class="space-y-3">
              <li v-for="item in contacts" :key="item.text">
                <a :href="item.href" class="text-[#6c6456] hover:text-[#5e1104] transition-all hover:translate-x-1 inline-flex items-center gap-2">
                  <i :class="item.icon" class="text-sm w-5"></i>
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Нижняя часть футера -->
        <div class="pt-8 border-t border-[#7f8330]/20 text-center text-sm text-[#6c6456]">
          <p>© {{ new Date().getFullYear() }} Плющ Бермана & Книги. Где каждая книга — произведение искусства.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const socials = [
    { icon: 'fab fa-pinterest', color: 'text-[#7f8330]' },
    { icon: 'fab fa-vk', color: 'text-[#7f8330]' },
    { icon: 'fab fa-telegram', color: 'text-[#7f8330]' },
    { icon: 'fas fa-envelope', color: 'text-[#7f8330]' }
  ]
  
  const sections = [
    { path: '/catalog', name: 'Каталог', icon: 'fas fa-book' },
    { path: '/collections', name: 'Коллекции', icon: 'fas fa-feather-alt' },
    { path: '/author-meetings', name: 'Встречи', icon: 'fas fa-calendar-alt' },
    { path: '/about', name: 'О нас', icon: 'fas fa-info-circle' }
  ]
  
  const help = [
    { path: '/delivery-payment', name: 'Доставка и оплата', icon: 'fas fa-truck' },
    { path: '/faq', name: 'FAQ', icon: 'fas fa-question-circle' },
    { path: '/contacts', name: 'Контакты', icon: 'fas fa-phone' },
    { path: '/sitemap', name: 'Карта сайта', icon: 'fas fa-sitemap' }
  ]
  
  const contacts = [
    { href: '#', text: 'ул. Модерна, 12', icon: 'fas fa-map-marker-alt' },
    { href: 'tel:88122345678', text: '8 (812) 234-56-78', icon: 'fas fa-phone' },
    { href: 'mailto:ivy@books.ru', text: 'ivy@books.ru', icon: 'fas fa-envelope' }
  ]
  </script>