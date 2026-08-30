/**
 * Hub Animations - Modified Version
 * Replaces card flip with icon flip + ghost panel animations
 */

// Override the card flip animation with new sequence
function animateNewTaskCompletion(newTask, progressPercent, totalCompleted, totalTasks) {
    const ghostPanel = document.querySelector(`.flip-container[data-task="${newTask}"] .hero-panel-ghost-compact`);
    const subtitle = ghostPanel ? ghostPanel.querySelector('.hero-panel-ghost-subtitle') : null;
    const iconButton = ghostPanel ? ghostPanel.querySelector('.hero-panel-ghost-button') : null;
    const progressFill = document.querySelector('.hero-panel-progress-fill');
    const progressText = document.querySelector('.hero-panel-progress-text');
    const progressSubtext = document.querySelector('.hero-panel-progress-subtext');
    
    console.log('[HUB-ANIM] Starting new animation sequence for:', newTask);
    
    // Wait 400ms for scroll to complete before starting animations
    setTimeout(function() {
        console.log('[HUB-ANIM] Scroll complete, starting animations');
        
        // Step 1: Update text FIRST
        if (progressText) progressText.textContent = `Your car profile is ${progressPercent}% complete`;
        if (progressSubtext) progressSubtext.textContent = `${totalCompleted} of ${totalTasks} tasks completed`;
        console.log('[HUB-ANIM] Text updated');
        
        // Step 2: Animate progress bar (starts immediately, duration 1s)
        setTimeout(function() {
            if (progressFill) {
                progressFill.style.transition = 'width 1s ease';
                progressFill.style.width = progressPercent + '%';
                console.log('[HUB-ANIM] Progress bar animating to:', progressPercent + '%');
            }
        }, 50);
    
    // Step 3: Change subtitle and flip icon (1300ms - after progress finishes)
    setTimeout(function() {
        // Change subtitle text
        if (subtitle) {
            subtitle.textContent = 'Added';
            console.log('[HUB-ANIM] Subtitle changed to Added');
        }
        
        // Flip the icon circle
        if (iconButton) {
            iconButton.style.transform = 'rotateY(180deg)';
            iconButton.style.transition = 'transform 0.6s ease';
            iconButton.style.transformStyle = 'preserve-3d';
            console.log('[HUB-ANIM] Icon button flipping');
            
            // Change icon to tick after half the flip (so it appears correctly when rotated)
            setTimeout(function() {
                const icon = iconButton.querySelector('img');
                if (icon) {
                    // The tick needs to be pre-flipped so it appears correct after rotation
                    icon.setAttribute('data-action-icon', 'tick');
                    icon.setAttribute('src', '../../../assets/icons/action/tick.svg');
                    icon.style.transform = 'scaleX(-1)'; // Flip horizontally to compensate
                    console.log('[HUB-ANIM] Icon changed to tick');
                }
            }, 300);
        }
    }, 1300);
    
    // Step 4: Lock hero panel height BEFORE ghost panel fades (100% only)
    // Tick flip completes at 1900ms (1300 + 600), add 150ms pause = 2050ms
    const heightLockDelay = (progressPercent === 100) ? 2050 : 2200;
    setTimeout(function() {
        if (progressPercent === 100) {
            const heroPanel = document.querySelector('.hero-panel-container');
            
            if (heroPanel) {
                const currentHeight = heroPanel.getBoundingClientRect().height;
                heroPanel.style.minHeight = currentHeight + 'px';
                heroPanel.style.height = currentHeight + 'px';
                heroPanel.style.maxHeight = currentHeight + 'px';
                heroPanel.style.overflow = 'hidden';
                console.log('[HUB-ANIM] 100% - Hero panel height LOCKED at', currentHeight + 'px (after 150ms pause)');
            }
        }
    }, heightLockDelay);
    
    // Step 5: Fade out ghost panel AND progress bar together - timing depends on if 100% or 75%
    // 100%: Start fade at 2050ms (after 150ms pause), 75%: Start at 2200ms as before
    const fadeOutDelay = (progressPercent === 100) ? 2050 : 2200;
    setTimeout(function() {
        const flipContainer = document.querySelector(`.flip-container[data-task="${newTask}"]`);
        const progressSection = document.getElementById('progress-section');
        
        if (progressPercent === 100) {
            // For 100%, fade out BOTH ghost panel and progress bar simultaneously
            if (flipContainer) {
                flipContainer.style.transition = 'opacity 0.4s ease';
                flipContainer.style.opacity = '0';
                console.log('[HUB-ANIM] 100% - Ghost panel fading out');
            }
            if (progressSection) {
                progressSection.style.transition = 'opacity 0.4s ease';
                progressSection.style.opacity = '0';
                console.log('[HUB-ANIM] 100% - Progress bar fading out simultaneously');
            }
        } else {
            // For 75%, only fade ghost panel
            if (flipContainer) {
                flipContainer.style.transition = 'opacity 0.4s ease';
                flipContainer.style.opacity = '0';
                console.log('[HUB-ANIM] Ghost panel fading out');
            }
        }
    }, fadeOutDelay);
    
    // Step 6: Handle panel visibility and expansion - timing depends on if 100% or 75%
    // 100%: Ghost+progress fade starts at 2050ms, completes at 2450ms (2050 + 400)
    // 75%: Ghost fade starts at 2200ms, completes at 2600ms (2200 + 400)
    const expansionDelay = (progressPercent === 100) ? 2450 : 2600;
    setTimeout(function() {
        const dashboardGrid = document.querySelector('.hero-panel-dashboard-grid');
        
        // If 100% complete, hide the entire dashboard grid
        if (progressPercent === 100) {
            // Hide completed panel's wrapper immediately
            const completedPanel = document.querySelector(`.flip-container[data-task="${newTask}"]`);
            if (completedPanel && completedPanel.parentElement) {
                completedPanel.parentElement.style.visibility = 'hidden';
                completedPanel.parentElement.style.pointerEvents = 'none';
                console.log('[HUB-ANIM] Completed panel wrapper hidden (visibility)');
            }
            
            // Fade out the entire dashboard grid
            if (dashboardGrid) {
                dashboardGrid.style.transition = 'opacity 0.4s ease';
                dashboardGrid.style.opacity = '0';
                console.log('[HUB-ANIM] 100% - Fading out entire dashboard grid');
            }
            
            // After fade completes, hide dashboard and progress, show notification
            setTimeout(function() {
                const dashboardGrid = document.querySelector('.hero-panel-dashboard-grid');
                const progressSection = document.getElementById('progress-section');
                const notification = document.getElementById('completion-notification');
                const heroPanel = document.querySelector('.hero-panel-container');
                
                console.log('[HUB-ANIM] POST-FADE - Elements found:', {
                    dashboardGrid: !!dashboardGrid,
                    progressSection: !!progressSection,
                    notification: !!notification,
                    heroPanel: !!heroPanel
                });
                
                // Hide faded elements
                if (dashboardGrid) {
                    dashboardGrid.style.display = 'none';
                    console.log('[HUB-ANIM] 100% - Dashboard hidden');
                }
                if (progressSection) {
                    progressSection.style.display = 'none';
                    console.log('[HUB-ANIM] 100% - Progress hidden');
                }
                
                // Show notification (invisible) and prepare for simultaneous animations
                if (notification) {
                    notification.style.display = 'block';
                    notification.style.opacity = '0';
                    notification.style.marginBottom = '16px';
                    console.log('[HUB-ANIM] 100% - Notification set to display:block, opacity:0');
                } else {
                    console.error('[HUB-ANIM] 100% - NOTIFICATION NOT FOUND!');
                }
                
                if (notification && heroPanel) {
                    // Get current locked height BEFORE any changes
                    const lockedHeight = parseInt(heroPanel.style.height) || heroPanel.getBoundingClientRect().height;
                    
                    // Force reflow to register display:block
                    notification.offsetHeight;
                    
                    // Calculate target height with notification visible
                    const targetHeight = heroPanel.scrollHeight;
                    
                    console.log('[HUB-ANIM] 100% - Locked height:', lockedHeight + 'px', 'Target height:', targetHeight + 'px');
                    
                    // Use setTimeout instead of requestAnimationFrame for more reliable timing
                    setTimeout(function() {
                        // Ensure we're starting from the locked height
                        heroPanel.style.height = lockedHeight + 'px';
                        
                        // Force reflow before setting transition
                        heroPanel.offsetHeight;
                        
                        // Enable transition
                        heroPanel.style.transition = 'height 0.5s ease';
                        notification.style.transition = 'opacity 0.5s ease';
                        
                        // Start animations on next frame
                        setTimeout(function() {
                            heroPanel.style.height = targetHeight + 'px';
                            notification.style.opacity = '1';
                            console.log('[HUB-ANIM] 100% - Started height animation from', lockedHeight, 'to', targetHeight);
                        }, 20);
                    }, 50);
                    
                    // Clean up after animation
                    setTimeout(function() {
                        heroPanel.style.height = 'auto';
                        heroPanel.style.minHeight = '';
                        heroPanel.style.maxHeight = '';
                        heroPanel.style.overflow = '';
                        heroPanel.style.transition = '';
                        console.log('[HUB-ANIM] 100% - Animation complete, styles cleaned');
                    }, 500);
                } else {
                    console.error('[HUB-ANIM] Missing heroPanel or notification for height animation');
                }
            }, 400);
        } else {
            // Not 100% yet - expand remaining panel
            const otherTask = newTask === 'insurance' ? 'servicing' : 'insurance';
            const otherPanel = document.querySelector(`.flip-container[data-task="${otherTask}"]`);
            const dashboardRow = document.querySelector('.hero-panel-dashboard-row');
            
            // Hide completed panel's wrapper (the <a> tag) - keep in flow for smooth animation
            const completedPanel = document.querySelector(`.flip-container[data-task="${newTask}"]`);
            if (completedPanel && completedPanel.parentElement) {
                completedPanel.parentElement.style.visibility = 'hidden';
                completedPanel.parentElement.style.pointerEvents = 'none';
                console.log('[HUB-ANIM] Completed panel wrapper hidden (visibility)');
            }
            
            // Expand remaining panel to full width and remove gap
            if (otherPanel && dashboardRow) {
                // Remove gap from dashboard row
                dashboardRow.style.gap = '0';
                dashboardRow.style.transition = 'gap 0.4s ease';
                // Expand panel's wrapper (the <a> tag)
                if (otherPanel.parentElement) {
                    otherPanel.parentElement.style.flex = '1 1 100%';
                    otherPanel.parentElement.style.maxWidth = '100%';
                    otherPanel.parentElement.style.transition = 'flex 0.4s ease, max-width 0.4s ease';
                }
                console.log('[HUB-ANIM] Remaining panel expanding');
            }
            
            // After animation completes, fully remove the hidden panel
            setTimeout(function() {
                if (completedPanel && completedPanel.parentElement) {
                    completedPanel.parentElement.style.display = 'none';
                }
            }, 400);
        }
    }, expansionDelay);
    
    // Step 7: Show list item with height animation - timing depends on if 100% or 75%
    // 100%: Start showing list item at same time as ghost panel fade (2050ms)
    // 75%: Keep original timing (3000ms)
    const listItemDelay = (progressPercent === 100) ? 2050 : 3000;
    setTimeout(function() {
        const listItem = document.getElementById(`${newTask}-list-item`);
        if (listItem) {
            // Set initial height to 0
            listItem.style.height = '0';
            listItem.style.overflow = 'hidden';
            listItem.style.display = 'flex';
            
            // Force reflow
            listItem.offsetHeight;
            
            // Get the natural height
            listItem.style.height = 'auto';
            const naturalHeight = listItem.offsetHeight;
            listItem.style.height = '0';
            
            // Force reflow again
            listItem.offsetHeight;
            
            // Animate to natural height
            listItem.style.transition = 'height 0.4s ease, opacity 0.4s ease';
            listItem.style.height = naturalHeight + 'px';
            listItem.style.opacity = '1';
            
            // Clean up after animation
            setTimeout(function() {
                listItem.style.height = 'auto';
                listItem.style.overflow = 'visible';
                
                // Reload SVG icons for the newly shown list item
                if (window.reloadInlineSVGs) {
                    window.reloadInlineSVGs();
                    console.log('[HUB-ANIM] Reloaded SVG icons after list item show');
                }
            }, 400);
            
            console.log('[HUB-ANIM] List item animated in');
        }
    }, listItemDelay);
    
    }, 400); // End of scroll delay wrapper
    
    // Return timing info for 100% completion handling
    return {
        progressUpdateTime: 450,  // Text updates after scroll (400ms + 50ms)
        totalAnimationTime: 3800  // Total duration (3400 + 400 scroll delay)
    };
}

// Make function globally available
window.animateNewTaskCompletion = animateNewTaskCompletion;

console.log('[HUB-ANIM] Animation override script loaded');