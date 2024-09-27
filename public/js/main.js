document.addEventListener('DOMContentLoaded', (event) => {
    const navbar = document.getElementById('navbar');
    const navbarSpacer = document.getElementById('navbar-spacer');
    let lastScrollTop = 0;
    const navbarHeight = navbar.offsetHeight;
    const scrollThreshold = 200; // Adjust this value to change when the navbar retracts

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down & past threshold
            navbar.style.transform = `translateY(-${navbarHeight}px)`;
        } else {
            // Scrolling up or above threshold
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // Adjust the navbar-spacer height to match the navbar
    navbarSpacer.style.height = `${navbarHeight}px`;
});

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