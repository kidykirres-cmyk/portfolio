import axios from 'axios'

// Centralized API service — Live Laravel on InfinityFree
// Architecture: React → Laravel API → InfinityFree MySQL
// All API calls go through VITE_API_URL; never connect React directly to MySQL
// Primary live API — set first as requested: https://gokulk.freedev.app/api/
// Trailing slash normalized: VITE_API_URL=https://gokulk.freedev.app/api/ → https://gokulk.freedev.app/api
// DEV uses Vite proxy (/api) to inject InfinityFree __test cookie and avoid CORS/aes.js block
const rawEnvUrl = import.meta.env.VITE_API_URL || 'https://gokulk.freedev.app/api/'
const envUrl = rawEnvUrl.replace(/\/$/, '') // strip trailing slash → https://gokulk.freedev.app/api
const isLocalBackend = envUrl.includes('localhost') || envUrl.includes('127.0.0.1')
const API_URL = isLocalBackend ? envUrl : (import.meta.env.DEV ? '/api' : envUrl)
const BASE_URL = API_URL.startsWith('http') ? API_URL.replace(/\/api\/?$/, '') : 'https://gokulk.freedev.app'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  // withCredentials must be false when using Vite proxy to InfinityFree (same-origin /api -> proxy -> https)
  // Keep true only for local backend that needs Sanctum cookie auth
  withCredentials: isLocalBackend ? true : false,
})

// CSRF helper for Sanctum stateful requests
function getXsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function getCsrfCookie() {
  // Fetch Sanctum CSRF cookie — sets XSRF-TOKEN cookie
  // BASE_URL is https://gokulk.freedev.app when VITE_API_URL is live
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
}

// Attach Bearer token + XSRF if present (Sanctum auth:sanctum preserved)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const xsrf = getXsrfToken()
  if (xsrf) {
    config.headers['X-XSRF-TOKEN'] = xsrf
  }
  return config
})

// Detect InfinityFree HTML challenge and give friendly error
api.interceptors.response.use(
  (res) => {
    const ct = res.headers?.['content-type'] || ''
    if (ct.includes('text/html') && typeof res.data === 'string' && res.data.includes('aes.js')) {
      return Promise.reject({ message: 'InfinityFree verification blocked API — Vite proxy __test cookie expired or DNS not propagated', response: res, isInfinityFree: true })
    }
    return res
  },
  (err) => {
    const ct = err.response?.headers?.['content-type'] || ''
    const data = err.response?.data
    if (ct.includes('text/html') || (typeof data === 'string' && data.includes('aes.js'))) {
      err.message = 'InfinityFree verification blocked API — restart vite dev server to refresh __test cookie or check DNS propagation (72h for new domains)'
      err.isInfinityFree = true
    }
    if (!err.response && err.message === 'Network Error') {
      // Could be DNS not propagated or InfinityFree challenge without CORS headers
      err.message = 'Network Error — API unreachable (DNS 72h propagation or InfinityFree verification). See console.'
    }
    return Promise.reject(err)
  }
)

// Projects — public: GET /api/projects, GET /api/projects/{id}
export const fetchProjects = (params = {}) => api.get('/projects', { params }).then(r => r.data)
export const fetchProject = (id) => api.get(`/projects/${id}`).then(r => r.data.data || r.data)
export const createProject = (formData) => api.post('/projects', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(r => r.data)
export const updateProject = (id, formData) => {
  if (formData instanceof FormData) {
    formData.append('_method', 'PUT')
    return api.post(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  }
  return api.put(`/projects/${id}`, formData).then(r => r.data)
}
export const deleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data)

// Auth — POST /api/admin/login (Sanctum), legacy POST /api/login
// InfinityFree bypass uses Bearer token only, no CSRF cookie needed (avoids extra CORS preflight)
export const login = async (credentials) => {
  if (isLocalBackend) { try { await getCsrfCookie() } catch {} }
  return api.post('/admin/login', credentials).then(r => r.data)
}
export const loginLegacy = async (credentials) => {
  if (isLocalBackend) { try { await getCsrfCookie() } catch {} }
  return api.post('/login', credentials).then(r => r.data)
}
export const logout = () => api.post('/admin/logout').then(r => r.data)
export const me = () => api.get('/admin/user').then(r => r.data)

// Admin Projects — /api/admin/projects (auth:sanctum)
export const adminFetchProjects = (params = {}) => api.get('/admin/projects', { params }).then(r => r.data)
export const adminCreateProject = (fd) => api.post('/admin/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
export const adminUpdateProject = (id, fd) => {
  if (fd instanceof FormData) { fd.append('_method', 'PUT'); return api.post(`/admin/projects/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data) }
  return api.put(`/admin/projects/${id}`, fd).then(r => r.data)
}
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`).then(r => r.data)

// Admin Skills — /api/admin/skills
export const adminFetchSkills = () => api.get('/admin/skills').then(r => r.data)
export const adminCreateSkill = (fd) => api.post('/admin/skills', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
export const adminUpdateSkill = (id, fd) => {
  if (fd instanceof FormData) { fd.append('_method', 'PUT'); return api.post(`/admin/skills/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data) }
  return api.put(`/admin/skills/${id}`, fd).then(r => r.data)
}
export const adminDeleteSkill = (id) => api.delete(`/admin/skills/${id}`).then(r => r.data)
export const adminReorderSkills = (ids) => api.post('/admin/skills/reorder', { ids }).then(r => r.data)

// Admin Settings — /api/admin/settings, public GET /api/settings
export const adminFetchSettings = () => api.get('/admin/settings').then(r => r.data)
export const adminUpdateSettings = (data) => api.put('/admin/settings', data).then(r => r.data)
export const adminUploadImage = (key, file) => {
  const fd = new FormData(); fd.append('key', key); fd.append('file', file);
  return api.post('/admin/settings/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
}
export const publicFetchSettings = () => api.get('/settings').then(r => r.data)

// Public Skills — GET /api/skills (used by About.jsx)
export const fetchSkills = () => api.get('/skills').then(r => r.data)

// Admin Visitors — /api/admin/visitors/stats
export const adminFetchVisitorStats = () => api.get('/admin/visitors/stats').then(r => r.data)
export const adminFetchVisitors = (params={}) => api.get('/admin/visitors', { params }).then(r => r.data)

// Admin Account — PUT /api/admin/account
export const adminUpdateAccount = (data) => api.put('/admin/account', data).then(r => r.data)

// Public visitor tracking — POST /api/track-visit
export const trackVisit = (page) => api.post('/track-visit', { page }).then(r => r.data).catch(()=>{})

// Contact — POST /api/contact
export const sendContact = (data) => api.post('/contact', data).then(r => r.data)

// Helpers to expose URLs for debugging
export const getApiUrl = () => API_URL
export const getBaseUrl = () => BASE_URL

export default api
