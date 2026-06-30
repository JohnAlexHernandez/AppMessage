const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

export const messageService = {
    // Función para obtener todos los mensajes desde el backend
    getAll: () => {
        // Obtenemos el token de autenticación
        const token = localStorage.getItem('token');
        // Hacemos una solicitud fetch al endpoint del backend para obtener los mensajes
        return fetch(`${API_URL}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(async (response) => {
                // Convertimos la respuesta a JSON  
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error al obtener los mensajes');
                }
                return data;
            });
        },  
    // Función para manejar la creación de un nuevo mensaje
    create: (text) => {
        // Obtenemos el token de autenticación
        const token = localStorage.getItem('token');
        // Hacemos una solicitud POST al backend para crear un nuevo mensaje
        return fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al crear el mensaje');
            }
            return data;
        });
    },
    // Función para actualizar un mensaje existente en el backend
    update: (id, text) => {
        // Obtenemos el token de autenticación
        const token = localStorage.getItem('token');
        return fetch(`${API_URL}/message/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) { 
                throw new Error(data.message || 'Error al actualizar el mensaje');
            }
            return data;
        });
    },
    // Función para eliminar un mensaje en el backend
    delete: (id) => {
        // Obtenemos el token de autenticación
        const token = localStorage.getItem('token');
        return fetch(`${API_URL}/message/${id}`, {
            method: 'DELETE',
            headers: {
                    'Authorization': `Bearer ${token}`
                }
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar el mensaje');
            }
            return data;
        });
    }
}