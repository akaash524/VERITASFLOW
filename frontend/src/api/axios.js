import axios from 'axios'

const API = axios.create({
    baseURL: "https://veritasflow-1.onrender.com",
    withCredentials: true,  // sends cookies automatically
})
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
export default API