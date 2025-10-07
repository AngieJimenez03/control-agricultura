export function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    const { rol } = req.user;
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: no tiene permisos suficientes" });
    }
    next();
  };
}