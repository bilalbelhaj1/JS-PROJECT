// accec the exam meta data from the sessionStorage
const data = JSON.parse(sessionStorage.getItem("examMetaData"));
 // Parse the string into an object

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


// verify if the sum of the questions mark is 20

// verify if the sum of time gived for each question is equal  to the duration of the exam if not show an error
// finlly create the exam object to be sent to the backend



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

// chane the type of the question 

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

// Function to add/remove options in QCM questions

document.addEventListener('click', function (e) {
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
                <i class="fa-solid fa-upload"></i>  Upload
                <input type="file" class="question-media" accept="image/*, audio/*, video/*">
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
                <input type="number" class="form-control" placeholder="5" min="1">
            </div>
            <div class="form-group">
                <label>Time Limit (seconds)</label>
                <input type="number"  class="form-control" placeholder="30" min="5">
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


function collectAllQuestions() {
    const questionCards = document.querySelectorAll('.question-card');
    const questions = [];

    questionCards.forEach(card => {
        const type = card.querySelector('.btn-direct').classList.contains('active') ? 'direct' : 'qcm';
        const enonce = card.querySelector('textarea').value.trim();
        const time = parseInt(card.querySelector('input[placeholder="30"]').value) || 0;
        const score = parseInt(card.querySelector('input[placeholder="5" ]').value) || 0;

        const mediaFile = card.querySelector('.question-media').files[0]; // Get the uploaded file


        if (type === 'direct') {
            const answer = card.querySelector('.direct-answer-section input[type="text"]').value.trim();
            const tolerance = parseInt(card.querySelector('.direct-answer-section input[type="number"]').value) || 0;
            questions.push({ enonce, type, time, score,tolerance , answer, mediaFile});
        } else {
            const options = [];
            const optionItems = card.querySelectorAll('.mcq-options-section .option-item');
            optionItems.forEach(item => {
                const text = item.querySelector('.option-input').value.trim();
                const isCorrect = item.querySelector('.option-correct').checked;
                options.push({ option:text, correct:isCorrect });
            });
            questions.push({ enonce, type, time, score, options,mediaFile });
        }
    });
    console.log(questions);
    return questions;
}

// Function to show exam link
function showExamLink(accessToken) {
    const modal = document.getElementById('examLinkModal');
    const examLinkInput = document.getElementById('examLinkInput');
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyStatus = document.getElementById('copyStatus');
    const closeModal = document.querySelector('.close-modal');
    
    // Generate the exam link
    const examLink = `${window.location.origin}/student/takeExam/${accessToken}`;
    examLinkInput.value = examLink;
    
    // Show the modal
    modal.style.display = 'block';
    
    // Close modal when X is clicked
    closeModal.onclick = function() {
      modal.style.display = 'none';
      copyStatus.textContent = '';
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
        copyStatus.textContent = '';
      }
    }
    
    // Copy link functionality
    copyBtn.onclick = function() {
      examLinkInput.select();
      document.execCommand('copy');
      
      // Show success message
      copyStatus.textContent = 'Link copied to clipboard!';
      setTimeout(() => {
        copyStatus.textContent = '';
      }, 2000);
    }
}

// save exam to the dataBase

document.getElementById('save-exam-btn').addEventListener('click', () => {
    const questions = collectAllQuestions();
    const exam ={
        title: title,
        description: description,
        group: group,
        duration: duration,
        questions: questions
    }
    console.log(exam);
    // Set your expected values
    const expectedDuration = exam.duration*60; // in minutes
    const expectedScore = 20;

    // Sum time and score
    let totalTime = 0;
    let totalScore = 0;

    questions.forEach(qes => {
        totalTime += qes.time || 0;
        totalScore += qes.score || 0;
    });

    // Validation
    if (totalTime !== expectedDuration) {
        alert(`The total time (${totalTime}s) does not match the required duration (${expectedDuration}s).`);
        return;
    }

    if (totalScore !== expectedScore) {
        alert(`The total score (${totalScore}) must be exactly ${expectedScore}.`);
        return;
    }

    // If everything is valid, send the data to the backend
    fetch('/teacher/createExam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exam)
    })
    .then(response => {
        if (response.status == 200 || response.status == 200 ) {
            alert('Exam created successfully!');
            
            //clear sessionStorage and redirect
            sessionStorage.removeItem('examMetaData'); 
            window.location.href = '/teacher/home'; // Redirect to home page or another page
        } else {
            alert('Failed to create exam. Please try again.');
        }
    })

   
});