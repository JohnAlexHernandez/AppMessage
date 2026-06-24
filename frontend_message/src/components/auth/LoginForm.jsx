import { useState } from 'react';
import { loginService } from '../../services/login.service';
import Register from './RegisterForm';

// Definimos el componente funcional Login
function LoginForm({ onLoginSuccess }){
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const validateForm = () => {
        if (!correo.trim() || !contrasena.trim()){
            return 'Los campos correo electrónico y contrasena son obligatorios';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(correo)){
            return 'El formato del correo electrónico no es válido';
        }
        return null;
    };

    // Función manejadora que se ejecuta cuando el usuario envía el formulario
    const handleLogin= (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        loginService.login(correo, contrasena)
            .then(data => {
                // Almacenamos el JWT recibido de forma persistente en el localStorage del navegador
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); 

                // Verificamos si el padre efectivamente nos envió la prop. Si existe, la ejecutamos.
                // Esto disparará el 'setIsLoggedIn(true)' que está guardado dentro de ella en App.jsx.
                if (onLoginSuccess) onLoginSuccess();
        })
        .catch(err => {
                console.error('Error en login:', err);
                setError(err.message);
            });
    };

    if (isRegisterMode) {
        return <Register onCancel={() => setIsRegisterMode(false)} />;
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="container p-4 rounded shadow" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Ingresar</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form noValidate onSubmit={handleLogin}>
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
                        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                    </div>  
                    <div className="d-flex justify-content-center mt-3">
                        <a 
                            href="#!" 
                            className="text-primary" 
                            style={{ cursor: 'pointer', textDecoration: 'none' }}
                            onClick={() => setIsRegisterMode(true)}
                        >
                            ¿No tienes cuenta? Regístrate aquí
                        </a>
                    </div>      
                </form>
            </div>
        </div>
    )
}

export default LoginForm;