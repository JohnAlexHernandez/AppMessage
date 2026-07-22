function MessageForm(
    {
        newMessage,
        setNewMessage,
        editingMessage,
        setEditingMessage,
        handleSubmit
    }){
    return (
        <form onSubmit={handleSubmit} className="input-group mb-4 shadow-sm" style={{ borderRadius: '6px', overflow: 'hidden' }}>
          <input
            type="text"
            placeholder={editingMessage ? "Edita tu mensajito..." : "Escribe algo bonito..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-control border-0 py-2 px-3"
            style={{ backgroundColor: '#fffdf9' }}
          />
          
          <button 
            type="submit" 
            className={`btn px-3 ${editingMessage ? 'btn-dark' : 'btn-light text-dark fw-bold'}`}
            style={{ borderLeft: '1px solid #dee2e6' }}
          >
            {editingMessage ? 'Actualizar' : '+ Agregar'}
          </button>

          {editingMessage && (
            <button 
              type="button" 
              className="btn btn-light text-danger px-3 border-0" 
              onClick={() => {
                setEditingMessage(null);
                setNewMessage('');
              }}
              title="Cancelar"
            >
              &times;
            </button>
          )}
        </form>
    );
}

export default MessageForm;