let Exam;
const startBtn = document.querySelector("#start-btn");
const geoModal = document.getElementById("geo-modal");
const geoModalText = document.getElementById("geo-modal-text");
const geoModalBtn = document.getElementById("geo-modal-btn");

const timeLeft = document.querySelector(".time-left");
const quizContainer = document.getElementById("container");
const nextBtn = document.getElementById("next-button");
const scoreContainer = document.querySelector(".score-container");
const userScore = document.getElementById("user-score");

let questionCount;
let scoreCount = 0;
let countdown;
let quizArray = [];
let longitude;
let latitude;

startBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        showGeoModal("Votre navigateur ne prend pas en charge la géolocalisation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            const accessToken = startBtn.getAttribute('data-accessToken');

            const response = await fetch(`/student/takingExam/${accessToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken, latitude, longitude })
            });

            if (response.ok) {
                const data = await response.json();
                Exam = data;
                document.getElementById("exam-title").innerText = Exam.title;
                document.querySelector(".start-screen").classList.add("hide");
                document.getElementById("display-container").classList.remove("hide");
                document.getElementById("exam-description-text").innerHTML = Exam.description;
                takingExam(Exam);
            } else if (response.status === 400) {
                response.json().then(data => {
                    showAlert(data.message, 'info');
                });
            }
        },
        () => {
            showGeoModal("L'accès à la localisation est nécessaire pour commencer l'examen. Veuillez autoriser l'accès à la localisation et recharger.");
        }
    );
});

geoModalBtn.addEventListener("click", () => {
    location.reload();
});

function showGeoModal(message) {
    console.log(geoModal);
    geoModal.classList.add('show');
    geoModalText.innerText = message;
    geoModalBtn.addEventListener('click', () => {
        document.getElementById("geo-modal").classList.remove("show");
        location.reload();
    })
}

function takingExam(exam) {
    quizArray = exam.questions;
    initial();
}

nextBtn.addEventListener("click", () => {
    const currentQuestion = quizArray[questionCount];

    if (currentQuestion.type === "direct") {
        const input = document.querySelector(".container-mid:not(.hide) input");
        if (input) {
            checkerDirect(input.value, currentQuestion.answer, currentQuestion.tolerance, currentQuestion.score);
        }
    }

    questionCount++;

    if (questionCount === quizArray.length) {
        document.getElementById("display-container").classList.add("hide");
        scoreContainer.classList.remove("hide");
        document.querySelector('.media').innerHTML = '';
        
        // Calculate normalized score out of 100
        const totalPossible = quizArray.reduce((sum, q) => sum + q.score, 0);
        const normalizedScore = Math.round((scoreCount / totalPossible) * 100);
        userScore.innerHTML = `Votre score est de ${normalizedScore} sur 100`;

        const StudentStats = {
            examAccessToken: Exam.accessToken,
            title: Exam.title,
            score: normalizedScore, // Save normalized score
            rawScore: scoreCount, // Also save raw score
            totalPossible: totalPossible, // Save total possible points
            longitude,
            latitude
        };

        setTimeout(() => {
            fetch('/student/saveStats', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ StudentStats })
            })
            .then(response => {
                if (response.ok) {
                    location.href = '/student/home';
                }
            });
        }, 2000);
    } else {
        quizDisplay(questionCount);
        startTimer(quizArray[questionCount].time || 10);

        if (questionCount === quizArray.length - 1) {
            nextBtn.innerText = "Soumettre l'examen";
        }
    }
});

function startTimer(time) {
    clearInterval(countdown);
    let count = time;
    timeLeft.innerText = `${count}s`;

    countdown = setInterval(() => {
        count--;
        timeLeft.innerText = `${count}s`;
        if (count <= 0) {
            clearInterval(countdown);
            nextBtn.click();
        }
    }, 1000);
}

function quizDisplay(index) {
    let cards = document.querySelectorAll(".container-mid");
    cards.forEach(card => card.classList.add("hide"));
    cards[index].classList.remove("hide");

    // Get the media container within the current question card
    const currentCard = cards[index];
    const mediaContainer = currentCard.querySelector('.media');
    if (!mediaContainer) {
        // Create media container if it doesn't exist
        const newMediaContainer = document.createElement('div');
        newMediaContainer.className = 'media';
        currentCard.insertBefore(newMediaContainer, currentCard.firstChild);
    }

    // Clear any existing media
    const currentMediaContainer = currentCard.querySelector('.media');
    currentMediaContainer.innerHTML = '';

    const currentQuestion = quizArray[index];

    if (currentQuestion.media) {
        currentMediaContainer.style.display = 'block';

        if (currentQuestion.media.fileType === 'image') {
            const image = document.createElement('img');
            image.src = currentQuestion.media.filePath;
            image.alt = 'Image de la question';
            currentMediaContainer.appendChild(image);
        } else if (currentQuestion.media.fileType === 'video') {
            const video = document.createElement('video');
            video.src = currentQuestion.media.filePath;
            video.controls = true;
            video.style.width = '100%';
            currentMediaContainer.appendChild(video);
        } else if (currentQuestion.media.fileType === 'audio') {
            const audio = document.createElement('audio');
            audio.src = currentQuestion.media.filePath;
            audio.controls = true;
            audio.style.width = '100%';
            currentMediaContainer.appendChild(audio);
        }
    } else {
        currentMediaContainer.style.display = 'none';
    }

    document.getElementById("current-question").innerText = index + 1;
    document.getElementById("total-questions").innerText = quizArray.length;
    updateProgressBar(index + 1, quizArray.length);
}

function updateProgressBar(current, total) {
    const progress = (current / total) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
}

function quizCreator() {
    quizContainer.innerHTML = "";

    for (let i of quizArray) {
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");

        // Add media container at the top of each question
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'media';
        mediaDiv.style.display = 'none';
        div.appendChild(mediaDiv);

        let questionP = document.createElement("p");
        questionP.classList.add("question");
        questionP.innerText = i.enonce;
        div.appendChild(questionP);

        if (i.type === "qcm") {
            i.options.sort(() => Math.random() - 0.5);
            i.options.forEach(opt => {
                let btn = document.createElement("button");
                btn.classList.add("option-div");
                btn.innerText = opt.option;
                btn.onclick = () => checker(btn, opt.correct, i.score);
                div.appendChild(btn);
            });
        } else {
            let input = document.createElement("input");
            input.placeholder = "Entrez votre réponse";
            div.appendChild(input);
        }

        quizContainer.appendChild(div);
    }
}

function checker(button, isCorrect, questionScore) {
    let card = document.getElementsByClassName("container-mid")[questionCount];
    let options = card.querySelectorAll(".option-div");

    options.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        button.classList.add("correct");
        scoreCount += questionScore;
    } else {
        button.classList.add("incorrect");
    }

    options.forEach(btn => {
        const correctOption = quizArray[questionCount].options.find(o => o.option === btn.innerText && o.correct);
        if (correctOption) btn.classList.add("correct");
    });

    clearInterval(countdown);
}

function checkerDirect(ans, correctAns, tolerance, questionScore) {
    // Trim and normalize case for string comparison
    const userAnswer = ans.trim().toLowerCase();
    const correctAnswer = correctAns.trim().toLowerCase();
    
    // First check for exact match (case insensitive)
    if (userAnswer === correctAnswer) {
        scoreCount += questionScore;
        return;
    }
    
    // If not exact match, check if it's a numeric value with tolerance
    if (!isNaN(userAnswer) && !isNaN(correctAnswer)) {
        const userNum = parseFloat(userAnswer);
        const correctNum = parseFloat(correctAnswer);
        const difference = Math.abs(userNum - correctNum);
        const allowedDifference = correctNum * (tolerance / 100);
        
        if (difference <= allowedDifference) {
            scoreCount += questionScore;
            return;
        }
    }
    
    // For non-numeric answers, implement string similarity check (Levenshtein distance)
    const similarity = calculateSimilarity(userAnswer, correctAnswer);
    if (similarity >= (1 - tolerance/100)) {
        scoreCount += questionScore;
    }
}

// Helper function to calculate string similarity (Levenshtein distance)
function calculateSimilarity(a, b) {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length <= b.length ? a : b;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    const distance = levenshteinDistance(a, b);
    return (longerLength - distance) / longerLength;
}

// Levenshtein distance implementation
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    // Fill in the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,     // deletion
                matrix[i][j - 1] + 1,     // insertion
                matrix[i - 1][j - 1] + cost  // substitution
            );
        }
    }
    
    return matrix[b.length][a.length];
}

function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    clearInterval(countdown);
    quizCreator();
    quizDisplay(questionCount);
    startTimer(quizArray[0].time || 10);
    nextBtn.innerText = "Prochaine question →";
}