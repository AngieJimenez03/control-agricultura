import Tarea from "../schemas/tareas.js";
import mongoose from "mongoose";

class tareasModel {
  async create(data) {
    return await Tarea.create(data);
  }

  async getAll() {
    return await Tarea.find()
      .populate("lote", "nombre ubicacion cultivo")
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol");
  }

  async getById(id) {
    return await Tarea.findById(id)
      .populate("lote", "nombre ubicacion cultivo")
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol");
  }
   async getByTecnico(tecnicoId) {
    return await Tarea.find({ tecnicosAsignados: tecnicoId })
      .populate("lote", "nombre ubicacion")
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol");
  }


  async update(id, data) {
    return await Tarea.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Tarea.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  }
}

export default new tareasModel();
