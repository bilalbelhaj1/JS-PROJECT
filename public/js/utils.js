function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alert-message');
    const alertText = document.getElementById('alert-text');
    const closeBtn = document.getElementById('alert-close');

    // Reset classes
    alertBox.className = 'alert';

    // Add type-specific class
    alertBox.classList.add(`alert-${type}`);

    // Set message
    alertText.textContent = message;

    // Show alert
    alertBox.style.display = 'flex';
    setTimeout(() => {
        alertBox.classList.add('alert-visible');
        alertBox.classList.remove('alert-hidden');
    }, 10); // Slight delay to allow transition

    // Auto hide after 5 seconds
    const timeout = setTimeout(() => {
        hideAlert();
    }, 5000);

    // Manual close
    closeBtn.onclick = function () {
        clearTimeout(timeout);
        hideAlert();
    };
}

function hideAlert() {
    const alertBox = document.getElementById('alert-message');
    alertBox.classList.remove('alert-visible');
    alertBox.classList.add('alert-hidden');

    // After animation ends, hide completely
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 400);
}
