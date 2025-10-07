import usuariosModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generarToken } from '../helpers/autenticacion.js';

class usuariosControllers {

  async register(req, res, next){
      
    try {
       
      const {nombre, email, telefono, clave, rol} = req.body;
      const existe = await usuariosModel.getOne({email});
      if(existe) return res.status(400).json({error:"Usuario ya existe"});

      const claveHash = await bcrypt.hash(clave, 10);
      const data = await usuariosModel.create({nombre, email, telefono, clave: claveHash, rol: rol || 'tecnico'});
      res.status(201).json(data);
    } catch(e){ next(e); }
  }

  async login(req, res, next){
    try {
      const {email, clave} = req.body;

      const usuario = await usuariosModel.getOne({email});
      if(!usuario) return res.status(400).json({error:"Usuario no existe"});

      const valido = await bcrypt.compare(clave, usuario.clave);
      if(!valido) return res.status(400).json({error:"Contraseña incorrecta"});

      const token = generarToken(usuario);
      res.status(200).json({msg:"Usuario autenticado", token, rol: usuario.rol
        
      });
    } catch(e){ next(e); }
  }
  
  //  Obtener todos los usuarios (solo admin)
  async getAll(req, res, next) {
    try {
      const usuarios = await usuariosModel.getAll();
      res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  //  Obtener usuario por ID 
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await usuariosModel.getOneById(id);

      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  // ✅ Actualizar usuario (solo admin)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, email, telefono, clave, rol } = req.body;

      // Validación de campos permitidos 
      const dataUpdate = { nombre, email, telefono, rol };
      if (clave) dataUpdate.clave = await bcrypt.hash(clave, 10);

      const usuarioActualizado = await usuariosModel.update(id, dataUpdate);

      if (!usuarioActualizado)
        return res.status(404).json({ error: "Usuario no encontrado" });

      usuarioActualizado.clave = undefined;

      res.status(200).json({
        msg: "Usuario actualizado correctamente",
        usuario: usuarioActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  //  Eliminar usuario 
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const eliminado = await usuariosModel.delete(id);

      if (!eliminado)
        return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }

}

export default new usuariosControllers();