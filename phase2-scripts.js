/* ============================================================
   Joy Ghosh Portfolio — PHASE 2 JS Add-on
   Runs alongside phase1-scripts.js. Independent, non-conflicting.
   Adds: theme toggle, scroll-reveal, project filters, back-to-top.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       1. DARK / LIGHT THEME TOGGLE (persists via localStorage)
       ========================================================= */
    const root = document.documentElement;
    const themeBtn = document.querySelector('.theme-toggle');
    const STORAGE_KEY = 'joyghosh-theme';

    // Apply saved theme on load
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      root.setAttribute('data-theme', savedTheme);
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY, next);
      });
    }

    /* =========================================================
       2. SCROLL-REVEAL (fade + slide-up on section entry)
       ========================================================= */
    if ('IntersectionObserver' in window) {
      const revealTargets = document.querySelectorAll('.reveal');
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealTargets.forEach(el => revealObs.observe(el));
    } else {
      // Fallback: show everything
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }

    /* =========================================================
       3. PROJECT FILTER TABS
       ========================================================= */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterTabs.length && projectCards.length) {

      // Compute counts per category from data-category attributes
      const counts = { all: projectCards.length };
      projectCards.forEach(c => {
        const cats = (c.dataset.category || '').split(/\s+/).filter(Boolean);
        cats.forEach(cat => { counts[cat] = (counts[cat] || 0) + 1; });
      });

      // Inject counts into tab labels
      filterTabs.forEach(tab => {
        const cat = tab.dataset.filter;
        const countEl = tab.querySelector('.count');
        if (countEl && counts[cat] != null) countEl.textContent = counts[cat];
      });

      // Filter click handler
      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const filter = tab.dataset.filter;
          filterTabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');

          projectCards.forEach(card => {
            const cats = (card.dataset.category || '').split(/\s+/);
            const show = filter === 'all' || cats.includes(filter);
            card.classList.toggle('is-filtered-out', !show);
          });
        });
      });
    }

    /* =========================================================
       4. BACK-TO-TOP BUTTON
       ========================================================= */
    const backBtn = document.querySelector('.back-to-top');
    if (backBtn) {
      const onScroll = () => {
        backBtn.classList.toggle('is-visible', window.scrollY > 600);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
})();
