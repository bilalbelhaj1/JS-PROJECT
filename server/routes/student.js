import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleWare.js";
import studentHome from "../controllers/studentHome.js";
import { takeExam,takingExam, saveStat } from "../controllers/takeExam.js";

const router = express.Router();

router.get('/home', authenticate, authorizeRole('Student'), (req, res) => {
    res.render("student/dashboard", { user: req.user });
})

router.post('/home', authenticate, authorizeRole("Student"),studentHome);

router.get('/takeExam/:id', authenticate, authorizeRole('Student'),takeExam)

router.post('/takingExam/:accessToken', authenticate, authorizeRole('Student'),takingExam);

router.post('/saveStats', authenticate, authorizeRole('Student'),saveStat);

export default router;
