import 'dotenv/config';
import mongoose from "mongoose";

class dbClient {
  constructor() {
    this.conectarBaseDatos();
  }

  async conectarBaseDatos() {
    const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/controlAgricultura?retryWrites=true&w=majority`;

    try {
      await mongoose.connect(queryString);
      console.log(" Conectado a MongoDB");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error.message);
    }
  }

  async cerrarConexion() {
    try {
      await mongoose.disconnect();
      console.log(' Conexión cerrada');
    } catch (e) {
      console.error("Error al cerrar la conexión");
    }
  }
}

export default new dbClient();