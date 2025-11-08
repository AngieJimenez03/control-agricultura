import express from "express";
import mensajesController from "../controllers/mensajes.js";
import { verificarToken } from "../middlewares/authMiddleware.js"; // usa tu mismo middleware de auth

const router = express.Router();

// Obtener historial de mensajes por lote
router.get("/:loteId", verificarToken, mensajesController.getMensajesPorLote);

// Obtener el último mensaje de cada lote (panel de chats)
router.get("/", verificarToken, mensajesController.getUltimosMensajes);

// Eliminar mensajes de un lote
router.delete("/:loteId", verificarToken, mensajesController.eliminarMensajes);

export default router;
