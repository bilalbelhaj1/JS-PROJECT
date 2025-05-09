let Exam;
document.querySelector("#start-btn").addEventListener("click", () => {
  const accessToken = document.querySelector('#start-btn').getAttribute('data-accessToken');

  fetch(`/student/takingExam/${accessToken}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accessToken })
  })
  .then(response => {
      if (response.ok) {
          response.json().then(data => {
              Exam = data;
              document.querySelector(".exam-header h1").innerText = Exam.title;
              document.querySelector(".start-screen").classList.add("hide");
              document.getElementById("display-container").classList.remove("hide");
              document.getElementById('exam-description-text').innerHTML = Exam.description;
              takingExam(Exam);
          });
      }else{
         response.json().then(data=>{
            alert(data.message);
            location.href = '/student/home';
         })
      }
  });
});

let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let scoreContainer = document.querySelector(".score-container");
let userScore = document.getElementById("user-score");
let questionCount;
let scoreCount = 0;
let countdown;
let quizArray = [];

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
      userScore.innerHTML = `Your score is ${scoreCount} out of ${totalPossibleScore()}`;

      const StudentStats = {
          examAccessToken: Exam.accessToken,
          title: Exam.title,
          score: scoreCount
      };
      setTimeout(() => {
          fetch('/student/saveStats', {
              method: "POST",
              headers: {
                  'Content-Type': 'Application/json'
              },
              body: JSON.stringify({ StudentStats })
          })
          .then(response => {
              if (response.ok) {
                  location.href = '/student/home';
              } else {
                  console.log("Error");
              }
          });
      }, 2000);
  } else {
      quizDisplay(questionCount);
      startTimer(quizArray[questionCount].time || 10);

      if (questionCount === quizArray.length - 1) {
          nextBtn.innerText = "Submit Exam";
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

  // Handle media
  const mediaContainer = document.querySelector('.media');
  mediaContainer.innerHTML = ''; // Clear previous media

  const currentQuestion = quizArray[index];

  if (currentQuestion.media) {
      mediaContainer.style.display = 'block';

      if (currentQuestion.media.fileType === 'image') {
          const image = document.createElement('img');
          image.src = currentQuestion.media.filePath;
          mediaContainer.appendChild(image);
      } else if (currentQuestion.media.fileType === 'video') {
          const video = document.createElement('video');
          video.src = currentQuestion.media.filePath;
          video.controls = true;
          mediaContainer.appendChild(video);
      } else if (currentQuestion.media.fileType === 'audio') {
          const audio = document.createElement('audio');
          audio.src = currentQuestion.media.filePath;
          audio.controls = true;
          mediaContainer.appendChild(audio);
      }
  } else {
      mediaContainer.style.display = 'none';
  }
}

function quizCreator() {
  quizContainer.innerHTML = "";

  for (let i of quizArray) {
      let div = document.createElement("div");
      div.classList.add("container-mid", "hide");

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
          input.placeholder = "Enter your answer";
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
  if (Math.abs(Number(ans.trim()) - Number(correctAns)) <= tolerance) {
      scoreCount += questionScore;
  }
  clearInterval(countdown);
}

function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  clearInterval(countdown);
  quizCreator();
  quizDisplay(questionCount);
  startTimer(quizArray[0].time || 10);
  nextBtn.innerText = "Next Question";
}

function totalPossibleScore() {
  let total = 0;
  quizArray.forEach(q => {
      total += q.score;
  });
  return total;
}
