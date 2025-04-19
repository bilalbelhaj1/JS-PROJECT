import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get('/home', authenticate, authorizeRole("Student"), (req, res) => {
    res.render("student/home", { user: req.user });
});

export default router;
