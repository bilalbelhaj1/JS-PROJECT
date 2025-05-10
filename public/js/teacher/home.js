const createExamForm = document.getElementById('createExam-form');

createExamForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById('exam-title').value;
    const description = document.getElementById('exam-desc').value;
    const group = document.getElementById('exam-group').value;

    if (!title || !description || !group) {
        showAlert("Veuillez remplir tous les champs", 'danger');
    } else if (title.length < 6 || title.length > 100) {
        showAlert("Le titre doit comporter entre 6 et 100 caractères", 'danger');
    } else {
        const examMetaData = {
            title,
            group,
            description
        };
        sessionStorage.setItem('examMetaData', JSON.stringify(examMetaData));
        window.location.href = '/teacher/createExam';
    }
});

const creatExamBtn = document.getElementById('create-exam-btn');

creatExamBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const createForm = document.querySelector('.exam-form');
    createForm.classList.add('active');
    createForm.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.id === 'exam-form-container') {
            e.target.classList.remove('active');
        }
    });
    const closeBtn = document.getElementById('close-form');
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createForm.classList.remove('active');
    });
});
