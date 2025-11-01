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
  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lots",
    required: true
  },

  tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  estado: {
    type: String,
    enum: ["pendiente", "en_revision", "resuelta"],
    default: "pendiente"
  },

  fechaResuelta: {
    type: Date,
    default: null
  }

}, { timestamps: true });

export default mongoose.model("incidencias", incidenciaSchema);

