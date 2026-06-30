const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/auth';

// Exportamos el objeto loginService para que pueda ser utilizado en los componentes de React
export const loginService = {
    // Función para manejar el inicio de sesión
    login: (correo_electronico, contrasena) => {
        // Hacemos una solicitud POST al backend para el inicio de sesión
        return fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ correo_electronico, contrasena })
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
            return data;
            });
    },  
    // Función para manejar la creación de un nuevo usuario
    create: (nombre, correo_electronico, contrasena) => {
        // Hacemos una solicitud POST al backend para crear un nuevo usuario
        return fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre, correo_electronico, contrasena })
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al crear el usuario');
            }
            return data;
            });
    }
}