// Importamos el módulo de conexión a la base de datos
const db = require('../config/db');

// Definimos una ruta GET que responde con un mensaje de texto "Lista de mensajes" cuando se accede a la URL "/mensajes"
const getMessages = async(req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM mensajes ORDER BY fecha_creacion DESC');
    res.json(messages);
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).json({ message: 'Error al obtener los mensajes' });
  }
};

// Definimos una ruta POST que responde con un mensaje de texto "Mensaje creado exitosamente!" cuando se accede a la URL "/mensaje" mediante una solicitud POST
const createMessage = async(req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'El campo "texto" es obligatorio' });
    }
    await db.query('INSERT INTO mensajes (texto) VALUES (?)', [text]);
    res.status(201).json({ message: 'Mensaje creado exitosamente!' });
  } catch (error) {
    console.error('Error al crear el mensaje:', error);
    res.status(500).json({ message: 'Error al crear el mensaje' });
  }
};

// Definimos una ruta PUT que acepta un ID de mensaje como parámetro y responde con un mensaje de éxito al actualizar el mensaje
const updateMessage = async(req, res) => {
  const id = req.params.id;
  try {
    const { text } = req.body;
    await db.query('UPDATE mensajes SET texto = ? WHERE id = ?', [text, id]);
    res.json({ message: 'Mensaje actualizado exitosamente!' });
  } catch (error) {
    console.error('Error al actualizar el mensaje:', error);
    res.status(500).json({ message: 'Error al actualizar el mensaje' });
  }
};

// Definimos una ruta DELETE que acepta un ID de mensaje como parámetro y responde con un mensaje de éxito al eliminar el mensaje
const deleteMessage = async(req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM mensajes WHERE id = ?', [id]);
    res.json({ message: 'Mensaje eliminado exitosamente!' });
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
    res.status(500).json({ message: 'Error al eliminar el mensaje' });
  }
};

// Exportamos las funciones para que puedan ser utilizadas en otros archivos de la aplicación
module.exports = {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage
};