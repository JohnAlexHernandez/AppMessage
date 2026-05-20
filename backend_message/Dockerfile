# Usamos una imagen base de Node.js en su versión 22 con Alpine Linux para mantener la imagen ligera
FROM node:22-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias al contenedor
COPY package*.json ./
RUN npm install

# Copiamos el resto de los archivos de la aplicación al contenedor
COPY . .

# Exponemos el puerto 3000 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]