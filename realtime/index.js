// src/realtime/index.js
import jwt from "jsonwebtoken";
import chatPorLote from "./chat.lote.js";
import iniciarMonitorDeAlertas from "./alertas.js";

let ioGlobal;
const usuariosConectados = new Map(); // email → socket.id

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

    usuariosConectados.set(email, socket.id);
    io.emit("usuarios_online", Array.from(usuariosConectados.keys()));

    // Canales base
    socket.join("tasks");
    if (rol === "admin") socket.join("admin");
    if (rol === "supervisor") socket.join(`supervisor:${email}`);
    if (rol === "tecnico") socket.join(`tecnico:${email}`);
    
    

    // Unión manual a lotes desde frontend
    socket.on("joinRoom", ({ lotes }) => {
      if (Array.isArray(lotes)) {
        lotes.forEach((id) => {
          socket.join(`lote:${id}`);
          console.log(` ${email} unido a lote:${id}`);
        });
      }
    });

    // Chat por lote
    chatPorLote(io, socket);

    socket.on("disconnect", () => {
      usuariosConectados.delete(email);
      io.emit("usuarios_online", Array.from(usuariosConectados.keys()));
      console.log(` Usuario desconectado: ${email}`);
    });
  });

  iniciarMonitorDeAlertas();
  console.log(" Socket.IO inicializado correctamente");
}
