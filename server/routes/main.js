import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res)=>{
    const token = req.cookies.authToken;
    if(!token){
        res.render('index');
    }else{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.render(`${decoded.role.toLowerCase()}/home`, { user: decoded })
    }
})

router.get('/register', (req, res) => {
    res.render('auth/register', { layout: false });
})

router.get('/login', (req, res) => {
    res.render('auth/login', { layout: false });
})

export default router;