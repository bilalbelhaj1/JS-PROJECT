document.addEventListener('DOMContentLoaded', function() {
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelPasswordBtn = document.getElementById('cancel-password');
    const passwordForm = document.getElementById('password-form');
    const profileForm = document.getElementById('profile-form');
    const profileImg = document.getElementById('profile-img');

    
    // Show password modal
    changePasswordBtn.addEventListener('click', function() {
        passwordModal.style.display = 'flex';
    });

    // Close password modal
    function closeModal() {
        passwordModal.style.display = 'none';
        passwordForm.reset();
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelPasswordBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    passwordModal.addEventListener('click', function(e) {
        if (e.target === passwordModal) {
            closeModal();
        }
    });

    // Handle password form submission
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Simple validation
        if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match!', 'danger');
            return;
        }
        
        if (newPassword.length < 8) {
            showAlert('Password must be at least 8 characters long!', 'danger');
            return;
        }
        
        fetch('/auth/changePassword',{method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({currentPassword, newPassword})
        })
        .then(response=>{
            response.json().then(data=>{
                showAlert(data.message, data.type);
            })
        })
        setTimeout(() => {
            closeModal();
        }, 400);
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        if(username.length < 6){
            showAlert("Username Must be more than 6 charactere", "danger");
        }else if(email.length < 10){
            showAlert('Please Provide a valid email', 'danger');
        }else{
             fetch('/auth/updateProfile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({username, email})
            })
               .then(response=>{
                  response.json().then(data=>{
                    showAlert(data.message, data.type);
                  })
               });
        }
    });
});