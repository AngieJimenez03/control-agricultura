import Mensaje from "../schemas/mensajes.js";
import Lote from "../schemas/lotes.js";
import mongoose from "mongoose";

class MensajesModel {
  async create(data) {
    return await Mensaje.create(data);
  }

  async getByLote(loteId) {
    return await Mensaje.find({ lote: new mongoose.Types.ObjectId(loteId) })
      .populate("lote", "nombre")
      .sort({ fecha: 1 })
      .limit(50);
  }

  // Obtener el último mensaje por cada lote, con nombre del lote
  async getUltimosPorLote() {
    const mensajes = await Mensaje.aggregate([
      { $sort: { fecha: -1 } },
      {
        $group: {
          _id: "$lote",
          ultimoMensaje: { $first: "$$ROOT" },
        },
      },
    ]);

    // Obtener los nombres de lotes relacionados
    const lotesIds = mensajes.map((m) => m._id);
    const lotes = await Lote.find({ _id: { $in: lotesIds } }).select("nombre");
    const lotesMap = Object.fromEntries(lotes.map((l) => [l._id.toString(), l.nombre]));

    // Reemplazar IDs por nombres
    return mensajes.map((m) => ({
      loteId: m._id,
      nombreLote: lotesMap[m._id.toString()] || "Sin nombre",
      ultimoMensaje: m.ultimoMensaje,
    }));
  }

  // Eliminar mensajes de un lote
  async deleteByLote(loteId) {
    return await Mensaje.deleteMany({ lote: new mongoose.Types.ObjectId(loteId) });
  }
}

export default new MensajesModel();
