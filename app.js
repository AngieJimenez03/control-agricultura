import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import dbClient from './config/dbClient.js';
import routesUsuarios from './routes/userRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Rutas
app.use('/users', routesUsuarios);

// Error handler global
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Servidor activo en puerto ${PORT}`));

// Cerrar conexión DB al terminar
process.on('SIGINT', async ()=>{
  await dbClient.cerrarConexion();
  process.exit(0);
});
