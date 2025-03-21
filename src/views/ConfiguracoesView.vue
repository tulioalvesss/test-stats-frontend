<template>
  <div class="configuracoes">
    <AppSidebar />
    
    <div class="main-content">
      <div class="header">
        <h1>Configurações</h1>
      </div>
      
      <div class="config-container">
        <!-- Seção de Perfis -->
        <div class="section-card">
          <div class="section-header">
            <h2>Perfis</h2>
            <button v-if="isAdmin" class="add-button" @click="openNewProfileModal">
              <span class="plus-icon">+</span>
            </button>
          </div>
          
          <div v-if="loading" class="loading-container">
            <div class="loader"></div>
            <p>Carregando dados...</p>
          </div>
          
          <table v-else class="config-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Quantidade De Usuários</th>
                <th>Permissões</th>
                <th v-if="isAdmin"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="profile in profiles" :key="profile.name">
                <td>{{ profile.name }}</td>
                <td>{{ profile.count }}</td>
                <td>
                  <div class="permissions-container">
                    <span v-if="profile.permissions.length === 5" class="permission tudo">
                      Todas
                    </span>
                    <template v-else-if="profile.permissions.length === 0 || (profile.permissions.length === 1 && profile.permissions[0] === '')">
                      <span class="permission nenhuma">
                        Nenhuma
                      </span>
                    </template>
                    <template v-else>
                      <span v-if="profile.permissions.includes('Downloads')" class="permission downloads">
                        Downloads
                      </span>
                      <span v-if="profile.permissions.includes('Avaliações')" class="permission avaliacoes">
                        Avaliações
                      </span>
                      <span v-if="profile.permissions.includes('Feedbacks')" class="permission feedback">
                        Feedbacks
                      </span>
                      <span v-if="profile.permissions.includes('Erros')" class="permission erros">
                        Erros
                      </span>
                      <span v-if="profile.permissions.includes('Novas Funcionalidades')" class="permission novas-funcionalidades">
                        Novas Funcionalidades
                      </span>
                    </template>
                  </div>
                </td>
                <td v-if="isAdmin" class="actions-column">
                  <button class="edit-button" @click="openEditProfileModal(profile)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.00001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>        
        <!-- Seção de Usuários -->
        <div class="section-card">
          <div class="section-header">
            <h2>Usuários</h2>
            <button v-if="isAdmin" class="add-button" @click="openNewUserModal">
              <span class="plus-icon">+</span>
            </button>
          </div>
          
          <div v-if="loading" class="loading-container">
            <div class="loader"></div>
            <p>Carregando dados...</p>
          </div>
          
          <table v-else class="config-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Status</th>
                <th v-if="isAdmin"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.profile.name }}</td>
                <td>
                  <span class="status-tag">ATIVO</span>
                </td>
                <td v-if="isAdmin" class="actions-column">
                  <button class="edit-button" @click="openEditUserModal(user)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mensagem de acesso restrito para edição -->
        <div v-if="!isAdmin" class="restricted-edit-message">
          <div class="info-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>Você está no modo de visualização. Apenas administradores podem criar ou editar dados.</p>
        </div>
      </div>
    </div>

    <!-- Modais (apenas visíveis para administradores) -->
    <template v-if="isAdmin">
      <!-- Modal de Novo Perfil -->
      <div v-if="showNewProfileModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Novo Perfil</h2>
          
          <div class="form-group">
            <input 
              type="text" 
              v-model="newProfileName" 
              placeholder="Novo Perfil" 
              class="form-input"
            >
          </div>
          
          <div class="permissions-list">          
            <div class="permission-item">
              <span>Downloads</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="newProfilePermissions.downloads">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Avaliações</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="newProfilePermissions.avaliacoes">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Erros</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="newProfilePermissions.erros">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Feedbacks</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="newProfilePermissions.feedbacks">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Novas Funcionalidades</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="newProfilePermissions.novasFuncionalidades">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-voltar" @click="closeNewProfileModal" :disabled="loadingNewProfile">Voltar</button>
            <button class="btn-adicionar" @click="addNewProfile" :disabled="loadingNewProfile">
              <span v-if="loadingNewProfile" class="button-loader"></span>
              <span v-else>Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Editar Perfil -->
      <div v-if="showEditProfileModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Editar Perfil</h2>
          
          <div class="form-group">
            <input 
              type="text" 
              v-model="editProfileName" 
              placeholder="Nome do Perfil" 
              class="form-input"
            >
          </div>
          
          <div class="permissions-list">          
            <div class="permission-item">
              <span>Downloads</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="editProfilePermissions.downloads">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Avaliações</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="editProfilePermissions.avaliacoes">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Erros</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="editProfilePermissions.erros">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Feedbacks</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="editProfilePermissions.feedbacks">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="permission-item">
              <span>Novas Funcionalidades</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="editProfilePermissions.novasFuncionalidades">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-voltar" @click="closeEditProfileModal" :disabled="loadingEditProfile">Voltar</button>
            <button class="btn-adicionar" @click="updateProfile" :disabled="loadingEditProfile">
              <span v-if="loadingEditProfile" class="button-loader"></span>
              <span v-else>Salvar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Novo Usuário -->
      <div v-if="showNewUserModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Novo Usuário</h2>
          
          <div class="form-group">
            <input 
              type="text" 
              v-model="newUserName" 
              placeholder="Nome do usuário" 
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <input 
              type="email" 
              v-model="newUserEmail" 
              placeholder="Email" 
              class="form-input"
            >
          </div>
          
          <div class="profile-selection">
            <p class="profile-label">Perfil</p>
            
            <div class="profile-options">
              <div v-for="profile in profiles" :key="profile.id" class="profile-option">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    :value="profile.id" 
                    v-model="newUserProfileId"
                    class="radio-input"
                  >
                  <span class="radio-text">{{ profile.name }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-voltar" @click="closeNewUserModal" :disabled="loadingNewUser">Voltar</button>
            <button class="btn-adicionar" @click="addNewUser" :disabled="loadingNewUser">
              <span v-if="loadingNewUser" class="button-loader"></span>
              <span v-else>Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Editar Usuário -->
      <div v-if="showEditUserModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Editar Usuário</h2>
          
          <div class="form-group">
            <input 
              type="text" 
              v-model="editUserName" 
              placeholder="Nome do usuário" 
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <input 
              type="email" 
              v-model="editUserEmail" 
              placeholder="Email" 
              class="form-input"
            >
          </div>
          
          <div class="profile-selection">
            <p class="profile-label">Perfil</p>
            
            <div class="profile-options">
              <div v-for="profile in profiles" :key="profile.id" class="profile-option">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    :value="profile.id" 
                    v-model="editUserProfileId"
                    class="radio-input"
                  >
                  <span class="radio-text">{{ profile.name }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-voltar" @click="closeEditUserModal" :disabled="loadingEditUser">Voltar</button>
            <button class="btn-adicionar" @click="updateUser" :disabled="loadingEditUser">
              <span v-if="loadingEditUser" class="button-loader"></span>
              <span v-else>Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
import { ref, onMounted, reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ConfiguracoesView',
  components: {
    AppSidebar
  },
  setup() {
    const store = useStore()
    const userName = ref('')
    const userType = ref('')
    const loading = computed(() => store.getters['config/loading'])
    const error = computed(() => store.getters['config/error'])
    const users = computed(() => store.getters['config/users'])
    const profiles = computed(() => store.getters['config/profiles'])
    
    // Estados de loading para os botões
    const loadingNewProfile = ref(false)
    const loadingEditProfile = ref(false)
    const loadingNewUser = ref(false)
    const loadingEditUser = ref(false)
    
    const showNewProfileModal = ref(false)
    const showEditProfileModal = ref(false)
    const showNewUserModal = ref(false)
    const showEditUserModal = ref(false)
    const newProfileName = ref('')
    const editProfileName = ref('')
    const currentEditProfileId = ref(null)
    const currentEditUserId = ref(null)
    
    // Dados para usuário
    const newUserName = ref('')
    const newUserEmail = ref('')
    const newUserProfileId = ref(null)
    const editUserName = ref('')
    const editUserEmail = ref('')
    const editUserProfileId = ref(null)
    
    // Permissões para novo perfil
    const newProfilePermissions = reactive({
      downloads: false,
      avaliacoes: false,
      erros: false,
      feedbacks: false,
      novasFuncionalidades: false
    })
    
    // Permissões para edição de perfil
    const editProfilePermissions = reactive({
      downloads: false,
      avaliacoes: false,
      erros: false,
      feedbacks: false,
      novasFuncionalidades: false
    })

    // Mapa de IDs das permissões
    const permissionsMap = {
      downloads: 1,
      avaliacoes: 2,
      erros: 3,
      feedbacks: 4,
      novasFuncionalidades: 5
    }

    // Verificar se o usuário é administrador
    const isAdmin = computed(() => {
      return userType.value.toLowerCase() === 'admin'
    })

    onMounted(async () => {
      try {
        // Buscar tipo do usuário
        const typeUserString = localStorage.getItem('TypeUser')
        if (typeUserString) {
          userType.value = typeUserString
        }

        // Buscar nome do usuário
        const userString = localStorage.getItem('user')
        if (userString) {
          const user = JSON.parse(userString)
          userName.value = user.name
        }
        
        // Carregar dados usando o Vuex
        await store.dispatch('config/fetchData')
      } catch (error) {
        console.error('Erro ao inicializar:', error)
      }
    })

    // Funções para gerenciar modais de perfil
    const openNewProfileModal = () => {
      showNewProfileModal.value = true
    }

    const closeNewProfileModal = () => {
      showNewProfileModal.value = false
      newProfileName.value = ''
      Object.keys(newProfilePermissions).forEach(key => {
        newProfilePermissions[key] = false
      })
    }

    const openEditProfileModal = (profile) => {
      currentEditProfileId.value = profile.id
      editProfileName.value = profile.name
      
      // Resetar todas as permissões
      Object.keys(editProfilePermissions).forEach(key => {
        editProfilePermissions[key] = false
      })
      
      // Marcar as permissões baseado nos IDs
      profile.permissionIds.forEach(id => {
        switch(id) {
          case 1: // Downloads
            editProfilePermissions.downloads = true
            break
          case 2: // Avaliações
            editProfilePermissions.avaliacoes = true
            break
          case 3: // Erros
            editProfilePermissions.erros = true
            break
          case 4: // Feedbacks
            editProfilePermissions.feedbacks = true
            break
          case 5: // Novas Funcionalidades
            editProfilePermissions.novasFuncionalidades = true
            break
        }
      })
      
      showEditProfileModal.value = true
    }

    const closeEditProfileModal = () => {
      showEditProfileModal.value = false
      currentEditProfileId.value = null
      editProfileName.value = ''
      Object.keys(editProfilePermissions).forEach(key => {
        editProfilePermissions[key] = false
      })
    }

    // Funções para gerenciar modais de usuário
    const openNewUserModal = () => {
      if (profiles.value.length > 0) {
        newUserProfileId.value = profiles.value[0].id
      }
      showNewUserModal.value = true
    }

    const closeNewUserModal = () => {
      showNewUserModal.value = false
      newUserName.value = ''
      newUserEmail.value = ''
      newUserProfileId.value = null
    }

    const openEditUserModal = (user) => {
      currentEditUserId.value = user.id
      editUserName.value = user.name
      editUserEmail.value = user.email
      editUserProfileId.value = user.profile.id
      showEditUserModal.value = true
    }

    const closeEditUserModal = () => {
      showEditUserModal.value = false
      currentEditUserId.value = null
      editUserName.value = ''
      editUserEmail.value = ''
      editUserProfileId.value = null
    }

    // Funções de API para perfis
    const addNewProfile = async () => {
      try {
        loadingNewProfile.value = true
        if (!newProfileName.value.trim()) {
          throw new Error('Por favor, insira um nome para o perfil')
        }

        // Converter as permissões selecionadas para array de IDs
        const permissionIds = []
        if (newProfilePermissions.downloads) permissionIds.push(permissionsMap.downloads)
        if (newProfilePermissions.avaliacoes) permissionIds.push(permissionsMap.avaliacoes)
        if (newProfilePermissions.erros) permissionIds.push(permissionsMap.erros)
        if (newProfilePermissions.feedbacks) permissionIds.push(permissionsMap.feedbacks)
        if (newProfilePermissions.novasFuncionalidades) permissionIds.push(permissionsMap.novasFuncionalidades)

        await store.dispatch('config/createProfile', {
          name: newProfileName.value,
          permissions: permissionIds
        })

        closeNewProfileModal()
        alert('Perfil criado com sucesso')
      } catch (error) {
        alert(error.message || 'Erro ao criar perfil. Por favor, tente novamente.')
        console.error('Erro ao adicionar perfil:', error)
      } finally {
        loadingNewProfile.value = false
      }
    }

    const updateProfile = async () => {
      try {
        loadingEditProfile.value = true
        if (!editProfileName.value.trim()) {
          throw new Error('Por favor, insira um nome para o perfil')
        }
        
        if (!currentEditProfileId.value) {
          throw new Error('Erro: ID do perfil não encontrado')
        }

        // Converter as permissões selecionadas para array de IDs
        const permissionIds = []
        if (editProfilePermissions.downloads) permissionIds.push(permissionsMap.downloads)
        if (editProfilePermissions.avaliacoes) permissionIds.push(permissionsMap.avaliacoes)
        if (editProfilePermissions.erros) permissionIds.push(permissionsMap.erros)
        if (editProfilePermissions.feedbacks) permissionIds.push(permissionsMap.feedbacks)
        if (editProfilePermissions.novasFuncionalidades) permissionIds.push(permissionsMap.novasFuncionalidades)

        await store.dispatch('config/updateProfile', {
          profileId: currentEditProfileId.value,
          name: editProfileName.value,
          permissions: permissionIds
        })

        closeEditProfileModal()
        alert('Perfil atualizado com sucesso')
      } catch (error) {
        alert(error.message || 'Erro ao atualizar perfil. Por favor, tente novamente.')
        console.error('Erro ao atualizar perfil:', error)
      } finally {
        loadingEditProfile.value = false
      }
    }

    // Funções de API para usuários
    const addNewUser = async () => {
      try {
        loadingNewUser.value = true
        if (!newUserName.value.trim()) {
          throw new Error('Por favor, insira um nome para o usuário')
        }
        
        if (!newUserEmail.value.trim()) {
          throw new Error('Por favor, insira um email para o usuário')
        }
        
        if (!newUserProfileId.value) {
          throw new Error('Por favor, selecione um perfil para o usuário')
        }

        const profileObj = profiles.value.find(p => p.id === newUserProfileId.value)
        
        await store.dispatch('config/createUser', {
          name: newUserName.value,
          email: newUserEmail.value,
          profileId: newUserProfileId.value,
          profileName: profileObj?.name || 'Desconhecido'
        })

        closeNewUserModal()
        alert('Usuário criado com sucesso')
      } catch (error) {
        alert(error.message || 'Erro ao criar usuário. Por favor, tente novamente.')
        console.error('Erro ao adicionar usuário:', error)
      } finally {
        loadingNewUser.value = false
      }
    }

    const updateUser = async () => {
      try {
        loadingEditUser.value = true
        if (!editUserName.value.trim()) {
          throw new Error('Por favor, insira um nome para o usuário')
        }
        
        if (!editUserEmail.value.trim()) {
          throw new Error('Por favor, insira um email para o usuário')
        }
        
        if (!editUserProfileId.value) {
          throw new Error('Por favor, selecione um perfil para o usuário')
        }
        
        if (!currentEditUserId.value) {
          throw new Error('Erro: ID do usuário não encontrado')
        }

        const currentUser = users.value.find(u => u.id === currentEditUserId.value)
        
        if (currentUser && editUserName.value !== currentUser.name && editUserEmail.value === currentUser.email) {
          throw new Error('Se o nome do usuário for alterado, o email também precisa ser modificado.')
        }

        const profileObj = profiles.value.find(p => p.id === editUserProfileId.value)

        await store.dispatch('config/updateUser', {
          userId: currentEditUserId.value,
          userData: {
            name: editUserName.value,
            email: editUserEmail.value,
            profileId: editUserProfileId.value,
            profileName: profileObj?.name || 'Desconhecido'
          }
        })

        closeEditUserModal()
        alert('Usuário atualizado com sucesso')
      } catch (error) {
        alert(error.message || 'Erro ao atualizar usuário. Por favor, tente novamente.')
        console.error('Erro ao atualizar usuário:', error)
      } finally {
        loadingEditUser.value = false
      }
    }

    return {
      userName,
      userType,
      users,
      profiles,
      loading,
      error,
      showNewProfileModal,
      showEditProfileModal,
      showNewUserModal,
      showEditUserModal,
      newProfileName,
      editProfileName,
      newProfilePermissions,
      editProfilePermissions,
      newUserName,
      newUserEmail,
      newUserProfileId,
      editUserName,
      editUserEmail,
      editUserProfileId,
      isAdmin,
      loadingNewProfile,
      loadingEditProfile,
      loadingNewUser,
      loadingEditUser,
      openNewProfileModal,
      closeNewProfileModal,
      openEditProfileModal,
      closeEditProfileModal,
      openNewUserModal,
      closeNewUserModal,
      openEditUserModal,
      closeEditUserModal,
      addNewProfile,
      updateProfile,
      addNewUser,
      updateUser
    }
  }
}
</script>

<style scoped>
.configuracoes {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f8;
}

.main-content {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.header {
  margin-bottom: 24px;
  text-align: left;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.config-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #6366F1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-size: 20px;
  line-height: 0;
  padding: 0;
}

.plus-icon {
  display: inline-block;
  line-height: 0.5;
}

.config-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.config-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

.config-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #E5E7EB;
  vertical-align: middle;
  text-align: left;
}

.actions-column {
  width: 60px;
  text-align: center;
}

.permission {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 6px;
  margin-bottom: 4px;
}

.permissions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.permission.tudo,
.permission.downloads,
.permission.avaliacoes,
.permission.erros,
.permission.novas-funcionalidades,
.permission.feedback,
.permission.nenhuma {
  background-color: #E0E7FF;
  color: #4F46E5;
}

.status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: #DCFCE7;
  color: #059669;
  text-transform: uppercase;
}

.edit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin: 0 auto;
}

.edit-button svg {
  stroke: #6366F1;
}

.edit-button:hover {
  background-color: #F9FAFB;
  border-radius: 4px;
}

/* Estilos da Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #f5f5f8;
  width: 400px;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-content h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 24px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background-color: white;
}

.form-input::placeholder {
  color: #9CA3AF;
}

.form-input:focus {
  outline: none;
  border-color: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.permissions-list {
  margin-bottom: 24px;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
  color: #374151;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #D1D5DB;
  transition: .3s;
  border-radius: 22px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #6366F1;
}

input:checked + .toggle-slider:before {
  transform: translateX(18px);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
}

.btn-voltar {
  flex: 1;
  padding: 12px;
  background-color: #EEEEF2;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4B5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-voltar:hover {
  background-color: #E5E7EB;
}

.btn-adicionar {
  flex: 1;
  padding: 12px;
  background-color: #6366F1;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-adicionar:hover {
  background-color: #4F46E5;
}

.profile-selection {
  margin-bottom: 24px;
}

.profile-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.profile-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-option {
  display: flex;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #D1D5DB;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  position: relative;
  outline: none;
}

.radio-input:checked {
  border-color: #6366F1;
}

.radio-input:checked::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #6366F1;
}

.radio-text {
  font-size: 14px;
  color: #374151;
}

/* Estilos para o loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6366F1;
}

.loading-container p {
  margin-top: 16px;
  font-size: 14px;
  color: #6B7280;
}

.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #6366F1;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.restricted-edit-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #EEF2FF;
  border-radius: 8px;
  margin-top: 24px;
}

.info-icon {
  color: #6366F1;
  display: flex;
  align-items: center;
}

.restricted-edit-message p {
  margin: 0;
  font-size: 14px;
  color: #4B5563;
}

/* Estilos para o loading dos botões */
.button-loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: button-spin 0.6s linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-adicionar:disabled,
.btn-voltar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-adicionar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
}
</style> 
