<template>
    <header class="bg-[#f1e8e0]/92 backdrop-blur-md sticky top-0 z-50 border-b border-[#7f8330]/20 py-6 px-4 md:px-8">
      <div class="container mx-auto max-w-7xl">
        <!-- Верхняя часть хедера -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-5 mb-6">
          <div class="flex flex-col md:flex-row items-center gap-5">
            <router-link to="/" class="font-['Playfair_Display'] text-3xl md:text-4xl text-[#5e1104] tracking-wide">
              Плющ Бермана<span class="text-[#8b4513] italic"> & Книги</span>
            </router-link>
            <div class="hidden md:block h-10 w-px bg-[#7f8330]/30"></div>
            <div class="font-['Cormorant_Garamond'] italic text-[#6c6456] max-w-xs text-center md:text-left leading-relaxed">
              Где эстетика модерна встречается с мудростью страниц
            </div>
          </div>
          
          <!-- Иконки пользователя и корзины -->
          <div class="flex gap-5 items-center">
            <router-link to="/login" class="text-2xl text-[#7f8330] hover:text-[#5e1104] transition-all hover:-translate-y-1">
              <i class="fas fa-user"></i>
            </router-link>
            <router-link to="/cart" class="text-2xl text-[#7f8330] hover:text-[#5e1104] transition-all hover:-translate-y-1 relative">
              <i class="fas fa-shopping-basket"></i>
              <span class="absolute -top-2 -right-2 bg-[#5e1104] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ cartCount }}
              </span>
            </router-link>
          </div>
        </div>
  
        <!-- Навигация -->
        <nav class="mt-5">
          <ul class="flex flex-wrap justify-center gap-1">
            <li v-for="item in navItems" :key="item.path">
              <router-link 
                :to="item.path" 
                class="nav-item inline-block px-6 py-3 text-[#6c6456] font-medium rounded-full transition-all hover:text-[#5e1104] hover:bg-[#7f8330]/8 hover:-translate-y-1"
                active-class="!text-[#5e1104] font-medium bg-[#7f8330]/10"
              >
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const cartCount = ref(3)
  
  const navItems = [
    { path: '/', name: 'Главная' },
    { path: '/catalog', name: 'Каталог' },
    { path: '/collections', name: 'Коллекции' },
    { path: '/new-editions', name: 'Переиздания' },
    { path: '/rare-books', name: 'Букинистика' },
    { path: '/bookcrossing', name: 'Буккроссинг' },
    { path: '/author-meetings', name: 'Авторские встречи' },
    { path: '/about', name: 'О нас' }
  ]
  </script>