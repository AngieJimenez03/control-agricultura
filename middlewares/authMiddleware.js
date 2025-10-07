import jwt from "jsonwebtoken";

export function verificarToken(req, res, next){
  const token = req.headers["authorization"]?.split(" ")[1];;
  if(!token) return res.status(401).json({error: "Token requerido"});

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = decoded; // pasamos info al request
    next(); // continuar con la ruta
  } catch (err) {
    return res.status(401).json({error: "Token inválido o expirado"});
  }
}