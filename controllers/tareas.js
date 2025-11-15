//controllers/tareas.js
import mongoose from "mongoose";
import tareasModel from "../models/tareas.js";
import lotesModel from "../models/lotes.js";
import { getIO } from "../realtime/index.js";
import Tarea from "../schemas/tareas.js";

class tareasController {
  // ✅ Crear tarea
  async crearTarea(req, res, next) {
    try {
      const usuario = req.user;
      const data = req.body;

      const lote = await lotesModel.getOneById(data.lote);
      if (!lote) return res.status(404).json({ msg: "Lote no encontrado" });

      if (usuario.rol === "supervisor" && lote.supervisor.email !== usuario.email) {
        return res.status(403).json({ msg: "No puedes crear tareas en lotes que no supervisas" });
      }

      if (!data.tecnicosAsignados || data.tecnicosAsignados.length === 0) {
        return res.status(400).json({ msg: "Debes asignar al menos un técnico" });
      }

      const tecnicos = data.tecnicosAsignados.map((id) => new mongoose.Types.ObjectId(id));

      let fechaLimiteValida = null;
      if (data.fechaLimite) {
        const fecha = new Date(data.fechaLimite);
        if (isNaN(fecha.getTime())) {
          return res.status(400).json({ msg: "Formato de fecha inválido" });
        }
        fechaLimiteValida = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
      }

      const nuevaTareaData = {
        titulo: data.titulo,
        tipo: data.tipo,
        estado: data.estado || "pendiente",
        fechaLimite: fechaLimiteValida,
        lote: lote._id,
        supervisor: lote.supervisor._id,
        creadoPor: usuario._id || usuario.id,
        tecnicosAsignados: tecnicos,
      };

      const nuevaTarea = await tareasModel.create(nuevaTareaData);

      //  Emitir evento por socket
      const io = getIO();
      io.to("admin").emit("tarea_creada", nuevaTarea);
      io.to(`supervisor:${lote.supervisor.email}`).emit("tarea_creada", nuevaTarea);
      io.to(`lote:${lote._id}`).emit("tarea_creada", nuevaTarea);

      nuevaTarea.tecnicosAsignados?.forEach((tecnico) => {
        if (tecnico.email) io.to(`tecnico:${tecnico.email}`).emit("tarea_creada", nuevaTarea);
      });

      res.status(201).json({
        msg: "Tarea creada correctamente",
        tarea: nuevaTarea,
      });
    } catch (e) {
      console.error(" Error creando tarea:", e);
      next(e);
    }
  }

  //  Obtener tareas
  async obtenerTareas(req, res, next) {
    try {
      const usuario = req.user;
      const usuarioId = usuario._id?.toString() || usuario.id?.toString();

      let tareas;
      if (usuario.rol === "admin") {
        tareas = await tareasModel.getAll();
      } else if (usuario.rol === "supervisor") {
        tareas = await tareasModel.getBySupervisor(usuarioId);
      } else if (usuario.rol === "tecnico") {
        tareas = await tareasModel.getByTecnico(usuarioId);
      } else {
        return res.status(403).json({ msg: "Rol no autorizado" });
      }

      res.status(200).json(tareas);
    } catch (e) {
      console.error("Error interno en obtenerTareas:", e);
      res.status(500).json({ error: "Error interno del servidor", message: e.message });
    }
  }

  // Actividades recientes
  async obtenerActividadesRecientes(req, res, next) {
    try {
      const usuario = req.user;
      let tareas = await Tarea.find({})
        .populate("lote supervisor tecnicosAsignados")
        .sort({ updatedAt: -1 })
        .limit(10);

      if (usuario.rol === "supervisor") {
        tareas = tareas.filter((t) => t.supervisor?.email === usuario.email);
      } else if (usuario.rol === "tecnico") {
        tareas = tareas.filter((t) =>
          t.tecnicosAsignados.some((tecnico) => tecnico.email === usuario.email)
        );
      }

      const actividades = tareas.map((t) => ({
        id: t._id,
        titulo: t.titulo,
        lote: t.lote?.nombre || "Lote sin nombre",
        estado: t.estado,
        fecha: t.updatedAt,
      }));

      res.status(200).json(actividades);
    } catch (e) {
      next(e);
    }
  }

  //  Obtener por ID
  async obtenerTareaPorId(req, res, next) {
    try {
      const tarea = await tareasModel.getOneById(req.params.id);
      if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
      res.status(200).json(tarea);
    } catch (e) {
      next(e);
    }
  }
//  Actualizar tarea (admin o supervisor)
async actualizarTarea(req, res, next) {
  try {
    // ✅ Permitir admin y supervisor
    if (!["admin", "supervisor"].includes(req.user.rol)) {
      return res.status(403).json({ msg: "No tienes permisos para actualizar tareas" });
    }

    const data = req.body;

    // 🔹 Validar fecha límite
    if (data.fechaLimite) {
      const fecha = new Date(data.fechaLimite);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({ msg: "Fecha límite inválida" });
      }
      data.fechaLimite = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
    }

    // 🔹 Campos permitidos para actualización
    const camposPermitidos = {
      titulo: data.titulo,
      tipo: data.tipo,
      estado: data.estado,
      tecnicosAsignados: data.tecnicosAsignados,
      fechaLimite: data.fechaLimite || undefined,
    };

    const tareaActualizada = await tareasModel.update(req.params.id, camposPermitidos);
    if (!tareaActualizada) return res.status(404).json({ msg: "Tarea no encontrada" });

    const io = getIO();
    const loteId = tareaActualizada.lote._id.toString();

    // 🔹 Emitir notificación de actualización
    const payload = {
      tareaId: tareaActualizada._id,
      titulo: tareaActualizada.titulo,
      nuevoEstado: tareaActualizada.estado,
      cambiadoPor: req.user.email,
      rol: req.user.rol,
      mensaje: `La tarea "${tareaActualizada.titulo}" fue actualizada.`,
      fecha: new Date().toLocaleTimeString(),
    };

    io.to("admin").emit("tarea_actualizada", payload);
    io.to(`supervisor:${tareaActualizada.supervisor.email}`).emit("tarea_actualizada", payload);
    io.to(`lote:${loteId}`).emit("tarea_actualizada", payload);

    tareaActualizada.tecnicosAsignados?.forEach((tecnico) => {
      if (tecnico.email) io.to(`tecnico:${tecnico.email}`).emit("tarea_actualizada", payload);
    });

    res.status(200).json({
      msg: "Tarea actualizada correctamente",
      tarea: tareaActualizada,
    });
  } catch (e) {
    next(e);
  }
}


  //  Actualizar estado (solo admin y técnico)
  async actualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { nuevoEstado } = req.body;
      const usuario = req.user;

      if (!["admin", "tecnico"].includes(usuario.rol)) {
        return res.status(403).json({ msg: "No tienes permisos para cambiar estado" });
      }

      const tarea = await tareasModel.getOneById(id);
      if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

      if (usuario.rol === "tecnico") {
        const esAsignado = tarea.tecnicosAsignados.some(
          (t) => t._id.toString() === usuario.id.toString()
        );
        if (!esAsignado)
          return res.status(403).json({ msg: "No puedes modificar tareas que no te asignaron" });
      }

      const permitidos = ["pendiente", "en_proceso", "completada"];
      if (!permitidos.includes(nuevoEstado)) {
        return res.status(400).json({ msg: "Estado no válido" });
      }

      tarea.estado = nuevoEstado;
      if (nuevoEstado === "completada") tarea.fechaFin = new Date();
      await tarea.save();

      const io = getIO();
      const loteId = tarea.lote._id.toString();

      const payload = {
        tareaId: tarea._id,
        titulo: tarea.titulo,
        nuevoEstado: tarea.estado,
        cambiadoPor: usuario.email,
        rol: usuario.rol,
        mensaje: `La tarea "${tarea.titulo}" cambió a "${tarea.estado}".`,
        fecha: new Date().toLocaleTimeString(),
      };

      io.to("admin").emit("tarea_actualizada", payload);
      io.to(`supervisor:${tarea.supervisor.email}`).emit("tarea_actualizada", payload);
      io.to(`lote:${loteId}`).emit("tarea_actualizada", payload);

      //  Enviar a cada técnico asignado
      tarea.tecnicosAsignados?.forEach((tecnico) => {
        if (tecnico.email) io.to(`tecnico:${tecnico.email}`).emit("tarea_actualizada", payload);
      });

      res.status(200).json({ msg: "Estado actualizado correctamente", tarea });
    } catch (e) {
      next(e);
    }
  }
   async getAllForAlertas() {
    return await Tarea.find()
      .populate("lote", "nombre ubicacion")
      .populate("supervisor", "nombre email rol")
      .populate("tecnicosAsignados", "nombre email rol");
  }

  // 🗑 Eliminar tarea
  async eliminarTarea(req, res, next) {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ msg: "Solo el administrador puede eliminar tareas" });
      }
      const eliminado = await tareasModel.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ msg: "Tarea no encontrada" });
      res.status(200).json({ msg: "Tarea eliminada correctamente" });
    } catch (e) {
      next(e);
    }
  }
}

export default new tareasController();
