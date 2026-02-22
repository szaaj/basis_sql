// Auto-add floating home button to all pages except index.html
(function() {
    // Check if we're NOT on the homepage
    const path = window.location.pathname;
    const isHomepage = path.endsWith('index.html') || path.endsWith('/');
    
    if (!isHomepage) {
        // Determine correct path to home
        const homePath = path.includes('/periode') ? '../index.html' : 'index.html';
        
        // Create floating home button
        const homeButton = document.createElement('a');
        homeButton.href = homePath;
        homeButton.className = 'home-button';
        homeButton.innerHTML = '🏠';
        homeButton.title = 'Terug naar Home';
        homeButton.setAttribute('aria-label', 'Terug naar Home');
        
        // Add to page
        document.body.appendChild(homeButton);
    }
})();
