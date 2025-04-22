import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  enonce: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['direct', 'qcm'] // Ensures only these two types are allowed
  },
  time: Number,
  score: Number,
  tolerance: Number,
  options: [{
    option: { type: String, required: true },
    correct: { type: Boolean, required: true, default: false }
  }]
}, { _id: false }); // _id: false prevents automatic _id creation for subdocuments

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