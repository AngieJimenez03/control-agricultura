import lotesModel from '../models/lotes.js';
import tareasModel from '../models/tareas.js';

class lotesController {

  //  Crear lote (solo admin)
  async crearLote(req, res, next) {
    try {
      const data = req.body;
      data.creadoPor = req.user.email; // quién lo crea (admin)
      const nuevoLote = await lotesModel.create(data);
      res.status(201).json({ msg: " Lote creado correctamente", lote: nuevoLote });
    } catch (e) {
      next(e);
    }
  }

  
  //  Obtener todos los lotes (según el rol del usuario)
  
async obtenerLotes(req, res, next) {
  try {
    const usuario = req.user;
    let lotes = [];

    if (usuario.rol === "admin") {
      lotes = await lotesModel.getAll();
    } else if (usuario.rol === "supervisor") {
      lotes = (await lotesModel.getAll()).filter(
        (l) => l.supervisor?.email === usuario.email
      );
    } else if (usuario.rol === "tecnico") {
      const tecnicoId = usuario._id || usuario.id;
      const tareas = await tareasModel.getByTecnico(tecnicoId);

      const lotesMap = new Map();
      tareas.forEach((t) => {
        if (t.lote?._id) {
          lotesMap.set(t.lote._id.toString(), t.lote);
        }
      });
      lotes = Array.from(lotesMap.values());
    }

    // 🔹 Convertir cada lote a objeto plano + contar tareas
    const lotesConTareas = await Promise.all(
      lotes.map(async (l) => {
        const lotePlano = l.toObject ? l.toObject() : l; // 👈 CORRECCIÓN CLAVE
        const tareas = await tareasModel.getByLote(l._id);
        return {
          ...lotePlano,
          totalTareas: tareas.length,
        };
      })
    );

    res.status(200).json(lotesConTareas);
  } catch (e) {
    console.error("Error en obtenerLotes:", e);
    next(e);
  }
}

  //  Obtener un lote por ID (accesible para todos los roles autenticados)
  async obtenerLotePorId(req, res, next) {
    try {
      const { id } = req.params;
      const lote = await lotesModel.getOneById(id);
      if (!lote) return res.status(404).json({ msg: " Lote no encontrado" });
      res.status(200).json(lote);
    } catch (e) {
      next(e);
    }
  }

  //  Actualizar un lote (solo admin)
  async actualizarLote(req, res, next) {
    try {
      const usuario = req.user;
      if (usuario.rol !== "admin") {
        return res.status(403).json({ msg: " Solo el administrador puede modificar lotes" });
      }

      const { id } = req.params;
      const data = req.body;

      const loteActualizado = await lotesModel.update(id, data);
      if (!loteActualizado)
        return res.status(404).json({ msg: " Lote no encontrado" });

      res.status(200).json({
        msg: " Lote actualizado correctamente",
        lote: loteActualizado
      });
    } catch (e) {
      next(e);
    }
  }

  //  Eliminar lote (solo admin)
  async eliminarLote(req, res, next) {
    try {
      const usuario = req.user;
      if (usuario.rol !== "admin") {
        return res.status(403).json({ msg: " Solo el administrador puede eliminar lotes" });
      }

      const { id } = req.params;
      const eliminado = await lotesModel.delete(id);
      if (!eliminado)
        return res.status(404).json({ msg: " Lote no encontrado" });

      res.status(200).json({ msg: "Lote eliminado correctamente" });
    } catch (e) {
      next(e);
    }
  }
}

export default new lotesController();
