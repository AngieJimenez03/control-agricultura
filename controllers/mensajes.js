import mensajesModel from "../models/mensajes.js";

/**
 * Controlador para manejo de mensajes de chat por lote
 */
class MensajesController {
  //  Obtener historial de un lote
  async getMensajesPorLote(req, res) {
    try {
      const { loteId } = req.params;
      const mensajes = await mensajesModel.getByLote(loteId);
      res.json(mensajes);
    } catch (error) {
      console.error(" Error al obtener mensajes:", error);
      res.status(500).json({ error: "Error al obtener mensajes del lote" });
    }
  }

  //  Obtener últimos mensajes por cada lote (para panel de conversaciones)
  async getUltimosMensajes(req, res) {
    try {
      const data = await mensajesModel.getUltimosPorLote();
      res.json(data);
    } catch (error) {
      console.error(" Error al obtener últimos mensajes:", error);
      res.status(500).json({ error: "Error al obtener los últimos mensajes" });
    }
  }

  //  Limpiar mensajes de un lote
  async eliminarMensajes(req, res) {
    try {
      const { loteId } = req.params;
      await mensajesModel.deleteByLote(loteId);
      res.json({ success: true, message: "Mensajes eliminados correctamente" });
    } catch (error) {
      console.error(" Error al eliminar mensajes:", error);
      res.status(500).json({ error: "Error al eliminar mensajes del lote" });
    }
  }
}

export default new MensajesController();
