const API_URL = 'http://localhost:3000/api';

export const messageService = {
    // Función para obtener todos los mensajes desde el backend
    getAll: () => {
        // Hacemos una solicitud fetch al endpoint del backend para obtener los mensajes
        return fetch(`${API_URL}/messages`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los mensajes');
                }
                // Convertimos la respuesta a JSON  
                return response.json();
            });
        },  
    // Función para manejar la creación de un nuevo mensaje
    create: (text) => {
        // Hacemos una solicitud POST al backend para crear un nuevo mensaje
        return fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ text })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el mensaje');
            }
            return response.json();
            });
    },
    // Función para actualizar un mensaje existente en el backend
    update: (id, text) => {
        return fetch(`${API_URL}/message/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ text })
        }).then(response => {
            if (!response.ok) { 
                throw new Error('Error al actualizar el mensaje');
            }
            return response.json();
            });
    },
    // Función para eliminar un mensaje en el backend
    delete: (id) => {
        return fetch(`${API_URL}/message/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el mensaje');
            }
            return response;
        }); 
    }
}