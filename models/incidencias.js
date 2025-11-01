import Incidencia from "../schemas/incidencias.js";
import mongoose from "mongoose";

class incidenciasModel {

  async create(data) {
    return await Incidencia.create(data);
  }

  async getAll() {
    return await Incidencia.find()
      .populate("tarea", "titulo tipo estado")
      .populate("lote", "nombre ubicacion")
      .populate("tecnico", "nombre email rol")
      .populate("supervisor", "nombre email rol");
  }

  async getOneById(id) {
    return await Incidencia.findById(id)
      .populate("tarea", "titulo tipo estado")
      .populate("lote", "nombre ubicacion")
      .populate("tecnico", "nombre email rol")
      .populate("supervisor", "nombre email rol");
  }

  async getBySupervisor(supervisorId) {
    return await Incidencia.find({ supervisor: new mongoose.Types.ObjectId(supervisorId) })
      .populate("tarea", "titulo tipo estado")
      .populate("lote", "nombre ubicacion")
      .populate("tecnico", "nombre email rol");
  }

  async getByTecnico(tecnicoId) {
    return await Incidencia.find({ tecnico: new mongoose.Types.ObjectId(tecnicoId) })
      .populate("tarea", "titulo tipo estado")
      .populate("lote", "nombre ubicacion");
  }

  async update(id, data) {
    return await Incidencia.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Incidencia.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  }
}

export default new incidenciasModel();
