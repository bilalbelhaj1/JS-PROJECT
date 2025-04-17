import express from 'express';

const router = express.Router()

router.get('/home', (req, res) =>{
    res.render('student/home');
})

export default router;