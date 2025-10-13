import incidenciasModel from "../models/incidencias.js";
import tareasModel from "../models/tareas.js";

class incidenciasController {

  // Crear incidencia (solo técnico asignado)
  async crearIncidencia(req, res, next) {
    try {
      const { descripcion, tarea } = req.body;

      const tareaExiste = await tareasModel.getById(tarea);
      if (!tareaExiste)
        return res.status(400).json({ error: "La tarea no existe." });

      const tecnicoId = req.user.id; // tomado del token
      // Validar que el técnico esté asignado a la tarea
    
const asignado = tareaExiste.tecnicosAsignados.some(t => {
  const tecnicoAsignadoId = t._id ? t._id.toString() : t.toString();
  return tecnicoAsignadoId === tecnicoId.toString();
});
      if (!asignado)
        return res.status(403).json({ error: "No está asignado a esta tarea." });

      const nuevaIncidencia = await incidenciasModel.create({
        descripcion,
        tarea,
        tecnico: tecnicoId,
      });

      res.status(201).json({
        msg: "Incidencia registrada correctamente",
        incidencia: nuevaIncidencia,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener incidencias según rol
  async obtenerIncidencias(req, res, next) {
    try {
      const { rol, id } = req.user;
      let incidencias;

      if (rol === "admin") {
        incidencias = await incidenciasModel.getAll();
      } else if (rol === "supervisor") {
        incidencias = await incidenciasModel.getBySupervisor(id);
      } else if (rol === "tecnico") {
        incidencias = await incidenciasModel.getByTecnico(id);
      }

      res.status(200).json(incidencias);
    } catch (error) {
      next(error);
    }
  }

  // Supervisor actualiza estado
  async actualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, observacionesSupervisor } = req.body;

      const incidencia = await incidenciasModel.update(id, {
        estado,
        observacionesSupervisor,
      });

      if (!incidencia)
        return res.status(404).json({ error: "Incidencia no encontrada" });

      res.status(200).json({
        msg: "Estado actualizado correctamente",
        incidencia,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin elimina incidencia
  async eliminarIncidencia(req, res, next) {
    try {
      const { id } = req.params;
      const eliminada = await incidenciasModel.delete(id);

      if (!eliminada)
        return res.status(404).json({ error: "Incidencia no encontrada" });

      res.status(200).json({ msg: "Incidencia eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

export default new incidenciasController();