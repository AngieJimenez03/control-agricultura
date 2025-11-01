import mongoose from "mongoose";

// Función de validación para que haya al menos un técnico

const tareaSchema = new mongoose.Schema({
  //  Información básica
  titulo: { 
    type: String, 
    required: true, 
    trim: true 
  },

  tipo: { 
    type: String, 
    enum: ["riego", "fertilizacion", "cosecha"], 
    required: true 
  },

  //  Estado de la tarea
  estado: { 
    type: String, 
    enum: ["pendiente", "en_proceso", "completada", "retrasada"], 
    default: "pendiente" 
  },

  // Fechas de control
  fechaInicio: { 
    type: Date, 
    default: Date.now  // se asigna automáticamente
  },

  fechaFin: { 
    type: Date, 
    default: null      // se asigna cuando se completa
  },

  fechaLimite: { 
    type: Date, 
    required: true     // el creador define hasta cuándo debe completarse
  },


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

tecnicosAsignados: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
      required: [true, "Debes asignar al menos un técnico"],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "Debes asignar al menos un técnico",
      },
    },
  
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("tareas", tareaSchema);

