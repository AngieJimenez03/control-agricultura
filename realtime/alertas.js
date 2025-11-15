// src/realtime/alertas.js
import tareasModel from "../models/tareas.js";
import { getIO } from "./index.js";

export default function iniciarMonitorDeAlertas() {
  console.log(" Monitor de alertas automáticas activado...");

  setInterval(async () => {
    try {
      const io = getIO();
      const tareas = await tareasModel.getAllForAlertas();
      const ahora = new Date();

      for (const tarea of tareas) {
        if (
          tarea.estado !== "completada" &&
          tarea.estado !== "cancelada" &&
          tarea.fechaLimite &&
          new Date(tarea.fechaLimite) < ahora
        ) {
          if (tarea.estado !== "retrasada") {
            tarea.estado = "retrasada";

            if (typeof tarea.save === "function") {
              await tarea.save();
            }

            const alerta = {
              tipo: "tarea_retrasada",
              tareaId: tarea._id,
              loteId: tarea.lote?._id,
              lote: tarea.lote?.nombre || "Sin nombre",
              titulo: tarea.titulo,
              mensaje: `La tarea "${tarea.titulo}" del lote "${tarea.lote?.nombre}" está retrasada.`,
              fecha: new Date().toISOString(),
            };

            //  Solo a los canales necesarios
            io.to("admin").emit("alerta_tarea_retrasada", alerta);

            if (tarea.supervisor?.email) {
              io.to(`supervisor:${tarea.supervisor.email}`).emit(
                "alerta_tarea_retrasada",
                alerta
              );
            }

            if (Array.isArray(tarea.tecnicosAsignados)) {
              tarea.tecnicosAsignados.forEach((tec) => {
                if (tec?.email) {
                  io.to(`tecnico:${tec.email}`).emit(
                    "alerta_tarea_retrasada",
                    alerta
                  );
                }
              });
            }

            console.log(
              ` Alerta: "${tarea.titulo}" retrasada (${tarea.lote?.nombre})`
            );
          }
        }
      }
    } catch (error) {
      console.error(" Error al verificar tareas retrasadas:", error.message);
    }
  }, 60000);
}
