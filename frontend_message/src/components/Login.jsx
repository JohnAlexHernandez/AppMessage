import { useState } from 'react';
import { loginService } from '../services/loginService';

// Definimos el componente funcional Login
function Login({ onLoginSuccess }){
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    // Función manejadora que se ejecuta cuando el usuario envía el formulario
    const manejarLogin= (e) => {
        e.preventDefault();
        loginService.login(correo, contrasena)
            .then(data => {
                // Almacenamos el JWT recibido de forma persistente en el localStorage del navegador
                localStorage.setItem('token', data.token);

                // Verificamos si el padre efectivamente nos envió la prop. Si existe, la ejecutamos.
                // Esto disparará el 'setIsLoggedIn(true)' que está guardado dentro de ella en App.jsx.
                if (onLoginSuccess) onLoginSuccess();
        })
        .catch(err => {
                console.error('Error en login:', err);
                setError('Correo o contraseña incorrectos');
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2>Iniciar sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={manejarLogin}>
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
                <div className="md-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={ contrasena }
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>                
                <button type="submit" className="btn btn-primary w-100">Ingresar</button>
            </form>
        </div>
    )
}

export default Login;