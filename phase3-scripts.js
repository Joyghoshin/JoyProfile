/* ============================================================
   Joy Ghosh Portfolio — PHASE 3 JS Delight Layer (v2)
   Runs alongside phase1 + phase2 scripts. No conflicts.
   Adds: AI Twin prompt teaser + FULL CHAT modal (iframe),
         contact form, copy-email toast, kbd shortcuts.
   ============================================================ */
(function () {
  'use strict';

  const AITWIN_URL = 'https://joyghoshin-joy-ghosh-ai-twin-new.hf.space';

  /* =========================================================
     DEV CONSOLE EASTER EGG (runs immediately)
     ========================================================= */
  const style = 'font-size:14px;font-weight:bold;color:#7c8cff;';
  const styleDim = 'font-size:12px;color:#67e8f9;';
  console.log('%c👋 Hey there, dev friend!', style);
  console.log('%cThanks for peeking under the hood.', styleDim);
  console.log('%cIf you\'re a recruiter, engineer, or PM — reach out:', styleDim);
  console.log('%c📧 joyghoshin@gmail.com  ·  💼 linkedin.com/in/joy-g-b11844242', styleDim);
  console.log('%c✨ Fun fact: This whole site is vanilla HTML/CSS/JS. No frameworks. No build step.', styleDim);

  document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       1. AI TWIN — Teaser + Full Chat Modal (in-page)
       ========================================================= */
    const aiFab = document.querySelector('.fab.aitwin');
    const teaser = document.querySelector('.aitwin-modal');
    const teaserClose = document.querySelector('.aitwin-modal__close');
    const teaserOpenFull = document.querySelector('.aitwin-open-full');
    const prompts = document.querySelectorAll('.aitwin-prompt');

    const chatOverlay = document.querySelector('.chat-overlay');
    const chatClose = document.querySelector('.chat-modal__close');
    const chatExpand = document.querySelector('.chat-modal__expand');
    const chatIframe = document.querySelector('.chat-modal__iframe');
    const chatLoader = document.querySelector('.chat-modal__loader');

    // --- Open the teaser (small suggested-prompts card) ---
    function openTeaser() { if (teaser) teaser.classList.add('is-open'); }
    function closeTeaser() { if (teaser) teaser.classList.remove('is-open'); }

    // --- Open the FULL chat modal with iframe ---
    function openChat(promptText) {
      if (!chatOverlay || !chatIframe) return;

      const url = promptText
        ? `${AITWIN_URL}?q=${encodeURIComponent(promptText)}`
        : AITWIN_URL;

      // Only reload iframe if URL changed (avoids reload on re-open of same prompt)
      if (chatIframe.dataset.currentUrl !== url) {
        chatIframe.dataset.currentUrl = url;
        chatIframe.src = url;
        if (chatLoader) chatLoader.classList.remove('is-hidden');
      }

      chatOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';   // lock background scroll
      closeTeaser();
    }

    function closeChat() {
      if (!chatOverlay) return;
      chatOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Hide loader when iframe finishes loading
    if (chatIframe && chatLoader) {
      chatIframe.addEventListener('load', () => {
        chatLoader.classList.add('is-hidden');
      });
    }

    // FAB click → show teaser
    if (aiFab) {
      aiFab.addEventListener('click', (e) => {
        e.preventDefault();
        openTeaser();
      });
    }

    // Teaser close
    if (teaserClose) teaserClose.addEventListener('click', closeTeaser);

    // "Open full chat →" button in teaser footer
    if (teaserOpenFull) {
      teaserOpenFull.addEventListener('click', (e) => {
        e.preventDefault();
        openChat();
      });
    }

    // Prompt click → open full chat with the prompt
    prompts.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openChat(btn.dataset.prompt || '');
      });
    });

    // Chat modal close
    if (chatClose) chatClose.addEventListener('click', closeChat);

    // Click on overlay backdrop (not the modal itself) → close
    if (chatOverlay) {
      chatOverlay.addEventListener('click', (e) => {
        if (e.target === chatOverlay) closeChat();
      });
    }

    // Expand button → open the AI Twin in a new tab (fallback for users who prefer it)
    if (chatExpand) {
      chatExpand.addEventListener('click', () => {
        const url = chatIframe && chatIframe.dataset.currentUrl
          ? chatIframe.dataset.currentUrl
          : AITWIN_URL;
        window.open(url, '_blank', 'noopener');
      });
    }

    // Escape closes chat first, then teaser
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (chatOverlay && chatOverlay.classList.contains('is-open')) {
        closeChat();
      } else if (teaser && teaser.classList.contains('is-open')) {
        closeTeaser();
      }
    });

    // Click outside teaser to close it (but not when chat is open)
    document.addEventListener('click', (e) => {
      if (!teaser || !aiFab) return;
      if (chatOverlay && chatOverlay.classList.contains('is-open')) return;
      if (!teaser.contains(e.target) && !aiFab.contains(e.target)) {
        closeTeaser();
      }
    });

    /* =========================================================
       2. CONTACT FORM (Formspree-ready)
       ========================================================= */
    const form = document.querySelector('.contact-form form');
    const status = document.querySelector('.contact-form .form-status');

    if (form && status) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        status.className = 'form-status';
        status.textContent = '';

        try {
          const formData = new FormData(form);
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            status.classList.add('is-success');
            status.textContent = '✓ Thanks! I\'ll reply within 24 hours.';
            form.reset();
          } else {
            throw new Error('Form submission failed');
          }
        } catch (err) {
          status.classList.add('is-error');
          status.textContent = '⚠ Something went wrong. Please email me directly.';
        } finally {
          btn.disabled = false;
          btn.textContent = 'Send Message';
        }
      });
    }

    /* =========================================================
       3. COPY EMAIL + TOAST
       ========================================================= */
    const copyBtn = document.querySelector('.copy-email-btn');
    const toast = document.querySelector('.toast');

    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2400);
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const email = copyBtn.dataset.email || 'joyghoshin@gmail.com';
        try {
          await navigator.clipboard.writeText(email);
          showToast('Email copied to clipboard');
        } catch {
          showToast('Copy failed — please copy manually');
        }
      });
    }

    /* =========================================================
       4. KEYBOARD SHORTCUTS
       ========================================================= */
    const kbdHint = document.querySelector('.kbd-hint');
    let hintShown = false;

    let showHintOnce = () => {
      if (hintShown || !kbdHint) return;
      hintShown = true;
      kbdHint.classList.add('is-visible');
      setTimeout(() => kbdHint.classList.remove('is-visible'), 4000);
      window.removeEventListener('scroll', showHintOnce);
    };
    window.addEventListener('scroll', showHintOnce, { passive: true });

    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === '/' || e.key === 'p') {
        e.preventDefault();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 't') {
        e.preventDefault();
        document.querySelector('.theme-toggle')?.click();
      } else if (e.key === 'c') {
        e.preventDefault();
        document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'h' || e.key === 'g') {
        e.preventDefault();
        document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
