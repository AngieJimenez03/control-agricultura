export default function chatPublic(io, socket) {
  socket.on("mensaje_publico", (data) => {
    const mensaje = {
      idEmisor: socket.id, // esto permite identificar al emisor
      emisor: socket.user?.email || "Usuario desconocido",
      rol: socket.user?.rol || "sin rol",
      texto: data.texto?.trim(),
      fecha: new Date().toLocaleTimeString(),
    };

    if (!mensaje.texto) return;

    console.log(`[${mensaje.rol}] ${mensaje.emisor}: ${mensaje.texto}`);

    // Enviar el mensaje a todos los clientes
    io.emit("mensaje_publico", mensaje);
  });
}
