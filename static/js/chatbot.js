document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle functionality
    const navToggler = document.getElementById('rsm-base-nav-toggler');
    
    if (navToggler) {
      navToggler.addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
      });
    }
    
    // Close menu when clicking outside of it
    document.addEventListener('click', function(event) {
      const isNavMenu = event.target.closest('#rsm-base-nav-menu');
      const isNavToggler = event.target.closest('#rsm-base-nav-toggler');
      
      if (!isNavMenu && !isNavToggler && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
      }
    });
    
    // Close menu when pressing escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
      }
    });
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
      const nav = document.getElementById('rsm-base-nav-section');
      
      if (window.scrollY > 50) {
        nav.style.background = 'linear-gradient(to right, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98))';
        nav.style.boxShadow = '0 4px 30px rgba(255, 215, 0, 0.3)';
      } else {
        nav.style.background = 'linear-gradient(to right, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95))';
        nav.style.boxShadow = '0 4px 30px rgba(255, 215, 0, 0.2)';
      }
    });
    
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#rsm-base-nav-menu-list li a');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (currentPath === linkPath) {
        link.style.color = '#ffd700';
        link.style.fontWeight = '600';
        link.style.backgroundColor = 'rgba(255, 215, 0, 0.12)';
        link.style.textShadow = '0 0 8px rgba(255, 215, 0, 0.3)';
        
        const indicator = document.createElement('span');
        indicator.style.position = 'absolute';
        indicator.style.bottom = '0';
        indicator.style.left = '50%';
        indicator.style.width = '70%';
        indicator.style.height = '2px';
        indicator.style.background = 'linear-gradient(90deg, #ffd700, #ff9d00)';
        indicator.style.transform = 'translateX(-50%)';
        indicator.style.boxShadow = '0 0 10px #ffd700';
        
        link.appendChild(indicator);
      }
    });
    
    // Add divine light effect to logo
    const logoImg = document.getElementById('rsm-base-nav-logo-img');
    if (logoImg) {
      setInterval(() => {
        logoImg.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))';
        
        setTimeout(() => {
          logoImg.style.filter = 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.7))';
        }, 1000);
        
        setTimeout(() => {
          logoImg.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))';
        }, 2000);
      }, 3000);
    }
    
    // Add divine particle effect
    const createDivineParticles = () => {
      const nav = document.getElementById('rsm-base-nav-section');
      
      if (!nav) return;
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('span');
        particle.className = 'divine-particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#ffd700';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        
        // Random position
        const posX = Math.random() * 100;
        particle.style.left = posX + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Animation
        particle.style.animation = `float-y ${Math.random() * 3 + 2}s infinite ease-in-out alternate, 
                                  float-x ${Math.random() * 5 + 3}s infinite ease-in-out alternate`;
        
        nav.appendChild(particle);
      }
      
      // Add keyframes for particle animation
      if (!document.getElementById('divine-particle-style')) {
        const style = document.createElement('style');
        style.id = 'divine-particle-style';
        style.innerHTML = `
          @keyframes float-y {
            from { transform: translateY(0); }
            to { transform: translateY(20px); }
          }
          @keyframes float-x {
            from { transform: translateX(0); }
            to { transform: translateX(20px); }
          }
          .divine-particle {
            pointer-events: none;
            z-index: -1;
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    // Run particle effect
    createDivineParticles();
  });



  /* Carousel JavaScript */
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.rsm-index-hero-carousel-slide');
  const dots = document.querySelectorAll('.rsm-index-hero-carousel-dot');
  const prevBtn = document.querySelector('.rsm-index-hero-carousel-prev');
  const nextBtn = document.querySelector('.rsm-index-hero-carousel-next');
  let currentSlide = 0;
  
  function showSlide(n) {
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });
    dots.forEach((dot) => {
      dot.classList.remove('active');
    });
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
  }
  
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Auto slide change
  setInterval(nextSlide, 5000);
});

function toggleCategory(element) {
  const content = element.nextElementSibling;
  const toggle = element.querySelector('.rsm-booking-category-toggle');
  
  if (content.style.display === 'block') {
      content.style.display = 'none';
      element.classList.remove('active');
  } else {
      content.style.display = 'block';
      element.classList.add('active');
  }
}

function toggleSeva(element) {
  const details = element.nextElementSibling;
  const toggle = element.querySelector('.rsm-booking-seva-toggle');
  
  if (details.style.display === 'block') {
      details.style.display = 'none';
      element.classList.remove('active');
  } else {
      details.style.display = 'block';
      element.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Add shimmering effect to the header
  const header = document.getElementById('rsm-booking-header-heading');
  header.classList.add('glow-effect');
  
  // Initially expand the first category
  const firstCategory = document.querySelector('.rsm-booking-category-header');
  if (firstCategory) {
      toggleCategory(firstCategory);
  }
});