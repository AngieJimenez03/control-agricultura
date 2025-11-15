import express from "express";
import mensajesController from "../controllers/mensajes.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mensajes
 *   description: Comunicación entre técnicos y supervisores
 */

/**
 * @swagger
 * /api/messages/{loteId}:
 *   get:
 *     summary: Obtener mensajes de un lote
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: loteId
 *         in: path
 *         required: true
 *         description: ID del lote
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */
router.get("/:loteId", verificarToken, mensajesController.getMensajesPorLote);
router.get("/", verificarToken, mensajesController.getUltimosMensajes);
router.delete("/:loteId", verificarToken, mensajesController.eliminarMensajes);

export default router;
