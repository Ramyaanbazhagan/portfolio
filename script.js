// ===== Mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Close' : 'Menu';
}
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible')); // older browsers: show everything
}

// ===== Active navigation link =====
const navItems = document.querySelectorAll('.links a');
const sections = [...navItems].map(a => document.querySelector(a.getAttribute('href')));
function updateActive() {
  const y = window.scrollY + 120;
  let current = null;
  sections.forEach(s => { if (s && s.offsetTop <= y) current = s.id; });
  navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

// ===== Back-to-top button =====
const toTop = document.getElementById('toTop');
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  toTop.hidden = window.scrollY < 500;
  updateActive();
}, { passive: true });
updateActive();

// ===== Placeholder links (projects without a URL yet) =====
// Replace href="#" and the text in index.html with a real URL to make them work.
document.querySelectorAll('[data-todo]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

// ===== Contact form validation =====
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  subject: v => v.trim().length >= 3 || 'Enter a subject.',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '';
  let firstBad = null;
  Object.keys(rules).forEach(id => {
    const field = form.elements[id];
    const result = rules[id](field.value);
    const ok = result === true;
    document.getElementById(id + 'Err').textContent = ok ? '' : result;
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok && !firstBad) firstBad = field;
  });
  if (firstBad) { firstBad.focus(); return; }

  // No backend: open the visitor's email app with the message prefilled.
  // To use a form service instead, replace this block with a fetch() to its endpoint.
  const body = `${form.elements.message.value}\n\nFrom: ${form.elements.name.value} (${form.elements.email.value})`;
  window.location.href = `mailto:ramya.anbu58@gmail.com?subject=${encodeURIComponent(form.elements.subject.value)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Opening your email app to send the message.';
  form.reset();
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Scroll progress bar =====
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}, { passive: true });

// ===== Rotating focus areas in the hero (all taken from the resume) =====
const focusEl = document.getElementById('focusWord');
const focusAreas = ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Explainable AI'];
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let fi = 0;
  setInterval(() => {
    focusEl.classList.add('swap');
    setTimeout(() => {
      fi = (fi + 1) % focusAreas.length;
      focusEl.textContent = focusAreas[fi];
      focusEl.classList.remove('swap');
    }, 350);
  }, 2800);
}
