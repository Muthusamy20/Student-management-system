import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const studentApi = {
  getAll: (params = {}) => apiClient.get('/students/', { params }),
  getById: (id) => apiClient.get(`/students/${id}/`),
  create: (data) => apiClient.post('/students/', data),
  update: (id, data) => apiClient.put(`/students/${id}/`, data),
  patch: (id, data) => apiClient.patch(`/students/${id}/`, data),
  delete: (id) => apiClient.delete(`/students/${id}/`),
};

export const departmentApi = {
  getAll: (params = {}) => apiClient.get('/departments/', { params }),
  create: (data) => apiClient.post('/departments/', data),
  delete: (id) => apiClient.delete(`/departments/${id}/`),
};

export const courseApi = {
  getAll: (params = {}) => apiClient.get('/courses/', { params }),
  create: (data) => apiClient.post('/courses/', data),
  update: (id, data) => apiClient.put(`/courses/${id}/`, data),
  delete: (id) => apiClient.delete(`/courses/${id}/`),
};

export const enrollmentApi = {
  getAll: (params = {}) => apiClient.get('/enrollments/', { params }),
  create: (data) => apiClient.post('/enrollments/', data),
  updateGrade: (id, grade) => apiClient.patch(`/enrollments/${id}/`, { grade }),
  delete: (id) => apiClient.delete(`/enrollments/${id}/`),
};

export const statsApi = {
  getStats: () => apiClient.get('/stats/'),
};

export default apiClient;
