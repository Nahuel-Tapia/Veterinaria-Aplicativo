import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uuid: String,
  username: String,
  hashedPassword: String,
  fullName: String,
  roles: Array,
  email: String,
  phone: String,
  address: String,
  dni: String,
}, { timestamps: true });

export default mongoose.model('users', userSchema);
