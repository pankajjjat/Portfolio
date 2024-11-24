// Fetch real market data
async function fetchMarketData() {
    try {
        const response = await fetch('https://api.marketdata.app/v1/stocks/quotes/NSEI.NS,BSESN.BO/');
        const data = await response.json();
        
        if (data && data.s === 'ok') {
            updateNiftySensex(data);
        }
    } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback to simulation if API fails
        simulateMarketData();
    }
}

function updateNiftySensex(data) {
    const niftyData = data.NSEI;
    const sensexData = data.BSESN;
    
    updateTickerItem('nifty-ticker', niftyData);
    updateTickerItem('sensex-ticker', sensexData);
}

function updateTickerItem(id, data) {
    const ticker = document.getElementById(id);
    if (!ticker) return;
    
    const price = data.c.toFixed(2);
    const change = data.cp.toFixed(2);
    const arrow = change >= 0 ? 'up' : 'down';
    
    ticker.innerHTML = `
        <i class="fas fa-arrow-${arrow}"></i>
        <span class="ticker-name">${id === 'nifty-ticker' ? 'NIFTY' : 'SENSEX'}</span>
        <span class="ticker-value">${numberWithCommas(price)}</span>
        <span class="ticker-change ${arrow}">${change >= 0 ? '+' : ''}${change}%</span>
    `;
    
    ticker.className = `ticker-item ${arrow}`;
}

// Fallback simulation function
function simulateMarketData() {
    const tickers = document.querySelectorAll('.ticker-item');
    tickers.forEach(ticker => {
        const baseValue = ticker.id === 'nifty-ticker' ? 19500 : 65000;
        const change = (Math.random() * 2 - 1).toFixed(2);
        const value = (baseValue * (1 + change/100)).toFixed(2);
        
        const arrow = change >= 0 ? 'up' : 'down';
        ticker.innerHTML = `
            <i class="fas fa-arrow-${arrow}"></i>
            <span class="ticker-name">${ticker.id === 'nifty-ticker' ? 'NIFTY' : 'SENSEX'}</span>
            <span class="ticker-value">${numberWithCommas(value)}</span>
            <span class="ticker-change ${arrow}">${change >= 0 ? '+' : ''}${change}%</span>
        `;
        ticker.className = `ticker-item ${arrow}`;
    });
}

// Format numbers with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update market data every 10 seconds
setInterval(fetchMarketData, 10000);
// Initial fetch
fetchMarketData();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    submitBtn.style.backgroundColor = 'var(--success-green)';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.style.backgroundColor = '';
        contactForm.reset();
    }, 3000);
});

// Scroll-based animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections and cards for scroll animations
document.querySelectorAll('section, .cert-card, .course-card, .timeline-item').forEach((element) => {
    observer.observe(element);
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animated particles background
function createParticles() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 1}px;
            height: ${Math.random() * 5 + 1}px;
            background: rgba(100, 255, 218, ${Math.random() * 0.3});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
        `;
        particles.appendChild(particle);
    }
}

// Add typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Add scroll reveal animations
function revealOnScroll() {
    const elements = document.querySelectorAll('.cert-card, .timeline-item, .skill-tag');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        typeWriter(heroTitle, 'Financial Market Professional');
    }
    
    // Add scroll animations
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    
    // Add hover effects to skill tags
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseover', () => {
            tag.style.transform = 'translateY(-5px) rotate(2deg)';
        });
        tag.addEventListener('mouseout', () => {
            tag.style.transform = 'translateY(0) rotate(0)';
        });
    });
});
