// realtime/chat.lote.js
import mensajesModel from "../models/mensajes.js";
import Mensaje from "../schemas/mensajes.js";

export default function chatPorLote(io, socket) {

  socket.on("unirse_lote", async (loteId) => {
    socket.join(`lote:${loteId}`);
    console.log(`✔ ${socket.user.email} se unió a lote:${loteId}`);

    try {
      const historial = await mensajesModel.getByLote(loteId);
      socket.emit("historial_mensajes", historial);
    } catch (e) {
      console.error("Error historial:", e.message);
    }
  });

  socket.on("mensaje_lote", async (data) => {
    if (!data.loteId) return;

    const nuevo = {
      lote: data.loteId,
      emisor: socket.user.nombre || socket.user.email,
      rol: socket.user.rol,
      texto: data.texto || "",
      imagen: data.imagen || null,
      fecha: new Date(),
    };

    try {
      const creado = await mensajesModel.create(nuevo);
      const completo = await Mensaje.findById(creado._id)
        .populate("lote", "nombre");

      io.to(`lote:${data.loteId}`).emit("mensaje_lote", completo);
    } catch (e) {
      console.error("Error guardar mensaje:", e.message);
    }
  });

}
