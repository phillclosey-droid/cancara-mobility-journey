// Add click handlers and navigation for list items
document.addEventListener('DOMContentLoaded', function() {
    // Find list items by checking the title text
    const listItems = document.querySelectorAll('.list-item-action');
    
    listItems.forEach(function(item) {
        const title = item.querySelector('.list-item-title');
        if (!title) return;
        
        const titleText = title.textContent.trim();
        
        if (titleText === 'Tax') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                // Set flag when leaving hub (for proper state detection on return)
                sessionStorage.setItem('leavingHub', 'true');
                
                // Preserve current state when navigating
                const currentParams = new URLSearchParams(window.location.search);
                const completed = currentParams.get('completed') || '';
                // Store in sessionStorage for tax page to read
                if (completed) {
                    sessionStorage.setItem('hubCompleted', completed);
                }
                const taxUrl = '../05-tax-added/tax-added.html' + (completed ? '?completed=' + completed : '');
                window.location.href = taxUrl;
            });
        } else if (titleText === 'MOT') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                // Set flag when leaving hub (for proper state detection on return)
                sessionStorage.setItem('leavingHub', 'true');
                
                // Preserve current state when navigating
                const currentParams = new URLSearchParams(window.location.search);
                const completed = currentParams.get('completed') || '';
                // Store in sessionStorage for MOT page to read
                if (completed) {
                    sessionStorage.setItem('hubCompleted', completed);
                }
                const motUrl = '../06-mot-added/mot-added.html' + (completed ? '?completed=' + completed : '');
                window.location.href = motUrl;
            });
        } else if (titleText === 'Insurance') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                // Set flag when leaving hub (for proper state detection on return)
                sessionStorage.setItem('leavingHub', 'true');
                
                // Navigate to insurance added page (success)
                const currentParams = new URLSearchParams(window.location.search);
                const completed = currentParams.get('completed') || '';
                const insuranceUrl = '../07-insurance-added/insurance-added.html' + (completed ? '?completed=' + completed : '');
                window.location.href = insuranceUrl;
            });
        } else if (titleText === 'Servicing') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                // Set flag when leaving hub (for proper state detection on return)
                sessionStorage.setItem('leavingHub', 'true');
                
                // Navigate to service added page (success)
                const currentParams = new URLSearchParams(window.location.search);
                const completed = currentParams.get('completed') || '';
                const servicingUrl = '../08-service-added/service-added.html' + (completed ? '?completed=' + completed : '');
                window.location.href = servicingUrl;
            });
        }
    });
    
    // Set flag when leaving hub (for proper return detection)
    const ghostPanels = document.querySelectorAll('.flip-container[data-task]');
    ghostPanels.forEach(function(panel) {
        panel.addEventListener('click', function() {
            const task = panel.getAttribute('data-task');
            sessionStorage.setItem('leavingHub', 'true');
            
            // Navigate to appropriate page
            if (task === 'insurance') {
                window.location.href = '../03-insurance-capture/insurance-capture.html';
            } else if (task === 'servicing') {
                window.location.href = '../04-service-capture/service-capture.html';
            }
        });
    });
});

console.log('[HUB] Navigation handlers loaded');