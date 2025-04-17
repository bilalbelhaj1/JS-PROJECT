document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Basic validation
    if (!username || !email || !password || !role) {
        alert('Please fill in all fields.');
        return;
    }
    if (username.length < 5) {
        alert('Username must be at least 5 characters long.');
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length <= 8) {
        alert('Password must be more than 8 characters.');
        return;
    }
    const validRoles = ['Teacher', 'Student']; // Match the case with your HTML options
    if (!validRoles.includes(role)) {
        alert('Please select a valid role.');
        return;
    }

    // Prepare data to send
    const data = { username, email, password, role };

    console.log(data);
    // Send data to the server using fetch
fetch('/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // Let server know it's JSON
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (response.redirected) {
        window.location.href = response.url; // Redirect if needed
    } else if (response.ok) {
        return response.text();
    } else {
        throw new Error('Registration failed');
    }
})
.then(result => {
    alert(result); // Optional: show success message
})
.catch(error => {
    console.error('Error:', error);
    alert('There was a problem with registration.');
});
});

