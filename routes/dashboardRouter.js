import express from "express";
import dashboardController from "../controllers/dashboard.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Dashboard principal (solo para usuarios autenticados)
router.get("/", verificarToken, dashboardController.obtenerDatos);

export default router;

