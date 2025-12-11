document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper function
  const $ = (sel, all = false) => all ? Array.from(document.querySelectorAll(sel)) : document.querySelector(sel);

  // ===== Active nav link on scroll =====
  const navLinks = $('#navbar') ? $('#navbar').querySelectorAll('.scrollto') : [];
  const setActive = () => {
    const pos = window.scrollY + 200;
    navLinks.forEach(link => {
      const id = link.getAttribute('href');
      const sec = id && id.startsWith('#') ? document.querySelector(id) : null;
      if (!sec) return;
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  window.addEventListener('scroll', setActive);
  window.addEventListener('load', setActive);

  // ===== Smooth scroll for .scrollto links =====
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.scrollto');
    if (!t) return;
    const id = t.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();

    // Close mobile menu if open
    const sidebar = $('#sidebar');
    const navToggle = $('.mobile-nav-toggle');
    if (sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      if (navToggle) navToggle.innerHTML = '<i class="bx bx-menu"></i>';
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ===== Mobile Nav Toggle =====
  const navToggle = $('.mobile-nav-toggle');
  const sidebar = $('#sidebar');

  if (navToggle && sidebar) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
      navToggle.innerHTML = sidebar.classList.contains('active') 
        ? '<i class="bx bx-x"></i>' 
        : '<i class="bx bx-menu"></i>';
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') &&
          !sidebar.contains(e.target) &&
          !navToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        navToggle.innerHTML = '<i class="bx bx-menu"></i>';
      }
    });

    // Close sidebar on window resize if desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        navToggle.innerHTML = '<i class="bx bx-menu"></i>';
      }
    });
  }

  // ===== Typed effect =====
  const typedEl = $('.typed');
  if (typedEl && window.Typed) {
    const items = typedEl.getAttribute('data-typed-items').split(',').map(s => s.trim());
    new Typed('.typed', { 
      strings: items, 
      typeSpeed: 90, 
      backSpeed: 45, 
      backDelay: 1600, 
      loop: true 
    });
  }

  // ===== Animate skill bars with proper data attributes =====
  const skillsSection = $('#skills');
  const bars = $('.progress .bar', true);
  
  if ('IntersectionObserver' in window && bars.length && skillsSection) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger animation for all bars
          bars.forEach(bar => {
            const value = bar.getAttribute('data-value');
            if (value) {
              // Set CSS custom property and width
              bar.style.setProperty('--value', value + '%');
              setTimeout(() => {
                bar.style.width = value + '%';
              }, 100);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    io.observe(skillsSection);
  } else if (bars.length) {
    // Fallback for browsers without IntersectionObserver
    bars.forEach(bar => {
      const value = bar.getAttribute('data-value');
      if (value) {
        bar.style.width = value + '%';
      }
    });
  }

  // ===== AOS initialization =====
  if (window.AOS) {
    AOS.init({ 
      duration: 800, 
      easing: 'ease-out', 
      once: true, 
      offset: 100,
      delay: 50
    });
  }

  // ===== Contact form =====
  const form = $('#contactForm');
  const status = $('#form-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending...';
      status.style.color = '#149ddd';

      const formData = new FormData(form);
      
      try {
        const response = await fetch(form.action, { 
          method: form.method, 
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        let data;
        try { 
          data = await response.json(); 
        } catch { 
          data = { success: response.ok }; 
        }
        
        if (data.success) {
          status.textContent = '✓ Message sent! I will get back to you shortly.';
          status.style.color = '#8ee6a4';
          form.reset();
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            status.textContent = '';
          }, 5000);
        } else {
          status.textContent = '✗ Something went wrong. Please try again.';
          status.style.color = '#ff4a57';
        }
      } catch (err) {
        status.textContent = '✗ Network error. Please try again later.';
        status.style.color = '#ff4a57';
        console.error('Form submission error:', err);
      }
    });
  }

  // ===== Theme Toggle =====
  const themeToggle = $('#theme-toggle');
  const body = document.body;

  // Check for saved theme preference or default to dark mode
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    body.classList.add("light-mode");
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="bx bx-moon me-1"></i><span>Dark Mode</span>';
    }
  } else {
    // Default to dark mode
    localStorage.setItem("theme", "dark");
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="bx bx-sun me-1"></i><span>Light Mode</span>';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle("light-mode");
      
      if (body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="bx bx-moon me-1"></i><span>Dark Mode</span>';
      } else {
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="bx bx-sun me-1"></i><span>Light Mode</span>';
      }
    });
  }

  // ===== Year in footer =====
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== Age calculation =====
  const ageEl = $('#age');
  if (ageEl) {
    const birthDate = new Date(2004, 2, 17); // March 17, 2004 (month is 0-indexed)
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    ageEl.textContent = age;
  }

  // ===== Back to top =====
  const backToTop = $('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    };
    
    window.addEventListener('scroll', toggleBackToTop);
    window.addEventListener('load', toggleBackToTop);

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    });
  }

  // ===== Lazy load images =====
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===== Preloader =====
  const preloader = $('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    });
  }

  // ===== Add animation to project cards on hover =====
  const projectCards = $('.project-card', true);
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.project-img i');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.project-img i');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // ===== Smooth reveal for sections =====
  const revealSections = () => {
    const sections = $('section', true);
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const revealPoint = 150;
      
      if (sectionTop < windowHeight - revealPoint) {
        section.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', revealSections);
  window.addEventListener('load', revealSections);

  // ===== Performance optimization: Debounce scroll events =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debounce to scroll-heavy functions
  window.addEventListener('scroll', debounce(() => {
    setActive();
    revealSections();
  }, 10));


});