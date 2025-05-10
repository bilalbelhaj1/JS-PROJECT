import express from 'express';
import multer from 'multer';
import { authenticate, authorizeRole } from '../middleware/authMiddleWare.js';
import createExam from '../controllers/createExam.js';
import teacherHome from '../controllers/teacherHome.js';
import Exam from '../models/exams.js';

import upload from '../controllers/uploadFile.js';

const router = express.Router();

router.get('/home', authenticate, authorizeRole("Teacher"), teacherHome);

router.get('/createExam', authenticate, authorizeRole("Teacher"), (req, res) => {
    res.render('teacher/createExam', { user: req.user, activePage: 'createExam' });
})

router.post('/createExam', authenticate, authorizeRole('Teacher'), upload.any(), createExam);

router.get('/myExams', authenticate, authorizeRole('Teacher'), (req, res) => {
    res.render('teacher/teacherExams', { user: req.user, activePage: 'myExams' });
})

router.post('/myExams', authenticate, authorizeRole('Teacher'), async (req, res) => {
    const teacherId = req.user.userId;
    const exams = await Exam.find({ teacher_id: teacherId });
    if (exams.length === 0) {
        res.status(500).json({
            message: "Vous n'avez pas encore d'examens"
        })
    } else {
        const cleanExams = exams.map(e => {
            const exam = {
                examId: e._id,
                title: e.title,
                description: e.description,
                group: e.group,
                status: e.status,
                accesstoken: e.accessToken
            }
            return exam;
        })
        res.status(201).json(cleanExams);
    }
})

router.delete('/deleteExam', authenticate, authorizeRole('Teacher'), async (req, res) => {
    const examId = req.body.examId;
    try {
        const exam = await Exam.findOneAndDelete({ _id: examId });
        if (!exam) {
            res.status(400).json({ message: "Aucun examen trouvé", type: "danger" });
        } else {
            res.status(201).json({ message: "Examen supprimé", type: "success" })
        }
    } catch (err) {
        res.status(400).json({ message: "Désolé, quelque chose s'est mal passé", type: "danger" });
    }
})

router.post('/changeExamsStat', authenticate, authorizeRole('Teacher'), async (req, res) => {
    const teacherId = req.user.userId;
    const { examId, currentStat, newStat } = req.body;
    if (!teacherId || !examId || !currentStat || !newStat) {
        res.status(400).json({
            message: "Quelque chose a mal tourné en changeant le statut",
            type: "danger"
        })
        return;
    } else {
        await Exam.findOneAndUpdate({ _id: examId, teacher_id: teacherId }, { $set: { status: newStat } });
        res.status(201).json({
            message: `L'examen est ${newStat}`,
            type: 'success'
        })
    }
})

export default router;
