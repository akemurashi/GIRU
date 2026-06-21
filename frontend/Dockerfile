# ---------- Etapa 1: Compilación ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar primero los manifiestos para aprovechar la caché de Docker
COPY package.json package-lock.json ./

# Instalar dependencias exactas según package-lock.json
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Generar la carpeta dist/
RUN npm run build


# ---------- Etapa 2: Servidor web ----------
FROM nginx:1.27-alpine

# Eliminar configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración para React Router / SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
