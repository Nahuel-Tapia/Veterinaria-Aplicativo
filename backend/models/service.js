import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  durationMinutes: { type: Number, default: 30 },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('services', serviceSchema);
