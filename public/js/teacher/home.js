// dik data blast matsiftha l backend khas dirha f sessionStorage
// redirect the teacher to create exam page then you can acces this data from the session storage
// to add it  to the exam object with the questions
const createExamForm = document.getElementById('createExam-form');

createExamForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = document.getElementById('exam-title').value;
    const description = document.getElementById('exam-desc').value;
    const group = document.getElementById('exam-group').value;
    const duration = document.getElementById('duration').value;


    if(!title || !description || !group || !duration){
        alert("Please fill all the fields");
    }else if(title.length < 6 || title.length > 100){
        alert("title must be between 5 and 100 characteres");
    }else if(duration < 20){
        alert("Exam must be more then 20 min");
    }else{
        const examMetaData = {
            title,
            description,
            group,
            duration
        }
        sessionStorage.setItem('examMetaData', JSON.stringify(examMetaData));
        window.location.href = '/teacher/createExam'
    }
})

const creatExamBtn = document.getElementById('create-exam-btn');

creatExamBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const createForm = document.querySelector('.exam-form');
    createForm.classList.add('active');
    createForm.addEventListener('click',(e)=>{
        e.stopPropagation();
        if(e.target.id === 'exam-form-container'){
            e.target.classList.remove('active')
        }
    })
    const closeBtn = document.getElementById('close-form');
    closeBtn.addEventListener('click',(e)=>{
        e.preventDefault()
        createForm.classList.remove('active');
    })
    
})
