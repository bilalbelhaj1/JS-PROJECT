// Access the exam meta data from the sessionStorage
const data = JSON.parse(sessionStorage.getItem("examMetaData")) || {};

if (data) {
    var title = data.title;
    var description = data.description;
    var group = data.group;
    var duration = data.duration;
} else {
    console.error("No examMetaData found in sessionStorage.");
    window.location.href = '/teacher/home';
}

document.addEventListener('DOMContentLoaded', () => {
    const examMetaData = JSON.parse(sessionStorage.getItem('examMetaData'));
    if (!examMetaData) {
        window.location.href = '/teacher/home';
    } else {
        document.getElementById('js-exam-title').innerText = examMetaData.title;
        createQuestion();
        document.getElementById('add-new-question').addEventListener('click', () => {
            createQuestion();
        });
    }
});

// Change the type of the question
function changeQuestionType(questionId, type) {
    const questionCard = document.querySelector(`.question-card[data-question-id="${questionId}"]`);
    const directAnswerSection = questionCard.querySelector('.direct-answer-section');
    const mcqOptionsSection = questionCard.querySelector('.mcq-options-section');
    const btnDirect = questionCard.querySelector('.btn-direct');
    const btnQCM = questionCard.querySelector('.btn-qcm');

    if (type === 'direct') {
        directAnswerSection.style.display = 'block';
        mcqOptionsSection.style.display = 'none';
        btnDirect.classList.add('active');
        btnQCM.classList.remove('active');
    } else {
        directAnswerSection.style.display = 'none';
        mcqOptionsSection.style.display = 'block';
        btnDirect.classList.remove('active');
        btnQCM.classList.add('active');
    }
}

// Event delegation for question type changes
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-direct')) {
        const questionCard = e.target.closest('.question-card');
        const questionId = questionCard.getAttribute('data-question-id');
        changeQuestionType(questionId, 'direct');
    }

    if (e.target.classList.contains('btn-qcm')) {
        const questionCard = e.target.closest('.question-card');
        const questionId = questionCard.getAttribute('data-question-id');
        changeQuestionType(questionId, 'qcm');
    }

    // Remove question
    if (e.target.classList.contains('remove-question-btn') || e.target.closest('.remove-question-btn')) {
        const questionCard = e.target.closest('.question-card');
        questionCard.remove();
    }

    // Add Option
    if (e.target.closest('.add-option')) {
        const questionCard = e.target.closest('.question-card');
        const optionsContainer = questionCard.querySelector('.options-container');

        const newOption = document.createElement('div');
        newOption.classList.add('option-item');
        newOption.innerHTML = `
            <input type="text" placeholder="New Option" class="option-input">
            <input type="checkbox" class="option-correct">
            <button class="remove-option-btn"><i class="fas fa-trash"></i></button>
        `;
        optionsContainer.appendChild(newOption);
    }
    
    // Remove Option
    if (e.target.classList.contains('remove-option-btn') || e.target.closest('.remove-option-btn')) {
        const button = e.target.closest('.remove-option-btn');
        const optionItem = button.closest('.option-item');
        if (optionItem) {
            optionItem.remove();
        }
    }
});

// Create a new question card
function createQuestion() {
    const questionId = Date.now();
    const QuestionHtml = `
    <div class="question-card" data-question-id="${questionId}">
        <div class="question-header">
            <h2>New Question <button class="remove-question-btn"><i class="fas fa-trash"></i></button></h2>
            <div class="question-type-toggle">
                <button class="btn-direct active" data-type="direct">Direct Question</button>
                <button class="btn-qcm" data-type="qcm">QCM</button>
            </div>
        </div>
        <div class="form-group">
            <label>Question Text</label>
            <textarea class="form-control" rows="3" placeholder="Enter your question..." required></textarea>
        </div>
        <div class="media-upload">
            <label class="media-upload-btn"> 
                <i class="fa-solid fa-upload"></i> Upload
                <input type="file" class="question-media" accept="image/*, audio/*, video/*">
            </label>
            <span class="file-name">No file selected</span>
        </div>
        <div class="direct-answer-section">
            <div class="form-group">
                <label>Correct Answer</label>
                <input type="text" class="form-control" placeholder="Expected answer" required>
            </div>
            <div class="form-group">
                <label>Tolerance (%)</label>
                <input type="number" class="form-control" placeholder="10" min="0" max="100" required>
                <small>Percentage of allowed variation in student answers (e.g., for typos).</small>
            </div>
        </div>
        <div class="mcq-options-section" style="display: none;">
            <div class="form-group">
                <label>Options (Check correct answers)</label>
                <div class="options-container">
                    <div class="option-item">
                        <input type="text" placeholder="Option 1" class="option-input" required>
                        <input type="checkbox" class="option-correct">
                        <button class="remove-option-btn"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="option-item">
                        <input type="text" placeholder="Option 2" class="option-input" required>
                        <input type="checkbox" class="option-correct">
                        <button class="remove-option-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="add-option">
                    <i class="fas fa-plus-circle"></i>
                    <span>Add Option</span>
                </div>
            </div>
        </div>
        <div class="settings-group">
            <div class="form-group">
                <label>Points</label>
                <input type="number" class="form-control" placeholder="5" min="1" required>
            </div>
            <div class="form-group">
                <label>Time Limit (seconds)</label>
                <input type="number" class="form-control" placeholder="30" min="5" required>
            </div>
        </div>
    </div>`;
    
    const container = document.querySelector('.questions-container');
    container.insertAdjacentHTML('beforeend', QuestionHtml);

    // Add event listener for file selection
    const newCard = container.lastElementChild;
    const fileInput = newCard.querySelector('.question-media');
    const fileNameDisplay = newCard.querySelector('.file-name');
    
    fileInput.addEventListener('change', function() {
        fileNameDisplay.textContent = this.files[0] ? this.files[0].name : 'No file selected';
    });

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// Collect all questions data
function collectAllQuestions() {
    const questionCards = document.querySelectorAll('.question-card');
    const questions = [];

    questionCards.forEach(card => {
        const type = card.querySelector('.btn-direct').classList.contains('active') ? 'direct' : 'qcm';
        const enonce = card.querySelector('textarea').value.trim();
        const time = parseInt(card.querySelector('input[placeholder="30"]').value) || 0;
        const score = parseInt(card.querySelector('input[placeholder="5"]').value) || 0;
        const mediaFile = card.querySelector('.question-media').files[0];

        if (type === 'direct') {
            const answer = card.querySelector('.direct-answer-section input[type="text"]').value.trim();
            const tolerance = parseInt(card.querySelector('.direct-answer-section input[type="number"]').value) || 0;
            questions.push({ enonce, type, time, score, tolerance, answer, mediaFile });
        } else {
            const options = [];
            const optionItems = card.querySelectorAll('.mcq-options-section .option-item');
            optionItems.forEach(item => {
                const text = item.querySelector('.option-input').value.trim();
                const isCorrect = item.querySelector('.option-correct').checked;
                if (text) { // Only include non-empty options
                    options.push({ option: text, correct: isCorrect });
                }
            });
            questions.push({ enonce, type, time, score, options, mediaFile });
        }
    });
    
    return questions;
}

// Show exam link modal
function showExamLink(accessToken) {
    const modal = document.getElementById('examLinkModal');
    const examLinkInput = document.getElementById('examLinkInput');
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyStatus = document.getElementById('copyStatus');
    const closeModal = document.querySelector('.close-modal');
    
    const examLink = `${window.location.origin}/student/takeExam/${accessToken}`;
    examLinkInput.value = examLink;
    modal.style.display = 'block';
    
    closeModal.onclick = function() {
        modal.style.display = 'none';
        copyStatus.textContent = '';
        sessionStorage.removeItem('examMetaData');
        location.href = '/teacher/myExams';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            copyStatus.textContent = '';
            sessionStorage.removeItem('examMetaData');
            location.href = '/teacher/myExams';
        }
    }
    
    copyBtn.onclick = function() {
        examLinkInput.select();
        document.execCommand('copy');
        copyStatus.textContent = 'Link copied to clipboard!';
        setTimeout(() => {
            copyStatus.textContent = '';
        }, 2000);
    }
}

// Save exam to database
document.getElementById('save-exam-btn').addEventListener('click', async () => {
    const questions = collectAllQuestions();
    const examMetaData = JSON.parse(sessionStorage.getItem('examMetaData'));
    
    // Validate required fields
    for (const question of questions) {
        if (!question.enonce) {
            alert('Please fill in all question texts');
            return;
        }
        if (question.type === 'direct' && !question.answer) {
            alert('Please fill in all answer fields for direct questions');
            return;
        }
        if (question.type === 'qcm' && question.options.length < 2) {
            alert('Each QCM question must have at least 2 options');
            return;
        }
    }

    // Validate total time and score
    const expectedDuration = examMetaData.duration * 60;
    const expectedScore = 20;
    let totalTime = 0;
    let totalScore = 0;

    questions.forEach(q => {
        totalTime += q.time || 0;
        totalScore += q.score || 0;
    });

    if (totalTime !== expectedDuration) {
        alert(`The total time (${totalTime}s) does not match the required duration (${expectedDuration}s).`);
        return;
    }

    if (totalScore !== expectedScore) {
        alert(`The total score (${totalScore}) must be exactly ${expectedScore}.`);
        return;
    }

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('title', examMetaData.title);
    formData.append('description', examMetaData.description);
    formData.append('group', examMetaData.group);
    formData.append('duration', examMetaData.duration);
    
    // Add questions data (without files)
    const questionsData = questions.map(q => {
        const questionData = { ...q };
        delete questionData.mediaFile; // Remove the File object
        return questionData;
    });
    formData.append('questions', JSON.stringify(questionsData));
    
    // Add media files with correct field names
    questions.forEach((q, index) => {
        if (q.mediaFile) {
            formData.append(`questions[${index}][media]`, q.mediaFile);
        }
    });

    try {
        const response = await fetch('/teacher/createExam', {
            method: 'POST',
            body: formData // No Content-Type header needed for FormData
        });
        
        if (response.ok) {
            const data = await response.json();
            showExamLink(data.accessToken);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create exam. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the exam.');
    }
});