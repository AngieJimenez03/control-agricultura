import express from 'express';
import lotesController from '../controllers/lotes.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Solo admin puede crear y eliminar
router.post('/', verificarToken, verificarRol(['admin']), lotesController.crearLote);
router.delete('/:id', verificarToken, verificarRol(['admin']), lotesController.eliminarLote);

// Admin y supervisor pueden actualizar
router.put('/:id', verificarToken, verificarRol(['admin', 'supervisor']), lotesController.actualizarLote);

// Todos los usuarios autenticados pueden ver
router.get('/', verificarToken, lotesController.obtenerLotes);
router.get('/:id', verificarToken, lotesController.obtenerLotePorId);

export default router;