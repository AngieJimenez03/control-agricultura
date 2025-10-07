import jwt from 'jsonwebtoken';
import chatPublic from './chat.public.js';

export default function inicializarSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Token requerido'));
    try {
      const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      socket.user = user;
      next();
    } catch {
      next(new Error('Token inválido'));
    }
  });



  // Evento: conexión de un cliente
  io.on('connection', (socket) => {
    console.log(` Usuario conectado: ${socket.user.email} (${socket.user.rol})`);

    // Inicia el chat público
    chatPublic(io, socket);

     socket.on("disconnect", () => {
      console.log(` Usuario desconectado: ${socket.user.email}`);
    });
  });
   console.log(" Socket.IO inicializado correctamente");
}