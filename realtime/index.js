// src/realtime/index.js
import jwt from "jsonwebtoken";
import chatPorLote from "./chat.lote.js";
import iniciarMonitorDeAlertas from "./alertas.js";

let ioGlobal;

export function getIO() {
  if (!ioGlobal) throw new Error("Socket.IO no inicializado");
  return ioGlobal;
}

export default function inicializarSockets(io) {
  ioGlobal = io;

  // Middleware para validar token
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
    const { email, rol } = socket.user;
    console.log(` Usuario conectado: ${email} (${rol})`);

    //  Unir a la sala general de tareas
    socket.join("tasks");

    // Salas según rol (para permisos específicos)
    if (rol === "admin") {
      socket.join("admin");
    } else if (rol === "supervisor") {
      socket.join(`supervisor:${email}`);
    } else if (rol === "tecnico") {
      socket.join(`tecnico:${email}`);
    }

    //  Unión manual (si se envían lotes desde el front)
    socket.on("joinRoom", ({ rol, email, lotes }) => {
      socket.join("tasks");
      if (rol === "admin") socket.join("admin");
      else if (rol === "supervisor") socket.join(`supervisor:${email}`);
      else if (rol === "tecnico") {
        socket.join(`tecnico:${email}`);
        if (Array.isArray(lotes)) {
          lotes.forEach((id) => socket.join(`lote:${id}`));
        }
      }
      console.log(` ${email} (${rol}) unido a salas:`, lotes);
    });

    // Chat de lote (si aplica)
    chatPorLote(io, socket);

    socket.on("disconnect", () => {
      console.log(` Usuario desconectado: ${socket.user.email}`);
    });
  });

  iniciarMonitorDeAlertas();
  console.log("⚡ Socket.IO inicializado correctamente");
}