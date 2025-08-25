import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileURL: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryTime: { type: Date, required: true },
  downloadCount: { type: Number, default: 0 },
});

export default mongoose.model('File', FileSchema);
