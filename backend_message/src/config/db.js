const mysql = require('mysql2');

// Creamos un pool de conexiones a la base de datos MySQL utilizando el módulo mysql2
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportamos el pool de conexiones para que pueda ser utilizado en otros archivos de la aplicación
module.exports = pool.promise();
