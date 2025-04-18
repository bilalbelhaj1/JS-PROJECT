document.querySelector('.menu-toggle').addEventListener('click',()=>{
    const sideBar = document.querySelector('.sideBar')
    sideBar.style.display = 'flex';
    document.querySelector('.close-menu-Btn').addEventListener('click',()=>{
        sideBar.style.display = 'none';
    })
})