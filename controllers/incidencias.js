import incidenciasModel from "../models/incidencias.js";
import tareasModel from "../models/tareas.js";
import { getIO } from "../realtime/index.js";

class incidenciasController {
  async crearIncidencia(req, res, next) {
    try {
      const usuario = req.user;
      const { tarea: tareaId, descripcion } = req.body;

      const tarea = await tareasModel.getOneById(tareaId);
      if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

      const esTecnicoAsignado = tarea.tecnicosAsignados.some(
        t => t._id.toString() === usuario.id.toString()
      );
      if (usuario.rol === "tecnico" && !esTecnicoAsignado) {
        return res.status(403).json({
          msg: "No puedes reportar incidencias de tareas que no te pertenecen",
        });
      }

      const data = {
        descripcion,
        tarea: tarea._id,
        lote: tarea.lote._id,
        tecnico: usuario.id,
        supervisor: tarea.supervisor._id,
      };

      const nuevaIncidencia = await incidenciasModel.create(data);

      const io = getIO();
      const loteId = tarea.lote._id.toString();

      // Emitir solo a admin, supervisor y técnicos del lote
      io.to("admin").emit("nueva_incidencia", {
        tipo: "incidencia",
        loteId,
        tareaId: tarea._id,
        descripcion,
        reportadoPor: usuario.email,
        fecha: new Date().toLocaleString(),
        mensaje: `Nueva incidencia en el lote "${tarea.lote.nombre}": ${descripcion}`,
      });

      io.to(`supervisor:${tarea.supervisor.email}`).emit("nueva_incidencia", {
        tipo: "incidencia",
        loteId,
        tareaId: tarea._id,
        descripcion,
        reportadoPor: usuario.email,
        fecha: new Date().toLocaleString(),
        mensaje: `Nueva incidencia en el lote "${tarea.lote.nombre}": ${descripcion}`,
      });

      io.to(`lote:${loteId}`).emit("nueva_incidencia", {
        tipo: "incidencia",
        loteId,
        tareaId: tarea._id,
        descripcion,
        reportadoPor: usuario.email,
        fecha: new Date().toLocaleString(),
        mensaje: `Nueva incidencia en el lote "${tarea.lote.nombre}": ${descripcion}`,
      });

      res.status(201).json({
        msg: "Incidencia registrada correctamente",
        incidencia: nuevaIncidencia,
      });
    } catch (e) {
      next(e);
    }
  }

  async obtenerIncidencias(req, res, next) {
    try {
      const usuario = req.user;
      let incidencias = await incidenciasModel.getAll();

      if (usuario.rol === "admin") {
      } else if (usuario.rol === "supervisor") {
        incidencias = incidencias.filter(i => i.supervisor.email === usuario.email);
      } else if (usuario.rol === "tecnico") {
        incidencias = incidencias.filter(i => i.tecnico.email === usuario.email);
      }

      res.status(200).json(incidencias);
    } catch (e) {
      next(e);
    }
  }

  async obtenerIncidenciaPorId(req, res, next) {
    try {
      const incidencia = await incidenciasModel.getOneById(req.params.id);
      if (!incidencia) return res.status(404).json({ msg: "Incidencia no encontrada" });
      res.status(200).json(incidencia);
    } catch (e) {
      next(e);
    }
  }

  async actualizarIncidencia(req, res, next) {
  try {
    const usuario = req.user;
    const { id } = req.params;
    const { estado, descripcion } = req.body;

    const incidencia = await incidenciasModel.getOneById(id);
    if (!incidencia) return res.status(404).json({ msg: "Incidencia no encontrada" });

    //  Validación de supervisor
    if (usuario.rol === "supervisor" && incidencia.supervisor.email !== usuario.email) {
      return res.status(403).json({ msg: "No puedes modificar incidencias de otros lotes" });
    }

    // 🔹 Actualización flexible
    if (estado) incidencia.estado = estado;
    if (descripcion) incidencia.descripcion = descripcion;

    if (estado === "resuelta") {
      incidencia.fechaResuelta = new Date();
    }

    await incidencia.save();

    const io = getIO();
    io.emit("incidencia_actualizada", {
      id: incidencia._id,
      estado: incidencia.estado,
      descripcion: incidencia.descripcion,
      actualizadoPor: usuario.email,
      fecha: new Date().toLocaleTimeString(),
    });

    res.status(200).json({ msg: "Incidencia actualizada correctamente", incidencia });
  } catch (e) {
    next(e);
  }
}

  async eliminarIncidencia(req, res, next) {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ msg: "Solo el administrador puede eliminar incidencias" });
      }

      const eliminado = await incidenciasModel.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ msg: "Incidencia no encontrada" });

      res.status(200).json({ msg: "Incidencia eliminada correctamente" });
    } catch (e) {
      next(e);
    }
  }
}

export default new incidenciasController();