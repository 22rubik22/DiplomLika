<template>
    <div>
      <h1 class="page-title">Коллекции</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="collection in collections" 
            :key="collection.id"
            class="group relative overflow-hidden rounded-xl cursor-pointer"
            @click="goToCollection(collection.id)"
          >
            <div class="aspect-square bg-gradient-to-br from-[#f3d8ce] to-[#f8e6df] flex items-center justify-center">
              <i :class="collection.icon" class="text-6xl text-[#7f8330]/50 group-hover:scale-110 transition-transform"></i>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#5e1104]/80 to-transparent flex items-end p-6">
              <div>
                <h3 class="text-white text-2xl font-['Playfair_Display'] mb-2">{{ collection.name }}</h3>
                <p class="text-white/80 text-sm">{{ collection.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const collections = ref([
    {
      id: 1,
      name: 'Искусство в переплете',
      description: 'Книги как арт-объекты с уникальным дизайном',
      icon: 'fas fa-feather-alt'
    },
    {
      id: 2,
      name: 'Книги-картины',
      description: 'Работы современных художников',
      icon: 'fas fa-palette'
    },
    {
      id: 3,
      name: 'Авторский винтаж',
      description: 'Букинистические находки с историей',
      icon: 'fas fa-history'
    },
    {
      id: 4,
      name: 'Поэзия Серебряного века',
      description: 'Прижизненные издания и репринты',
      icon: 'fas fa-feather'
    },
    {
      id: 5,
      name: 'Философская мысль',
      description: 'Труды великих мыслителей в подарочном оформлении',
      icon: 'fas fa-brain'
    },
    {
      id: 6,
      name: 'Детская книга',
      description: 'Иллюстрированные издания для детей',
      icon: 'fas fa-child'
    }
  ])
  
  const goToCollection = (id) => {
    router.push(`/collections/${id}`)
  }
  </script>