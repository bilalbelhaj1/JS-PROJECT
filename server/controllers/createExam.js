import Exam from '../models/exams.js'

const createExam = async (req,res)=>{
    const recievedExam = req.body;
    const userId = req.user.userId;
    const accessToken = Date.now() + userId;
    const examToSave = {
        ...recievedExam,
        teacher_id: userId,
        accessToken,
    }
    console.log(examToSave);
    try{
        const exam = new Exam(examToSave);
        await exam.save();
        console.log(accessToken);
        res.status(201).json({
            accessToken
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

export default createExam;