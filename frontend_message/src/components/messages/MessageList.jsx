import React from 'react';

function MessageList({ messages, onEdit, onDelete, currentUser }) {
    // Paleta de colores pastel para rotar visualmente en las notas
    const pastelColors = ['#FEF3C7', '#FCE7F3', '#D1FAE5', '#E0F2FE', '#EDE9FE'];

    return (
        <>
        {messages.length === 0 ? (
            <div className="alert alert-light text-center border-0 shadow-sm" role="alert">
                No hay notas disponibles.
            </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {messages.map((item, index) => {
              // Asignar un color pastel de forma cíclica
              const randomColor = pastelColors[index % pastelColors.length];
              
              // Generar una inclinación sutil (entre -3 y 3 grados)
              const rotation = (index % 7 - 3);

              return (
                <div className="col" key={item.id}>
                  <div 
                    className="card h-100 p-3 shadow-sm post-it-note"
                    style={{
                      backgroundColor: randomColor,
                      transform: `rotate(${rotation}deg)`,
                      border: 'none',
                      borderRadius: '2px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div className="card-body p-0 d-flex flex-column justify-content-between">
                      <p className="card-text mb-3" style={{ wordBreak: 'break-word' }}>
                        {item.texto}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Autor: {item.nombre_usuario}
                        </small>
                        
                        {/* Botones de acción minimalistas */}
                        <div className="d-flex gap-2 opaco-hover align-items-center">
                          {/* Botón Editar (punto sutil) */}
                          <button 
                            onClick={() => onEdit(item)} 
                            className="btn btn-link p-0 text-dark text-decoration-none"
                            style={{ fontSize: '1.2rem', lineHeight: '0.5', fontWeight: 'bold' }}
                            title="Editar"
                            disabled={item.usuario_id !== currentUser.id}
                          >
                            &bull;
                          </button>
                          
                          {/* Botón Eliminar (x fina) */}
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="btn btn-link p-0 text-danger text-decoration-none"
                            style={{ fontSize: '1.2rem', lineHeight: '0.5' }}
                            title="Eliminar"
                            disabled={item.usuario_id !== currentUser.id}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
    );
}

export default MessageList;