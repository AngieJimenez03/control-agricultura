


import express from 'express';
import userController from '../controllers/user.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Ruta protegida de ejemplo (canal)
router.get('/canal', verificarToken, (req,res)=>{
  res.json({msg: `Bienvenido al canal ${req.user.email}`});
});

export default router;