import lotesModel from '../models/lotes.js';

class lotesController {

  async crearLote(req, res, next) {
    try {
      const data = req.body;
      data.creadoPor = req.user.email; // el usuario autenticado
      const nuevoLote = await lotesModel.create(data);
      res.status(201).json({ msg: " Lote creado correctamente", lote: nuevoLote });
    } catch (e) { next(e); }
  }

  async obtenerLotes(req, res, next) {
    try {
      const lotes = await lotesModel.getAll();
      res.status(200).json(lotes);
    } catch (e) { next(e); }
  }

  async obtenerLotePorId(req, res, next) {
    try {
      const { id } = req.params;
      const lote = await lotesModel.getOneById(id);
      if (!lote) return res.status(404).json({ msg: "Lote no encontrado" });
      res.status(200).json(lote);
    } catch (e) { next(e); }
  }

  async actualizarLote(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const loteActualizado = await lotesModel.update(id, data);
      if (!loteActualizado) return res.status(404).json({ msg: "Lote no encontrado" });
      res.status(200).json({ msg: " Lote actualizado correctamente", lote: loteActualizado });
    } catch (e) { next(e); }
  }

  async eliminarLote(req, res, next) {
    try {
      const { id } = req.params;
      const eliminado = await lotesModel.delete(id);
      if (!eliminado) return res.status(404).json({ msg: "Lote no encontrado" });
      res.status(200).json({ msg: " Lote eliminado correctamente" });
    } catch (e) { next(e); }
  }
}

export default new lotesController();