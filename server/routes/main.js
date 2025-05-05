import express from 'express';
import jwt from 'jsonwebtoken';
import Exam from '../models/exams.js'

const router = express.Router();

router.get('/',async (req, res)=>{
    const token = req.cookies.authToken;
    if(!token){
        res.render('index');
    }else{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '4sUgd85m6mAr5DCH');
        if(decoded.role.toLowerCase() === 'teacher'){
            const teacherId = decoded.userId;
                const exams = await Exam.find({teacher_id:teacherId})
                const totalExams = exams.length;
                let createdQuestions = 0;
                console.log(exams);
                let activeExams = 0;
                if(totalExams !== 0){
                    activeExams = exams.map(e=>e.status === 'active').length;
                    exams.forEach(e=>{
                        createdQuestions += e.questions.length;
                    })
                }
                const examsStatistic = {totalExams, activeExams, createdQuestions};
                console.log(examsStatistic);
                res.render('teacher/home', { user: decoded,examsStatistic,activePage: 'home' });
        }else{
            res.render('student/home',{user : decoded});
        }
        /* res.render(`${decoded.role.toLowerCase()}/home`, { user: decoded }) */
    }
})

router.get('/register', (req, res) => {
    res.render('auth/register', { layout: false });
})

router.get('/login', (req, res) => {
    res.render('auth/login', { layout: false });
})

export default router;