# Estágio de build
FROM node:18-alpine as build-stage

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Define a variável de ambiente para a URL da API
ENV VUE_APP_API_URL=http://host.docker.internal:8080

# Compila a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine as production-stage

# Copia os arquivos compilados do estágio anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copia a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 8081
EXPOSE 8081

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"] 