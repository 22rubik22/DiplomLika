import api from './axios'

export const genreApi = {
  // Получить список жанров
  getGenres(params = {}) {
    return api.get('/genres', { params })
  },
  
  // Получить дерево жанров
  getGenreTree() {
    return api.get('/genres/tree')
  },
  
  // Получить один жанр
  getGenre(id) {
    return api.get(`/genres/${id}`)
  },
  
  // Создать жанр
  createGenre(data) {
    return api.post('/genres', data)
  },
  
  // Обновить жанр
  updateGenre(id, data) {
    return api.put(`/genres/${id}`, data)
  },
  
  // Удалить жанр
  deleteGenre(id) {
    return api.delete(`/genres/${id}`)
  },
  
  // Переключить активность
  toggleActive(id) {
    return api.patch(`/genres/${id}/toggle-active`)
  }
}