import Tarea from "../schemas/tareas.js";
import mongoose from "mongoose";

class tareasModel {
  
  //  Crear nueva tarea
  async create(data) {
    return await Tarea.create(data);
  }

  //  Obtener todas las tareas (admin)
  async getAll() {
    return await Tarea.find()
      .populate("lote", "nombre ubicacion")
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol")
      .populate("creadoPor", "nombre email rol");
  }

  //  Obtener tarea por ID
  async getOneById(id) {
    return await Tarea.findById(id)
      .populate("lote", "nombre ubicacion")
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol")
      .populate("creadoPor", "nombre email rol");
  }

  // Obtener tareas por supervisor (más robusto)
async getBySupervisor(supervisorId) {
  const id = new mongoose.Types.ObjectId(supervisorId);

  const tareas = await Tarea.find({
    $or: [
      { supervisor: id },              // tareas donde el supervisor está directamente asignado
      { "lote.supervisor": id }        // tareas donde el lote pertenece a ese supervisor
    ]
  })
    .populate({
      path: "lote",
      select: "nombre ubicacion cultivo estado supervisor",
      populate: { path: "supervisor", select: "nombre email rol" }
    })
    .populate("tecnicosAsignados", "nombre email rol")
    .populate("supervisor", "nombre email rol");

  return tareas;
}
  async getByLote(loteId) {
  return await Tarea.find({ lote: new mongoose.Types.ObjectId(loteId) })
    .populate("lote", "nombre ubicacion cultivo estado")
    .populate("tecnicosAsignados", "nombre email rol")
    .populate("supervisor", "nombre email rol");
}
  //  Obtener tareas asignadas a un técnico
  async getByTecnico(tecnicoId) {
  const id = new mongoose.Types.ObjectId(tecnicoId);

  const tareas = await Tarea.find({
    tecnicosAsignados: { $in: [id] }
  })
    .populate({
      path: "lote",
      select: "nombre ubicacion cultivo estado supervisor",
      populate: { path: "supervisor", select: "nombre email rol" } // <- aquí
    })
    .populate("tecnicosAsignados", "nombre email rol")
    .populate("supervisor", "nombre email rol"); // opcional si quieres supervisor directo también

  return tareas;
}



  //  Actualizar tarea (solo admin)
  async update(id, data) {
    return await Tarea.findByIdAndUpdate(id, data, { new: true });
  }

  //  Eliminar tarea
  async delete(id) {
    return await Tarea.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  }
}

export default new tareasModel();
