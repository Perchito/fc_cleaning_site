/* FC Cleaning — Motion One animations
   Loaded after includes.js injects header/footer.
   Respects prefers-reduced-motion automatically via the
   reduced-motion check at the top. */

(function () {
  'use strict';

  // Bail out entirely for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Wait for Motion One to be available on the global scope
  function waitForMotion(cb) {
    if (window.Motion) { cb(window.Motion); return; }
    const id = setInterval(() => {
      if (window.Motion) { clearInterval(id); cb(window.Motion); }
    }, 30);
  }

  waitForMotion(({ animate, inView, spring }) => {

    /* ─────────────────────────────────────────
       1. HERO COPY — staggered entrance
       ───────────────────────────────────────── */
    const heroCopy = document.querySelector('.hero-copy');
    if (heroCopy) {
      const els = [
        heroCopy.querySelector('.hero-eyebrow'),
        heroCopy.querySelector('h1'),
        heroCopy.querySelector('.hero-divider'),
        heroCopy.querySelector('.lead'),
        heroCopy.querySelector('.hero-actions'),
        heroCopy.querySelector('.hero-pills'),
      ].filter(Boolean);

      els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
      });

      els.forEach((el, i) => {
        animate(
          el,
          { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
          { delay: 0.1 + i * 0.08, duration: 0.55, easing: [0.25, 1, 0.5, 1] }
        );
      });
    }

    /* ─────────────────────────────────────────
       2. PAGE HERO (inner pages)
       ───────────────────────────────────────── */
    const pageHero = document.querySelector('.page-hero .container');
    if (pageHero) {
      const els = [
        pageHero.querySelector('.hero-eyebrow'),
        pageHero.querySelector('h1'),
        pageHero.querySelector('.lead'),
      ].filter(Boolean);

      els.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
      });

      els.forEach((el, i) => {
        animate(
          el,
          { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
          { delay: 0.08 + i * 0.1, duration: 0.5, easing: [0.25, 1, 0.5, 1] }
        );
      });
    }

    /* ─────────────────────────────────────────
       3. TRUSTED PANEL
       ───────────────────────────────────────── */
    inView('.trusted-panel', ({ target }) => {
      animate(
        target,
        { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
    }, { amount: 0.3 });

    /* ─────────────────────────────────────────
       4. SECTION HEADINGS
       ───────────────────────────────────────── */
    document.querySelectorAll('.section-heading').forEach(heading => {
      inView(heading, ({ target }) => {
        animate(
          target,
          { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
          { duration: 0.55, easing: [0.25, 1, 0.5, 1] }
        );
      }, { amount: 0.4 });
    });

    /* ─────────────────────────────────────────
       5. CARDS — service, feature, process, FAQ
       ───────────────────────────────────────── */
    const cardSelectors = [
      '.service-card',
      '.feature-card',
      '.process-card',
      '.faq-item',
      '.stat-card',
    ];

    cardSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((card, i) => {
        inView(card, ({ target }) => {
          animate(
            target,
            { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
            {
              delay: (i % 4) * 0.07,  // stagger within rows of up to 4
              duration: 0.5,
              easing: [0.25, 1, 0.5, 1],
            }
          );
        }, { amount: 0.2 });
      });
    });

    /* ─────────────────────────────────────────
       6. TRUST STRIP ITEMS
       ───────────────────────────────────────── */
    document.querySelectorAll('.trust-item').forEach((item, i) => {
      inView(item, ({ target }) => {
        animate(
          target,
          { opacity: [0, 1], transform: ['scale(0.94)', 'scale(1)'] },
          { delay: i * 0.06, duration: 0.45, easing: [0.34, 1.56, 0.64, 1] }
        );
      }, { amount: 0.5 });
    });

    /* ─────────────────────────────────────────
       7. SPLIT GRID (about/services image+text)
       ───────────────────────────────────────── */
    document.querySelectorAll('.split-grid > *').forEach((col, i) => {
      const dir = i % 2 === 0 ? '-24px' : '24px';
      inView(col, ({ target }) => {
        animate(
          target,
          { opacity: [0, 1], transform: [`translateX(${dir})`, 'translateX(0px)'] },
          { duration: 0.6, easing: [0.25, 1, 0.5, 1] }
        );
      }, { amount: 0.25 });
    });

    /* ─────────────────────────────────────────
       8. CTA SECTIONS
       ───────────────────────────────────────── */
    ['.cta-full-inner', '.cta-band-inner'].forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      inView(el, ({ target }) => {
        animate(
          target,
          { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
          { duration: 0.55, easing: [0.25, 1, 0.5, 1] }
        );
      }, { amount: 0.3 });
    });

    /* ─────────────────────────────────────────
       9. CONTACT FORM + INFO CARDS
       ───────────────────────────────────────── */
    ['.contact-form-wrap', '.contact-info-card'].forEach((sel, i) => {
      document.querySelectorAll(sel).forEach(el => {
        inView(el, ({ target }) => {
          animate(
            target,
            { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
            { delay: i * 0.1, duration: 0.5, easing: [0.25, 1, 0.5, 1] }
          );
        }, { amount: 0.2 });
      });
    });

    /* ─────────────────────────────────────────
       10. BUTTON PRESS MICRO-INTERACTION
       ───────────────────────────────────────── */
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        animate(btn, { scale: [1, 0.96] }, { duration: 0.12, easing: 'ease-out' });
      });
      btn.addEventListener('pointerup', () => {
        animate(btn, { scale: [0.96, 1] }, { duration: 0.2, easing: [0.34, 1.56, 0.64, 1] });
      });
      btn.addEventListener('pointerleave', () => {
        animate(btn, { scale: 1 }, { duration: 0.15 });
      });
    });

    /* ─────────────────────────────────────────
       11. FOOTER COLUMNS
       ───────────────────────────────────────── */
    document.querySelectorAll('.footer-top > *').forEach((col, i) => {
      inView(col, ({ target }) => {
        animate(
          target,
          { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
          { delay: i * 0.07, duration: 0.45, easing: [0.25, 1, 0.5, 1] }
        );
      }, { amount: 0.3 });
    });

  }); // end waitForMotion

})();
