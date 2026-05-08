import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Usually a teacher or admin
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
