/**
 * HUB STATE MACHINE - SIMPLE INTEGRATION
 * 
 * This replaces the complex URL parameter and sessionStorage logic
 * with a clean localStorage-based state machine.
 * 
 * USAGE:
 * 1. Include this script BEFORE hub-new-animations.js and hub-navigation.js
 * 2. Success pages call: hubStateMachine.completeTask('insurance')
 * 3. Hub page automatically renders correct state and animates when needed
 */

(function() {
    'use strict';

    const STATE_KEY = 'hub_state_v2'; // v2 to avoid conflicts with old system
    
    // Default starting state - NOTE: First ever visit should be hub_0!
    const DEFAULT_STATE = {
        completedTasks: [],  // Start with NO tasks
        progressState: 'hub_0',  // Start at hub_0 for initial animation
        lastCompletedTask: null,
        hasSeenInitialAnimation: false,  // Track if we've done the car spin
        isConnected: true  // Track if car is connected (false = show empty state)
    };

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    function getState() {
        try {
            const stored = localStorage.getItem(STATE_KEY);
            if (!stored) return { ...DEFAULT_STATE };
            return JSON.parse(stored);
        } catch (e) {
            console.error('[STATE-MACHINE] Error reading state:', e);
            return { ...DEFAULT_STATE };
        }
    }

    function setState(newState) {
        try {
            localStorage.setItem(STATE_KEY, JSON.stringify(newState));
            console.log('[STATE-MACHINE] State saved:', newState);
        } catch (e) {
            console.error('[STATE-MACHINE] Error saving state:', e);
        }
    }

    function calculateProgressState(completedTasks) {
        const count = completedTasks.length;
        if (count >= 4) return 'hub_100';
        if (count === 3) return 'hub_75';
        if (count >= 2) return 'hub_50';
        return 'hub_0';
    }

    // ========================================
    // RENDER STATIC STATE
    // ========================================

    function renderStaticState(state) {
        console.log('[STATE-MACHINE] Rendering static state:', state.progressState, 'isConnected:', state.isConnected);
        
        // Handle disconnected state (empty panel)
        if (!state.isConnected) {
            const connectedPanel = document.getElementById('hero-panel-connected');
            const emptyPanel = document.getElementById('hero-panel-empty');
            const listActionGroup = document.querySelector('.list-action-group');
            const financeButton = document.getElementById('finance-button');
            
            // Hide connected panel and list items
            if (connectedPanel) {
                connectedPanel.style.display = 'none';
            }
            if (listActionGroup) {
                listActionGroup.style.display = 'none';
            }
            
            // Show empty panel
            if (emptyPanel) {
                emptyPanel.style.display = 'block';
                emptyPanel.style.opacity = '1';
            }
            
            // Change finance button to secondary
            if (financeButton) {
                financeButton.classList.remove('btn-primary');
                financeButton.classList.add('btn-secondary');
            }
            
            console.log('[STATE-MACHINE] Showing empty/disconnected state');
            return; // Exit early - don't render connected state
        }
        
        // Show connected panel, hide empty panel
        const connectedPanel = document.getElementById('hero-panel-connected');
        const emptyPanel = document.getElementById('hero-panel-empty');
        const listActionGroup = document.querySelector('.list-action-group');
        const financeButton = document.getElementById('finance-button');
        
        if (connectedPanel) {
            connectedPanel.style.display = 'block';
            connectedPanel.style.opacity = '1';
        }
        if (emptyPanel) {
            emptyPanel.style.display = 'none';
        }
        if (listActionGroup) {
            listActionGroup.style.display = 'block';
            listActionGroup.style.opacity = '1';
        }
        if (financeButton) {
            financeButton.classList.remove('btn-secondary');
            financeButton.classList.add('btn-primary');
        }
        
        const progressMap = {
            'hub_0': 0,
            'hub_50': 50,
            'hub_75': 75,
            'hub_100': 100
        };
        
        const progressPercent = progressMap[state.progressState];
        const completedCount = state.completedTasks.length;
        
        // Set video source and position
        const video = document.getElementById('hero-car-video');
        if (video) {
            const currentTheme = document.body.getAttribute('data-theme') || 'dark';
            const videoSource = currentTheme === 'light' 
                ? '../../../assets/videos/car-spin-light.webm'
                : '../../../assets/videos/car-spin.webm';
            
            // Only change src if it's different
            const needsLoad = video.src !== videoSource && !video.src.includes(videoSource);
            if (needsLoad) {
                video.src = videoSource;
            }
            
            // For hub_0, set to start. For others, set to end frame
            if (state.progressState === 'hub_0') {
                if (video.readyState >= 1) {
                    video.currentTime = 0;
                    video.pause();
                } else {
                    video.addEventListener('loadedmetadata', function() {
                        video.currentTime = 0;
                        video.pause();
                    }, { once: true });
                }
                if (needsLoad) video.load();
            } else {
                if (video.readyState >= 1) {
                    video.currentTime = video.duration;
                    video.pause();
                } else {
                    video.addEventListener('loadedmetadata', function() {
                        video.currentTime = video.duration;
                        video.pause();
                    }, { once: true });
                }
                if (needsLoad) video.load();
            }
        }
        
        // Show progress section (use flex for proper vertical spacing!)
        const progressSection = document.getElementById('progress-section');
        const notification = document.getElementById('completion-notification');
        
        if (state.progressState === 'hub_100') {
            // At 100%, hide progress and show notification
            if (progressSection) progressSection.style.display = 'none';
            if (notification) {
                notification.style.display = 'block';
                notification.style.opacity = '1';
                notification.style.marginBottom = '16px';  // Add 16px margin for static state too
            }
        } else {
            // Show progress, hide notification
            if (progressSection) progressSection.style.display = 'flex';  // Important: flex not block!
            if (notification) {
                notification.style.display = 'none';
                notification.style.opacity = '0';
            }
        }
        
        // Update progress bar (no animation)
        const progressFill = document.querySelector('.hero-panel-progress-fill');
        const progressText = document.querySelector('.hero-panel-progress-text');
        const progressSubtext = document.querySelector('.hero-panel-progress-subtext');
        
        if (progressFill) {
            progressFill.style.transition = 'none';
            if (state.progressState === 'hub_0') {
                progressFill.style.width = '8px';  // Start state
            } else {
                progressFill.style.width = progressPercent + '%';
            }
            // Force reflow
            progressFill.offsetWidth;
        }
        
        if (progressText) {
            if (state.progressState === 'hub_0') {
                progressText.textContent = 'Your car profile';
            } else {
                progressText.textContent = `Your car profile is ${progressPercent}% complete`;
            }
        }
        
        if (progressSubtext) {
            progressSubtext.textContent = `${completedCount} of 4 tasks completed`;
        }
        
        // Show completed list items (but NOT the one being animated)
        state.completedTasks.forEach(task => {
            // Skip the task that's currently being animated
            if (state.lastCompletedTask && task === state.lastCompletedTask) {
                const listItem = document.getElementById(`${task}-list-item`);
                if (listItem) {
                    listItem.style.display = 'none';
                    listItem.style.opacity = '0';
                }
                return;
            }
            
            const listItem = document.getElementById(`${task}-list-item`);
            if (listItem) {
                listItem.style.display = 'flex';
                listItem.style.opacity = '1';
                listItem.style.height = 'auto';
            }
        });
        
        // Handle ghost panels
        if (state.progressState === 'hub_50') {
            // Both ghost panels visible
            showGhostPanels(['insurance', 'servicing']);
            
            // Reset ghost panel subtitles to default state (in case they were changed)
            resetGhostPanelSubtitle('insurance', 'Get reminder');
            resetGhostPanelSubtitle('servicing', 'Keep track');
        } else if (state.progressState === 'hub_75') {
            // One ghost panel hidden, one expanded
            const remaining = ['insurance', 'servicing'].find(t => !state.completedTasks.includes(t));
            const completed = ['insurance', 'servicing'].find(t => state.completedTasks.includes(t));
            
            // If we're about to animate (lastCompletedTask exists), show the completed task with "Added"
            if (state.lastCompletedTask) {
                // Show the task we just completed with "Added" text
                showGhostPanels([state.lastCompletedTask]);
                setGhostPanelToAdded(state.lastCompletedTask);
                expandGhostPanel(state.lastCompletedTask);
                
                // Hide all other tasks
                const allTasks = ['insurance', 'servicing'];
                allTasks.forEach(task => {
                    if (task !== state.lastCompletedTask) {
                        hideGhostPanel(task);
                    }
                });
            } else {
                // Normal static state - hide completed, show remaining expanded
                hideGhostPanel(completed);
                showGhostPanels([remaining]);
                expandGhostPanel(remaining);
            }
        } else if (state.progressState === 'hub_100') {
            // All ghost panels hidden
            hideGhostPanel('insurance');
            hideGhostPanel('servicing');
            
            const dashboardGrid = document.querySelector('.hero-panel-dashboard-grid');
            if (dashboardGrid) {
                dashboardGrid.style.display = 'none';
            }
        }
    }

    function showGhostPanels(tasks) {
        tasks.forEach(task => {
            const flipContainer = document.querySelector(`.flip-container[data-task="${task}"]`);
            if (flipContainer && flipContainer.parentElement) {
                flipContainer.style.opacity = '1';
                flipContainer.style.visibility = 'visible';
                flipContainer.parentElement.style.display = 'flex';
                flipContainer.parentElement.style.visibility = 'visible';
            }
        });
    }

    function hideGhostPanel(task) {
        const flipContainer = document.querySelector(`.flip-container[data-task="${task}"]`);
        if (flipContainer && flipContainer.parentElement) {
            flipContainer.style.opacity = '0';
            flipContainer.style.visibility = 'hidden';
            flipContainer.parentElement.style.display = 'none';
        }
    }

    function expandGhostPanel(task) {
        const panel = document.querySelector(`.flip-container[data-task="${task}"]`);
        const dashboardRow = document.querySelector('.hero-panel-dashboard-row');
        
        if (panel && panel.parentElement && dashboardRow) {
            // No animation for static render
            dashboardRow.style.transition = 'none';
            dashboardRow.style.gap = '0';
            
            panel.parentElement.style.transition = 'none';
            panel.parentElement.style.flex = '1 1 100%';
            panel.parentElement.style.maxWidth = '100%';
        }
    }

    function resetGhostPanelSubtitle(task, text) {
        const ghostPanel = document.querySelector(`.flip-container[data-task="${task}"] .hero-panel-ghost-compact`);
        const subtitle = ghostPanel ? ghostPanel.querySelector('.hero-panel-ghost-subtitle') : null;
        const iconButton = ghostPanel ? ghostPanel.querySelector('.hero-panel-ghost-button') : null;
        
        if (subtitle) {
            subtitle.textContent = text;
        }
        
        // Reset icon rotation
        if (iconButton) {
            iconButton.style.transform = 'rotateY(0deg)';
            const icon = iconButton.querySelector('img');
            if (icon) {
                icon.setAttribute('data-action-icon', 'plus');
                icon.setAttribute('src', '../../../assets/icons/action/plus.svg');
                icon.style.transform = 'scaleX(1)';
            }
        }
    }

    function setGhostPanelToAdded(task) {
        const ghostPanel = document.querySelector(`.flip-container[data-task="${task}"] .hero-panel-ghost-compact`);
        const subtitle = ghostPanel ? ghostPanel.querySelector('.hero-panel-ghost-subtitle') : null;
        const iconButton = ghostPanel ? ghostPanel.querySelector('.hero-panel-ghost-button') : null;
        
        // Set subtitle to default text based on task type (animation will change it to "Added")
        if (subtitle) {
            if (task === 'insurance') {
                subtitle.textContent = 'Get reminder';
            } else if (task === 'servicing') {
                subtitle.textContent = 'Keep track';
            }
        }
        
        // Keep icon as plus (not flipped) so animation can flip it
        if (iconButton) {
            iconButton.style.transform = 'rotateY(0deg)';
            iconButton.style.transition = '';
            const icon = iconButton.querySelector('img');
            if (icon) {
                icon.setAttribute('data-action-icon', 'plus');
                icon.setAttribute('src', '../../../assets/icons/action/plus.svg');
                icon.style.transform = 'scaleX(1)';
            }
        }
    }

    // ========================================
    // ANIMATIONS
    // ========================================

    /**
     * Run initial animation (hub_0 → hub_50)
     * Car spins once, progress animates to 50%
     */
    function runInitialAnimation() {
        console.log('[STATE-MACHINE] Running initial animation hub_0 → hub_50');
        
        const video = document.getElementById('hero-car-video');
        const progressFill = document.querySelector('.hero-panel-progress-fill');
        const progressText = document.querySelector('.hero-panel-progress-text');
        const progressSubtext = document.querySelector('.hero-panel-progress-subtext');
        
        if (!video || !progressFill) {
            console.error('[STATE-MACHINE] Missing video or progress elements!');
            return;
        }
        
        // Play video
        video.play().catch(function(err) {
            console.error('[STATE-MACHINE] Video play error:', err);
        });
        
        // When video ends, animate progress
        video.addEventListener('ended', function() {
            console.log('[STATE-MACHINE] Video ended - animating progress');
            video.pause();
            
            // Enable transition
            progressFill.style.transition = 'width 1s ease';
            
            // Animate to 50%
            setTimeout(() => {
                progressFill.style.width = '50%';
                if (progressText) progressText.textContent = 'Your car profile is 50% complete';
                if (progressSubtext) progressSubtext.textContent = '2 of 4 tasks completed';
                
                console.log('[STATE-MACHINE] Progress animated to 50%');
            }, 50);
            
            // After animation, update state
            setTimeout(() => {
                const state = getState();
                state.completedTasks = ['tax', 'mot'];
                state.progressState = 'hub_50';
                state.hasSeenInitialAnimation = true;
                setState(state);
                console.log('[STATE-MACHINE] Initial animation complete, state updated to hub_50');
            }, 1100);
            
        }, { once: true });
    }

    /**
     * Run animation for newly completed task
     */
    /**
     * Run animation for newly completed task (hub_50 → hub_75 or hub_75 → hub_100)
     */
    function runTaskCompletionAnimation(state) {
        const task = state.lastCompletedTask;
        if (!task) return;
        
        console.log('[STATE-MACHINE] ===== RUNNING TASK COMPLETION ANIMATION =====');
        console.log('[STATE-MACHINE] Task:', task);
        console.log('[STATE-MACHINE] Target state:', state.progressState);
        
        const progressMap = {
            'hub_75': 75,
            'hub_100': 100
        };
        
        const progressPercent = progressMap[state.progressState];
        const totalCompleted = state.completedTasks.length;
        
        console.log('[STATE-MACHINE] Progress percent:', progressPercent);
        console.log('[STATE-MACHINE] Total completed:', totalCompleted);
        
        // Step 1: Scroll to focus on progress bar and ghost panels (300ms)
        const contentWrapper = document.querySelector('.content-wrapper');
        const progressSection = document.querySelector('.hero-panel-progress-section');
        
        setTimeout(function() {
            console.log('[STATE-MACHINE] Scrolling to progress section');
            if (contentWrapper && progressSection) {
                const scrollTop = contentWrapper.scrollTop;
                const progressTop = progressSection.getBoundingClientRect().top;
                const wrapperTop = contentWrapper.getBoundingClientRect().top;
                contentWrapper.scrollTo({
                    top: scrollTop + progressTop - wrapperTop - 100,
                    behavior: 'smooth'
                });
            }
        }, 300);
        
        // Call the existing animation function from hub-new-animations.js
        console.log('[STATE-MACHINE] Checking for window.animateNewTaskCompletion...');
        console.log('[STATE-MACHINE] Found?', typeof window.animateNewTaskCompletion);
        
        if (window.animateNewTaskCompletion) {
            console.log('[STATE-MACHINE] Calling animateNewTaskCompletion NOW');
            window.animateNewTaskCompletion(task, progressPercent, totalCompleted, 4);
            
            // Clear lastCompletedTask after animation completes (3800ms total)
            setTimeout(() => {
                const currentState = getState();
                currentState.lastCompletedTask = null;
                setState(currentState);
                console.log('[STATE-MACHINE] Animation complete, cleared lastCompletedTask');
            }, 3800);
        } else {
            console.error('[STATE-MACHINE] ERROR: animateNewTaskCompletion not found!');
            console.error('[STATE-MACHINE] window object keys:', Object.keys(window).filter(k => k.includes('animate')));
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        console.log('[STATE-MACHINE] Initializing');
        
        // Check if coming from account summary page
        const params = new URLSearchParams(window.location.search);
        const fromAccountSummary = params.get('from') === 'account-summary';
        
        if (fromAccountSummary) {
            console.log('[STATE-MACHINE] Coming from account summary - resetting to hub_0');
            setState({ ...DEFAULT_STATE });
        }
        
        const state = getState();
        console.log('[STATE-MACHINE] Current state:', state);
        
        // If we just completed a task, we need to render the PREVIOUS state first
        // then animate to the current state
        let renderState = state;
        if (state.lastCompletedTask) {
            // Determine previous state based on current state
            if (state.progressState === 'hub_75') {
                // Was at hub_50, now at hub_75
                renderState = { ...state, progressState: 'hub_50' };
                console.log('[STATE-MACHINE] Will render hub_50 first, then animate to hub_75');
            } else if (state.progressState === 'hub_100') {
                // Was at hub_75, now at hub_100
                renderState = { ...state, progressState: 'hub_75' };
                console.log('[STATE-MACHINE] Will render hub_75 first, then animate to hub_100');
            }
        }
        
        // ALWAYS render static state first
        renderStaticState(renderState);
        
        // Initialize icons and SVGs
        setTimeout(function() {
            if (window.initPictograms) window.initPictograms();
            if (window.initIllustrations) window.initIllustrations();
            if (window.initActionIcons) window.initActionIcons();
            if (window.reloadInlineSVGs) {
                window.reloadInlineSVGs();
                console.log('[STATE-MACHINE] Reloaded inline SVGs');
            }
        }, 100);
        
        // FOR NOW: Handle animations
        if (state.progressState === 'hub_0' && !state.hasSeenInitialAnimation) {
            // First ever visit - play initial animation
            console.log('[STATE-MACHINE] First visit - will play initial animation');
            setTimeout(() => {
                runInitialAnimation();
            }, 500);
        } else if (state.lastCompletedTask) {
            // Just completed a task - render previous static state, then animate
            console.log('[STATE-MACHINE] Just completed task:', state.lastCompletedTask);
            console.log('[STATE-MACHINE] Will animate from current state to:', state.progressState);
            
            // Wait for animation script to load, then trigger animation
            const maxWait = 2000; // 2 seconds max wait
            const checkInterval = 50; // Check every 50ms
            let waited = 0;
            
            const waitForAnimation = setInterval(() => {
                if (window.animateNewTaskCompletion) {
                    clearInterval(waitForAnimation);
                    console.log('[STATE-MACHINE] Animation function found, triggering animation');
                    setTimeout(() => {
                        runTaskCompletionAnimation(state);
                    }, 200);
                } else {
                    waited += checkInterval;
                    if (waited >= maxWait) {
                        clearInterval(waitForAnimation);
                        console.error('[STATE-MACHINE] Timeout waiting for animation function');
                    }
                }
            }, checkInterval);
        } else {
            console.log('[STATE-MACHINE] Showing static state only (no animation)');
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    window.hubStateMachine = {
        completeTask: function(task) {
            console.log('[STATE-MACHINE] Task completed:', task);
            
            const state = getState();
            
            if (!state.completedTasks.includes(task)) {
                state.completedTasks.push(task);
            }
            
            state.progressState = calculateProgressState(state.completedTasks);
            state.lastCompletedTask = task;
            
            setState(state);
        },
        
        disconnect: function() {
            console.log('[STATE-MACHINE] Disconnecting car');
            const state = getState();
            state.isConnected = false;
            setState(state);
            
            // Re-render to show empty state
            renderStaticState(state);
        },
        
        reconnect: function() {
            console.log('[STATE-MACHINE] Reconnecting car - resetting to initial state');
            // Reset to default state and reload
            setState({ ...DEFAULT_STATE });
            location.reload();
        },
        
        getState: getState,
        
        reset: function() {
            setState({ ...DEFAULT_STATE });
            location.reload();
        }
    };

    // ========================================
    // AUTO-INITIALIZE
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

console.log('[STATE-MACHINE] Loaded');
