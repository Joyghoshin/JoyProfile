/* ============================================================
   Joy Ghosh Portfolio — PHASE 1 JS
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- 1. Nav shadow on scroll ---- */
    const nav = document.querySelector('.site-nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- 2. Active-section highlight ---- */
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
    const sections = [];
    navLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) sections.push({ id, el, link: a });
    });
    if ('IntersectionObserver' in window && sections.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l =>
              l.classList.toggle('is-active', l.getAttribute('href') === '#' + id)
            );
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
      sections.forEach(s => io.observe(s.el));
    }

    /* ---- 3. Mobile nav toggle ---- */
    const toggle = document.querySelector('.nav-toggle');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
      navLinks.forEach(l => l.addEventListener('click', () => nav.classList.remove('is-open')));
    }

    /* ---- 4. Timeline: show earlier roles ---- */
    const tlToggle = document.querySelector('.timeline-toggle');
    if (tlToggle) {
      tlToggle.addEventListener('click', () => {
        const hidden = document.querySelectorAll('.timeline .is-hidden');
        const expanded = tlToggle.dataset.expanded === 'true';
        hidden.forEach(el => el.style.display = expanded ? 'none' : 'block');
        tlToggle.dataset.expanded = expanded ? 'false' : 'true';
        tlToggle.textContent = expanded
          ? '↓ Show earlier roles (2011 & before)'
          : '↑ Hide earlier roles';
      });
      tlToggle.dataset.expanded = 'false';
      tlToggle.textContent = '↓ Show earlier roles (2011 & before)';
    }
  });
})();