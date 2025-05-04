// Event listener for the start button
const btn = document.querySelector("#start-btn");


btn.addEventListener("click", async () => {
    const accessToken = btn.getAttribute('data-accessToken');
    console.log("Sending accessToken:", accessToken);  // Debug log

    // Hide the start button
    btn.style.display = 'none';

    try {
        const response = await fetch('/student/takeExam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accessToken })
        });

        if (response.status === 201) {
            const exam = await response.json();
            document.getElementById('display-container').style.display = 'block';
            console.log("Fetched exam:", exam);
            takingExam(exam); // Assuming you have this function defined to handle the loaded exam
        } else {
            alert("Server Error: Could not load exam.");
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Error: Something went wrong.");
    }
})

// Function to handle the loaded exam
function takingExam(exam) {
    window.quizArray = exam.questions; // Store the questions globally for quiz usage
    window.examDuration = exam.duration; // Store exam duration globally
    initial(); // Call initial function to start the quiz setup
}

// References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;

// Next button click event
nextBtn.addEventListener("click", () => {
    questionCount++;

    if (questionCount === quizArray.length) {
        // Hide quiz and show score
        displayContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");
        userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
    } else {
        // Update question count and display the next question
        countOfQuestion.innerHTML = `${questionCount + 1} of ${quizArray.length} Question`;
        quizDisplay(questionCount);
        count = quizArray[questionCount].time || 11;  // Use the question's time limit or default to 11 seconds
        clearInterval(countdown);  // Clear previous interval
        timerDisplay(count);  // Start new timer
    }
});

// Timer function
const timerDisplay = (timeLimit) => {
    count = timeLimit || 11; // Use the question's time limit or default to 11 seconds
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count === 0) {
            clearInterval(countdown);
            nextBtn.click(); // Trigger the next button click after timer ends
        }
    }, 1000);
};

// Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    quizCards.forEach((card) => {
        card.classList.add("hide");
    });
    quizCards[questionCount].classList.remove("hide");
};

// Quiz creation
function quizCreator() {
    for (let i of quizArray) {
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");

        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.enonce; // Display question text
        div.appendChild(question_DIV);

        if (i.type === "qcm") {
            // Multiple-choice options
            i.options.sort(() => Math.random() - 0.5);
            i.options.forEach(option => {
                let button = document.createElement("button");
                button.classList.add("option-div");
                button.innerHTML = option.option;
                button.onclick = () => checker(button, option.correct);
                div.appendChild(button);
            });
        } else {
            // Direct answer type
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Enter your answer";
            input.classList.add("direct-answer");
            div.appendChild(input);

            let submitBtn = document.createElement("button");
            submitBtn.innerHTML = "Submit";
            submitBtn.onclick = () => checkerDirect(input.value, i.answer, i.tolerance);
            div.appendChild(submitBtn);
        }

        quizContainer.appendChild(div);
    }
}

// Checker function to validate the answer
function checker(userOption, isCorrect) {
    let questionDiv = document.getElementsByClassName("container-mid")[questionCount];
    let options = questionDiv.querySelectorAll(".option-div");

    // Mark the selected option as correct or incorrect
    if (isCorrect) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
    }

    // Show the correct options for all options
    options.forEach((element) => {
        const matchingOption = window.quizArray[questionCount].options.find(
            opt => opt.option == element.innerText
        );
        if (matchingOption && matchingOption.correct) {
            element.classList.add("correct");
        }
    });

    // Stop the timer and disable all options
    clearInterval(countdown);
    options.forEach((element) => {
        element.disabled = true;
    });
}

// Direct answer checker
function checkerDirect(userAnswer, correctAnswer, tolerance) {
    let normalizedUserAnswer = userAnswer.trim();
    let normalizedCorrectAnswer = correctAnswer.trim();

    if (Math.abs(Number(normalizedUserAnswer) - Number(normalizedCorrectAnswer)) <= tolerance) {
        scoreCount++;
    }

    clearInterval(countdown);
    nextBtn.disabled = false; // Enable the next button after submission

    // Automatically move to the next question after 2 seconds
    setTimeout(() => {
        nextBtn.click();
    }, 2000);
}

// Initial setup for the quiz
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    clearInterval(countdown);
    timerDisplay(quizArray[0].time || 11);  // Use the first question's time limit or default to 11 seconds
    quizCreator();
    quizDisplay(questionCount);
}

// Hide quiz and display start screen on page load
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};
