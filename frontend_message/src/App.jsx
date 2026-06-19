// Importamos el hook useState para manejar el estado en nuestro componente
import { useState, useEffect } from "react";
import { messageService } from "./services/message.service";
import MessageList from "./components/messages/MessageList";
import MessageForm from "./components/messages/MessageForm";
import Login from "./components/auth/LoginForm";  
import "./App.css";

function App() {

  // Inicializamos el estado con una lista de mensajes
  const [messages, setMessages] = useState([]);

  // Estado para el nuevo mensaje que se va a crear
  const [newMessage, setNewMessage] = useState("");

  // Estado para el mensaje que se está editando
  const [editingMessage, setEditingMessage] = useState(null);

  // Estado para el token guardado al cargar la app
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Estado para la notificación
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Función helper para disparar alertas con auto-cierre
  const triggerNotification = (message, type = "success") => {
    // Enciende la alerta con los datos dinámicos
    setNotification({
      show: true,
      message: message,
      type: type,
    });

    // Programa el apagado automático
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const loadMessages = () => {
    messageService
      .getAll()
      // Actualizamos el estado con los mensajes obtenidos
      .then((data) => setMessages(data))
      .catch((error) => {
        console.error("Error al cargar los mensajes:", error.message)
        triggerNotification(error.message, "error");
      });
  };

  // Utilizamos useEffect para cargar los mensajes desde el backend cuando el componente se monta
  useEffect(() => {
    // Si el usuario está autenticado, ejecutamos la función de carga
    if (isLoggedIn) {
      loadMessages();
    }
  }, [isLoggedIn]);
  // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Función para cerrar la sesión
  const handleLogout = () => {
    // Elimina físicamente el JWT del disco del navegador
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMessages([]);
  };

  // Función para manejar el envío del formulario, tanto para crear como para actualizar mensajes
  const handleSubmit = (e) => {
    // Evitamos que el formulario se envíe de forma tradicional
    e.preventDefault();

    // Validamos que el nuevo mensaje no esté vacío o solo contenga espacios
    if (!newMessage.trim()) return;

    if (editingMessage) {
      // Si hay un mensaje en edición, hacemos una solicitud PUT al backend para actualizarlo
      messageService
        .update(editingMessage.id, newMessage)
        .then(response => {
          triggerNotification(response.message, "success"); 
          loadMessages();
          setEditingMessage(null);
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error al actualizar el mensaje:", error.message)
          triggerNotification(error.message, "error");
        });
      // Manejamos cualquier error que pueda ocurrir durante la creación del mensaje
    } else {
      // Si no hay mensaje en edición, hacemos una solicitud POST al backend para crear un nuevo mensaje
      messageService
        .create(newMessage)
        .then(response => {
          triggerNotification(response.message, "success");          
          loadMessages();
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error al crear el mensaje:", error.message);
          triggerNotification(error.message, "error");          
        });
      // Manejamos cualquier error que pueda ocurrir durante la creación del mensaje
    }
  };

  // Manejador para cuando se da clic en "Editar" en la lista
  const handleSelectToEdit = (item) => {
    setEditingMessage(item);
    setNewMessage(item.texto);
  };

  const handleDeleteMessage = (id) => {
    messageService
      .delete(id)
      // Verificamos si la respuesta fue exitosa
      .then((response) => {
        if (response && response.message) {
          triggerNotification(response.message, "success");
          // Si la eliminación fue exitosa, actualizamos el estado de mensajes filtrando el mensaje eliminado
          setMessages((mensajes) =>
            mensajes.filter((mensaje) => mensaje.id !== id),
          );
        } else {
          console.error("Error al eliminar el mensaje");   
        }
      })
      // Manejamos cualquier error que pueda ocurrir durante la eliminación del mensaje
      .catch((error) => {
        console.error("Error al eliminar el mensaje:", error.message),
        triggerNotification(error.message, "error");
      });
  };

  // Si el estado es false, detenemos la ejecución de App.jsx aquí y pintamos únicamente el Login.
  if (!isLoggedIn) {
    // Le pasamos al hijo la instrucción de encender el interruptor maestro mediante la prop 'onLoginSuccess'
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <>
      {notification.show && (
        <div className={`toast-notificacion ${notification.type}`}>
          <p className="toast-texto">{notification.message}</p>
        </div>
      )}
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <div className="d-flex justify-content-end mb-4">
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

        <MessageForm
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          editingMessage={editingMessage}
          setEditingMessage={setEditingMessage}
          handleSubmit={handleSubmit}
        />

        <MessageList
          messages={messages}
          onEdit={handleSelectToEdit}
          onDelete={handleDeleteMessage}
        />
      </div>
    </>
  );
}

export default App;
