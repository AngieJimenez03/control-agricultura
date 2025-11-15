import express from "express";
import dashboardController from "../controllers/dashboard.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Datos generales del sistema
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener datos del dashboard principal
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del panel general
 *         content:
 *           application/json:
 *             example:
 *               usuariosTotales: 5
 *               incidenciasPendientes: 2
 *               tareasActivas: 3
 */
router.get("/", verificarToken, dashboardController.obtenerDatos);

export default router;
