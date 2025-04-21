document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorDiv = document.querySelector(".error-displayer");
    errorDiv.innerText = ""; // Clear previous error messages
    errorDiv.style.color = 'red';
    // Perform validation
    if (email === "" || password === "") {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        errorDiv.innerText = "Please fill in all fields."; // Show error message
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        errorDiv.innerText = 'Please enter a valid email address.'; // show error message
        return;
    }
    if (password.length <= 8) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        errorDiv.innerText = 'Password must be at least 8 characters long.'; // show error message
        return;
    }

    // Prepare data to send
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
            // Success
            
            if (result.token) {
                //localStorage.setItem('authToken', result.token);
                console.log(result);
                document.cookie = `authToken=${result.token}; path=/; max-age=86400`;
                window.location.href = result.url;
            }
            if (result.url) {
                window.location.href = result.url; // Redirect to the URL provided in the response
            } else {
                errorDiv.style.color = 'green';
                errorDiv.style.display = 'block';
                errorDiv.innerText = result.message || 'Login successful.';
            }
        } else {
            // Handle 400, 401, 500, etc.
            errorDiv.style.display = 'block';
            errorDiv.style.color = 'red';
            errorDiv.innerText = result.message || 'Login failed.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        errorDiv.innerText = 'Something went wrong. Please try again later.';
    });

    document.getElementById('loginForm').reset();
});