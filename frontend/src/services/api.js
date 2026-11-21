import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// ==================== Student API ====================
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByUserId: (userId) => api.get(`/students/user/${userId}`),
  getByClassId: (classId) => api.get(`/students/class/${classId}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// ==================== Faculty API ====================
export const facultyAPI = {
  getAll: () => api.get('/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  getByUserId: (userId) => api.get(`/faculty/user/${userId}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
  assignSubjects: (id, subjectIds) => api.post(`/faculty/${id}/assign-subjects`, subjectIds),
};

// ==================== Subject API ====================
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  getBySemester: (sem) => api.get(`/subjects/semester/${sem}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// ==================== Class API ====================
export const classAPI = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

// ==================== Attendance API ====================
export const attendanceAPI = {
  markBatch: (data) => api.post('/attendance/batch', data),
  getByClassSubjectDate: (classId, subjectId, date) =>
    api.get(`/attendance/class/${classId}/subject/${subjectId}`, { params: { date } }),
  getStudentSummary: (studentId) => api.get(`/attendance/student/${studentId}/summary`),
  getStudentHistory: (studentId) => api.get(`/attendance/student/${studentId}/history`),
  getReport: (params) => api.get('/attendance/report', { params }),
};

// ==================== Marks API ====================
export const marksAPI = {
  saveBatch: (data) => api.post('/marks/batch', data),
  getByClassSubjectAssessment: (classId, subjectId, assessmentType) =>
    api.get(`/marks/class/${classId}/subject/${subjectId}`, { params: { assessmentType } }),
  getByStudentId: (studentId) => api.get(`/marks/student/${studentId}`),
  getStudentPerformance: (studentId) => api.get(`/marks/student/${studentId}/performance`),
  getReport: (params) => api.get('/marks/report', { params }),
};

// ==================== Dashboard API ====================
export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getFacultyStats: (facultyId) => api.get(`/dashboard/faculty/${facultyId}`),
  getStudentStats: (studentId) => api.get(`/dashboard/student/${studentId}`),
};

export default api;
