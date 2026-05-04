/* ============================================================
   E-VAST AGENCY — GLOBAL SCRIPT
   js/script.js · Version 1.0
   Loaded by every page. Handles: custom cursor, scroll reveal,
   nav scroll state, smooth anchor links, form submission,
   ticker pause-on-hover, and mobile nav.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. CUSTOM CURSOR ─────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    // Move dot instantly with mouse
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Lag the ring behind cursor using rAF
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', function () {
      cursor.style.opacity     = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursor.style.opacity     = '1';
      cursorRing.style.opacity = '1';
    });
  }


  /* ── 2. SCROLL REVEAL ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  /* ── 3. NAV SCROLL STATE ──────────────────────────────── */
  const nav = document.querySelector('nav');

  if (nav) {
    function onNavScroll() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll(); // run once on load
  }


  /* ── 4. SMOOTH ANCHOR LINKS ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  /* ── 5. TICKER / MARQUEE PAUSE ON HOVER ──────────────── */
  document.querySelectorAll('.ticker-track, .marquee-inner').forEach(function (track) {
    track.addEventListener('mouseenter', function () {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', function () {
      track.style.animationPlayState = 'running';
    });
  });


  /* ── 6. FORM SUBMIT (generic qual-form handler) ─────── */
  //  For pages that use the simple .qual-form (not the multi-step
  //  contact form which has its own logic).
  document.querySelectorAll('.qual-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      if (!btn || btn.disabled) return;

      // Basic field validation
      const required = form.querySelectorAll('input[required], select[required]');
      let valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderBottomColor = 'var(--error)';
          valid = false;
          setTimeout(function () {
            field.style.borderBottomColor = '';
          }, 2500);
        }
      });

      if (!valid) return;

      // Success state
      btn.textContent  = '✓ Submitted — We\'ll be in touch';
      btn.style.background = '#2a6b3a';
      btn.style.color      = '#b8f0c8';
      btn.disabled         = true;

      // Here you'd POST formData to your backend or Formspree:
      // const data = new FormData(form);
      // fetch('/api/contact', { method: 'POST', body: data });
    });
  });


  /* ── 7. PROJECT CARD CURSOR LABEL ────────────────────── */
  //  Shows "View Project" label near cursor on project cards
  const cursorLabel = document.getElementById('cursor-label');

  if (cursorLabel) {
    document.addEventListener('mousemove', function (e) {
      cursorLabel.style.left = e.clientX + 'px';
      cursorLabel.style.top  = e.clientY + 'px';
    });

    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        cursorLabel.style.opacity = '1';
      });
      card.addEventListener('mouseleave', function () {
        cursorLabel.style.opacity = '0';
      });
    });
  }


  /* ── 8. FILTER BUTTONS (Projects page) ───────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length) {
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    // Add transition to all filterable cards
    projectCards.forEach(function (card) {
      card.style.transition = 'opacity 0.35s ease';
    });

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(function (card) {
          const cats = card.dataset.category || '';
          if (filter === 'all' || cats.includes(filter)) {
            card.style.opacity        = '1';
            card.style.pointerEvents  = 'auto';
          } else {
            card.style.opacity        = '0.2';
            card.style.pointerEvents  = 'none';
          }
        });
      });
    });
  }


  /* ── 9. SERVICE ACCORDION (Services page) ────────────── */
  window.toggleService = function (id) {
    const block  = document.getElementById(id);
    if (!block) return;
    const isOpen = block.classList.contains('open');

    // Close all
    document.querySelectorAll('.service-block').forEach(function (b) {
      b.classList.remove('open');
    });

    // Open clicked one if it was closed
    if (!isOpen) {
      block.classList.add('open');
    }
  };


  /* ── 10. ACTIVE NAV LINK (mark current page) ─────────── */
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const linkFile = link.getAttribute('href').split('/').pop();
    if (linkFile === currentPath) {
      link.classList.add('active');
    }
  });


  /* ── 11. MOBILE NAV TOGGLE ──────────────────────────── */
  //  If you add a hamburger button with id="mobile-nav-toggle"
  //  and a menu with id="mobile-nav-menu", this wires it up.
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileMenu   = document.getElementById('mobile-nav-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

})();
