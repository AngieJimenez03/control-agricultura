import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  tipo: {
    type: String,
    enum: ["siembra", "riego", "fertilizacion", "cosecha"],
    required: true
  },
  estado: {
    type: String,
    enum: ["pendiente", "en_progreso", "completada"],
    default: "pendiente"
  },
  fechaInicio: { type: Date, default: Date.now },
  fechaFin: { type: Date },
  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lots",
    required: true
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  tecnicosAsignados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ]
}, { timestamps: true });

export default mongoose.model("tareas", tareaSchema);
