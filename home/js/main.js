document.addEventListener('DOMContentLoaded', (event) => {
    const navbar = document.getElementById('navbar');
    const navbarSpacer = document.getElementById('navbar-spacer');
    let lastScrollTop = 0;
    const navbarHeight = navbar.offsetHeight;
    const scrollThreshold = 200;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            navbar.style.transform = `translateY(-${navbarHeight}px)`;
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    navbarSpacer.style.height = `${navbarHeight}px`;

    // Load testimonials
    fetch('./json/dummy-testimoni.json')
        .then(response => response.json())
        .then(data => {
            const testimonialContainer = document.querySelector("#testimony .flex");
            testimonialContainer.innerHTML = '';

            // Randomly select 3 testimonials from the data
            const selectedTestimonials = data.sort(() => 0.5 - Math.random()).slice(0, 3);

            selectedTestimonials.forEach(testimonial => {
                testimonialContainer.innerHTML += `
                    <div class="flex flex-col flex-shrink rounded-lg items-center text-center shadow-md w-full md:w-80 p-8 space-y-4 bg-neutral-50">
                    <img src="./assets/img/pfp.jpg" alt="" class="object-cover rounded-full size-24">
                    <p>${testimonial.text}</p>
                    <div class="text-emerald-500 text-xl font-bold">
                        ${testimonial.name}
                    </div>
                </div>
                `;
            });
        })
        .catch(error => console.error('Error loading testimonials:', error));
});

// Sidebar toggle logic (same as previously implemented)
document.addEventListener('DOMContentLoaded', (event) => {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeSidebarButton = document.getElementById('close-sidebar');

    mobileMenuButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.add('hidden');
    });
});
