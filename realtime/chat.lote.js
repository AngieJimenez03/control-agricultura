
import mensajesModel from "../models/mensajes.js";
export default function chatPorLote(io, socket) {
  //  Unirse a un canal (lote)
  socket.on("unirse_lote", async (loteId) => {
    socket.join(loteId);
    console.log(` ${socket.user?.email || "Usuario"} se unió al lote ${loteId}`);

    //  Enviar historial guardado al usuario que entra
    try {
      const historial = await mensajesModel.getByLote(loteId);
      socket.emit("historial_mensajes", historial);
    } catch (error) {
      console.error("Error al obtener historial de mensajes:", error.message);
    }
  });

  //  Enviar mensajes dentro del canal del lote
  socket.on("mensaje_lote", async (data) => {
    if (!data?.texto?.trim() || !data.loteId) return;

    const mensaje = {
      lote: data.loteId,
      emisor: socket.user?.email || "usuario@desconocido.com",
      rol: socket.user?.rol || "sin_rol",
      texto: data.texto.trim(),
      fecha: new Date(),
    };

    try {
      //  Guardar mensaje en la base de datos
      await mensajesModel.create(mensaje);

      //  Emitir el mensaje a todos los conectados en el mismo lote
      io.to(data.loteId).emit("mensaje_lote", mensaje);

      console.log(` [${data.loteId}] ${mensaje.emisor}: ${mensaje.texto}`);
    } catch (error) {
      console.error("Error al guardar o enviar mensaje:", error.message);
    }
  });

  //  Notificación instantánea al lote (para tareas o incidencias)
  socket.on("notificar_lote", (data) => {
    io.to(data.loteId).emit("notificacion_lote", {
      titulo: data.titulo,
      mensaje: data.mensaje,
      fecha: new Date().toLocaleTimeString(),
    });
  });
}
