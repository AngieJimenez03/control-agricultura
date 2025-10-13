
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import dbClient from './config/dbClient.js';
import userRoutes from './routes/userRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import lotesRoutes from './routes/lotesRouter.js';
import tareasRoutes from './routes/tareasRouter.js';
import incideciasRoutes from './routes/incidenciasRouter.js';


//  Agregamos HTTP y Socket.IO
import http from 'http';
import { Server } from 'socket.io';
import inicializarSockets from './realtime/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas HTTP
app.use('/users', userRoutes);
app.use('/lotes',lotesRoutes);
app.use('/tareas', tareasRoutes);
app.use('/incidencias', incideciasRoutes);



// Middleware global de errores
app.use(errorHandler);

//  Crear servidor HTTP
const server = http.createServer(app);

//  Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//  Inicializar la lógica de sockets 
inicializarSockets(io);

//  Iniciar servidor
const PORT = process.env.PORT || 5100;
server.listen(PORT, () => console.log(` Servidor corriendo en puerto ${PORT}`));

//  Cerrar conexión DB al terminar
process.on('SIGINT', async () => {
  await dbClient.cerrarConexion();
  process.exit(0);
});