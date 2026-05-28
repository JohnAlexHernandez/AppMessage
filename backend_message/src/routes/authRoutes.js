const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/usuario', authController.registrarUsuarios);

router.post('/login', authController.loginUsuario);

module.exports = router;
