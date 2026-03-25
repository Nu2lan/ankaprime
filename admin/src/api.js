import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

let isRefreshing = false
let failedQueue = []
const processQueue = (error, token = null) => {
    failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
    failedQueue = []
}

api.interceptors.response.use(
    r => r,
    async (error) => {
        const orig = error.config
        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !orig._retry) {
            if (isRefreshing) {
                return new Promise((res, rej) => { failedQueue.push({ resolve: res, reject: rej }) })
                    .then(t => { orig.headers.Authorization = `Bearer ${t}`; return api(orig) })
            }
            orig._retry = true; isRefreshing = true
            try {
                const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { clientType: 'admin' }, { withCredentials: true })
                localStorage.setItem('adminToken', data.accessToken)
                processQueue(null, data.accessToken)
                orig.headers.Authorization = `Bearer ${data.accessToken}`
                return api(orig)
            } catch (e) {
                processQueue(e); localStorage.removeItem('adminToken'); window.location.href = '/login'; return Promise.reject(e)
            } finally { isRefreshing = false }
        }
        return Promise.reject(error)
    }
)

export default api
