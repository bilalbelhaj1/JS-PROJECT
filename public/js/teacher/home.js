// dik data blast matsiftha l backend khas dirha f sessionStorage
// redirect the teacher to create exam page then you can acces this data from the session storage
// to add it  to the exam object with the questions


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
