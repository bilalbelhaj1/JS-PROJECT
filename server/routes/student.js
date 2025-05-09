import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleWare.js";
import Exam from '../models/exams.js';
import PassedExam from "../models/passedExam.js";

const router = express.Router();

router.get('/home', authenticate,authorizeRole('Student'), (req,res)=>{
    res.render("student/dashboard", { user: req.user });
})

router.post('/home', authenticate, authorizeRole("Student"), async (req, res) => {
    const studentId = req.user.userId;
    try {
        const exams = await PassedExam.find({ studentId })
        if (exams.length === 0) {
            return res.status(400).json({ message: 'No exams found for this student.' });
        }

        const scores = exams.map(exam => exam.score);

        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        const averageScore = scores.reduce((acc, val) => acc + val, 0) / scores.length;

        const examsArray = exams.map(exam => ({
            title: exam.title,
            score: exam.score,
            date: exam.date.toISOString().split('T')[0]
        }));

        const StudentData = {
            stats:{
                highest:highestScore,
                lowest:lowestScore,
                mean: Number(averageScore.toFixed(2)),
            },
            exams: examsArray
        };

        res.status(201).json(StudentData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/takeExam/:id', authenticate, authorizeRole('Student'), async (req,res)=>{
    try{
        const accessToken = req.params.id;
        const exam = await Exam.findOne({accessToken});
        const title = exam.title;
        const duration = exam.duration;

        if(!exam){
            res.send("You don't have any exam");
        }

        res.render('student/takeExam', {examMetaData: {
            accessToken,
            title,
            questionsCount: exam.questions.length,
            duration
        }, layout:false});
    }catch(err){
        res.send("Server Error");
    }
})

router.post('/takingExam/:accessToken', authenticate, authorizeRole('Student'), async (req, res)=>{
    try{
        const accessToken = req.params.accessToken;
        const examTaked = await PassedExam.findOne({accessToken});
        if(examTaked){
            res.status(500).json({
                message:"You already passed this exam",
            })
            return;
        }
        const exam = await Exam.findOne({accessToken});
        if(exam.status !== 'active'){
            res.status(500).json({
                message:"this exam is not available at this moment please try again later",
            })
            return;
        }
        console.log(exam);
        res.status(201).json(exam);
    }catch(err){
        res.status(404);
    }
})

router.post('/saveStats',authenticate,authorizeRole('Student'), async (req,res)=>{
    console.log("Reached");
    try{
        const studentId = req.user.userId;
        console.log(req.body);
        const {examAccessToken, score, title } = req.body.StudentStats;
        const studentStat = new PassedExam({
            title,
            accessToken:examAccessToken,
            studentId,
            score
        });

        console.log(studentStat);

        await studentStat.save();
        console.log('saved');
        res.status(201);
    }catch(err){
        console.log("ERROOOOOOR:"+err);
        res.status(400);
    }

})

export default router;