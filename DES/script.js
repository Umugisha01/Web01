// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                // Here you would typically send the form data to a server
                console.log('Form submitted successfully');
                form.reset();
            }
        });
    });

    // Dynamic Service Cards Loading
    const loadServices = () => {
        const services = [
            {
                icon: 'fa-music',
                title: 'Music Production',
                description: 'Professional recording, mixing, and mastering services.'
            },
            {
                icon: 'fa-video',
                title: 'Video Production',
                description: 'High-quality video production and editing services.'
            },
            // Add more services as needed
        ];

        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            services.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card';
                serviceCard.innerHTML = `
                    <i class="fas ${service.icon}"></i>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <a href="#" class="btn btn-outline">Learn More</a>
                `;
                servicesGrid.appendChild(serviceCard);
            });
        }
    };

    loadServices();
});
Last edited 10 minutes ago