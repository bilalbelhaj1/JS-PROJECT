import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  enonce: { type: String, required: true },
  type: {
    type: String,
    required: true,
  },
  time: Number,
  score: Number,
  tolerance: Number,
  answer: String,
  options: [String],
});

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
  },
  accessToken: String,
  questions: [questionSchema],
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);