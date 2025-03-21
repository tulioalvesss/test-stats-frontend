import { apiAuth, api } from './api'

export const AuthService = {
  async login(email, password) {
    const formData = new URLSearchParams()
    formData.append('grant_type', 'password')
    formData.append('client_id', '9e7ac923-91ea-489a-9fbe-16ad75e9a7ab')
    formData.append('client_secret', '8fWZHEBfgzq9Cyo82pVt4Zkc5SLpKi0JbL7DNQH1')
    formData.append('username', email)
    formData.append('password', password)

    const response = await apiAuth.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const userResponse = await api.get('/me', {
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`
      }
    })

    return {
      token: response.data.access_token,
      user: userResponse.data.data.user
    }
  },

  setUserData(token, userType) {
    localStorage.setItem('token', token)
    localStorage.setItem('TypeUser', userType)
  },

  clearUserData() {
    localStorage.removeItem('token')
    localStorage.removeItem('TypeUser')
    localStorage.removeItem('user')
  }
} 