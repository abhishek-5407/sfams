import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online', 'Card', 'UPI'],
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
});

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
