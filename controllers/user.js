import usuariosModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generarToken } from '../helpers/autenticacion.js';

class usuariosControllers {

  async register(req, res, next){
      
    try {
       
      const {nombre, email, telefono, clave} = req.body;
      const existe = await usuariosModel.getOne({email});
      if(existe) return res.status(400).json({error:"Usuario ya existe"});

      const claveHash = await bcrypt.hash(clave, 10);
      const data = await usuariosModel.create({nombre, email, telefono, clave: claveHash});
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

      const token = generarToken(email);
      res.status(200).json({msg:"Usuario autenticado", token});
    } catch(e){ next(e); }
  }
}

export default new usuariosControllers();