export function errorHandler(err, req, res, next){
  console.error(" Error:", err.message);
  res.status(500).json({error: "Error interno del servidor", message: err.message});
}