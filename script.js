const menuBtn = document.querySelector('#menuBtn');
const nav = document.querySelector('#nav');
const navLinks = document.querySelectorAll('#nav a');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
  const isOpen = nav.classList.contains('active');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
