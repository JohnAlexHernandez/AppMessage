// Cargamos las variables de entorno desde el archivo .env utilizando el módulo dotenv
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

// Creamos una instancia de la aplicación Express
const express = require('express');

// Módulo nativo de Node.js para crear servidores web HTTP
const http = require('http');

// Clase constructora del servidor de Socket.io
const { Server } = require('socket.io');

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

// Creamos el servidor HTTP usando la app de Express
const server = http.createServer(app);

let io = null;

// Usamos el enrutador de mensajes para manejar las rutas que comienzan con /api
app.use('/api', messageRoutes);

// Usamos el enrutador de mensajes para manejar las rutas que comienzan con /auth
app.use('/auth', authRoutes);

// Iniciamos el servidor y hacemos que escuche en el puerto definido, si no estamos en modo test
if(process.env.NODE_ENV !== 'test'){

  // Inicializamos Socket.io solo en ejecución real vinculándola a nuestro servidor HTTP
  io = new Server(server, {
    cors: {
      // Permitimos que el cliente de React se conecte por WebSockets
      origin: process.env.ALLOWED_ORIGINS || 'http://localhost:5173', 
      // Métodos HTTP requeridos por Socket.io para el saludo inicial (handshake)
      methods: ["GET", "POST"]
    }
  });

  // Escuchamos el evento principal: cuando un cliente de React logra conectarse con éxito
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    
    // Nos quedamos esperando a que alguna pestaña de React use este canal
    socket.on('cliente:mensaje_nuevo', (data) => {
      console.log('Llegó un mensaje de creación al túnel de sockets');

      // Se lo enviamos a todos los DEMÁS usuarios conectados
      socket.broadcast.emit('servidor:mensaje_nuevo', data);
    });

    // Nos quedamos esperando a que alguna pestaña de React use este canal
    socket.on('cliente:mensaje_actualizado', () => {
      console.log('Llegó un mensaje de actualización al túnel de sockets');

      // Se lo enviamos a todos los DEMÁS usuarios conectados
      socket.broadcast.emit('servidor:mensaje_actualizado');
    });

    // Nos quedamos esperando a que alguna pestaña de React use este canal
    socket.on('cliente:mensaje_eliminado', () => {
      console.log('Llegó un mensaje de eliminación al túnel de sockets');

      // Se lo enviamos a todos los DEMÁS usuarios conectados
      socket.broadcast.emit('servidor:mensaje_eliminado');
    });

    // Escuchamos si ese usuario específico cierra la pestaña o pierde conexión
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  // Ponemos a escuchar al servidor HTTP (server) en el puerto asignado.
  // Escuchamos a 'server' porque éste contiene tanto a Express como a Socket.io.
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = { app, server, io };