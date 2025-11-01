// src/realtime/index.js
import jwt from "jsonwebtoken";
import chatPorLote from "./chat.lote.js";
import iniciarMonitorDeAlertas from "./alertas.js";

let ioGlobal;

// Permite obtener la instancia global de io en cualquier controlador
export function getIO() {
  if (!ioGlobal) throw new Error("Socket.IO no inicializado");
  return ioGlobal;
}

export default function inicializarSockets(io) {
  ioGlobal = io;

  // Middleware de autenticación JWT para sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Token requerido"));
    try {
      const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      socket.user = user;
      next();
    } catch {
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", (socket) => {
    console.log(` Usuario conectado: ${socket.user.email} (${socket.user.rol})`);

    // Unir al usuario a una "sala" según su rol o lote
    if (socket.user.rol === "admin") socket.join("admin");
    else if (socket.user.rol === "supervisor")
      socket.join(`supervisor:${socket.user.email}`);
    else if (socket.user.rol === "tecnico") {
      socket.user.lotesAsignados?.forEach((loteId) =>
        socket.join(`lote:${loteId}`)
      );
    }

    // 🔹 Conectar módulo de chat
    chatPorLote(io, socket);

    // 🔹 Permitir unión manual desde el frontend
    socket.on("joinRoom", ({ rol, email, lotes }) => {
      if (rol === "admin") socket.join("admin");
      else if (rol === "supervisor") socket.join(`supervisor:${email}`);
      else if (rol === "tecnico" && Array.isArray(lotes)) {
        lotes.forEach((id) => socket.join(`lote:${id}`));
      }
     socket.on("joinRoom", ({ rol, email, lotes }) => {
  console.log(`🟢 ${email} (${rol}) se unió manualmente a salas:`, lotes);
});
    });

    // 🔹 Desconexión
    socket.on("disconnect", () => {
      console.log(` Usuario desconectado: ${socket.user.email}`);
    });
  });

  // 🔹 Iniciar alertas automáticas
  iniciarMonitorDeAlertas();

  console.log(" Socket.IO inicializado correctamente con alertas automáticas");
}
