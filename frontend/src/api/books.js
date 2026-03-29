import api from './axios'

export const bookApi = {
  // Получить список книг
  getBooks(params = {}) {
    return api.get('/books', { params })
  },
  
  // Получить книгу по ID
  getBook(id) {
    return api.get(`/books/${id}`)
  },
  
  // Создать книгу
  createBook(data) {
    return api.post('/books', data)
  },
  
  // Обновить книгу
  updateBook(id, data) {
    return api.put(`/books/${id}`, data)
  },
  
  // Удалить книгу
  deleteBook(id) {
    return api.delete(`/books/${id}`)
  },
  
  // Переключить статус "Рекомендуемая"
  toggleFeatured(id) {
    return api.patch(`/books/${id}/toggle-featured`)
  },
  
  // Переключить статус активности
  toggleActive(id) {
    return api.patch(`/books/${id}/toggle-active`)
  }
}

export const bookImageApi = {
  // Получить изображения книги
  getImages(bookId) {
    return api.get(`/books/${bookId}/images`)
  },
  
  // Загрузить изображение
  uploadImage(bookId, data) {
    return api.post(`/books/${bookId}/images`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Обновить изображение
  updateImage(imageId, data) {
    return api.put(`/book-images/${imageId}`, data)
  },
  
  // Удалить изображение
  deleteImage(imageId) {
    return api.delete(`/book-images/${imageId}`)
  },
  
  // Установить как основное
  setPrimary(imageId) {
    return api.patch(`/book-images/${imageId}/set-primary`)
  },
  
  // Обновить порядок сортировки
  reorderImages(bookId, images) {
    return api.post(`/books/${bookId}/images/reorder`, { images })
  }
}