

import mongoose from 'mongoose';

const usuariosSchema = new mongoose.Schema({
 nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  telefono: { type: String },
  clave: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'supervisor', 'tecnico'], default: 'tecnico' }
},{timestamps:true});

export default mongoose.model('users', usuariosSchema);