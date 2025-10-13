


import express from 'express';
import userController from '../controllers/user.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/roleMiddleware.js';
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);



// Rutas protegidas
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ msg: `Bienvenido ${req.user.email}`, rol: req.user.rol });
});

// Solo para admin
router.get("/", verificarToken, verificarRol(["admin"]), userController.getAll);
router.get("/:id", verificarToken, verificarRol(["admin"]), userController.getById);
router.put("/:id", verificarToken, verificarRol(["admin"]), userController.update);
router.delete("/:id", verificarToken, verificarRol(["admin"]), userController.delete);
router.put('/:id/rol', verificarToken, verificarRol(['admin']), userController.cambiarRol);

// Ruta protegida de ejemplo (canal)
router.get('/canal', verificarToken, (req,res)=>{
  res.json({msg: `Bienvenido al canal ${req.user.email}`});
});

export default router;