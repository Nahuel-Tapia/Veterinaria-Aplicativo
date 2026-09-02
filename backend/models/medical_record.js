import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  petUuid: { type: String, required: true },
  vetUuid: { type: String, required: true },
  appointmentUuid: String,
  date: { type: Date, default: Date.now },
  reason: String,
  diagnosis: { type: String, required: true },
  treatment: String,
  prescription: String, // Receta médica / fármacos
  weight: Number, // Peso registrado en la consulta
  vaccinesApplied: [String],
}, { timestamps: true });

export default mongoose.model('medical_records', medicalRecordSchema);
