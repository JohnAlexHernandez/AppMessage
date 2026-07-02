// Importamos supertest para simular peticiones HTTP
const request = require("supertest");
const { app } = require("../../../index");
const db = require("../../config/db");
const bcrypt = require('bcryptjs');

// describe agrupa las pruebas relacionadas
describe("Messages API - Delete", () => {
  // Variable que contiene el identificador del registro de prueba
  let messageIdToClean = null;

  let testUserId;
  
  beforeEach(async () => {
    // Limpiamos las tablas para que un test no ensucie al siguiente
    await db.query("DELETE FROM mensajes");
    await db.query("DELETE FROM usuarios");

    // Generamos los "salts" (rondas de aleatoriedad para la encriptación)
    const salt = await bcrypt.genSalt(10);
    
    // Encriptamos la contraseña usando el salt
    const hashedPassword = await bcrypt.hash('contrasena', salt);

    // Insertamos el usuario de prueba
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)",
      ['Usuario de prueba', 'correo@prueba.com', hashedPassword]
    );

    testUserId = result.insertId;
  });

  // Validación de la actualización de un mensaje
  it("debe retornar 200 si el mensaje se elimina exitosamente", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "correo@prueba.com",
        contrasena: "contrasena",
      });

    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [testUserId]
    );

    messageIdToClean = inserted.insertId;

    // Extraemos el token de la respuesta
    const token = login.body.token;

    const response = await request(app)
      .delete(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({ message: "Mensaje eliminado exitosamente!" });
  });

  // Validación error inesperado en el servidor
  it("debe retornar 500 si ocurre un error inesperado en el servidor", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "correo@prueba.com",
        contrasena: "contrasena",
      });
    
    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [testUserId]
    );

    messageIdToClean = inserted.insertId;

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
      .delete(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    expect(response.body).toEqual({ message: "Error al eliminar el mensaje" });

    // Deshacemos el espía para que la BD vuelva a la normalidad
    dbSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  // Se ejecuta de forma automática para limpiar los datos de prueba
    afterEach(async () => {
      // Eliminamos el mensaje de prueba de la BD después de cada prueba
      if(messageIdToClean){
          await db.query(
            "DELETE FROM mensajes WHERE id = ?", [messageIdToClean]
          );
          messageIdToClean = null;
      }

      await db.query("DELETE FROM usuarios");
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