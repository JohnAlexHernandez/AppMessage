// Importamos supertest para simular peticiones HTTP
const request = require("supertest");
const { app } = require("../../../index");
const db = require("../../config/db");

// describe agrupa las pruebas relacionadas
describe("Messages API - Update", () => {
  // Variable que contiene el identificador del registro de prueba
  let messageIdToClean = null;

  // Validación de la actualización de un mensaje
  it("debe retornar 200 si el mensaje se actualiza exitosamente", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "prueba@prueba.com",
        contrasena: "prueba",
      });

    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [10]
    );

    messageIdToClean = inserted.insertId;

    // Extraemos el token de la respuesta
    const token = login.body.token;

    const response = await request(app)
      .put(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Mensaje de prueba actualizado",
      })
      .expect(200);

    expect(response.body).toEqual({ message: "Mensaje actualizado exitosamente!" });
  });

  // Validación de campos obligatorios
  it("debe retornar 400 si los campos obligatorios están vacios", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "prueba@prueba.com",
        contrasena: "prueba",
      });

    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [10]
    );

    messageIdToClean = inserted.insertId;

    // Extraemos el token de la respuesta
    const token = login.body.token;

    const response = await request(app)
      .put(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "",
      })
      .expect(400);

    expect(response.body).toEqual({message: 'El campo "texto" es obligatorio'});
  });

  // Validación de campos obligatorios
  it("debe retornar 400 si los campos obligatorios no son enviados", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "prueba@prueba.com",
        contrasena: "prueba",
      });

    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [10]
    );

    messageIdToClean = inserted.insertId;

    // Extraemos el token de la respuesta
    const token = login.body.token;

    const response = await request(app)
      .put(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(response.body).toEqual({
      message: 'El campo "texto" es obligatorio',
    });
  });

  // Validación de campos obligatorios
  it("debe retornar 400 si el texto del mensaje supera el límite de 100 caracteres", async () => {
    // Primero hacemos login para obtener el token
    const login = await request(app)
      .post("/auth/login")
      .send({
        correo_electronico: "prueba@prueba.com",
        contrasena: "prueba",
      });

    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [10]
    );

    messageIdToClean = inserted.insertId;

    // Extraemos el token de la respuesta
    const token = login.body.token;
    
    // Creamos una cadena de texto de 101 caracteres
    const longText = "a".repeat(101);

    const response = await request(app)
      .put(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: longText,
      })
      .expect(400);

    expect(response.body).toEqual({
      message: 'El campo "texto" no puede superar los 100 caracteres',
    });
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

    // Insertamos el mensaje usando el ID del usuario
    const [inserted] = await db.query(
      "INSERT INTO mensajes (texto, usuario_id) VALUES ('Texto original', ?)",
      [10]
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
      .put(`/api/message/${messageIdToClean}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Mensaje de prueba actualizado",
      })
      .expect(500);

    expect(response.body).toEqual({ message: "Error al actualizar el mensaje" });

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