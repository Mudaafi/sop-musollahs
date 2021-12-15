import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default httpClient
