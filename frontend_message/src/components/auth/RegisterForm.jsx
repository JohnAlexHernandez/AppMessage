import { useState } from 'react';
import { loginService } from '../../services/login.service';

// Definimos el componente funcional registrar
function RegisterForm({ onCancel }){
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!nombre.trim() || !correo.trim() || !contrasena.trim()){
            return 'Los campos nombre, correo electrónico y contrasena son obligatorios';
        }
        if(nombre.length > 100){
            return 'El campo "nombre" no puede superar los 100 caracteres';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(correo)){
            return 'El formato del correo electrónico no es válido';
        }
        return null;
    };

    // Función manejadora que se ejecuta cuando el usuario se registra
    const handleRegister= (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        loginService.create(nombre, correo, contrasena)
            .then(() => {
                setError('');
                // Y regresamos al usuario a la pantalla de Login para que inicie sesión
                if (onCancel) onCancel();
        })
        .catch(err => {
                console.error('Error en login:', err);
                setError(err.message);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="container p-4 rounded shadow" style={{ maxWidth: '400px' }}>
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
                <h2 className='text-center mb-4'>Crear cuenta</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form noValidate onSubmit={handleRegister}>
                    <div className="mb-3 text-center">
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Nombre"
                            value={ nombre }
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 text-center">
                        <input 
                            type="email"
                            className="form-control"
                            placeholder="Correo electrónico"
                            value={ correo }
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Contraseña"
                            value={ contrasena }
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                    </div>  
                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary w-100">Guardar</button>
                    </div>     
                </form>
            </div>
        </div>
    )
}

export default RegisterForm;