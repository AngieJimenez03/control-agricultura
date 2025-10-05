

import mongoose from 'mongoose';

const usuariosSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  telefono: { type: String },
  clave: { type: String, required: true }
},{timestamps:true});

export default mongoose.model('users', usuariosSchema);