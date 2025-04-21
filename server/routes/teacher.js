import express from 'express';
import { authenticate, authorizeRole } from '../middleware/authMiddleWare.js';


const router = express.Router();

router.get('/home',authenticate, authorizeRole("Teacher"), (req, res)=>{
    res.render('teacher/home', { user: req.user });
})

router.get('/createExam', authenticate, authorizeRole('Teacher'), (req, res) =>{
    res.render('teacher/createExam',{exam:{
        title:'test',
        description: 'just take the test',
        duration:60,
        group: 'Mip 4'
    }});
})
export default router;