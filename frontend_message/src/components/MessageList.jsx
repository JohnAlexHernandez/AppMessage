function MessageList({ mensajes, onEdit, onDelete }) {
    return (
        <>
        <h2 className="text-secondary mb-3">Lista de mensajes:</h2>
        <ul className="list-group">
          { mensajes.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.texto}
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
            </li>
          )) }
        </ul>
        </>
    );
}

export default MessageList;