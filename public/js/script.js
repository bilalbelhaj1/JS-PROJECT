document.querySelector('.menu-toggle').addEventListener('click',()=>{
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display = 'flex';
    document.querySelector('.close-menu-Btn').addEventListener('click',()=>{
        sideBar.style.display = 'none';
    })
})


const isLoggedin = localStorage.getItem('authToken') ;
if(isLoggedin){
    document.querySelectorAll('#login').forEach((btn)=>{
        btn.style.display = 'none';
    })
    document.querySelectorAll('#register').forEach((btn)=>{
        btn.style.display = 'none';
    });
    document.querySelectorAll('#logout').forEach((btn)=>{
        btn.style.display = 'block';
        btn.addEventListener('click',()=>{
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        })
    })
}else{
    document.querySelectorAll('#logout').forEach((btn)=>{
        btn.style.display = 'none';
    })
}