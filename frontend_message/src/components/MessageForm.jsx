function MessageForm(
    {
        nuevoMensaje,
        setNuevoMensaje,
        mensajeEnEdicion,
        setMensajeEnEdicion,
        controlarEnvio
    }){
    return (
        <form onSubmit={controlarEnvio} className="input-group mb-4">
          <input
            type="text"
            placeholder={mensajeEnEdicion ? "Edita tu mensaje..." : "Escribe un nuevo mensaje..."}
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            className="form-control"
          />
        <button 
          type="submit" 
          className={`btn ${mensajeEnEdicion ? 'btn-warning' : 'btn-primary'}`}
        >
          {mensajeEnEdicion ? 'Actualizar' : 'Guardar'}
        </button>

        {mensajeEnEdicion && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => {
              setMensajeEnEdicion(null);
              setNuevoMensaje('');
            }}
          >
            Cancelar
          </button>
        )}

        </form>
    );
}

export default MessageForm;