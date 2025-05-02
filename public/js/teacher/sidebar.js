document.querySelectorAll('.sidebar-menu li').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
    });
  });
  