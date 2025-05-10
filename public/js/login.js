document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêcher l'envoi par défaut

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorDiv = document.querySelector(".error-displayer");
    errorDiv.innerText = ""; // Vider les anciens messages
    errorDiv.style.color = 'red';

    // Validation de base
    if (email === "" || password === "") {
        errorDiv.style.display = 'block';
        errorDiv.innerText = "Veuillez remplir tous les champs.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = "Veuillez entrer une adresse e-mail valide.";
        return;
    }

    if (password.length < 8) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = "Le mot de passe doit contenir au moins 8 caractères.";
        return;
    }

    // Préparer les données à envoyer
    const data = { email, password };

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        const result = await response.json();

        if (response.status === 200 || response.status === 201) {
            // Succès
            if (result.token) {
                document.cookie = `authToken=${result.token}; path=/; max-age=86400`;
            }
            if (result.url) {
                window.location.href = result.url; // Redirection
            } else {
                errorDiv.style.color = 'green';
                errorDiv.style.display = 'block';
                errorDiv.innerText = result.message || "Connexion réussie.";
            }
            document.getElementById('loginForm').reset(); // Vider le formulaire après réussite
        } else {
            // Gérer les erreurs (400, 401, 500, etc.)
            errorDiv.style.display = 'block';
            errorDiv.style.color = 'red';
            errorDiv.innerText = result.message || "Échec de la connexion.";
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        errorDiv.innerText = "Une erreur est survenue. Veuillez réessayer plus tard.";
    });
});
