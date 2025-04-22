import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    enonce:String,
    type:String,
    time:Number,
    score:Number,
    tolerance:Number,
    answer:String,
    options:[String],

});

const examSchema = new mongoose.Schema({
    teacher_id:String,
    title: String,
    description: String,
    group: String,
    duration: Number,
    status:{
        type:String,
        default: 'active',
    },
    accesToken:String,
    questions:[questionSchema],
});

export default mongoose.model('Exam',examSchema);