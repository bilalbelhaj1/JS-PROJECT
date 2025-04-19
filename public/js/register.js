document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    console.log('Form submitted!'); // Log to console
    const errorDiv = document.querySelector('.error-displayer');
    errorDiv.innerText = ''; 

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Basic validation
    if (!username || !email || !password || !role) {
        errorDiv.innerText = 'Please fill in all fields.';
        errorDiv.style.display = 'block' // show error message
        return;
    }
    if (username.length < 5) {
        errorDiv.innerText = 'Username must be at least 5 characters long.'; // show error message
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
    const validRoles = ['Teacher', 'Student']; 
    if (!validRoles.includes(role)) {
        errorDiv.innerText = 'Please select a valid role.';
        errorDiv.style.display = 'block' // show error message
        return;
    }

    // Prepare data to send
    const data = { username, email, password, role };

    //console.log(data);

        
    // Send data to the server using fetch
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Let server know it's JSON
        },
        body: JSON.stringify(data)
    })
    .then(response =>{
        if(response.status === 400 || response.status === 500) {
           // get the json data from the response
           return response.json().then(data => {
                errorDiv.innerText = data.message;
                errorDiv.style.display = 'block';
            });
        }else{
            return response.json().then(data => {
                window.location.href = '/login';
            })
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorDiv.innerText = 'Registration failed. Please try again.'; // show error message
    });

        
    // clear the form after submission
    document.getElementById('registerForm').reset();
});

