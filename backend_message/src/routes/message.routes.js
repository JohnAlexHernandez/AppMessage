const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { validateBearerToken } = require('../middlewares/auth.middleware');

// Ruta para obtener todos los messages
router.get('/messages', validateBearerToken, messageController.getMessages);

// Ruta para crear un nuevo mensaje
router.post('/message', validateBearerToken, messageController.createMessage);

// Ruta para actualizar un mensaje existente
router.put('/message/:id', validateBearerToken, messageController.updateMessage);

// Ruta para eliminar un mensaje
router.delete('/message/:id', validateBearerToken, messageController.deleteMessage);

// Exportamos el router para que pueda ser utilizado en otros archivos de la aplicación
module.exports = router;