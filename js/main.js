/* ============================================================
   HUSH Website — main.js
   ============================================================ */

/* ── Dark / Light Mode ──────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('hush-theme', theme);
}

// On load: respect saved preference, then system preference
(function initTheme() {
  const saved  = localStorage.getItem('hush-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || system);
})();

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── Sticky Nav ─────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Scroll Animations (Intersection Observer) ──────────────── */
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
fadeEls.forEach(el => observer.observe(el));

/* ── Gallery Drag-to-Scroll ──────────────────────────────────── */
const track = document.querySelector('.gallery__track');
if (track) {
  let isDown = false, startX = 0, scrollLeft = 0;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.classList.add('grabbing');
    startX    = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('grabbing');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('grabbing');
  });

  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
  });

  // Touch drag
  let touchStartX = 0, touchScrollLeft = 0;
  track.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].pageX;
    touchScrollLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    const dx = touchStartX - e.touches[0].pageX;
    track.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });
}

/* ── Smooth scroll for nav links ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── APK download counter (UI feedback) ─────────────────────── */
document.querySelectorAll('.js-download').forEach(btn => {
  btn.addEventListener('click', () => {
    // Vercel Web Analytics custom event
    if (window.va) window.va('event', { name: 'apk_download' });
    
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Download started';
    btn.style.background = '#2E4A2A';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
    }, 3000);
  });
});
