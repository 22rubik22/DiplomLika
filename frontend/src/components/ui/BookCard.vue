<template>
    <div 
      class="bg-white rounded-xl overflow-hidden shadow-[0_5px_25px_rgba(0,0,0,0.05)] transition-all duration-700 border border-[#f3d8ce]/50 hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2.5 hover:border-[#f3d8ce] cursor-pointer group"
      @click="$emit('click')"
    >
      <!-- Обложка -->
      <div class="h-72 bg-gradient-to-br from-[#f3d8ce] to-[#f8e6df] flex items-center justify-center overflow-hidden">
        <img 
          :src="book.image" 
          :alt="book.title"
          class="w-2/3 h-auto object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:scale-105"
        >
      </div>
      
      <!-- Информация о книге -->
      <div class="p-6">
        <h3 class="font-['Playfair_Display'] text-xl text-[#5e1104] mb-2 leading-tight">{{ book.title }}</h3>
        <p class="text-sm text-[#6c6456] mb-4">{{ book.author }}</p>
        
        <div class="flex justify-between items-center mt-5">
          <span class="text-2xl text-[#5e1104]">{{ formatPrice(book.price) }} ₽</span>
          
          <div class="flex gap-2">
            <!-- Кнопка "В корзину" -->
            <button 
              @click.stop="$emit('add-to-cart', book)"
              class="inline-flex items-center gap-2 px-5 py-2 bg-transparent text-[#5e1104] border border-[#7f8330] rounded-full text-sm font-medium transition-all hover:bg-[#7f8330]/8 hover:pr-8 hover:-translate-y-1 hover:shadow-[0_5px_25px_rgba(0,0,0,0.05)]"
            >
              В корзину
            </button>
            
            <!-- Кнопка "Подробнее" (опционально) -->
            <button 
              v-if="showDetails"
              @click.stop="$emit('show-details', book)"
              class="inline-flex items-center gap-2 px-5 py-2 bg-transparent text-[#5e1104] border border-[#7f8330] rounded-full text-sm font-medium transition-all hover:bg-[#7f8330]/8 hover:-translate-y-1"
            >
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        
        <!-- Дополнительная информация (для особых случаев) -->
        <div v-if="book.special" class="mt-3">
          <span class="inline-block bg-[#b59b6d] text-white text-xs px-3 py-1 rounded-full">
            {{ book.special }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    book: {
      type: Object,
      required: true
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['click', 'add-to-cart', 'show-details'])
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  </script>