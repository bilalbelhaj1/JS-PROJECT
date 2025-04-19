document.querySelector('.menu-toggle').addEventListener('click', () => {
    const sideBar = document.querySelector('.sideBar');
    sideBar.style.display = 'flex';
    document.querySelector('.close-menu-Btn').addEventListener('click', () => {
        sideBar.style.display = 'none';
    });
});

// Function to get a cookie by name
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

const authToken = getCookie('authToken');

if (authToken) {
    document.querySelectorAll('#login').forEach((btn) => {
        btn.style.display = 'none';
    });
    document.querySelectorAll('#register').forEach((btn) => {
        btn.style.display = 'none';
    });
    document.querySelectorAll('#logout').forEach((btn) => {
        btn.style.display = 'block';
        btn.addEventListener('click', () => {
            // Clear the cookie by setting its max-age to 0
            document.cookie = 'authToken=; path=/; max-age=0';
            window.location.href = '/login';
        });
    });
} else {
    document.querySelectorAll('#logout').forEach((btn) => {
        btn.style.display = 'none';
    });
}
