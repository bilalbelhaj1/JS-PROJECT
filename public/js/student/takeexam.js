// References
const btn = document.querySelector("#start-btn");
const timeLeft = document.querySelector(".time-left");
const quizContainer = document.getElementById("container");
const nextBtn = document.getElementById("next-button");
const countOfQuestion = document.querySelector(".number-of-question");
const displayContainer = document.getElementById("display-container");
const scoreContainer = document.querySelector(".score-container");
const userScore = document.getElementById("user-score");
const startScreen = document.querySelector(".start-screen");

let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;
let quizArray = [];

// Sample exam for local testing
const Exam = {
    title: "Sample Math Exam",
    description: "A basic math exam to test addition and subtraction skills.",
    group: "Grade 5",
    duration: 30,
    status: "active",
    accessToken: "dummy-access-token-12345",
    questions: [
        {
            enonce: "What is 5 + 7?",
            type: "direct",
            time: 30,
            score: 5,
            tolerance: 0,
            answer: "12",
            options: []
        },
        {
            enonce: "Select all prime numbers below.",
            type: "qcm",
            time: 45,
            score: 5,
            options: [
                { option: "2", correct: true },
                { option: "3", correct: true },
                { option: "4", correct: false },
                { option: "6", correct: false }
            ]
        },
        {
            enonce: "What is the capital of France?",
            type: "direct",
            time: 30,
            score: 5,
            tolerance: 0,
            answer: "Paris",
            options: []
        },
        {
            enonce: "Which of these are programming languages?",
            type: "qcm",
            time: 45,
            score: 5,
            options: [
                { option: "JavaScript", correct: true },
                { option: "Python", correct: true },
                { option: "Car", correct: false },
                { option: "Banana", correct: false }
            ]
        }
    ]
};

// Event listener for local testing
btn.addEventListener("click", () => {
    btn.style.display = 'none';
    document.querySelector(".exam-header h1").innerText = Exam.title;
    document.querySelector(".exam-header p").innerText = Exam.description;
    displayContainer.style.display = 'block';

    quizArray = Exam.questions;
    initial();
});

// Next question
nextBtn.addEventListener("click", () => {
    questionCount++;
    if (questionCount === quizArray.length) {
        displayContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");
        userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
    } else {
        countOfQuestion.innerHTML = `${questionCount + 1} of ${quizArray.length} Question`;
        quizDisplay(questionCount);
        clearInterval(countdown);
        timerDisplay(quizArray[questionCount].time || 11);
    }
});

// Timer
const timerDisplay = (timeLimit) => {
    count = timeLimit || 11;
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count === 0) {
            clearInterval(countdown);
            nextBtn.click();
        }
    }, 1000);
};

// Display question
const quizDisplay = (index) => {
    let quizCards = document.querySelectorAll(".container-mid");
    quizCards.forEach(card => card.classList.add("hide"));
    quizCards[index].classList.remove("hide");
};

// Create questions UI
function quizCreator() {
    quizContainer.innerHTML = "";
    quizArray.forEach((q, i) => {
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");

        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerText = q.enonce;
        div.appendChild(question_DIV);

        if (q.type === "qcm") {
            q.options.sort(() => Math.random() - 0.5);
            q.options.forEach(option => {
                let button = document.createElement("button");
                button.classList.add("option-div");
                button.innerText = option.option;
                button.onclick = () => checker(button, option.correct);
                div.appendChild(button);
            });
        } else {
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Enter your answer";
            input.classList.add("direct-answer");
            div.appendChild(input);

            let submitBtn = document.createElement("button");
            submitBtn.innerText = "Submit";
            submitBtn.onclick = () => checkerDirect(input.value, q.answer, q.tolerance);
            div.appendChild(submitBtn);
        }

        quizContainer.appendChild(div);
    });
}

// Checker for QCM
function checker(userOption, isCorrect) {
    let options = document.getElementsByClassName("container-mid")[questionCount].querySelectorAll(".option-div");

    if (isCorrect) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
    }

    options.forEach(el => {
        const matching = quizArray[questionCount].options.find(opt => opt.option == el.innerText);
        if (matching && matching.correct) el.classList.add("correct");
        el.disabled = true;
    });

    clearInterval(countdown);
}

// Checker for direct input
function checkerDirect(userAnswer, correctAnswer, tolerance) {
    if (correctAnswer === undefined) {
        alert("Missing correct answer.");
        return;
    }

    if (
        !isNaN(userAnswer) && !isNaN(correctAnswer) &&
        Math.abs(Number(userAnswer.trim()) - Number(correctAnswer.trim())) <= tolerance
    ) {
        scoreCount++;
    } else if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        scoreCount++;
    }

    clearInterval(countdown);
    nextBtn.disabled = false;
    setTimeout(() => nextBtn.click(), 2000);
}

// Initializer
function initial() {
    questionCount = 0;
    scoreCount = 0;
    clearInterval(countdown);
    quizCreator();
    quizDisplay(questionCount);
    timerDisplay(quizArray[0].time || 30);
}

// Load screen
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};
