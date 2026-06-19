function MessageForm(
    {
        newMessage,
        setNewMessage,
        editingMessage,
        setEditingMessage,
        handleSubmit
    }){
    return (
        <form onSubmit={handleSubmit} className="input-group mb-4">
          <input
            type="text"
            placeholder={editingMessage ? "Edita tu mensaje..." : "Escribe un nuevo mensaje..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-control"
          />
        <button 
          type="submit" 
          className={`btn ${editingMessage ? 'btn-warning' : 'btn-primary'}`}
        >
          {editingMessage ? 'Actualizar' : 'Guardar'}
        </button>

        {editingMessage && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => {
              setEditingMessage(null);
              setNewMessage('');
            }}
          >
            Cancelar
          </button>
        )}

        </form>
    );
}

export default MessageForm;