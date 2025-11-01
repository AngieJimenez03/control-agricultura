import Mensaje from "../schemas/mensajes.js";
import mongoose from "mongoose";

class mensajesModel {
  // Crear mensaje nuevo
  async create(data) {
    return await Mensaje.create(data);
  }

  // Obtener los mensajes de un lote (últimos 50)
  async getByLote(loteId) {
    return await Mensaje.find({ lote: new mongoose.Types.ObjectId(loteId) })
      .sort({ fecha: 1 }) // ordenados del más antiguo al más reciente
      .limit(50);
  }

  // Eliminar mensajes (por limpieza o reinicio)
  async deleteByLote(loteId) {
    return await Mensaje.deleteMany({ lote: new mongoose.Types.ObjectId(loteId) });
  }
}

export default new mensajesModel();
