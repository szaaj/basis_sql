// Main app JavaScript voor homepage

document.addEventListener('DOMContentLoaded', () => {
    updateHomepageStats();
    
    // Update stats every time page is visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateHomepageStats();
        }
    });
});

function updateHomepageStats() {
    const stats = progressTracker.getTotalStats();
    const currentLevel = progressTracker.getCurrentLevel();
    const nextLevel = progressTracker.getNextLevel();
    const levelProgress = progressTracker.getLevelProgress();
    const xpToNext = progressTracker.getXPToNextLevel();
    
    // Update Level Display
    document.getElementById('levelIcon').textContent = currentLevel.icon;
    document.getElementById('levelName').textContent = currentLevel.name;
    document.getElementById('currentLevel').textContent = currentLevel.level;
    
    // Update total XP
    document.getElementById('totalXP').textContent = stats.totalXP;
    
    // Update Level Progress
    if (nextLevel) {
        document.getElementById('levelProgressText').textContent = 
            `Voortgang naar Level ${nextLevel.level}: ${nextLevel.name}`;
        document.getElementById('xpToNextLevel').textContent = `${xpToNext} XP te gaan`;
        document.getElementById('levelProgressBar').style.width = `${levelProgress}%`;
    } else {
        document.getElementById('levelProgressText').textContent = 'Max Level Bereikt!';
        document.getElementById('xpToNextLevel').textContent = '👑 Champion';
        document.getElementById('levelProgressBar').style.width = '100%';
    }
    
    // Update Periode 1 stats
    document.getElementById('p1-completed').textContent = 
        `${stats.periode1.completed}/${stats.periode1.total}`;
    document.getElementById('p1-xp').textContent = stats.periode1.xp;
    document.getElementById('p1-progress').style.width = `${stats.periode1.percentage}%`;
    
    // Update Periode 2 stats
    document.getElementById('p2-completed').textContent = 
        `${stats.periode2.completed}/${stats.periode2.total}`;
    document.getElementById('p2-xp').textContent = stats.periode2.xp;
    document.getElementById('p2-progress').style.width = `${stats.periode2.percentage}%`;
    
    // Animate XP counter
    animateValue('totalXP', 0, stats.totalXP, 1000);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press '1' to go to Periode 1
    if (e.key === '1') {
        window.location.href = 'periode1/overview.html';
    }
    // Press '2' to go to Periode 2
    if (e.key === '2') {
        window.location.href = 'periode2/overview.html';
    }
    // Press 's' to go to Sandbox
    if (e.key === 's') {
        window.location.href = 'sandbox.html';
    }
    // Press 'c' to go to Cheat Sheet
    if (e.key === 'c') {
        window.location.href = 'cheatsheet.html';
    }
});

// Reset function
function resetAllProgress() {
    if (confirm('⚠️ WAARSCHUWING!\n\nWeet je ZEKER dat je ALLE voortgang wilt resetten?\n\n- Alle XP verdwijnt\n- Je level wordt gereset naar 1\n- Alle voltooide oefeningen worden gewist\n- Debug Quest progress wordt gewist\n\nDit kan NIET ongedaan gemaakt worden!')) {
        if (confirm('Laatste bevestiging: Ben je 100% zeker?')) {
            // Reset main progress
            localStorage.removeItem('sqlQuestProgress');
            
            // Reset debug quest progress
            localStorage.removeItem('debugQuestProgress');
            
            // Show confirmation
            alert('✅ Alle voortgang is gereset!\n\nDe pagina wordt nu herladen.');
            
            // Reload page
            location.reload();
        }
    }
}
