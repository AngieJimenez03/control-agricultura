import express from 'express';
import dbClient from './config/dbClient.js';
import 'dotenv/config';
import routesUsuarios from './routes/userRouter.js';

// Instancia de Express
const app = express();

// Middlewares
app.use(express.json()); // para recibir JSON
app.use(express.urlencoded({ extended: true })); // para recibir datos de formularios

// Rutas
app.use('/users', routesUsuarios);

try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));
} catch (e) {
    console.log(e);
}

// Cerrar conexión con la DB al terminar
process.on('SIGINT', async () => {
    await dbClient.cerrarConexion();
    process.exit(0);
})