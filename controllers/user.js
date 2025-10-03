import usuariosModel from '../models/user.js'
import bcrypt from 'bcryptjs'
import JsonWebToken from 'jsonwebtoken';
import { generarToken } from '../helpers/autenticacion.js';


class usuariosControllers {

     constructor(){

     }

     async register (req,res){
     try { 
      const {email, nombre, telefono, clave } = req.body;
      const usuarioExiste = await usuariosModel.getOne({email})
      if(usuarioExiste){
        return res.status(400).json({error: 'El usuario ya existe'})
      }
      
     const claveEncryptada = await bcrypt.hash(clave,10);

       const data = await usuariosModel.create({
        email,
        nombre,
        telefono,
        clave: claveEncryptada
      });

      res.status(200).json(data);
     
        } catch (e) {
          console.log(e)
            res.status(500).send(e);
                      
                  }
      

     }

      async login (req,res){
      const {email,clave}=  req.body;

       const usuarioExiste = await usuariosModel.getOne({email})
      if(!usuarioExiste){
        return res.status(400).json({error: 'El usuario no existe'})
      }

    const claveValida= await bcrypt.compare(clave, usuarioExiste.clave);

    if(!claveValida){
        return res.status(400).json({error: 'contraseña incorrecta'})
      }

       const token = generarToken(email);

      return res.status(200).json({msg:'Usuario Autenticado', token});
    }
      

      

     }


export default new usuariosControllers();