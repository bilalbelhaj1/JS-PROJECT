import mongoose from "mongoose";

const passedExamSchema = mongoose.Schema({
    title: String,
    accessToken: String,
    studentId: mongoose.Schema.Types.ObjectId,
    score: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('PassedExam', passedExamSchema);

