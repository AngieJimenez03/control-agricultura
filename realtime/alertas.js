
import tareasModel from "../models/tareas.js";
import { getIO } from "./index.js";

export default function iniciarMonitorDeAlertas() {
  console.log("Monitor de alertas automáticas activado...");

  // Revisión cada 60 segundos
  setInterval(async () => {
    try {
      const io = getIO();
      const tareas = await tareasModel.getAll();

      const ahora = new Date();

      for (const tarea of tareas) {
        if (
          tarea.estado !== "completada" &&
          tarea.estado !== "cancelada" &&
          tarea.fechaLimite &&
          new Date(tarea.fechaLimite) < ahora
        ) {
          // Si no estaba marcada como retrasada, actualizamos
          if (tarea.estado !== "retrasada") {
            tarea.estado = "retrasada";
            await tarea.save();

            // Enviar alerta en tiempo real
            io.emit("alerta_tarea_retrasada", {
              tipo: "tarea_retrasada",
              tareaId: tarea._id,
              lote: tarea.lote?.nombre || "Sin nombre",
              titulo: tarea.titulo,
              mensaje: ` La tarea "${tarea.titulo}" del lote "${tarea.lote?.nombre}" está retrasada.`,
              fecha: new Date().toLocaleString(),
            });

            console.log(
              ` Alerta: Tarea "${tarea.titulo}" marcada como retrasada (${tarea.lote?.nombre})`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar tareas retrasadas:", error.message);
    }
  }, 60000); // cada 1 minuto
}
