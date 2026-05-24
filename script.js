/* ═══════════════════════════════════════════════════════════
   CA NIAMUL KHAN — Premium Website JavaScript
   Features: Sticky Nav · Scroll Animations · Counters ·
             Testimonial Slider · FAQ Accordion ·
             GST & ITR Calculators · Form Handling
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initTestimonialSlider();
  initFAQ();
  initCalcTabs();
  initNavLinks();
  initFormHandlers();
  initITRRegimeToggle();
  createFavicon();
});

/* ═══════════════════════════════════════════
   NAVBAR — Sticky + Scroll Effect
═══════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

/* ── Active Nav Link on Scroll ── */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ── Smooth Scroll for Nav Links ── */
function initNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════
   SCROLL ANIMATIONS — Intersection Observer
═══════════════════════════════════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 80 : 0;
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  let started = false;

  const startCounters = () => {
    if (started) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      started = true;
      counters.forEach(counter => animateCounter(counter));
    }
  };

  window.addEventListener('scroll', startCounters, { passive: true });
  // Also try on load
  setTimeout(startCounters, 800);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };

  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════
   TESTIMONIAL SLIDER
═══════════════════════════════════════════ */
let currentSlide = 0;
let totalSlides = 0;
let autoSlideInterval = null;

function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  totalSlides = cards.length;

  // Determine visible count
  const getVisible = () => window.innerWidth <= 768 ? 1 : 2;

  // Create dots
  const createDots = () => {
    dotsContainer.innerHTML = '';
    const visible = getVisible();
    const dotCount = Math.ceil(totalSlides / visible);
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  };

  createDots();
  window.addEventListener('resize', () => {
    createDots();
    goToSlide(0);
  });

  // Auto-slide
  autoSlideInterval = setInterval(() => slideTestimonials(1), 5000);

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  track.parentElement.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => slideTestimonials(1), 5000);
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slideTestimonials(diff > 0 ? 1 : -1);
  });
}

function goToSlide(index) {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;
  const visible = window.innerWidth <= 768 ? 1 : 2;
  const maxSlide = Math.ceil(totalSlides / visible) - 1;
  currentSlide = Math.max(0, Math.min(index, maxSlide));

  const cardWidth = track.querySelector('.testimonial-card').offsetWidth + 24;
  track.style.transform = `translateX(-${currentSlide * visible * cardWidth}px)`;

  // Update dots
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

window.slideTestimonials = function(dir) {
  const visible = window.innerWidth <= 768 ? 1 : 2;
  const maxSlide = Math.ceil(totalSlides / visible) - 1;
  let next = currentSlide + dir;
  if (next > maxSlide) next = 0;
  if (next < 0) next = maxSlide;
  goToSlide(next);
};

/* ═══════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════ */
function initFAQ() {
  // Already handled via onclick in HTML, but also support keyboard
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(btn);
      }
    });
  });
}

window.toggleFAQ = function(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
  }
};

/* ═══════════════════════════════════════════
   CALCULATOR TABS
═══════════════════════════════════════════ */
function initCalcTabs() {
  const tabs = document.querySelectorAll('.calc-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      document.querySelectorAll('.calc-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      const panel = document.getElementById(`calc-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── ITR Regime Toggle ── */
function initITRRegimeToggle() {
  const regimeSelect = document.getElementById('itr-regime');
  const deductionGroup = document.getElementById('deduction-group');
  if (!regimeSelect) return;

  regimeSelect.addEventListener('change', () => {
    if (deductionGroup) {
      deductionGroup.style.display = regimeSelect.value === 'old' ? 'flex' : 'none';
    }
  });
  // Initial state
  if (deductionGroup) deductionGroup.style.display = 'none';
}

/* ═══════════════════════════════════════════
   GST CALCULATOR
═══════════════════════════════════════════ */
window.calculateGST = function() {
  const amountInput = document.getElementById('gst-amount');
  const rateSelect = document.getElementById('gst-rate');
  const typeSelect = document.getElementById('gst-type');

  const amount = parseFloat(amountInput.value);
  const rate = parseFloat(rateSelect.value);
  const type = typeSelect.value;

  if (!amount || amount <= 0) {
    amountInput.focus();
    amountInput.style.borderColor = '#ef4444';
    setTimeout(() => amountInput.style.borderColor = '', 2000);
    return;
  }

  let base, gstAmount, total;

  if (type === 'exclusive') {
    base = amount;
    gstAmount = (amount * rate) / 100;
    total = amount + gstAmount;
  } else {
    total = amount;
    base = (amount * 100) / (100 + rate);
    gstAmount = total - base;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  document.getElementById('gst-base').textContent = `₹${formatNum(base)}`;
  document.getElementById('gst-cgst').textContent = `₹${formatNum(cgst)} (${rate/2}%)`;
  document.getElementById('gst-sgst').textContent = `₹${formatNum(sgst)} (${rate/2}%)`;
  document.getElementById('gst-total').textContent = `₹${formatNum(total)}`;

  // Animate result
  animateResult('gst-result');
};

/* ═══════════════════════════════════════════
   INCOME TAX CALCULATOR (FY 2024-25)
═══════════════════════════════════════════ */
window.calculateITR = function() {
  const incomeInput = document.getElementById('itr-income');
  const regimeSelect = document.getElementById('itr-regime');
  const deductionsInput = document.getElementById('itr-deductions');

  const grossIncome = parseFloat(incomeInput.value);
  const regime = regimeSelect.value;
  const deductions = parseFloat(deductionsInput.value) || 0;

  if (!grossIncome || grossIncome <= 0) {
    incomeInput.focus();
    incomeInput.style.borderColor = '#ef4444';
    setTimeout(() => incomeInput.style.borderColor = '', 2000);
    return;
  }

  let taxableIncome, tax;

  if (regime === 'new') {
    // New Tax Regime FY 2024-25 (Standard deduction ₹75,000 for salaried)
    const stdDeduction = 75000;
    taxableIncome = Math.max(0, grossIncome - stdDeduction);
    tax = calcNewRegimeTax(taxableIncome);
    // Rebate u/s 87A: if taxable income ≤ 7,00,000, tax = 0
    if (taxableIncome <= 700000) tax = 0;
  } else {
    // Old Tax Regime
    const maxDeduction = Math.min(deductions, 150000); // 80C cap
    const stdDeduction = 50000;
    taxableIncome = Math.max(0, grossIncome - stdDeduction - maxDeduction);
    tax = calcOldRegimeTax(taxableIncome);
    // Rebate u/s 87A: if taxable income ≤ 5,00,000, tax = 0
    if (taxableIncome <= 500000) tax = 0;
  }

  // Surcharge (simplified)
  let surcharge = 0;
  if (grossIncome > 5000000 && grossIncome <= 10000000) surcharge = tax * 0.10;
  else if (grossIncome > 10000000 && grossIncome <= 20000000) surcharge = tax * 0.15;
  else if (grossIncome > 20000000) surcharge = tax * 0.25;

  const taxWithSurcharge = tax + surcharge;
  const cess = taxWithSurcharge * 0.04;
  const totalTax = taxWithSurcharge + cess;

  document.getElementById('itr-gross').textContent = `₹${formatNum(grossIncome)}`;
  document.getElementById('itr-taxable').textContent = `₹${formatNum(taxableIncome)}`;
  document.getElementById('itr-tax').textContent = `₹${formatNum(taxWithSurcharge)}`;
  document.getElementById('itr-cess').textContent = `₹${formatNum(cess)}`;
  document.getElementById('itr-total').textContent = `₹${formatNum(totalTax)}`;

  animateResult('itr-result');
};

function calcNewRegimeTax(income) {
  // New regime slabs FY 2024-25
  const slabs = [
    { limit: 300000,  rate: 0 },
    { limit: 600000,  rate: 0.05 },
    { limit: 900000,  rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];
  return calcSlabTax(income, slabs);
}

function calcOldRegimeTax(income) {
  // Old regime slabs
  const slabs = [
    { limit: 250000,  rate: 0 },
    { limit: 500000,  rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];
  return calcSlabTax(income, slabs);
}

function calcSlabTax(income, slabs) {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.limit) - prev;
    tax += taxable * slab.rate;
    prev = slab.limit;
  }
  return tax;
}

/* ── Helpers ── */
function formatNum(n) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function animateResult(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

/* ═══════════════════════════════════════════
   FORM HANDLERS
═══════════════════════════════════════════ */
function initFormHandlers() {
  // Appointment form
  const apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', submitAppointment);
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', submitContact);
  }
}

window.submitAppointment = function(e) {
  e.preventDefault();
  const form = e.target || document.getElementById('appointmentForm');
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  // Capture values before reset
  const name    = form.querySelector('[name="name"]')?.value || '';
  const phone   = form.querySelector('[name="phone"]')?.value || '';
  const service = form.querySelector('[name="service"]')?.value || '';

  // Sync reply-to hidden field
  const replyTo = form.querySelector('#appt-replyto');
  const emailField = form.querySelector('[name="email"]');
  if (replyTo && emailField) replyTo.value = emailField.value;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      btn.style.display = 'none';
      if (success) success.classList.add('show');
      form.reset();
      // Also ping WhatsApp so CA gets an instant notification
      const msg = encodeURIComponent(
        `Hello CA Niamul Khan,\n\nNew appointment request from your website.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\n\nPlease confirm the appointment.`
      );
      setTimeout(() => {
        window.open(`https://wa.me/917638842853?text=${msg}`, '_blank');
      }, 1500);
    } else {
      res.json().then(data => {
        btn.textContent = 'Send Request';
        btn.disabled = false;
        alert(data.errors ? data.errors.map(err => err.message).join(', ') : 'Submission failed. Please try again.');
      });
    }
  })
  .catch(() => {
    btn.textContent = 'Send Request';
    btn.disabled = false;
    alert('Network error. Please check your connection and try again.');
  });
};

window.submitContact = function(e) {
  e.preventDefault();
  const form = e.target || document.getElementById('contactForm');
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('contactSuccess');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      btn.style.display = 'none';
      if (success) success.classList.add('show');
      form.reset();
    } else {
      res.json().then(data => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        alert(data.errors ? data.errors.map(err => err.message).join(', ') : 'Submission failed. Please try again.');
      });
    }
  })
  .catch(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    alert('Network error. Please check your connection and try again.');
  });
};

/* ═══════════════════════════════════════════
   FAVICON — SVG CA Monogram
═══════════════════════════════════════════ */
function createFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" fill="#0a1c38"/>
    <rect x="2" y="2" width="60" height="60" rx="10" fill="none" stroke="#d4a843" stroke-width="2"/>
    <text x="32" y="44" font-family="Georgia,serif" font-size="28" font-weight="700" fill="#d4a843" text-anchor="middle">CA</text>
  </svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = url;
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS INDICATOR
═══════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
    background: linear-gradient(90deg, #d4a843, #e8c96a);
    width: 0%; transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(212,168,67,0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
})();

/* ═══════════════════════════════════════════
   CARD TILT EFFECT (subtle, desktop only)
═══════════════════════════════════════════ */
(function initTilt() {
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.service-card, .feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════
   SECTION REVEAL — Gold Line Accent
═══════════════════════════════════════════ */
(function initSectionLines() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--section-visible', '1');
      }
    });
  }, { threshold: 0.05 });
  sections.forEach(s => observer.observe(s));
})();

/* ═══════════════════════════════════════════
   LAZY LOAD IMAGES
═══════════════════════════════════════════ */
(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native lazy load
  const images = document.querySelectorAll('img');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
})();

/* ═══════════════════════════════════════════
   KEYBOARD ACCESSIBILITY
═══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      const spans = document.querySelectorAll('.nav-toggle span');
      spans.forEach(s => s.style.transform = s.style.opacity = '');
    }
  }
});

/* ═══════════════════════════════════════════
   PERFORMANCE — Debounce resize
═══════════════════════════════════════════ */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

window.addEventListener('resize', debounce(() => {
  // Re-init tilt on resize
  document.querySelectorAll('.service-card, .feature-card').forEach(card => {
    card.style.transform = '';
  });
}, 250));