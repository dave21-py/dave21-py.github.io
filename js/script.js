
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}



document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    const navLinksContainer = navbar.querySelector('.nav-links');
    const navLinks = navbar.querySelectorAll('.nav-links a');
    const menuBtn = document.getElementById('menu-btn');
    const currentYearSpan = document.getElementById('current-year');

    // --- Preloader ---
    window.addEventListener('load', () => {
        // Add a small delay before hiding preloader to ensure rendering
        setTimeout(() => {
             preloader.classList.add('hidden');
        }, 100); // 100ms delay, adjust if needed
    });

    // --- Sticky Header ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scrolling & Active Link Highlighting ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if menu is open on mobile and close it
            if (navLinksContainer.classList.contains('active')) {
                 navLinksContainer.classList.remove('active');
                 menuBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Reset icon
            }

            // Smooth scroll for internal links
            if (link.hash !== "") {
                e.preventDefault();
                const hash = link.hash;
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerOffset = header.offsetHeight;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Optionally update hash in URL without jumping, helps with history but can be complex
                    // setTimeout(() => { history.pushState(null, null, hash); }, 300); // Delay allows scroll to happen first
                }
            }
        });
    });

    // --- Active link highlighting on scroll ---
    const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID

    function activateNavLink() {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;
        // Use a slightly larger offset to ensure the section is well in view before highlighting
        const headerOffset = header.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.offsetHeight;
            // Check if scroll position is within the section's bounds
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

         // Handle edge case for reaching the absolute bottom of the page
         // If scrolled past the start of the last section and near the bottom
         const totalHeight = document.documentElement.scrollHeight;
         const windowHeight = window.innerHeight;
         if (sections.length > 0 && scrollY + windowHeight >= totalHeight - 50) { // 50px buffer from bottom
             currentSectionId = sections[sections.length - 1].getAttribute('id');
         }

        navLinks.forEach(link => {
            link.classList.remove('active');
             // Check if the link's href matches the current section ID
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Special case for home section when scrolled near the very top
         if (scrollY < sections[0].offsetTop - header.offsetHeight) { // Use exact header height here
              navLinks.forEach(link => link.classList.remove('active'));
              const homeLink = document.querySelector('a[href="#home"]');
              if(homeLink) homeLink.classList.add('active');
         } else if (!currentSectionId && scrollY < sections[0].offsetTop) {
             // If slightly scrolled but not yet at the first section, keep 'Home' active
             const homeLink = document.querySelector('a[href="#home"]');
             if(homeLink) homeLink.classList.add('active');
         }
    }

    window.addEventListener('scroll', activateNavLink);
    // Run once on load after a slight delay to ensure layout is stable
    setTimeout(activateNavLink, 200);

    // --- AOS Initialization ---
    AOS.init({
        duration: 800, // Animation duration
        offset: 100,   // Offset (in px) from the original trigger point
        once: true,    // Animation happens only once
        anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
    });

    // --- Mobile Menu Toggle ---
    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        // Toggle icon
        if (navLinksContainer.classList.contains('active')) {
            menuBtn.innerHTML = '<i class="fas fa-times"></i>'; // Change to 'X' icon
        } else {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Change back to bars
        }
    });

    // --- Footer Current Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Particles.js Initialization ---
    // Check if particles.js is loaded before calling load
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'js/particles-config.json', function() {
            console.log('callback - particles.js config loaded');
        });
    } else {
        console.error("particles.js library not found. Make sure it's loaded correctly in index.html.");
    }

}); // End of DOMContentLoaded listener