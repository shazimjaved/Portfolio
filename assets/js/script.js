'use strict';

/**
 * Modern Portfolio JavaScript
 * Enhanced functionality with smooth animations and interactions
 */

// DOM Elements
const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbarMenu = document.querySelector("[data-navbar-menu]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const backTopBtn = document.querySelector("[data-back-to-top]");
const contactForm = document.getElementById("contactForm");

// Carousel Elements
const portfolioTrack = document.querySelector(".portfolio-track");
const carouselArrows = document.querySelectorAll(".carousel-arrow");
const indicators = document.querySelectorAll(".indicator");

/**
 * Navigation Toggle
 */
navToggleBtn.addEventListener("click", function () {
  const isActive = navbarMenu.classList.contains("active");
  
  navbarMenu.classList.toggle("active");
  navToggleBtn.classList.toggle("active");
  navToggleBtn.setAttribute("aria-expanded", !isActive);
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = !isActive ? "hidden" : "";
});

/**
 * Close mobile menu when clicking on links
 */
navbarLinks.forEach(link => {
  link.addEventListener("click", function () {
    navbarMenu.classList.remove("active");
    navToggleBtn.classList.remove("active");
    navToggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

/**
 * Close mobile menu when clicking outside
 */
document.addEventListener("click", function (e) {
  if (!header.contains(e.target) && navbarMenu.classList.contains("active")) {
    navbarMenu.classList.remove("active");
    navToggleBtn.classList.remove("active");
    navToggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
});

/**
 * Header scroll effect
 */
let lastScrollY = window.scrollY;

window.addEventListener("scroll", function () {
  const currentScrollY = window.scrollY;
  
  // Add scrolled class for styling
  if (currentScrollY > 100) {
    header.classList.add("scrolled");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("scrolled");
    backTopBtn.classList.remove("active");
  }
  
  lastScrollY = currentScrollY;
});

/**
 * Back to top functionality
 */
backTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Typing Animation for Hero Section
 */
function initTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;
  
  const texts = typingElement.getAttribute('data-typing').split(',');
  let currentIndex = 0;
  let currentText = '';
  let isDeleting = false;
  
  function typeText() {
    const current = texts[currentIndex];
    
    if (isDeleting) {
      currentText = current.substring(0, currentText.length - 1);
    } else {
      currentText = current.substring(0, currentText.length + 1);
    }
    
    typingElement.textContent = currentText;
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && currentText === current) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && currentText === '') {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % texts.length;
    }
    
    setTimeout(typeText, typeSpeed);
  }
  
  typeText();
}

/**
 * Intersection Observer for Animations
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
        
        // Special handling for skill cards
        if (entry.target.classList.contains('skill-card')) {
          const progressBar = entry.target.querySelector('.skill-progress');
          if (progressBar) {
            const width = progressBar.getAttribute('data-width');
            setTimeout(() => {
              progressBar.style.width = width + '%';
            }, 300);
          }
        }
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.portfolio-card, .service-card, .skill-card, .about-highlights .highlight-item').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Form Validation and Submission
 */
function initContactForm() {
  if (!contactForm) return;
  
  const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
  const submitBtn = contactForm.querySelector('.btn-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const statusEl = document.getElementById('contactStatus');
  
  // Real-time validation
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      clearFieldError(this);
    });
  });
  
  // Form submission
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      submitForm();
    }
  });
  
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorEl = document.getElementById(fieldName + '-error');
    
    clearFieldError(field);
    
    if (!value) {
      showFieldError(field, errorEl, 'This field is required');
      return false;
    }
    
    if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, errorEl, 'Please enter a valid email address');
        return false;
      }
    }
    
    if (fieldName === 'message' && value.length < 10) {
      showFieldError(field, errorEl, 'Message must be at least 10 characters long');
      return false;
    }
    
    return true;
  }
  
  function showFieldError(field, errorEl, message) {
    field.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }
  
  function clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = document.getElementById(field.name + '-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }
  
  function validateForm() {
    let isValid = true;
    
    formInputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  function submitForm() {
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
      to_name: "Shazim Javed",
      from_name: contactForm.name.value.trim(),
      from_email: contactForm.email.value.trim(),
      message: contactForm.message.value.trim(),
      reply_to: contactForm.email.value.trim()
    };
    
    // Send email using EmailJS
    emailjs.send("service_n4j7jw1", "template_yjyjirc", formData)
      .then((response) => {
        console.log("EmailJS Success:", response);
        showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        showFormStatus('error', 'Failed to send message. Please try again or contact me directly.');
      })
      .finally(() => {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
      });
  }
  
  function showFormStatus(type, message) {
    if (type === 'success') {
      statusEl.innerHTML = `
        <div class="success-notification">
          <div class="success-icon">
            <ion-icon name="checkmark-circle"></ion-icon>
          </div>
          <div class="success-content">
            <h4>Message Sent Successfully!</h4>
            <p>Thank you for reaching out. I'll get back to you soon!</p>
          </div>
          <button class="close-notification" onclick="closeNotification()">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>
      `;
    } else {
      statusEl.innerHTML = `
        <div class="error-notification">
          <div class="error-icon">
            <ion-icon name="alert-circle"></ion-icon>
          </div>
          <div class="error-content">
            <h4>Message Failed to Send</h4>
            <p>${message}</p>
          </div>
          <button class="close-notification" onclick="closeNotification()">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>
      `;
    }
    
    statusEl.className = 'status-notification show';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      closeNotification();
    }, 5000);
  }
}

/**
 * Close Notification Function
 */
function closeNotification() {
  const statusEl = document.getElementById('contactStatus');
  if (statusEl) {
    statusEl.style.display = 'none';
    statusEl.className = 'status-notification';
  }
}

/**
 * CV Download Functionality
 */
window.handleCVAction = function() {
  const cvUrl = 'assets/Resume.pdf';
  const cvFileName = 'Shazim_Javed_Resume.pdf';
  
  // Open CV in new tab
  window.open(cvUrl, '_blank');
  
  // Download CV
  const link = document.createElement('a');
  link.href = cvUrl;
  link.download = cvFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Portfolio Carousel Functionality
 */
let currentSlide = 0;
let cardsPerSlide = 3;
let totalCards;
let totalSlides;

function updateCarouselSettings() {
  totalCards = document.querySelectorAll('.portfolio-card').length;
  
  // Determine cards per slide based on screen width
  if (window.innerWidth <= 767) {
    cardsPerSlide = 1;
  } else if (window.innerWidth <= 1023) {
    cardsPerSlide = 2;
  } else {
    cardsPerSlide = 3;
  }
  
  totalSlides = Math.ceil(totalCards / cardsPerSlide);
  
  // Reset current slide if it's out of bounds
  if (currentSlide >= totalSlides) {
    currentSlide = totalSlides - 1;
  }
  if (currentSlide < 0) {
    currentSlide = 0;
  }
}

function updateCarousel() {
  if (!portfolioTrack) return;
  
  updateCarouselSettings();
  
  const slideWidth = 100 / cardsPerSlide;
  const offset = currentSlide * cardsPerSlide * slideWidth;
  portfolioTrack.style.transform = `translateX(-${offset}%)`;
  
  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
  
  // Update arrow states
  const prevArrow = document.querySelector('.carousel-arrow-prev');
  const nextArrow = document.querySelector('.carousel-arrow-next');
  
  if (prevArrow) {
    prevArrow.style.opacity = currentSlide === 0 ? '0.5' : '1';
    prevArrow.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';
  }
  
  if (nextArrow) {
    nextArrow.style.opacity = currentSlide >= totalSlides - 1 ? '0.5' : '1';
    nextArrow.style.cursor = currentSlide >= totalSlides - 1 ? 'not-allowed' : 'pointer';
  }
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateCarousel();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateCarousel();
  }
}

function goToSlide(slideIndex) {
  if (slideIndex >= 0 && slideIndex < totalSlides) {
    currentSlide = slideIndex;
    updateCarousel();
  }
}

// Initialize carousel event listeners
if (portfolioTrack) {
  // Arrow navigation
  carouselArrows.forEach(arrow => {
    arrow.addEventListener('click', function() {
      if (this.classList.contains('carousel-arrow-prev')) {
        prevSlide();
      } else if (this.classList.contains('carousel-arrow-next')) {
        nextSlide();
      }
    });
  });
  
  // Indicator navigation
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  portfolioTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  portfolioTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left, go to next
      } else {
        prevSlide(); // Swipe right, go to previous
      }
    }
  }
  
  // Handle window resize
  window.addEventListener('resize', debounce(() => {
    updateCarousel();
  }, 250));
  
  // Initialize carousel
  updateCarousel();
}

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  initTypingAnimation();
  initScrollAnimations();
  initContactForm();
  
  // Add loading class removal for smooth animations
  document.body.classList.add('loaded');
});

/**
 * Performance optimization: Debounce scroll events
 */
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 100) {
    header.classList.add("scrolled");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("scrolled");
    backTopBtn.classList.remove("active");
  }
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);