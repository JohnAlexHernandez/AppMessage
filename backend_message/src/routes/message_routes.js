const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message_controller');

// Ruta para obtener todos los mensajes
router.get('/mensajes', messageController.obtenerMensajes);

// Ruta para crear un nuevo mensaje
router.post('/mensaje', messageController.crearMensaje);

// Ruta para actualizar un mensaje existente
router.put('/mensaje/:id', messageController.actualizarMensaje);

// Ruta para eliminar un mensaje
router.delete('/mensaje/:id', messageController.eliminarMensaje);

// Exportamos el router para que pueda ser utilizado en otros archivos de la aplicación
module.exports = router;