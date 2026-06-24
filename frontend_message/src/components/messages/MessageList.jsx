function MessageList({ messages, onEdit, onDelete, currentUser }) {
    return (
        <>
        <h2>Lista de mensajes:</h2>
        {messages.length === 0 ? (
            <div className="alert alert-info" role="alert">
                No hay mensajes disponibles.
            </div>
        ) : (
          <ul className="list-group">
            { messages.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.texto}
                {item.usuario_id === currentUser.id && (
                  <div className="btn-group">
                    <button 
                      onClick={() => {
                        onEdit(item);
                      }} 
                      className="btn btn-outline-warning btn-sm me-2"
                    >
                    Editar
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            )) }
          </ul>
        )}
        </>
    );
}

export default MessageList;