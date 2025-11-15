import express from "express";
import userController from "../controllers/user.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints de gestión de usuarios
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Laura Pérez"
 *             email: "laura@example.com"
 *             clave: "123456"
 *             rol: "tecnico"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "laura@example.com"
 *             clave: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post("/login", userController.login);

router.get("/perfil", verificarToken, (req, res) => {
  res.json({ msg: `Bienvenido ${req.user.email}`, rol: req.user.rol });
});

router.get("/", verificarToken, verificarRol(["admin"]), userController.getAll);
router.get("/:id", verificarToken, verificarRol(["admin"]), userController.getById);
router.put("/:id", verificarToken, verificarRol(["admin"]), userController.update);
router.delete("/:id", verificarToken, verificarRol(["admin"]), userController.delete);
router.put("/:id/rol", verificarToken, verificarRol(["admin"]), userController.cambiarRol);
router.get("/rol/:rol", verificarToken, verificarRol(["admin", "supervisor"]), userController.getByRol);

export default router;
