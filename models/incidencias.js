import Incidencia from "../schemas/incidencias.js";
import mongoose from "mongoose";

class incidenciasModel {
  async create(data) {
    return await Incidencia.create(data);
  }

  async getAll() {
    return await Incidencia.find()
      .populate("tarea", "titulo tipo")
      .populate("tecnico", "nombre email");
  }

  async getByTecnico(tecnicoId) {
    return await Incidencia.find({ tecnico: new mongoose.Types.ObjectId(tecnicoId) })
      .populate("tarea", "titulo tipo")
      .populate("tecnico", "nombre email");
  }

  async getBySupervisor(supervisorId) {
    return await Incidencia.find()
      .populate({
        path: "tarea",
        match: { supervisor: new mongoose.Types.ObjectId(supervisorId) },
        populate: { path: "tecnico", select: "nombre email" }
      });
  }

  async update(id, data) {
    return await Incidencia.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Incidencia.findByIdAndDelete(id);
  }
}

export default new incidenciasModel();
