export default function chatPublic(io, socket) {
  // Escuchar cuando un cliente envía un mensaje al canal público
  socket.on("mensaje_publico", (data) => {
    const mensaje = {
      emisor: socket.user.email || "Usuario desconocido", // si no tiene nombre, usa email
      rol: socket.user.rol || "sin rol",
      texto: data.texto?.trim(),
      fecha: new Date().toLocaleString(),
    };



    if (!mensaje.texto) return; // evita mensajes vacíos

    console.log(` [${mensaje.rol}] ${mensaje.emisor}: ${mensaje.texto}`);

    // Emitir el mensaje a todos los conectados (canal público)
    io.emit("mensaje_publico", mensaje);
  });
}