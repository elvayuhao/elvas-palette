const header = document.querySelector('[data-header]');
const menu = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const dialog = document.querySelector('[data-dialog]');
const dialogImage = document.querySelector('[data-dialog-image]');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (finePointer.matches) {
  document.querySelectorAll('.project').forEach((project) => {
    const painting = project.querySelector('.image-main');

    project.addEventListener('pointermove', (event) => {
      const bounds = project.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      project.style.setProperty('--bg-x', `${40 + (x * 20)}%`);
      project.style.setProperty('--bg-y', `${40 + (y * 20)}%`);
      painting?.style.setProperty('--ry', `${(x - 0.5) * 4}deg`);
      painting?.style.setProperty('--rx', `${(0.5 - y) * 4}deg`);
    });

    project.addEventListener('pointerleave', () => {
      project.style.setProperty('--bg-x', '50%');
      project.style.setProperty('--bg-y', '50%');
      painting?.style.setProperty('--ry', '0deg');
      painting?.style.setProperty('--rx', '0deg');
    });
  });
}

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!dialog || !dialogImage) return;
    dialogImage.src = button.dataset.lightbox;
    const sourceImage = button.querySelector('img');
    dialogImage.alt = sourceImage?.alt || 'Expanded artwork';
    dialog.showModal();
  });
});

document.querySelector('[data-close]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
