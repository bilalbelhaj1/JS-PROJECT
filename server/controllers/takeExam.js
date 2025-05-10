import Exam from '../models/exams.js';
import PassedExam from "../models/passedExam.js";
const takeExam = async (req, res) => {
    try {
        const accessToken = req.params.id;
        const exam = await Exam.findOne({ accessToken });
        const title = exam.title;
        const duration = exam.duration;

        if (!exam) {
            res.send("Vous n'avez aucun examen");
        }

        res.render('student/takeExam', { examMetaData: {
            accessToken,
            title,
            questionsCount: exam.questions.length,
            duration
        }, layout: false });
    } catch (err) {
        res.send("Erreur du serveur");
    }
}

const takingExam =  async (req, res) => {
    try {
        const accessToken = req.params.accessToken;
        const { latitude, longitude } = req.body;

        const examTaked = await PassedExam.findOne({ accessToken });
        if (examTaked) {
            return res.status(400).json({
                message: "Vous avez déjà passé cet examen",
            });
        }
        const exam = await Exam.findOne({ accessToken });
        if (!exam || exam.status !== 'active') {
            return res.status(400).json({
                message: "Cet examen n'est pas disponible pour le moment, veuillez réessayer plus tard",
            });
        }

        console.log('Géolocalisation reçue:', latitude, longitude);
        res.status(201).json(exam);
    } catch (err) {
        res.status(404).json({ message: "Erreur du serveur" });
    }
}

const saveStat =  async (req, res) => {
    try {
        const studentId = req.user.userId;
        const { examAccessToken, score, title, latitude, longitude } = req.body.StudentStats;

        const studentStat = new PassedExam({
            title,
            accessToken: examAccessToken,
            studentId,
            score,
            location: {
                latitude,
                longitude
            }
        });

        await studentStat.save();
        res.status(201).json({ message: 'Statistiques enregistrées avec succès' });
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de l\'enregistrement des statistiques' });
    }
}

export { takeExam, takingExam, saveStat };