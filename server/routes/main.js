import express from 'express';

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

export default router;
// app.use('/main', mainRoute);