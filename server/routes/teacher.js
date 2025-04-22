import express from 'express';
import { authenticate, authorizeRole } from '../middleware/authMiddleWare.js';
import createExam from '../controllers/createExam.js';


const router = express.Router();

router.get('/home',authenticate, authorizeRole("Teacher"), (req, res)=>{
    res.render('teacher/home', { user: req.user });
})

router.get('/createExam', authenticate, authorizeRole('Teacher'), (req, res) =>{
    const examData = req.body || {
        title:'test',
        description: 'just take the test',
        duration:60,
        group: 'Mip 4'
    }
    console.log(req.body);
    res.render('teacher/createExam',{exam: examData});
})

router.post('/createExam', authenticate, authorizeRole('Teacher'),createExam)

export default router;