function showAlert(message, type) {
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = message;
    alertMessage.className = 'alert';
    alertMessage.classList.add(`alert-${type}`);
    alertMessage.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 5000);
}