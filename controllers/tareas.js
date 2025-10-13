import tareasModel from '../models/tareas.js';
import lotesModel from '../models/lotes.js';

class tareasController {
  // Crear tarea (solo admin o supervisor)
  async crearTarea(req, res, next) {
    try {
      const { titulo, tipo, lote, tecnicosAsignados, fechaFin, supervisor } = req.body;

      // Verificar existencia del lote
      const loteExiste = await lotesModel.getOneById(lote);
      if (!loteExiste) {
        return res.status(400).json({ error: "El lote especificado no existe." });
      }

      let supervisorAsignado;

      // Si el rol es ADMIN puede asignar a cualquiera (usa el supervisor del body)
      if (req.user.rol === "admin") {
        if (!supervisor) {
          return res.status(400).json({ error: "Debe especificar un supervisor al crear la tarea." });
        }
        supervisorAsignado = supervisor;
      }

      // // Si el rol es SUPERVISOR, se asigna a sí mismo (aunque se mande otro supervisor, se ignora)
      // else if (req.user.rol === "supervisor") {
      //   supervisorAsignado = req.user.id; 
      // }

      // Técnicos no pueden crear
      else {
        return res.status(403).json({ error: "No tiene permisos para crear tareas." });
      }

      const nuevaTarea = await tareasModel.create({
        titulo,
        tipo,
        lote,
        supervisor: supervisorAsignado,
        tecnicosAsignados,
        fechaFin
      });
      

      res.status(201).json({ msg: " Tarea creada correctamente", tarea: nuevaTarea });

    } catch (error) {
      next(error);
    }
  }
// Obtener tareas según el rol
  async obtenerTareas(req, res, next) {
    try {
      let tareas;

      if (req.user.rol === "admin" || req.user.rol === "supervisor") {
        // Admin y supervisor ven todas las tareas
        tareas = await tareasModel.getAll();
      } else {
        // Técnicos solo las asignadas
        tareas = await tareasModel.getByTecnico(req.user.id);
      }

      res.status(200).json(tareas);
    } catch (error) {
      next(error);
    }
  }

  //  Obtener una tarea por ID
  async obtenerTareaPorId(req, res, next) {
    try {
      const { id } = req.params;
      const tarea = await tareasModel.getOneById(id);
      if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

      res.status(200).json(tarea);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar estado o descripción de una tarea
  async actualizarTarea(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, descripcion } = req.body;

      const tarea = await tareasModel.getOneById(id);
      if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

      // Actualizar descripción o estado
      if (descripcion) tarea.descripcion = descripcion;
      if (estado) {
        tarea.estado = estado;

        // Si la tarea se marca como completada → guardar fecha fin
        if (estado === "completada") {
          tarea.fechaFin = new Date();
        }
      }

      const tareaActualizada = await tarea.save();

      res.status(200).json({
        msg: "Tarea actualizada correctamente",
        tarea: tareaActualizada,
      });
    } catch (error) {
      next(error);
    }
  }

  //  Eliminar tarea
  async eliminarTarea(req, res, next) {
    try {
      const { id } = req.params;
      const eliminado = await tareasModel.delete(id);
      if (!eliminado) return res.status(404).json({ msg: "Tarea no encontrada" });

      res.status(200).json({ msg: "Tarea eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

export default new tareasController();