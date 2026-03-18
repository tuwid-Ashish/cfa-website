/* ============================================================
   CFA – Main JavaScript
   Nav scroll, hamburger, counters, fade-in, lightbox, forms
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Nav on Scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Hamburger Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href], .dropdown-item[href]').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      // Also mark parent dropdown trigger
      const parent = link.closest('.nav-item');
      if (parent) parent.querySelector('.nav-link')?.classList.add('active');
    }
  });

  /* ── Hero Parallax BG ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1) translateY(${window.scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  /* ── Animate Counter Numbers ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ── Intersection Observer for Fade-in + Counters ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Gallery Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (src) {
          lightboxImg.src = src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ── Filter Tabs ── */
  document.querySelectorAll('.filter-tabs').forEach(tabsEl => {
    tabsEl.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.filter;
        const grid = tabsEl.nextElementSibling;
        if (!grid) return;
        grid.querySelectorAll('[data-cat]').forEach(item => {
          const match = target === 'all' || item.dataset.cat === target;
          item.style.display = match ? '' : 'none';
        });
        // Update count if exists
        const countEl = document.querySelector('.results-count strong');
        if (countEl) {
          const visible = grid.querySelectorAll('[data-cat]:not([style*="display: none"])').length;
          countEl.textContent = visible;
        }
      });
    });
  });

  /* ── Accordion ── */
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('active');
      // Close all
      document.querySelectorAll('.accordion-btn').forEach(b => {
        b.classList.remove('active');
        b.nextElementSibling?.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('active');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  /* ── Contact / Membership Form Submit ── */
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector('.form-success');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }
      setTimeout(() => {
        form.reset();
        if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.original || 'Submit'; }
        if (success) { success.style.display = 'block'; }
        setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
      }, 1200);
    });
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.dataset.original = btn.innerHTML;
  });

  /* ── Scroll to top on smooth links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
