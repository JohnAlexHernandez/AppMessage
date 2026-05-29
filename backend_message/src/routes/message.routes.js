const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// Ruta para obtener todos los messages
router.get('/messages', messageController.getMessages);

// Ruta para crear un nuevo mensaje
router.post('/message', messageController.createMessage);

// Ruta para actualizar un mensaje existente
router.put('/message/:id', messageController.updateMessage);

// Ruta para eliminar un mensaje
router.delete('/message/:id', messageController.deleteMessage);

// Exportamos el router para que pueda ser utilizado en otros archivos de la aplicación
module.exports = router;