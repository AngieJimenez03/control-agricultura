import express from "express";
import tareasController from "../controllers/tareas.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Crear tarea (admin o supervisor)
router.post("/", verificarToken, verificarRol(["admin", "supervisor"]), tareasController.crearTarea);

// Obtener tareas
router.get("/", verificarToken, tareasController.obtenerTareas);
router.get("/actividades", verificarToken, tareasController.obtenerActividadesRecientes);
router.get("/:id", verificarToken, tareasController.obtenerTareaPorId);

// Actualizar tarea (solo admin)
router.put("/:id", verificarToken, verificarRol(["admin","supervisor"]), tareasController.actualizarTarea);

// Cambiar estado (técnico o admin)
router.put("/:id/estado", verificarToken, tareasController.actualizarEstado);

// Eliminar tarea (solo admin)
router.delete("/:id", verificarToken, verificarRol(["admin"]), tareasController.eliminarTarea);

export default router;
