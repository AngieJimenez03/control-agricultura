import mongoose from "mongoose";

const loteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  ubicacion: {
    type: String,
    required: true,
    trim: true
  },
  cultivo: {
    type: String,
    trim: true,
    default: "" // puede no tener cultivo activo
  },
  estado: {
    type: String,
    enum: ["activo", "inactivo", "en_proceso"],
    default: "activo"
  },
  fechaSiembra: {
    type: Date,
    default: null
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null
  },
  creadoPor: {
    type: String, // email del admin que creó el lote
    required: true
  }
}, { timestamps: true });

export default mongoose.model("lots", loteSchema);
