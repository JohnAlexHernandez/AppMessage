// Importamos supertest para simular peticiones HTTP
const request = require("supertest");
const app = require("../../../index");
const db = require("../../config/db");
const jwt = require('jsonwebtoken');

// describe agrupa las pruebas relacionadas
describe("Messages API - Get", () => {
  // Validación sin token debe retornar 401
  it("debe retornar 401 si el usuario no está autenticado", async () => {
    const response = await request(app)
      .get("/api/messages")
      .expect(401);

    expect(response.body).toEqual({ message: "No se proporcionó un token bearer válido" });
  });

  // Validación con token no válido, debe retornar 403
  it("debe retornar 403 si el token no es válido", async () => {
    // Silenciamos temporalmente el console.error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const tokenInvalido = "tokenInvalidoFalso123";

    const response = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${tokenInvalido}`)
      .expect(403);

    expect(response.body).toEqual({ message: "Token no válido o token expirado" });

    consoleSpy.mockRestore();
  });

  // Validación con token expirado, debe retornar 403
  it("debe retornar 403 si el token expiró", async () => {
    // Silenciamos temporalmente el console.error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const payload = {
        id: 10,
        correo_electronico: 'prueba@prueba.com'
    }

    const tokenExpirado = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '-10s' }
    );

    const response = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${tokenExpirado}`)
      .expect(403);

    expect(response.body).toEqual({ message: "Token no válido o token expirado" });

    consoleSpy.mockRestore();
  });

  // Validación con token debe retornar 200
  it("debe retornar 200 y lista de mensajes si el usuario está autenticado", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "prueba@prueba.com",
        contrasena: "prueba",
      });

    // Extraemos el token de la respuesta
    const token = login.body.token;

    // Hacemos la petición con el token en el header
    const response = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // Verificamos que la respuesta sea un array
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Validación error inesperado en el servidor
  it("debe retornar 500 si ocurre un error inesperado en el servidor", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "prueba@prueba.com",
        contrasena: "prueba",
      });

    // Extraemos el token de la respuesta
    const token = login.body.token;

    // Espiamos el método 'query' del objeto 'db' real y lo obligamos a fallar
    const dbSpy = jest
      .spyOn(db, "query")
      .mockRejectedValueOnce(new Error("Fallo temporal de BD"));

    // Silenciamos temporalmente el console.error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    expect(response.body).toEqual({ message: "Error al obtener los mensajes" });

    // Deshacemos el espía para que la BD vuelva a la normalidad
    dbSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});

// Se ejecuta de forma automática cuando todos los 'it' anteriores finalizan
afterAll(async () => {
  // Si el objeto de la base de datos existe y tiene el método para finalizar el pool
  if (db && typeof db.end === "function") {
    // Apagamos y cerramos las conexiones activas en segundo plano para permitir que el proceso de Node termine de inmediato
    await db.end();
  }
});