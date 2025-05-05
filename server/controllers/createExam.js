import Exam from '../models/exams.js'
const createExam = async (req, res) => {
    try {
        const examMetaData = req.body;
        const userId = req.user.userId;
        const accessToken = Date.now() + userId;
        
        // Process questions and files
        const questions = JSON.parse(examMetaData.questions);
        const files = req.files || [];
        
        // Create a map of question indices to their files
        const fileMap = {};
        files.forEach(file => {
            // Extract question index from fieldname (e.g., "questions[0][media]")
            const match = file.fieldname.match(/questions\[(\d+)\]\[media\]/);
            if (match) {
                fileMap[match[1]] = file; // Only one file per question
            }
        });
        
        // Add media info to questions
        const processedQuestions = questions.map((question, index) => {
            const questionWithMedia = { ...question };
            
            if (fileMap[index]) {
                const file = fileMap[index];
                questionWithMedia.media = {
                    fileType: file.mimetype.split('/')[0], // 'image', 'video', or 'audio'
                    fileName: file.originalname,
                    filePath: `/uploads/${file.filename}`
                };
            }
            
            return questionWithMedia;
        });
        
        const examToSave = {
            ...examMetaData,
            questions: processedQuestions,
            teacher_id: userId,
            accessToken
        };
        
        const exam = new Exam(examToSave);
        await exam.save();
        
        res.status(201).json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Something went wrong" });
    }
};

export default createExam;