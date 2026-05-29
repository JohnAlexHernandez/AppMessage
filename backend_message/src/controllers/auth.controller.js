// Importamos el módulo de conexión a la base de datos
const db = require('../config/db');
// Importamos bcryptjs
const bcrypt = require('bcryptjs');
// Importamos jsonwebtoken
const jwt = require('jsonwebtoken');


// Definimos una ruta POST que responde con un mensaje de texto "Usuario creado exitosamente!" cuando se accede a la URL "/usuario" mediante una solicitud POST
const registerUser = async(req, res) => {
    // Extraemos los datos enviados por el usuario desde el cuerpo de la petición
    const { nombre, correo_electronico, contrasena} = req.body;

    try{
        // Generamos los "salts" (rondas de aleatoriedad para  la encriptación)
        const salt = await bcrypt.genSalt(10);

        // Encriptamos la contraseña usando el salt
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        await db.query(
            'INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)',
            [nombre, correo_electronico, hashedPassword]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// Definimos una ruta POST que responde con un mensaje de texto "Inicio de sesión exitoso" cuando se accede a la URL "/login" mediante una solicitud POST
const loginUser = async(req, res) => {
    // Extraemos los datos enviados por el usuario desde el cuerpo de la petición
    const { correo_electronico, contrasena} = req.body;

    try{
        // Consultamos en la base de datos si existe algún usuario con el correo electrónico proporcionado
        const [users] = await db.query(
            'SELECT * FROM usuarios WHERE correo_electronico = ?',
            [correo_electronico]
        );

        // Validamos si el usuario existe en el sistema
        if (users.length === 0){
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }
        
        // Comparamos la contraseña en texto plano con el hash encriptado almacenado en la base de datos
        const isPasswordCorrect = await bcrypt.compare(contrasena, users[0].contrasena);
        
        if(!isPasswordCorrect){
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }

        // Creamos el Payload (los datos del usuario que viajarán dentro del token)
        const payload = {
            id: users[0].id,
            correo_electronico: users[0].correo_electronico
        }

        // Firmamos el token usando la librería jsonwebtoken y la clave secreta del .env
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })

        // Respondemos con éxito enviando el token al cliente
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            token: token
        });
    }catch(error){
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ message: 'Error al iniciar sesión' })
    }
}

module.exports = { registerUser, loginUser };