const API_URL = 'http://localhost:3000/auth';

// Exportamos el objeto loginService para que pueda ser utilizado en los componentes de React
export const loginService = {
    // Función para manejar el inicio de sesión
    login: (correo_electronico, contrasena) => {
        // Hacemos una solicitud POST al backend para el inicio de sesión
        return fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ correo_electronico, contrasena })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el mensaje');
            }
            return response.json();
            });
    }
}