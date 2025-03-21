<template>
  <div class="login-container">
    <div class="login-left">      
      <h1 class="welcome-title">Bem-vindo de Volta</h1>
      <p class="welcome-subtitle">Insira suas credenciais para acessar a plataforma</p>
      
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <input 
            type="email" 
            v-model="form.email"
            :class="{ 'form-input': true, 'input-error': v$.form.email.$error }"
            placeholder="Seu e-mail" 
            @blur="v$.form.email.$touch()"
          >
          <span v-if="v$.form.email.$error" class="error-text">
            {{ v$.form.email.$errors[0].$message }}
          </span>
        </div>
        
        <div class="form-group">
          <input 
            type="password" 
            v-model="form.password"
            :class="{ 'form-input': true, 'input-error': v$.form.password.$error }"
            placeholder="Sua senha" 
            @blur="v$.form.password.$touch()"
          >
          <span v-if="v$.form.password.$error" class="error-text">
            {{ v$.form.password.$errors[0].$message }}
          </span>
        </div>
        
        <div v-if="authError" class="error-message">
          {{ authError }}
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading || v$.form.$invalid">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>

    <div class="login-right"> 
      <img src="@/assets/dash.png" alt="Dashboard Preview" class="dashboard-preview">
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'

export default {
  name: 'LoginView',
  setup() {
    const store = useStore()
    const router = useRouter()

    const form = ref({
      email: '',
      password: ''
    })

    // Regras de validação
    const rules = {
      form: {
        email: { 
          required, 
          email,
          $message: 'Digite um e-mail válido'
        },
        password: { 
          required,
          minLength: minLength(6),
          $message: 'A senha deve ter no mínimo 6 caracteres'
        }
      }
    }

    const v$ = useVuelidate(rules, { form })

    // Computed properties do Vuex
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const authError = computed(() => store.getters['auth/error'])

    const handleSubmit = async () => {
      const isFormValid = await v$.value.$validate()
      if (!isFormValid) return

      const success = await store.dispatch('auth/login', {
        email: form.value.email,
        password: form.value.password
      })

      if (success) {
        router.push('/dashboard')
      }
    }

    return {
      form,
      v$,
      isLoading,
      authError,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f8;
}

.login-left {
  width: 30%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f5f5f8;
}

.logo-container {
  margin-bottom: 40px;
}

.logo {
  height: 40px;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f8;
  position: relative;
}

.dashboard-preview {
  width: 90%;
  max-width: 1200px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: #051c41;
  margin-bottom: 10px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border 0.3s, background-color 0.3s;
  background-color: #f9fafb;
}

.form-input:focus {
  border-color: #4f46e5;
  background-color: #ffffff;
}

.input-error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.error-message {
  color: #ef4444;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.login-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style> 