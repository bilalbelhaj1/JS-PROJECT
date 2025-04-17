import express from 'express';
import userRegister from '../controllers/registerUser.js';

import loginUser from '../controllers/loginUser.js';
const router = express.Router();

router.post('/register', userRegister)

router.post('/login', loginUser)
export default router;



