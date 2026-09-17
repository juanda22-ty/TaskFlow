# Usamos una versión ligera de Node.js
FROM node:20-alpine

# Creamos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias primero (optimiza la caché)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto donde corre Express
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]