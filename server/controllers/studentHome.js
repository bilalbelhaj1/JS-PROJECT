import PassedExam from "../models/passedExam.js";

export default async (req, res) => {
    const studentId = req.user.userId;
    try {
        const exams = await PassedExam.find({ studentId })
        if (exams.length === 0) {
            return res.status(400).json({ message: 'Aucun examen trouvé pour cet étudiant.' });
        }

        const scores = exams.map(exam => exam.score);

        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        const averageScore = scores.reduce((acc, val) => acc + val, 0) / scores.length;

        const examsArray = exams.map(exam => ({
            title: exam.title,
            score: exam.score,
            date: exam.date.toISOString().split('T')[0]
        }));

        const StudentData = {
            stats: {
                highest: highestScore,
                lowest: lowestScore,
                mean: Number(averageScore.toFixed(2)),
            },
            exams: examsArray
        };

        res.status(201).json(StudentData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}