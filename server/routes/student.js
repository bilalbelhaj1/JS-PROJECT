import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleWare.js";
import Exam from '../models/exams.js';
import PassedExam from "../models/passedExam.js";

const router = express.Router();

router.get('/home', authenticate,authorizeRole('Student'), (req,res)=>{
    res.render("student/home", { user: req.user });
})

router.post('/home', authenticate, authorizeRole("Student"), async (req, res) => {
    const studentId = req.user.userId;
    const studentExams = await passedExam.find({studentId})
    try {
        const exams = await PassedExam.find({ studentId });

        if (exams.length === 0) {
            return res.status(404).json({ message: 'No exams found for this student.' });
        }

        const scores = exams.map(exam => exam.score);

        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        const averageScore = scores.reduce((acc, val) => acc + val, 0) / scores.length;

        const examsArray = exams.map(exam => ({
            title: exam.title,
            score: exam.score,
            date: exam.date
        }));

        const StudentData = {
            highest:highestScore,
            lowest:lowestScore,
            mean: Number(averageScore.toFixed(2)),
            exams: examsArray
        };

        res.render("student/home", { user: req.user,StudentData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/takeExam/:id', authenticate, authorizeRole('Student'), async (req,res)=>{
    const accessToken = req.params.id;
    const exam = await Exam.findOne({accessToken});
    console.log(exam);
    const title = exam.title;
    const duration = exam.duration;
    res.render('student/takeExam', {examMetaData: {
        accessToken,
        title,
        questionsCount: exam.questions.length,
        duration
    }, layout:false});
})

router.post('/takingExam/:accessToken', authenticate, authorizeRole('Student'), async (req, res)=>{
    try{
        const accessToken = req.params.accessToken;
        const exam = await Exam.findOne({accessToken});
        console.log(exam);
        res.status(201).json(exam);
    }catch(err){
        res.status(404);
    }
})

export default router;