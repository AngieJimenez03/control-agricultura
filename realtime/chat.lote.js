// realtime/chat.lote.js
import mensajesModel from "../models/mensajes.js";
import Mensaje from "../schemas/mensajes.js"; // para populate después de crear

export default function chatPorLote(io, socket) {
  // Unirse al canal de un lote
  socket.on("unirse_lote", async (loteId) => {
    // usar prefijo consistente 'lote:<id>' para unir y emitir
    socket.join(`lote:${loteId}`);
    console.log(` ${socket.user?.email} se unió al canal lote:${loteId}`);

    try {
      const historial = await mensajesModel.getByLote(loteId); // ya hace populate(lote, 'nombre')
      socket.emit("historial_mensajes", historial);
    } catch (error) {
      console.error(" Error al obtener historial:", error.message);
    }
  });

  // Enviar mensaje de texto o imagen
  socket.on("mensaje_lote", async (data) => {
    if (!data.loteId || (!data.texto && !data.imagen)) return;

    // Guardar emisor como nombre si está disponible en el token (socket.user.nombre)
    const emisorNombre = socket.user?.nombre || socket.user?.email || "Desconocido";

    const mensajeParaGuardar = {
      lote: data.loteId,
      emisor: emisorNombre,
      rol: socket.user?.rol || "sin_rol",
      texto: data.texto || "",
      imagen: data.imagen || null,
      fecha: new Date()
    };

    try {
      // guardar y luego traer el doc poblado para emitir (así viene con lote.nombre)
      const creado = await mensajesModel.create(mensajeParaGuardar);

      // Traer con populate('lote','nombre')
      const creadoPop = await Mensaje.findById(creado._id).populate("lote", "nombre");

      // Emitir a la sala correcta (todos los conectados a lote:<id>)
      io.to(`lote:${data.loteId}`).emit("mensaje_lote", creadoPop);
      console.log(` [lote:${data.loteId}] ${creadoPop.emisor}: ${creadoPop.texto || "(imagen)"}`);
    } catch (error) {
      console.error(" Error al guardar mensaje:", error.message);
    }
  });

  // Notificar evento del lote
  socket.on("notificar_lote", (data) => {
    io.to(`lote:${data.loteId}`).emit("notificacion_lote", {
      titulo: data.titulo,
      mensaje: data.mensaje,
      fecha: new Date().toLocaleTimeString()
    });
  });
}
