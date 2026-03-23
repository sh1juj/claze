/* ═══════════════════════════════════════════════════════════════
   CLAZE — script.js
   Works on both index.html and team.html.
   - Sticky nav with scroll shadow
   - Mobile burger menu
   - IntersectionObserver fade-up animations
   - Smooth scroll with nav offset (index.html only)
   - Active nav link highlight on scroll (index.html only)
   - Concentric ring slow rotation (hero only)
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Sticky nav shadow ───────────────────────────────────── */
  var nav = document.getElementById('navbar');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile burger menu ──────────────────────────────────── */
  var burger     = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Smooth scroll with nav offset (same-page anchors only) ─ */
  var navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
    10
  ) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── IntersectionObserver — fade-up animations ───────────── */
  var fadeElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeElements.forEach(function (el) { observer.observe(el); });
  } else {
    fadeElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Active nav link highlight on scroll (index.html only) ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__links a');

  if (sections.length && navLinks.length) {
    function setActiveLink() {
      var current = '';
      sections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - navHeight - 80) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        var isActive = href === '#' + current || href === 'index.html#' + current;
        link.style.color      = isActive ? 'var(--charcoal)' : '';
        link.style.fontWeight = isActive ? '500' : '';
      });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
  }

  /* ── Concentric ring slow rotation (hero, index.html) ───── */
  var heroConc = document.querySelector('.hero__concentric');
  if (heroConc) {
    var angle = 0;
    function rotateRings() {
      angle += 0.012;
      heroConc.style.transform = 'rotate(' + angle + 'deg)';
      requestAnimationFrame(rotateRings);
    }
    requestAnimationFrame(rotateRings);
  }

})();
