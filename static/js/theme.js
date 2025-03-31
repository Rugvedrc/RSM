// Function to toggle mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const navToggler = document.getElementById('rsm-base-nav-toggler');
    const navMenu = document.getElementById('rsm-base-nav-menu');
    
    navToggler.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        } else {
            navMenu.classList.add('active');
        }
    });
});


