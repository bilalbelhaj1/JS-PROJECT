import Exam from '../models/exams.js'


const teacherHome = async (req, res)=>{
    const teacherId = req.user.userId;
    const exams = await Exam.find({teacher_id:teacherId})
    const totalExams = exams.length;
    let createdQuestions = 0;
    console.log(exams);
    let activeExams = 0;
    if(totalExams !== 0){
        activeExams = exams.map(e=>e.status === 'active').length;
        exams.forEach(e=>{
            createdQuestions += e.questions.length;
        })
    }
    const examsStatistic = {totalExams, activeExams, createdQuestions};
    console.log(examsStatistic);
    res.render('teacher/home', { user: req.user,examsStatistic });
}

export default teacherHome;