import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lots",
    required: true
  },
  emisor: {
    type: String, // Guardamos el email del usuario
    required: true
  },
  rol: {
    type: String,
    enum: ["admin", "supervisor", "tecnico"],
    required: true
  },
  texto: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("mensajes", mensajeSchema);
