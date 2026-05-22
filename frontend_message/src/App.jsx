// Importamos el hook useState para manejar el estado en nuestro componente
import { useState, useEffect } from 'react'
import { messageService } from './services/messageService';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import './App.css'

function App() {

  // Inicializamos el estado con una lista de mensajes
  const [mensajes, setMensajes] = useState([]);

  // Estado para el nuevo mensaje que se va a crear
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  // Estado para el mensaje que se está editando
  const [mensajeEnEdicion, setMensajeEnEdicion] = useState(null);

  
  const cargarMensajes = () => {
    messageService.getAll()
    // Actualizamos el estado con los mensajes obtenidos
    .then(data => setMensajes(data))
    .catch(error => console.error('Error al cargar los mensajes:', error));
  };
  
  // Utilizamos useEffect para cargar los mensajes desde el backend cuando el componente se monta
  useEffect(() => {
    cargarMensajes();
  }, []); 
  // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Función para manejar el envío del formulario, tanto para crear como para actualizar mensajes
  const controlarEnvio = (e) => {
    // Evitamos que el formulario se envíe de forma tradicional
    e.preventDefault();

    // Validamos que el nuevo mensaje no esté vacío o solo contenga espacios
    if (!nuevoMensaje.trim()) return;

    if (mensajeEnEdicion) {
      // Si hay un mensaje en edición, hacemos una solicitud PUT al backend para actualizarlo
        messageService.update(mensajeEnEdicion.id, nuevoMensaje)
        .then(() => {
          cargarMensajes();
          setMensajeEnEdicion(null);
          setNuevoMensaje('');
        })
        .catch(error => console.error('Error al actualizar el mensaje:', error));
        // Manejamos cualquier error que pueda ocurrir durante la creación del mensaje
    } else {
      // Si no hay mensaje en edición, hacemos una solicitud POST al backend para crear un nuevo mensaje
      messageService.create(nuevoMensaje)
      .then(() => {
        cargarMensajes();
        setNuevoMensaje('');
      })
      .catch(error => console.error('Error al crear el mensaje:', error));
      // Manejamos cualquier error que pueda ocurrir durante la creación del mensaje
    }
  };

  // Manejador para cuando se da clic en "Editar" en la lista
  const seleccionarParaEditar = (item) => {
    setMensajeEnEdicion(item);
    setNuevoMensaje(item.texto);
  };

  const eliminarMensaje = (id) => {
    messageService.delete(id)
    // Verificamos si la respuesta fue exitosa
    .then(response => {
      if (response.ok) {
        // Si la eliminación fue exitosa, actualizamos el estado de mensajes filtrando el mensaje eliminado
        setMensajes(mensajes => mensajes.filter(mensaje => mensaje.id !== id));
      } else {
        console.error('Error al eliminar el mensaje');
      }
    })
    // Manejamos cualquier error que pueda ocurrir durante la eliminación del mensaje
    .catch(error => console.error('Error al eliminar el mensaje:', error));
  };

  return (
      <div className="container mt-5" style={{ maxWidth: '500px' }}>

        <MessageForm
          nuevoMensaje={nuevoMensaje}
          setNuevoMensaje={setNuevoMensaje}
          mensajeEnEdicion={mensajeEnEdicion}
          setMensajeEnEdicion={setMensajeEnEdicion}
          controlarEnvio={controlarEnvio}
        />

        <MessageList
          mensajes={mensajes}
          onEdit={seleccionarParaEditar}
          onDelete={eliminarMensaje}
        />
      </div>
  )
}

export default App
