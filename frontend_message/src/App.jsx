// Importamos el hook useState para manejar el estado en nuestro componente
import { useState } from 'react'
import './App.css'

function App() {
  // Declaramos una variable de estado llamada 'texto' y una función 'setTexto' para actualizarla, con un valor inicial de 'Hola mundo'
  const [texto, setTexto] = useState('Hola mundo')

  const [mensajes, setMensajes] = useState([
    { id: 1, texto: 'Primer mensaje' },
    { id: 2, texto: 'Segundo mensaje'}
  ])

  // Función para cambiar el mensaje cuando se hace clic en el botón
  const cambiarMensaje = () => {
    setTexto('El estado ha cambiado existosamente');
  }
  return (
    <>
      <div>
        <h1>{ texto }</h1>
        <button onClick={ cambiarMensaje }>
          Cambiar mensaje
        </button>
      </div>
      <div>
        <h2>Lista de mensajes:</h2>
        <ul>
          { mensajes.map((item) => (
            <li key={item.id}>{item.texto}</li>
          )) }
        </ul>
      </div>
    </>
  )
}

export default App
