// Importamos supertest para simular peticiones HTTP
const request = require('supertest');
const { app } = require('../../index');
const db = require('../../src/config/db');
const bcrypt = require('bcryptjs');

// describe agrupa las pruebas relacionadas
describe('Auth API - Login', () => {

  beforeEach(async () => {
    await db.query("DELETE FROM usuarios");
    // Generamos los "salts" (rondas de aleatoriedad para  la encriptación)
    const salt = await bcrypt.genSalt(10);
    
    // Encriptamos la contraseña usando el salt
    const hashedPassword = await bcrypt.hash('contrasena', salt);
    // Insertamos el usuario con el que intentaremos loguearnos mal
    await db.query(
      "INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)",
      ['Usuario de prueba', 'correo@prueba.com', hashedPassword]
    );
  });

  // Validación de usuario existente
  it('debe retornar 400 si el usuario no existe', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: 'noexiste@noexiste.com',
        contrasena: 'noexiste'
      })
      .expect(400);

    expect(response.body).toEqual({ message: 'No existe un usuario asociado al correo electrónico ingresado' });
  });

  // Validación de contraseña correcta
  it('debe retornar 400 si la contraseña es incorrecta', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: 'correo@prueba.com',
        contrasena: 'contrasenaincorrecta'
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'Correo o contraseña incorrectos' });
  });

  // Validación de campos obligatorios
  it('debe retornar 400 si los campos obligatorios están vacios', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: '',
        contrasena: ''
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'Los campos correo electrónico y contrasena son obligatorios' });
  });

  // Validación de campos obligatorios
  it('debe retornar 400 si el correo electrónico está presente pero la contraseña está vacía', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: 'correo@prueba.com',
        contrasena: ''
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'Los campos correo electrónico y contrasena son obligatorios' });
  });

  // Validación de campos obligatorios
  it('debe retornar 400 si la contraseña está presente pero el correo electrónico está vacío', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: '',
        contrasena: 'prueba'
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'Los campos correo electrónico y contrasena son obligatorios' });
  });

  // Validación formato válido del campo correo electrónico 
  it('debe retornar 400 si el campo correo electrónico no tiene formato válido', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: 'correoInvalidoNoTieneArroba',
        contrasena: 'prueba'
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'El formato del correo electrónico no es válido' });
  });

  // Validación de contraseña correcta
  it('debe retornar 200, mensaje de éxito y un token válido en un login exitoso', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: 'correo@prueba.com',
        contrasena: 'contrasena'
      })
      .expect(200);
    
    expect(response.body.message).toEqual('Inicio de sesión exitoso' );
    // Revisamos si el objeto JSON devuelto por el servidor tiene una llave llamada token
    expect(response.body).toHaveProperty('token');
    // Revisamos que lo que haya dentro de token sea texto plano (una cadena de caracteres).
    expect(typeof response.body.token).toBe('string');
  });

  // Validación error inesperado en el servidor
  it('debe retornar 500 si ocurre un error inesperado en el servidor', async () => {

    // Espiamos el método 'query' del objeto 'db' real y lo obligamos a fallar
    const dbSpy = jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Fallo temporal de BD'));

    // Silenciamos temporalmente el console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app)
      .post('/auth/login')
      .send({
        correo_electronico: 'prueba@prueba.com',
        contrasena: 'prueba'
      })
      .expect(500);
    
    expect(response.body).toEqual({ message: 'Error al iniciar sesión' });

    // Deshacemos el espía para que la BD vuelva a la normalidad
    dbSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  // Se ejecuta de forma automática para limpiar los datos de prueba
  afterEach(async () => {
    // Eliminamos el usuario de prueba de la BD después de cada prueba
    await db.query("DELETE FROM usuarios WHERE correo_electronico = 'correo@prueba.com'");
  });
});

describe('Auth API - Register', () => {

  beforeEach(async () => {
    await db.query("DELETE FROM usuarios");
    // Generamos los "salts" (rondas de aleatoriedad para la encriptación)
    const salt = await bcrypt.genSalt(10);
    
    // Encriptamos la contraseña usando el salt
    const hashedPassword = await bcrypt.hash('contrasena', salt);
    // Insertamos el usuario con el que intentaremos loguearnos mal
    await db.query(
      "INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)",
      ['Usuario de prueba', 'correo@prueba.com', hashedPassword]
    );
  });

  // Validación de registro de un nuevo usuario
  it('debe retornar 201 si el registro del usuario es exitoso', async () => {
    const response = await request(app)
      .post('/auth/user')
      .send({
        nombre: 'Usuario de prueba',
        correo_electronico: 'usuario-prueba@prueba.com',
        contrasena: 'usuario-prueba'
      })
      .expect(201);

    expect(response.body).toEqual({ message: 'Usuario registrado exitosamente' });
  });

  // Validación de campos obligatorios
  it('debe retornar 400 si los campos obligatorios están vacios', async () => {
    const response = await request(app)
      .post('/auth/user')
      .send({
        nombre: '',
        correo_electronico: '',
        contrasena: ''
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'Los campos nombre, correo electrónico y contrasena son obligatorios' });
  });

  // Validación formato válido del campo correo electrónico 
  it('debe retornar 400 si el campo correo electrónico no tiene formato válido', async () => {
    const response = await request(app)
      .post('/auth/user')
      .send({
        nombre: 'Usuario de prueba',
        correo_electronico: 'correoInvalidoNoTieneArroba',
        contrasena: 'prueba'
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'El formato del correo electrónico no es válido' });
  });

    // Validación de campos obligatorios
  it("debe retornar 400 si el nombre del mensaje supera el límite de 100 caracteres", async () => {    
    // Creamos una cadena de texto de 101 caracteres
    const longText = "a".repeat(101);

    const response = await request(app)
      .post('/auth/user')
      .send({
        nombre: longText,
        correo_electronico: 'correoInvalidoNoTieneArroba',
        contrasena: 'prueba'
      })
      .expect(400);

    expect(response.body).toEqual({ message: 'El campo "nombre" no puede superar los 100 caracteres'});
  });

  // Validación correo electrónico duplicado 
  it('debe retornar 400 si el correo electrónico ya se encuentra asociado a un usuario existente', async () => {
    const response = await request(app)
      .post('/auth/user')
      .send({
        nombre: 'Usuario de prueba',
        correo_electronico: 'correo@prueba.com',
        contrasena: 'prueba'
      })
      .expect(400);
    
    expect(response.body).toEqual({ message: 'Ya existe un usuario asociado al correo electrónico' });
  });

  // Validación error inesperado en el servidor
  it('debe retornar 500 si ocurre un error inesperado en el servidor', async () => {

    // Espiamos el método 'query' del objeto 'db' real y lo obligamos a fallar
    const dbSpy = jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Fallo temporal de BD'));

    // Silenciamos temporalmente el console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app)
      .post('/auth/user')
      .send({
        nombre: 'Usuario de prueba',
        correo_electronico: 'usuario-prueba@prueba.com',
        contrasena: 'usuario-prueba'
      })
      .expect(500);
    
    expect(response.body).toEqual({ message: 'Error al registrar el usuario' });

    // Deshacemos el espía para que la BD vuelva a la normalidad
    dbSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  // Se ejecuta de forma automática para limpiar los datos de prueba
  afterEach(async () => {
    // Eliminamos el usuario de prueba de la BD después de cada prueba
    await db.query("DELETE FROM usuarios");
  });
});

// Se ejecuta de forma automática cuando todos los 'it' anteriores finalizan
afterAll(async () => {
  // Si el objeto de la base de datos existe y tiene el método para finalizar el pool
  if (db && typeof db.end === 'function') {
    // Apagamos y cerramos las conexiones activas en segundo plano para permitir que el proceso de Node termine de inmediato
    await db.end();
  }
});