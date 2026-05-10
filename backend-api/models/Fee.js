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
    enum: ['Cash', 'Online', 'Card', 'UPI', 'Check'],
    required: true,
  },
  transactionId: {
    type: String,
    required: false,
  },
  month: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Paid',
  },
  remarks: {
    type: String,
    default: '',
  },
});

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
