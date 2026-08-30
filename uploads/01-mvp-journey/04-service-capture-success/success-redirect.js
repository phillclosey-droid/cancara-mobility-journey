/**
 * SERVICE SUCCESS PAGE - Redirect Handler
 * ========================================
 * Called when user clicks "Continue" button
 * Marks servicing as completed and redirects to hub for animation
 */

function handleContinue() {
    console.log('[SERVICE-SUCCESS] Continue clicked');
    
    // Mark servicing as completed in state
    if (window.hubStateMachine) {
        window.hubStateMachine.completeTask('servicing');
    } else {
        // Fallback: Set state directly if state machine not loaded
        const state = JSON.parse(localStorage.getItem('hub_state') || '{"completedTasks":["tax","mot"],"progressState":"hub_50","lastCompletedTask":null}');
        
        if (!state.completedTasks.includes('servicing')) {
            state.completedTasks.push('servicing');
        }
        
        // Calculate new progress
        const count = state.completedTasks.length;
        state.progressState = count === 4 ? 'hub_100' : count === 3 ? 'hub_75' : 'hub_50';
        state.lastCompletedTask = 'servicing';
        
        localStorage.setItem('hub_state', JSON.stringify(state));
        console.log('[SERVICE-SUCCESS] State set (fallback):', state);
    }
    
    // Redirect to hub
    window.location.href = '../02-mobility-hub/mobility-hub.html';
}

console.log('[SERVICE-SUCCESS] Script loaded');
