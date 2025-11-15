import express from "express";
import incidenciasController from "../controllers/incidencias.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Incidencias
 *   description: Gestión de incidencias del sistema
 */

/**
 * @swagger
 * /api/incidents:
 *   post:
 *     summary: Crear una nueva incidencia
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: "Fallo en servidor"
 *             descripcion: "Error de red en planta 2"
 *             prioridad: "alta"
 *     responses:
 *       201:
 *         description: Incidencia creada correctamente
 */
router.post("/", verificarToken, verificarRol(["tecnico", "admin"]), incidenciasController.crearIncidencia);

/**
 * @swagger
 * /api/incidents:
 *   get:
 *     summary: Obtener todas las incidencias
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de incidencias
 */
router.get("/", verificarToken, incidenciasController.obtenerIncidencias);

router.get("/:id", verificarToken, incidenciasController.obtenerIncidenciaPorId);
router.put("/:id", verificarToken, verificarRol(["supervisor", "admin"]), incidenciasController.actualizarIncidencia);
router.delete("/:id", verificarToken, verificarRol(["admin"]), incidenciasController.eliminarIncidencia);

export default router;
