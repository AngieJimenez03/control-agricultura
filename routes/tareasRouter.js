import express from "express";
import tareasController from "../controllers/tareas.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();


router.post("/", verificarToken, verificarRol(["admin"]), tareasController.crearTarea);


router.get("/", verificarToken, tareasController.obtenerTareas);


router.get("/:id", verificarToken, tareasController.obtenerTareaPorId);

router.put("/:id", verificarToken, verificarRol(["admin", "supervisor"]), tareasController.actualizarTarea);


router.delete("/:id", verificarToken, verificarRol(["admin"]), tareasController.eliminarTarea);

export default router;
