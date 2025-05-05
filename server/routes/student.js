import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleWare.js";
import Exam from '../models/exams.js';

const router = express.Router();

router.get('/home', authenticate, authorizeRole("Student"), (req, res) => {
    res.render("student/home", { user: req.user });
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