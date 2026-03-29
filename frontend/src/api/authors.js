import api from './axios'

export const authorApi = {
  // Получить список авторов
  getAuthors(params = {}) {
    return api.get('/authors', { params })
  },
  
  // Получить одного автора
  getAuthor(id) {
    return api.get(`/authors/${id}`)
  },
  
  // Получить книги автора
  getAuthorBooks(id) {
    return api.get(`/authors/${id}/books`)
  },
  
  // Создать автора
  createAuthor(data) {
    return api.post('/authors', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Обновить автора
  updateAuthor(id, data) {
    return api.post(`/authors/${id}?_method=PUT`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Удалить автора
  deleteAuthor(id) {
    return api.delete(`/authors/${id}`)
  }
}