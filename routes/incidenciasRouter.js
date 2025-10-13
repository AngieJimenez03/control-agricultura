import express from "express";
import incidenciasController from "../controllers/incidencias.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Técnicos → crean incidencias
router.post("/", verificarToken, verificarRol(["tecnico"]), incidenciasController.crearIncidencia);

// Todos → pueden ver incidencias (según rol)
router.get("/", verificarToken, incidenciasController.obtenerIncidencias);

// Supervisores → actualizan estado
router.put("/:id", verificarToken, verificarRol(["supervisor"]), incidenciasController.actualizarEstado);

// Admin → elimina incidencias
router.delete("/:id", verificarToken, verificarRol(["admin"]), incidenciasController.eliminarIncidencia);

export default router;
