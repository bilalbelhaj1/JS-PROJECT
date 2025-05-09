document.addEventListener('DOMContentLoaded',()=>{
    getExams();
})

function getExams(){
    fetch('/teacher/myExams',{
        method:'POST',
        headers:{
            'Content-Type':'Application/json'
        },
        body:JSON.stringify({})
    })
      .then(response=>{
         if(response.status === 500){
            const erroDis = document.querySelector('.no-exams-found');
            response.json().then(data=>{
                erroDis.innerHTML = data.message;
                erroDis.style.display = 'block';
            })
         }else if(response.status === 201){
            response.json().then(exams=>{
                displayExams(exams);
            })
         }
      })
}

function displayExams(exams){
    let examsContainer = document.querySelector('.exams-container');
    exams.forEach(exam => {
        let status;
        let className;
        let btnText;
        if(exam.status === 'active'){
            status = 'actif';
            className = 'inactive'
            btnText = 'Désactiver'
        }else{
            status = 'Inactif';
            btnText = 'Activer'
            className = 'activate';
        }
        examsContainer.innerHTML += `<div class="exam-card">
                        <h2>${exam.title}</h2>
                        <p><strong>Description:</strong> ${exam.description}</p>
                        <p><strong>Group:</strong> ${exam.group}</p>
                        <p><strong>Status:</strong> 
                                <span class="status ${exam.status}">${status}</span>
                        </p>
                        <div class="exam-link">
                          <input type="text" value="http://localhost:5000/student/takeExam/${exam.accesstoken}">
                          <button id="copyExamLink"><i class="fa-solid fa-copy"></i></button>
                        </div>
                        <div class="result"></div>
                        <div class="card-actions">
                            <button class="statusBtn btn ${className}-btn" data-examId="${exam.examId}" id="${exam.status}">${btnText}</button>
                            <button class="btn delete-btn" data-examId="${exam.examId}" id="delete-exam">Supprimer</button>
                        </div>
                    </div>`

    });
    examsDeletion();
    changeStatus();
    copyExamLink();
}

function copyExamLink() {
    document.querySelectorAll('#copyExamLink').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const examCards = document.querySelectorAll('.exam-card');
            examCards.forEach(examCard =>{
                examCard.addEventListener('copy',()=>{
                    examCard.querySelector('.result').innerText = 'Copied';
                    setTimeout(()=>{
                        examCard.querySelector('.result').innerText = '';
                    },1000)
                })
            })
            let button = e.currentTarget; 
            const input = button.previousElementSibling; 
            input.select();
            document.execCommand('copy');
        });
    });
}

function examsDeletion(){
    const deleteExamBtns = document.querySelectorAll('#delete-exam');
deleteExamBtns.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        const examId = e.target.getAttribute('data-examid')
        console.log(examId);
        deleteExam(examId)
    })
})
function deleteExam(examId){

    fetch('/teacher/deleteExam',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({examId})
    })
       .then(response=>{
            response.json().then(data=>{
                location.reload();
            })
       })
}
}

function changeStatus(){
    const statusBtns = document.querySelectorAll('.statusBtn');
    statusBtns.forEach(btn=>{
        btn.addEventListener('click', (e)=>{
            let currentStat;
            let newStat;
            const examId = e.target.getAttribute('data-examId');
            console.log(examId);
            if(e.target.id === 'active'){
                currentStat = 'active';
                newStat = 'inactive';
            }else{
                currentStat = 'inactive';
                newStat = 'active';
            }
            fetch('/teacher/changeExamsStat',{
                method: 'POST',
                headers:{
                    'Content-Type':'Application/json'
                },
                body:JSON.stringify({examId,currentStat,newStat})
            })
            .then(response=>{
                response.json().then(data=>{
                    console.log(data);
                    location.reload();
                })
            })
        })
    })
}
