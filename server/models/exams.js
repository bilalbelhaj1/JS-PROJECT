import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  enonce: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['direct', 'qcm']
  },
  time: Number,
  score: Number,
  tolerance: Number,
  answer: String,
  options: [{
    option: { type: String, required: true },
    correct: { type: Boolean, required: true, default: false }
  }],
  media: {
    type: {
      fileType: String,
      fileName: String,
      filePath: String
    },
    default: null
  }
}, 

{ _id: false });

const examSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  title: { type: String, required: true },
  description: String,
  group: { type: String, required: true },
  duration: Number,
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'draft']
  },
  accessToken: String,
  questions: [questionSchema],
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);