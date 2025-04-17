import express from 'express';

const router = express.Router();

router.get('/dashboard', (req, res)=>{
    res.render('teacher/dashboard');
})
export default router;