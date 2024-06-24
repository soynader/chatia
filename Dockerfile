FROM node:21-alpine3.18 as builder

# Habilita corepack y prepara pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Establece el directorio de trabajo
WORKDIR /app

# Crea un directorio temporal (si es necesario)
RUN mkdir /app/tmp

# Copia los archivos de configuración
COPY package.json pnpm-lock.yaml ./

# Instala dependencias necesarias para la construcción
RUN apk add --no-cache \
      nss \
      git \
      freetype \
      harfbuzz \
      ca-certificates \
      libpq-dev \
      g++ \
      make \
      python3 \
      ttf-freefont

# Copia el resto del código de la aplicación
COPY . .

# Instala las dependencias
RUN pnpm i

# Construye el proyecto
RUN pnpm build

# Segunda etapa: producción
FROM node:21-alpine3.18

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Instala solo las dependencias de producción
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile --production

# Copia el directorio dist desde el contexto de construcción local
COPY ./dist ./dist

# Exponer el puerto (si es necesario)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
