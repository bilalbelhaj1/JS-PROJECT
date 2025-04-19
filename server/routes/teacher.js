import express from 'express';
import { authenticate, authorizeRole } from '../middleware/authMiddleWare.js';


const router = express.Router();

router.get('/home',authenticate, authorizeRole("Teacher"), (req, res)=>{
    res.render('teacher/home', { user: req.user });
})
export default router;