// Cargamos las variables de entorno desde el archivo .env utilizando el módulo dotenv
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

// Creamos una instancia de la aplicación Express
const express = require('express');

// Importamos el módulo CORS para permitir solicitudes desde diferentes orígenes
const cors = require('cors');

// Importamos el enrutador de mensajes para manejar las rutas relacionadas con los mensajes
const messageRoutes = require('./src/routes/message.routes');

// Importamos el enrutador de mensajes para manejar las rutas relacionadas con el inicio de sesión
const authRoutes = require('./src/routes/auth.routes');

const app = express();
// Definimos el puerto en el que el servidor escuchará las solicitudes
const port = process.env.PORT || 3000;

// Importamos el módulo CORS para permitir solicitudes desde diferentes orígenes
app.use(cors());
// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Usamos el enrutador de mensajes para manejar las rutas que comienzan con /api
app.use('/api', messageRoutes);

// Usamos el enrutador de mensajes para manejar las rutas que comienzan con /auth
app.use('/auth', authRoutes);

// Iniciamos el servidor y hacemos que escuche en el puerto definido, si no estamos en modo test
if(process.env.NODE_ENV !== 'test'){
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;