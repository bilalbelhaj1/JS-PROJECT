import mongoose from "mongoose";

const PassedExamSchema = new mongoose.Schema({
    title: String,
    accessToken: String,
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    score: Number,
    location: {
        latitude: Number,
        longitude: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('PassedExam', PassedExamSchema);

