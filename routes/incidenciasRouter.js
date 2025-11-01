import express from "express";
import incidenciasController from "../controllers/incidencias.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Crear incidencia (técnico o admin)
router.post("/", verificarToken, verificarRol(["tecnico", "admin"]), incidenciasController.crearIncidencia);

// Ver incidencias (todos los roles)
router.get("/", verificarToken, incidenciasController.obtenerIncidencias);
router.get("/:id", verificarToken, incidenciasController.obtenerIncidenciaPorId);

// Actualizar estado (supervisor o admin)
router.put("/:id", verificarToken, verificarRol(["supervisor", "admin"]), incidenciasController.actualizarIncidencia);

// Eliminar incidencia (solo admin)
router.delete("/:id", verificarToken, verificarRol(["admin"]), incidenciasController.eliminarIncidencia);

export default router;
