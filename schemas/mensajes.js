import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lots",
    required: true
  },
  emisor: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["admin", "supervisor", "tecnico"],
    required: true
  },
  texto: {
    type: String,
    trim: true
  },
  imagen: {
    type: String, // URL o base64
    default: null
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("mensajes", mensajeSchema);
