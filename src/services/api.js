import axios from 'axios'
import router from '../router'

// Criando uma instância do axios com configuração padrão
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const apiAuth = axios.create({
  baseURL: '/oauth',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})


// Interceptador de requisições
api.interceptors.request.use(
  config => {
    // Verifica se existe um token armazenado
    const token = localStorage.getItem('token')
    const TypeUser = localStorage.getItem('TypeUser')
    
    // Se o token existir, adiciona-o ao cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (TypeUser) {
      config.headers.TypeUser = TypeUser
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptador de respostas
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Tratamento de erros de resposta
    if (error.response) {
      const { status } = error.response
      
      // Se receber um erro 401 (não autorizado), redireciona para login
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('TypeUser')
        router.push('/login')
      }
    }
    
    return Promise.reject(error)
  }
)

export { api, apiAuth } 