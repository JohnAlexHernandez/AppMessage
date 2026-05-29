import { useState } from 'react';
import { loginService } from '../../services/login.service';

// Definimos el componente funcional registrar
function RegisterForm({ onCancel }){
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    // Función manejadora que se ejecuta cuando el usuario se registra
    const handleRegister= (e) => {
        e.preventDefault();
        loginService.create(nombre, correo, contrasena)
            .then(() => {
                setError('');
                // Y regresamos al usuario a la pantalla de Login para que inicie sesión
                if (onCancel) onCancel();
        })
        .catch(err => {
                console.error('Error en login:', err);
                setError('No se pudo registrar el usuario. Inténtalo de nuevo');
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2>Registrar usuario</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex justify-content-end mb-4">
                <a 
                    href="#!" 
                    className="text-primary text-decoration-none"
                    style={{ cursor: 'pointer' }}
                    onClick={onCancel}
                >
                    &larr; Volver
                </a>
            </div>
            <form onSubmit={handleRegister}>
                <div className="mb-3 text-center">
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        value={ nombre }
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 text-center">
                    <input 
                        type="email"
                        className="form-control"
                        placeholder="Correo electrónico"
                        value={ correo }
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={ contrasena }
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>  
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary w-100">Guardar</button>
                </div>     
            </form>
        </div>
    )
}

export default RegisterForm;