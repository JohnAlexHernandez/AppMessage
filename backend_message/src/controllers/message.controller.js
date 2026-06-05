// Importamos el módulo de conexión a la base de datos
const db = require('../config/db');

// Definimos una ruta GET que responde con un mensaje de texto "Lista de mensajes" cuando se accede a la URL "/mensajes"
const getMessages = async(req, res) => {
  try {
    const usuarioId = req.user.id;
    const [messages] = await db.query(
      'SELECT * FROM mensajes where usuario_id = ? ORDER BY fecha_creacion DESC',
      [usuarioId]
    );
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
    const usuarioId = req.user.id;
    
    const querySql = 'INSERT INTO mensajes (texto, usuario_id) VALUES (?, ?)';
    await db.query(querySql, [text, usuarioId]);
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
    const usuarioId = req.user.id;
    await db.query(
      'UPDATE mensajes SET texto = ? WHERE id = ? AND usuario_id',
      [text, id, usuarioId]
    );
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
    const usuarioId = req.user.id;
    await db.query(
      'DELETE FROM mensajes WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
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