import express from 'express';
import multer from 'multer';
import { authenticate, authorizeRole } from '../middleware/authMiddleWare.js';
import createExam from '../controllers/createExam.js';
import teacherHome from '../controllers/teacherHome.js'
import Exam from '../models/exams.js';

const upload = multer({dest:'uploads/'});

const router = express.Router();

router.get('/home',authenticate, authorizeRole("Teacher"), teacherHome);

router.get('/createExam',authenticate, authorizeRole("Teacher"), (req, res) =>{
    res.render('teacher/createExam.ejs', { user: req.user });
})

router.post('/createExam', authenticate, authorizeRole('Teacher'),upload.single('media'),createExam);

router.get('/myExams', authenticate, authorizeRole('Teacher'), (req, res)=>{
    res.render('teacher/teacherExams',{user:req.user});
})

router.post('/myExams', authenticate, authorizeRole('Teacher'),async (req,res)=>{
    const teacherId = req.user.userId;
    const exams = await Exam.find({teacher_id: teacherId});
    console.log(teacherId);
    if(exams.length === 0){
        res.status(500).json({
            message:"You don't have any exams Yet"
        })
    }else{
        const cleanExams = exams.map(e=>{
            const exam ={
                examId: e._id,
                title:e.title,
                description: e.description,
                group: e.group,
                status: e.status,
                accesstoken: e.accessToken
            }
            return exam;
        })
        console.log(cleanExams);
        res.status(201).json(cleanExams);
    }
})

router.delete('/deleteExam', authenticate, authorizeRole('Teacher'),async (req, res)=>{
    const examId = req.body.examId;
    try{
        const exam = await Exam.findOneAndDelete({_id:examId});
        if(!exam){
            res.status(400).json({message:"No exam Found", type:"danger"});
        }else{
            res.status(201).json({message:"exam deleted", type:"success"})
        }
    }catch(err){
        res.status(400).json({message:"Sorry Something went wrong", type:"danger"});
    }
})

router.post('/changeExamsStat', authenticate, authorizeRole('Teacher'), async (req,res)=>{
    const teacherId = req.user.userId;
    const {examId, currentStat, newStat} = req.body;
    console.log(teacherId);
    if(!teacherId || !examId || !currentStat || !newStat){
        res.status(400).json({
            message:"Something went Wrong changing the status",
            type: "danger"
        })
        return;
    }else{
        await Exam.findOneAndUpdate({_id:examId,teacher_id:teacherId},{$set:{status:newStat}});
        res.status(201).json({
            message:`Exam is ${newStat}`,
            type:'success'
        })
    }
})


export default router;