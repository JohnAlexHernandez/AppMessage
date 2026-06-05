const jwt = require('jsonwebtoken');

const validateBearerToken = (req, res, next) =>{
    // Obtenemos la cabecera 'authorization'
    const authHeader = req.header('Authorization');

    // Se valida que exista y que empiece con 'Bearer'
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            mesage: 'No se proporcionó un token bearer válido'
        });
    }

    // Extraemos el JWT puro
    const token = authHeader.split(' ')[1];

    try {
        // Verificamos la firma del token (usa tu clave secreta de las variables de entorno)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Inyectamos los datos del usuario en la petición
        req.user = decoded;

        //Damos luz verde para ir al controlador
        next();
    } catch(error){
        console.error('Error de verificación de token', error.mesage);
        return res.status(403).json({
            mesage: 'Token no válido o token expirado'
        });
    }
};

module.exports = { validateBearerToken };