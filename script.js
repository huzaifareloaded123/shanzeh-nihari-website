document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Navbar shadow when scrolling
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 8px 30px rgba(0,0,0,0.35)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  console.log('Shanzeh Nihari website loaded!');
});
