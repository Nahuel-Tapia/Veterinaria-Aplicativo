import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  ownerUuid: { type: String, required: true },
  name: { type: String, required: true },
  species: { type: String, required: true }, // 'perro', 'gato', 'ave', 'exotico', etc.
  breed: String,
  birthDate: String,
  gender: String, // 'macho', 'hembra'
  weight: Number, // en kg
  neutered: Boolean,
  microchip: String,
  photoUrl: String,
  notes: String,
}, { timestamps: true });

export default mongoose.model('pets', petSchema);
