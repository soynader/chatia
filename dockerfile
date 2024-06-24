FROM node:21-alpine3.18 as bot
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Instala las dependencias
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Copia el resto de los archivos
COPY . .

# Establece las variables de entorno
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación sin PM2
CMD ["node", "dist/index.js"]
