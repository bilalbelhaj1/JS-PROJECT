document.querySelectorAll('ul li').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('ul li').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
    });
  });
  