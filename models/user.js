import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import Usuario from '../schemas/users.js';
import mongoose from "mongoose";

class usuariosModel{
    
async create(user) {
   
    return await Usuario.create(user);
    
  }
  

  async getAll(){
   
    return await Usuario.find();
  }

   async getOneById(id){
    return await Usuario.findById(id)

  }

   async getOne(filtro){
    return await Usuario.findOne(filtro)

  }


  async update(id, user){
    return await Usuario.findByIdAndUpdate(id,user,{new :true});

  }
  async getByRol(rol) {
    return await Usuario.find({ rol });
  }

  async delete(id){
    return await Usuario.findOneAndDelete({_id: new mongoose.Types.ObjectId(id)});
  }


}

export default new usuariosModel

