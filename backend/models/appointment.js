import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  clientUuid: { type: String, required: true },
  petUuid: { type: String, required: true },
  vetUuid: String, // Opcional o asignado posteriormente
  serviceUuid: { type: String, required: true },
  date: { type: Date, required: true }, // Fecha y hora del turno
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  reason: String,
  notes: String,
}, { timestamps: true });

export default mongoose.model('appointments', appointmentSchema);
