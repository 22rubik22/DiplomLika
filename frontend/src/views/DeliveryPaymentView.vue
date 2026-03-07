<template>
    <div>
      <h1 class="page-title">Доставка и оплата</h1>
      
      <div class="bg-white rounded-xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-[#f3d8ce]/50">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Доставка -->
          <div>
            <h3 class="text-[#5e1104] text-2xl mb-6">Способы доставки</h3>
            
            <div class="space-y-6">
              <div v-for="delivery in deliveryMethods" :key="delivery.id" class="flex gap-4">
                <div class="w-12 h-12 bg-[#7f8330]/10 rounded-lg flex items-center justify-center">
                  <i :class="delivery.icon" class="text-xl text-[#7f8330]"></i>
                </div>
                <div>
                  <h4 class="text-[#5e1104] font-medium mb-1">{{ delivery.name }}</h4>
                  <p class="text-[#6c6456] text-sm mb-2">{{ delivery.description }}</p>
                  <p class="text-[#7f8330] font-medium">{{ delivery.price }}</p>
                </div>
              </div>
            </div>
            
            <div class="mt-8 p-4 bg-[#7f8330]/5 rounded-lg">
              <p class="text-sm text-[#6c6456]">
                <i class="fas fa-info-circle text-[#7f8330] mr-2"></i>
                Бесплатная доставка по Санкт-Петербургу при заказе от 2 500 ₽
              </p>
            </div>
          </div>
          
          <!-- Оплата -->
          <div>
            <h3 class="text-[#5e1104] text-2xl mb-6">Способы оплаты</h3>
            
            <div class="space-y-6">
              <div v-for="payment in paymentMethods" :key="payment.id" class="flex gap-4">
                <div class="w-12 h-12 bg-[#7f8330]/10 rounded-lg flex items-center justify-center">
                  <i :class="payment.icon" class="text-xl text-[#7f8330]"></i>
                </div>
                <div>
                  <h4 class="text-[#5e1104] font-medium mb-1">{{ payment.name }}</h4>
                  <p class="text-[#6c6456] text-sm">{{ payment.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Зоны доставки -->
        <div class="mt-12">
          <h3 class="text-[#5e1104] text-xl mb-4">Зоны доставки</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 border border-[#7f8330]/10 rounded-lg">
              <h4 class="text-[#5e1104] font-medium mb-2">Санкт-Петербург</h4>
              <p class="text-sm text-[#6c6456]">1-2 дня • от 300 ₽</p>
            </div>
            <div class="p-4 border border-[#7f8330]/10 rounded-lg">
              <h4 class="text-[#5e1104] font-medium mb-2">Ленинградская область</h4>
              <p class="text-sm text-[#6c6456]">2-3 дня • от 400 ₽</p>
            </div>
            <div class="p-4 border border-[#7f8330]/10 rounded-lg">
              <h4 class="text-[#5e1104] font-medium mb-2">Другие регионы РФ</h4>
              <p class="text-sm text-[#6c6456]">5-14 дней • от 350 ₽</p>
            </div>
          </div>
        </div>
        
        <!-- Возврат -->
        <div class="mt-12 p-6 bg-[#7f8330]/5 rounded-xl">
          <h3 class="text-[#5e1104] text-xl mb-3">Условия возврата</h3>
          <ul class="space-y-2 text-[#6c6456]">
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Возврат товара возможен в течение 14 дней</li>
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Товар должен быть в оригинальной упаковке</li>
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Для букинистических изданий действуют особые условия</li>
            <li><i class="fas fa-check text-[#7f8330] mr-2"></i>Деньги возвращаются на карту в течение 5-7 дней</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const deliveryMethods = [
    {
      id: 1,
      name: 'Курьерская доставка',
      icon: 'fas fa-truck',
      description: 'По Санкт-Петербургу — 300 ₽, от 2 500 ₽ бесплатно. Срок доставки: 1-2 дня.',
      price: 'от 300 ₽'
    },
    {
      id: 2,
      name: 'Пункты выдачи',
      icon: 'fas fa-store',
      description: 'Более 50 пунктов выдачи в городе — 150 ₽, срок доставки: 2-3 дня.',
      price: '150 ₽'
    },
    {
      id: 3,
      name: 'Почта России',
      icon: 'fas fa-mail-bulk',
      description: 'По всей России — от 200 ₽, срок доставки: 5-14 дней.',
      price: 'от 200 ₽'
    }
  ]
  
  const paymentMethods = [
    {
      id: 1,
      name: 'Банковские карты',
      icon: 'fas fa-credit-card',
      description: 'Visa, Mastercard, МИР — онлайн на сайте'
    },
    {
      id: 2,
      name: 'SBP/QR-код',
      icon: 'fas fa-mobile-alt',
      description: 'Быстрая оплата по QR-коду'
    },
    {
      id: 3,
      name: 'Наличными при получении',
      icon: 'fas fa-money-bill-wave',
      description: 'Для курьерской доставки и пунктов выдачи'
    }
  ]
  </script>