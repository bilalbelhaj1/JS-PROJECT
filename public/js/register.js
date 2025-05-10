document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher l'envoi par défaut
    console.log('Formulaire soumis !');
    const errorDiv = document.querySelector('.error-displayer');
    errorDiv.innerText = '';

    // Récupérer les valeurs du formulaire
    const Fname = document.getElementById('fname').value.trim();
    const Lname = document.getElementById('lname').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const email = document.getElementById('email').value.trim();
    const birthdate = document.getElementById('birthdate').value.trim();
    const establishment = document.getElementById('establishment').value.trim();
    const field = document.getElementById('field').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validation de base
    if (!Fname || !Lname || !gender || !email || !birthdate || !establishment || !field || !password || !role) {
        errorDiv.innerText = 'Veuillez remplir tous les champs.';
        errorDiv.style.display = 'block';
        return;
    }
    if (Fname.length < 3) {
        errorDiv.innerText = 'Le prénom doit contenir au moins 3 caractères.';
        errorDiv.style.display = 'block';
        return;
    }
    if (Lname.length < 3) {
        errorDiv.innerText = 'Le nom doit contenir au moins 3 caractères.';
        errorDiv.style.display = 'block';
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.innerText = 'Veuillez entrer une adresse e-mail valide.';
        errorDiv.style.display = 'block';
        return;
    }
    if (password.length < 8) {
        errorDiv.innerText = 'Le mot de passe doit contenir au moins 8 caractères.';
        errorDiv.style.display = 'block';
        return;
    }
    const validRoles = ['Teacher', 'Student'];
    if (!validRoles.includes(role)) {
        errorDiv.innerText = 'Veuillez sélectionner un rôle valide.';
        errorDiv.style.display = 'block';
        return;
    }

    // Préparer les données à envoyer
    const data = { Fname, Lname, gender, email, birthdate, establishment, field, password, role };

    // Envoyer les données au serveur
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 400 || response.status === 500) {
            return response.json().then(data => {
                errorDiv.innerText = data.message;
                errorDiv.style.display = 'block';
            });
        } else {
            return response.json().then(data => {
                document.getElementById('registerForm').reset();
                window.location.href = '/login';
            });
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        errorDiv.innerText = 'Échec de l\'inscription. Veuillez réessayer.';
        errorDiv.style.display = 'block';
    });
});
