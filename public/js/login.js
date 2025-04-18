document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorDiv = document.querySelector(".error-displayer");
    errorDiv.innerText = ""; // Clear previous error messages
    errorDiv.style.color = 'red';
    // Perform validation
    if (email === "" || password === "") {
        errorDiv.innerText = "Please fill in all fields."; // Show error message
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.innerText = 'Please enter a valid email address.'; // show error message
        return;
    }
    if (password.length <= 8) {
        errorDiv.innerText = 'Password must be at least 8 characters long.'; // show error message
        return;
    }

    // Prepare data to send
    const data = { email, password };

    // Send data to the server using fetch
    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Let server know it's JSON
        },
        body: JSON.stringify(data)
    })
        .then(async (response) => {
            if (response.redirected) {
                window.location.href = response.url; // Redirect to the home page
            } else if (response.ok) {
                const message = await response.text();
                errorDiv.style.color = 'green';
                errorDiv.innerText = message; // Show success message
            } else {
                const errorMessage = await response.text();
                errorDiv.innerText = errorMessage || 'Login failed. Please try again.'; // Show error message
            }
        })
        .catch((error) => {
            errorDiv.innerText = error.message; // Show error message
        });
    document.getElementById('loginForm').reset(); // Reset the form fields
});