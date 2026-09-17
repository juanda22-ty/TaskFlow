import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true },
  categoria: { 
    type: String, 
    required: true, 
    // Exactamente las 5 categorías requeridas
    enum: ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'] 
  },
  prioridad: { 
    type: String, 
    required: true, 
    enum: ['Baja', 'Media', 'Alta'], 
    default: 'Media' 
  },
  estado: { 
    type: String, 
    // Exactamente los 5 estados del ciclo de vida
    enum: ['PENDIENTE', 'EN COLA', 'PROCESANDO', 'RESPONDIDA', 'ERROR'], 
    default: 'PENDIENTE' 
  },
  respuesta: { type: String, default: null },
  mensajeError: { type: String, default: null },
  fechaCreacion: { type: Date, default: Date.now },
  fechaProcesamiento: { type: Date, default: null }
});

export default mongoose.model('Request', requestSchema);