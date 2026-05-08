import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  class: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  feesStatus: {
    type: String,
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid',
  },
  totalFees: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  attendancePercentage: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
