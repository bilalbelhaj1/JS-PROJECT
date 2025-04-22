import express from 'express';
import { authenticate, authorizeRole } from '../middleware/authMiddleWare.js';
import createExam from '../controllers/createExam.js';

const router = express.Router();

router.get('/home',authenticate, authorizeRole("Teacher"), (req, res)=>{
    res.render('teacher/home', { user: req.user });
})
router.get('/createExam',authenticate, authorizeRole("Teacher"), (req, res) =>{
    res.render('teacher/createExam.ejs', { user: req.user });
})

router.post('/createExam', authenticate, authorizeRole('Teacher'),createExam);


export default router;