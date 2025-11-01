import usuariosModel from "../models/user.js";
import lotesModel from "../models/lotes.js";
import tareasModel from "../models/tareas.js";
import incidenciasModel from "../models/incidencias.js";

class DashboardController {
  async obtenerDatos(req, res, next) {
    try {
      const { rol, id } = req.user;
      let resumen = {};

      // ============================================================
      // 🔹 ADMINISTRADOR
      // ============================================================
      if (rol === "admin") {
        const [usuarios, lotes, tareas, incidencias] = await Promise.all([
          usuariosModel.getAll(),
          lotesModel.getAll(),
          tareasModel.getAll(),
          incidenciasModel.getAll(),
        ]);

        resumen = {
          cards: {
            totalLotes: lotes.length,
            tareasPendientes: tareas.filter(t => t.estado === "pendiente").length,
            usuariosActivos: usuarios.length,
            totalIncidencias: incidencias.length,
          },
          estadoSistema: {
            tareasCompletadas: tareas.filter(t => t.estado === "completada").length,
            tareasPendientes: tareas.filter(t => t.estado === "pendiente").length,
          },
          ultimasIncidencias: incidencias
            .sort((a, b) => new Date(b.fechaReporte || b.createdAt) - new Date(a.fechaReporte || a.createdAt))
            .slice(0, 5)
            .map(i => ({
              id: i._id,
              titulo: i.descripcion || "Incidencia sin título",
              lote: i.lote?.nombre || "Sin lote asignado",
              estado: i.estado || "Desconocido",
              responsable: i.tecnico?.nombre || i.supervisor?.nombre || "No asignado",
              fecha: i.fechaReporte || i.createdAt,
            })),
        };
      }

      // ============================================================
      // 🔹 SUPERVISOR
      // ============================================================
      if (rol === "supervisor") {
        const [lotes, tareas, incidencias] = await Promise.all([
          lotesModel.getBySupervisor(id),
          tareasModel.getBySupervisor(id),
          incidenciasModel.getBySupervisor(id),
        ]);

        resumen = {
          cards: {
            lotesSupervisados: lotes.length,
            tareasEnProceso: tareas.filter(t => t.estado === "en_proceso").length,
            tareasCompletadas: tareas.filter(t => t.estado === "completada").length,
            incidenciasRecibidas: incidencias.length,
          },
          procesosActivos: tareas
            // 👇 solo tareas activas (NO completadas)
            .filter(t => ["pendiente", "en_proceso", "retrasada"].includes(t.estado))
            .map(t => ({
              id: t._id,
              nombre: t.titulo,
              lote: t.lote?.nombre || "No asignado",
              estado: t.estado,
              progress:
                t.estado === "pendiente"
                  ? 0
                  : t.estado === "retrasada"
                  ? 30
                  : t.estado === "en_proceso"
                  ? 60
                  : 0,
            })),
          actividadReciente: [
            ...incidencias.slice(-3).map(i => ({
              tipo: "Incidencia",
              titulo: i.descripcion || "Incidencia sin título",
              lote: i.lote?.nombre || "Sin lote",
              fecha: i.fechaReporte || i.createdAt,
            })),
            ...tareas.slice(-3).map(t => ({
              tipo: "Tarea",
              titulo: `Tarea ${t.titulo} actualizada`,
              fecha: t.fecha || t.createdAt,
            })),
          ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
        };
      }

      // ============================================================
      // 🔹 TÉCNICO
      // ============================================================
      if (rol === "tecnico") {
        const [tareas, incidencias] = await Promise.all([
          tareasModel.getByTecnico(id),
          incidenciasModel.getByTecnico(id),
        ]);

        resumen = {
          cards: {
            tareasAsignadas: tareas.length,
            tareasCompletadas: tareas.filter(t => t.estado === "completada").length,
            incidenciasReportadas: incidencias.length,
          },
          procesosActivos: tareas
            .filter(t => ["pendiente", "en_proceso", "retrasada", "completada"].includes(t.estado))
            .map(t => ({
              id: t._id,
              nombre: t.titulo,
              lote: t.lote?.nombre || "No asignado",
              estado: t.estado,
              progress:
                t.estado === "pendiente"
                  ? 0
                  : t.estado === "retrasada"
                  ? 30
                  : t.estado === "en_proceso"
                  ? 60
                  : t.estado === "completada"
                  ? 100
                  : 0,
            })),
          actividadReciente: [
            ...tareas.slice(-3).map(t => ({
              tipo: "Tarea",
              titulo: `Actualización en tarea: ${t.titulo}`,
              fecha: t.fecha || t.createdAt,
            })),
            ...incidencias.slice(-3).map(i => ({
              tipo: "Incidencia",
              titulo: i.descripcion || "Incidencia sin título",
              lote: i.lote?.nombre || "Sin lote",
              fecha: i.fechaReporte || i.createdAt,
            })),
          ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
        };
      }

      // ============================================================
      // RESPUESTA FINAL
      // ============================================================
      res.status(200).json({
        msg: " Datos del dashboard generados correctamente",
        resumen,
      });
    } catch (error) {
      console.error(" Error en obtenerDatos:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        message: error.message,
      });
      next(error);
    }
  }
}

export default new DashboardController();

