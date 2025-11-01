import jwt from "jsonwebtoken";
import usuariosModel from "../models/user.js";

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token no proporcionado" });

    // ✅ Verificar token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    // ✅ Buscar usuario en la BD
    const usuario = await usuariosModel.getOneById(decoded.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Guardar usuario en la request
    req.user = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    next();
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
