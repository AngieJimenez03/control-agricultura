import express from "express";
import lotesController from "../controllers/lotes.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lotes
 *   description: Gestión de lotes
 */

/**
 * @swagger
 * /api/lots:
 *   post:
 *     summary: Crear un nuevo lote
 *     tags: [Lotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Lote A"
 *             descripcion: "Área de mantenimiento"
 *     responses:
 *       201:
 *         description: Lote creado correctamente
 */
router.post("/", verificarToken, verificarRol(["admin"]), lotesController.crearLote);

router.get("/", verificarToken, lotesController.obtenerLotes);
router.get("/:id", verificarToken, lotesController.obtenerLotePorId);
router.put("/:id", verificarToken, verificarRol(["admin"]), lotesController.actualizarLote);
router.delete("/:id", verificarToken, verificarRol(["admin"]), lotesController.eliminarLote);

export default router;
