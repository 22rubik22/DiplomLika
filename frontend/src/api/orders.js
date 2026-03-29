import api from './axios'

export const orderApi = {
  // Получить список заказов пользователя
  getUserOrders(params = {}) {
    return api.get('/orders', { params })
  },
  
  // Получить детали заказа
  getOrder(id) {
    return api.get(`/orders/${id}`)
  },
  
  // Создать заказ из корзины
  createOrder(data) {
    return api.post('/orders', data)
  },
  
  // Отменить заказ
  cancelOrder(id) {
    return api.post(`/orders/${id}/cancel`)
  },
  
  // ============= АДМИНСКИЕ МЕТОДЫ =============
  
  // Получить все заказы (админ)
  getAllOrders(params = {}) {
    return api.get('/admin/orders', { params })
  },
  
  // Обновить статус заказа
  updateOrderStatus(id, status, adminComment = null) {
    return api.put(`/admin/orders/${id}/status`, {
      status,
      admin_comment: adminComment
    })
  },
  
  // Обновить статус оплаты
  updatePaymentStatus(id, paymentStatus) {
    return api.put(`/admin/orders/${id}/payment-status`, {
      payment_status: paymentStatus
    })
  }
}