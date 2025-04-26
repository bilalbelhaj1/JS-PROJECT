// accec the exam meta data from the sessionStorage
const data = JSON.parse(sessionStorage.getItem("examMetaData")); // Parse the string into an object

if (data) {
    var title = data.title;
    var description = data.description;
    var group = data.group;
    var duration = data.duration;

    // if there is no examMetaData redirect the teachers to the home page 
} else {
    console.error("No examMetaData found in sessionStorage.");
    // Optionally redirect to the home page or handle the error
    window.location.href = '/teacher/home';
}

// add questions dynamic
// remove question
// add/remove option

// verify if the sum of the questions mark is 20

// verify if the sum of time gived for each question is equal  to the duration of the exam if not show an error
// finlly create the exam object to be sent to the backend
const exam ={
    title: title,
    description: description,
    group: group,
    duration:duration
} ;
//console.log(exam);

// don't forget to include the exam Meta data stored in the sessionStorage

// note the data in sessionStorage stored on form of :
/* 
   {
      title,
      description,
      group,
      duration
   }
*/

/*
  the object you will send is something like this:
  
  {
  title: 'JavaScript Basics',
  description: 'just take the test',
  group: 'Mip',
  duration: '30',
  questions: [
    { enonce: '2+2', type: 'qcm', time: 1, score: 1, options: [Array] },
    {
      enonce: '3+3',
      type: 'direct',
      time: 1,
      score: 1,
      tolerance: 0,
      answer: '6'
    }
  ],
}
*/



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
};
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
});

// Function to remove a question card
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-question-btn')) {
        const questionCard = e.target.closest('.question-card');
        questionCard.remove();
    }
});





// Function to create a new question card

function createQuestion() {
    const questionId = Date.now(); // Unique ID for each question
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
            <textarea class="form-control" rows="3" placeholder="Enter your question..."></textarea>
        </div>
        <div class="media-upload">
            <label class="media-upload-btn">
                <i class="fas fa-image"></i> Image
                <input type="file" accept="image/*">
            </label>
            <label class="media-upload-btn">
                <i class="fas fa-volume-up"></i> Audio
                <input type="file" accept="audio/*">
            </label>
            <label class="media-upload-btn">
                <i class="fas fa-video"></i> Video
                <input type="file" accept="video/*">
            </label>
        </div>
        <div class="direct-answer-section">
            <div class="form-group">
                <label>Correct Answer</label>
                <input type="text" class="form-control" placeholder="Expected answer">
            </div>
            <div class="form-group">
                <label>Tolerance (%)</label>
                <input type="number" class="form-control" placeholder="10" min="0" max="100">
                <small>Percentage of allowed variation in student answers (e.g., for typos).</small>
            </div>
        </div>
        <div class="mcq-options-section" style="display: none;">
            <div class="form-group">
                <label>Options (Check correct answers)</label>
                <div class="options-container">
                    <div class="option-item">
                        <input type="text" placeholder="Option 1" class="option-input">
                        <input type="checkbox" class="option-correct">
                        <button class="remove-option-btn"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="option-item">
                        <input type="text" placeholder="Option 2" class="option-input">
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
                <input type="number" class="form-control" placeholder="10" min="1">
            </div>
            <div class="form-group">
                <label>Time Limit (seconds)</label>
                <input type="number" class="form-control" placeholder="30" min="5">
            </div>
        </div>
</div>`
const container = document.querySelector('.questions-container');
    container.insertAdjacentHTML('beforeend', QuestionHtml);

    // Scroll to the bottom of the page
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}


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
};
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
});
