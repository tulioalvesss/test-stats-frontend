import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'

// Criando a aplicação
const app = createApp(App)

// Registrando os plugins
app.use(store)
app.use(router)

// Montando a aplicação
app.mount('#app') 