import express from 'express';

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('auth/register', { layout: false });
})

router.get('/login', (req, res) => {
    res.render('auth/login', { layout: false });
})

export default router;