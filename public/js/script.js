document.querySelector('.menu-toggle').addEventListener('click', () => {
    const sideBar = document.querySelector('.sideBar');
    sideBar.style.display = 'flex';
    document.querySelector('.close-menu-Btn').addEventListener('click', () => {
        sideBar.style.display = 'none';
    });
});

// Navbar dropdown
const dropDownToglle = document.querySelector('.dropDownn-toggle');
const dropdownMenu =  document.querySelector('.dropdown-menu');
dropDownToglle.addEventListener('click',()=>{
    dropdownMenu.classList.toggle('show');
})

document.querySelector('.dropDownn-toggle-sidebar').addEventListener('click',()=>{
    document.querySelector('.dropdown-menu-sideBar').classList.toggle('show')
})

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
    document.querySelectorAll('.dropDownn-toggle').forEach((btn) => {
        btn.style.display = 'block';
        document.querySelectorAll('#logout').forEach(btn=>{
            btn.addEventListener('click', () => {
                // Clear the cookie by setting its max-age to 0
                document.cookie = 'authToken=; path=/; max-age=0';
                window.location.href = '/login';
            });
        })
    });
} else {
    document.querySelectorAll('.dropDownn-toggle').forEach((btn) => {
        btn.style.display = 'none';
    });
}
