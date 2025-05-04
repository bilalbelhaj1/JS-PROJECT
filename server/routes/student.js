import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleWare.js";
import Exam from '../models/exams.js';

const router = express.Router();

router.get('/home', authenticate, authorizeRole("Student"), (req, res) => {
    res.render("student/home", { user: req.user });
});

router.get('/takeExam/:id', authenticate, authorizeRole('Student'), async (req,res)=>{
    try {
        const accessToken = req.params.id;
        const exam = await Exam.findOne({accessToken});
        console.log("GET /takeExam/:id -> Found exam:", exam);

        if (!exam) {
            return res.status(404).send("Exam not found");
        }

        const title = exam.title;
        const duration = exam.duration;
        res.render('student/takeExam', {
            examMetaData: {
                accessToken,
                title,
                duration,
                description: exam.description
            },
            layout: false
        });
    } catch (err) {
        console.error("Error in GET /takeExam/:id:", err);
        res.status(500).send("Server Error");
    }
});


router.post('/takeExam', authenticate, authorizeRole('Student'), async (req, res) => {
    console.log("Route hit: /takeExam");  // Debug log to confirm route is hit
    const { accessToken } = req.body;
    console.log('Received accessToken:', accessToken);  // Debug log

    try {
        const exam = await Exam.findOne({ accessToken });

        if (!exam) {
            console.log('Exam not found');
            return res.status(404).json({ message: "Exam not found" });
        }

        const examToSend = {
            title: exam.title,
            description: exam.description,
            duration: exam.duration,
            questions: exam.questions.map(q => {
                const cleanOptions = q.options?.map(opt => ({
                    option: opt.option
                }));

                return {
                    enonce: q.enonce,
                    type: q.type,
                    time: q.time,
                    score: q.score,
                    tolerance: q.tolerance,
                    options: cleanOptions,
                    media: q.media
                };
            })
        };

        console.log('Exam found:', examToSend);
        res.status(201).json(examToSend);
    } catch (err) {
        console.error("Error fetching exam:", err.message); // Log the error message
        res.status(500).json({ message: "Server error", error: err.message });
    }
    
    });


export default router;