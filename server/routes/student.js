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
    const title = exam.title;
    const duration = exam.duration;
    res.render('student/takeExam', {examMetaData: {
        accessToken,
        title,
        duration
    }, layout:false});
})

router.post('/takeExam', authenticate, authorizeRole('Student'), async (req, res)=>{
    const accessToken = req.body.accessToken;
    const exam = await Exam.findOne({accessToken});
    res.status(200).json(exam);
})

export default router;