# Vue.js Stats Frontend

Um projeto frontend em Vue.js com configuração Docker para análise estatística.

## Configuração do Projeto

### Desenvolvimento sem Docker

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run serve

# Compilar para produção
npm run build

# Lint e correções
npm run lint
```

## Tecnologias

- Vue.js 3
- Vue Router
- Vuex
- Axios
- Docker 

## Rodar Container
# Reconstruir a imagem
docker build -t vue-stats-frontend .

# Executar o novo container
docker run -p 8081:8081 vue-stats-frontend