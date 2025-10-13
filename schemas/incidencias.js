// schemas/incidencias.js
import mongoose from "mongoose";

const incidenciaSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  tarea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tareas",
    required: true
  },
  tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  estado: {
    type: String,
    enum: ["pendiente", "revisada", "resuelta"],
    default: "pendiente"
  },
  observacionesSupervisor: {
    type: String,
    trim: true,
    default: ""
  },
}, { timestamps: true });

export default mongoose.model("incidencias", incidenciaSchema);
