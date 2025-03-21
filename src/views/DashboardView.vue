<template>
  <div class="dashboard">
    <AppSidebar />
    
    <div class="main-content">
      <div class="header">
        <h1>Estatísticas</h1>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Carregando dados...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p>{{ error }}</p>
        <button @click="reloadData" class="reload-button">Tentar Novamente</button>
      </div>
      
      <div v-else class="stats-container">
        <div class="stats-row">
          <div class="stat-card downloads" v-if="hasPermission('Downloads')">
            <div class="stat-header">
              <h3 class="stat-title">Downloads</h3>
              <span class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V3" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
            <div class="stat-value">{{ stats.downloads }}</div>
            <div class="stat-details">
              <div class="stat-detail-item">
                <IconAndroid />
                <span class="stat-detail-label">{{ stats.downloadsAndroid }}</span>
              </div>
              <div class="stat-detail-item">
                <IconIOS />
                <span class="stat-detail-label">{{ stats.downloadsIos }}</span>
              </div>
            </div>
          </div>
          
          <div class="stat-card ratings" v-if="hasPermission('Avaliações')">
            <div class="stat-header">
              <h3 class="stat-title">Avaliações</h3>
              <span class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
            <div class="stat-value">{{ stats.rating }}<span class="small">/5</span></div>
            <div class="stat-details">
              <div class="stat-detail-item">
                <IconAndroid />
                <span class="stat-detail-label">{{ stats.ratingAndroid }}</span>
              </div>
              <div class="stat-detail-item">
                <IconIOS />
                <span class="stat-detail-label">{{ stats.ratingIos }}</span>
              </div>
            </div>
          </div>
          
          <div class="stat-card errors" v-if="hasPermission('Erros')">
            <div class="stat-header">
              <h3 class="stat-title">Erros</h3>
              <span class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
            <div class="stat-value">{{ stats.errors }}</div>
            <div class="stat-details">
              <div class="stat-detail-item">
                <IconAndroid />
                <span class="stat-detail-label">{{ stats.errorsAndroid }}</span>
              </div>
              <div class="stat-detail-item">
                <IconIOS />
                <span class="stat-detail-label">{{ stats.errorsIos }}</span>
              </div>
              <div class="stat-trend-indicator">
                <span class="trend-down">{{ stats.errorsLow }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13L12 8L17 13" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-card" v-if="hasPermission('Feedbacks')">
          <h3 class="section-title">Feedbacks</h3>
          <div v-if="feedbacks.length > 0" class="feedback-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="th-description">Avaliação</th>
                  <th class="th-date">Data</th>
                  <th class="th-rating">Avaliação</th>
                  <th class="th-improvements">Melhorias</th>
                  <th class="th-platform">Plataforma</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(feedback, index) in feedbacks" :key="index">
                  <td class="td-description">{{ feedback.description }}</td>
                  <td class="td-date">{{ formatDate(feedback.created_at) }}</td>
                  <td class="td-rating">{{ feedback.evaluation }}</td>
                  <td class="td-improvements">{{ feedback.improvements || '-' }}</td>
                  <td class="td-platform">{{ feedback.platform }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" v-else>
            Nenhum feedback disponível no momento.
          </div>
        </div>
        
        <div class="section-card" v-if="hasPermission('Novas Funcionalidades')">
          <h3 class="section-title">Novas Funcionalidades</h3>
          <div class="feature-table-wrapper">
            <table class="data-table feature-table">
              <thead>
                <tr>
                  <th class="feature-name-header">Funcionalidade</th>
                  <th class="feature-usage-header">Taxa De Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(feature, index) in features" :key="index">
                  <td class="feature-name">{{ feature.name }}</td>
                  <td class="feature-usage">
                    <span class="feature-percentage" :class="getPercentageClass(feature.percentage)">{{ feature.percentage }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="restricted-access" v-if="!hasAnyPermission()">
          <div class="restricted-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 4H12.01M12 20H12.01M20 12H20.01M4 12H4.01" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Acesso Restrito</h3>
          <p>Você não possui permissões para visualizar dados neste painel.</p>
          <p>Entre em contato com um administrador para solicitar acesso.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppSidebar from '../components/Sidebar.vue'
import IconAndroid from '../components/iconAndroid.vue'
import IconIOS from '../components/iconIOS.vue'

export default {
  name: 'DashboardView',
  components: {
    AppSidebar,
    IconAndroid,
    IconIOS
  },
  
  setup() {
    const store = useStore()

    // Computed properties
    const stats = computed(() => store.getters['dashboard/stats'])
    const feedbacks = computed(() => store.getters['dashboard/feedbacks'])
    const features = computed(() => store.getters['dashboard/features'])
    const loading = computed(() => store.getters['dashboard/loading'])
    const error = computed(() => store.getters['dashboard/error'])
    const userType = computed(() => store.getters['auth/userType'])

    // Permissões baseadas no tipo de usuário
    const permissions = computed(() => {
      const type = userType.value?.toLowerCase()
      
      if (type === 'admin') {
        return ['Downloads', 'Avaliações', 'Erros', 'Feedbacks', 'Novas Funcionalidades']
      } else if (type === 'desenvolvedor') {
        return ['Downloads', 'Avaliações', 'Erros', 'Novas Funcionalidades']
      } else if (type === 'recursos humanos') {
        return ['Avaliações', 'Feedbacks']
      }
      
      return []
    })

    // Methods
    const hasPermission = (permission) => {
      return permissions.value.includes(permission)
    }

    const hasAnyPermission = () => {
      return permissions.value.length > 0
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    }

    const getPercentageClass = (percentage) => {
      if (percentage >= 90) return 'high'
      if (percentage >= 70) return 'medium'
      return 'low'
    }

    const reloadData = () => {
      store.dispatch('dashboard/fetchDashboardData')
    }

    // Lifecycle hooks
    onMounted(() => {
      store.dispatch('dashboard/fetchDashboardData')
    })

    return {
      stats,
      feedbacks,
      features,
      loading,
      error,
      hasPermission,
      hasAnyPermission,
      formatDate,
      getPercentageClass,
      reloadData
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background-color: #f5f5f8;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  padding: 24px 32px;
  overflow-y: auto;
  width: calc(100% - 195px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* Loading indicator */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
}

.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #6366F1;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Stats cards */
.stats-container {
  width: 100%;
}

.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-title {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  font-weight: normal;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.downloads .stat-icon {
  background-color: rgba(59, 130, 246, 0.1);
}

.ratings .stat-icon {
  background-color: rgba(139, 92, 246, 0.1);
}

.errors .stat-icon {
  background-color: rgba(239, 68, 68, 0.1);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  text-align: left;
}

.small {
  font-size: 18px;
  color: #6b7280;
  font-weight: normal;
}

.stat-details {
  display: flex;
  gap: 16px;
  align-items: center;
  position: relative;
}

.stat-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-detail-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.stat-detail-icon.android {
  background-color: #10B981;
}

.stat-detail-icon.ios {
  background-color: #EF4444;
}

.stat-detail-label {
  font-size: 14px;
  color: #4b5563;
}

.stat-trend-indicator {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-down {
  color: #10B981;
  font-size: 14px;
  font-weight: 500;
}

/* Section cards */
.section-card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  text-align: left;
}

/* Table styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  color: #9ca3af;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 14px;
  vertical-align: top;
  line-height: 1.4;
}

.data-table tr:last-child td {
  border-bottom: none;
}

/* Efeito zebrado nas tabelas */
.data-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Feedback table */
.th-description, .td-description {
  width: 45%;
}

.th-date, .td-date {
  width: 10%;
  color: #9ca3af;
  white-space: nowrap;
}

.th-rating, .td-rating {
  width: 10%;
  text-align: center;
}

.th-improvements, .td-improvements {
  width: 20%;
  white-space: pre-line;
  color: #6b7280;
}

.th-platform, .td-platform {
  width: 15%;
}

/* Feature table */
.feature-table {
  width: 100%;
}

.feature-name-header, .feature-usage-header {
  padding: 12px 16px;
  color: #9ca3af;
  font-weight: 500;
  font-size: 14px;
}

.feature-name {
  padding: 16px;
  color: #4b5563;
  font-weight: 500;
}

.feature-usage {
  padding: 16px;
  text-align: left;
}

.feature-percentage {
  font-weight: 600;
}

.feature-percentage.high {
  color: #10B981;
}

.feature-percentage.medium {
  color: #10B981;
}

.feature-percentage.low {
  color: #F59E0B;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

/* Restricted access message */
.restricted-access {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.restricted-icon {
  margin-bottom: 16px;
  color: #9CA3AF;
}

.restricted-access h3 {
  font-size: 20px;
  font-weight: 600;
  color: #4B5563;
  margin-bottom: 8px;
}

.restricted-access p {
  font-size: 14px;
  color: #6B7280;
  margin: 4px 0;
  max-width: 400px;
}

/* Novo estilo para o container de erro */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: 20px 0;
}

.error-icon {
  margin-bottom: 16px;
  color: #EF4444;
}

.error-container p {
  color: #4B5563;
  margin-bottom: 16px;
  text-align: center;
}

.reload-button {
  padding: 8px 16px;
  background-color: #4F46E5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.reload-button:hover {
  background-color: #4338CA;
}
</style> 