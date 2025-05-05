import express from 'express';
import userRegister from '../controllers/registerUser.js';
import User from '../models/user.js';
import { authenticate } from '../middleware/authMiddleWare.js';
import { updateProfile, changePassword } from '../controllers/updateUser.js';

import loginUser from '../controllers/loginUser.js';
const router = express.Router();

router.post('/register', userRegister);

router.post('/login', loginUser);
router.get('/profile',authenticate, (req, res) =>{
    // get teacher data from database
    const userId = req.user.userId;
    User.findById(userId).then((user) => {
        if (!user) {
            return res.render('auth/login');
        }
        // Render the profile page with teacher data
        if(user.role === 'Student'){
            res.render('student/profile.ejs', {user})
        }else{
            res.render('teacher/profile.ejs',{user,activePage:'profile'});
        }
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Server error');
    });
})
router.post('/updateProfile', authenticate, updateProfile)

router.post('/changePassword',authenticate, changePassword);
export default router;



