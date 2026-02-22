// Overview page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Get periode from URL (assume we're in periode1/ or periode2/ directory)
    const path = window.location.pathname;
    const periode = path.includes('periode1') ? 1 : 2;
    
    updateOverviewStats(periode);
    updateLessonCards(periode);
});

function updateOverviewStats(periode) {
    // Get data directly from localStorage to ensure it's fresh
    const progress = progressTracker.getProgress();
    const periodeData = progress[`periode${periode}`];
    
    if (!periodeData) {
        console.error(`No data for periode ${periode}`);
        return;
    }
    
    // Calculate stats
    const lessons = Object.values(periodeData.lessons);
    const completedCount = lessons.filter(l => l.completed).length;
    const totalLessons = 7;
    const percentage = Math.round((completedCount / totalLessons) * 100);
    const xp = periodeData.xp || 0;
    
    console.log(`[OVERVIEW DEBUG] Periode ${periode}:`, {
        completed: completedCount,
        total: totalLessons,
        xp: xp,
        percentage: percentage
    });
    
    // Update header stats
    const completedElement = document.getElementById('completedLessons');
    const xpElement = document.getElementById('periodeXP');
    const percentageElement = document.getElementById('percentage');
    
    if (completedElement) {
        completedElement.textContent = `${completedCount}/${totalLessons}`;
    }
    
    if (xpElement) {
        xpElement.textContent = xp;
    }
    
    if (percentageElement) {
        percentageElement.textContent = `${percentage}%`;
    }
}

function updateLessonCards(periode) {
    const progress = progressTracker.getProgress();
    const periodeData = progress[`periode${periode}`];
    
    // Update each lesson card
    for (let lessonNum = 1; lessonNum <= 7; lessonNum++) {
        const lessonData = periodeData.lessons[`les${lessonNum}`];
        const card = document.querySelector(`.lesson-card[data-lesson="${lessonNum}"]`);
        const statusIcon = document.getElementById(`status-${lessonNum}`);
        
        if (card && lessonData) {
            if (lessonData.completed) {
                card.classList.add('completed');
                
                if (statusIcon) {
                    statusIcon.innerHTML = `
                        <svg class="status-icon completed" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.2"/>
                            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    `;
                }
            } else if (lessonData.exercises.length > 0) {
                // Lesson started but not completed
                card.classList.add('in-progress');
                
                if (statusIcon) {
                    const totalExercises = getTotalExercises(lessonNum);
                    const progressPercent = (lessonData.exercises.length / totalExercises) * 100;
                    
                    statusIcon.innerHTML = `
                        <svg class="status-icon in-progress" width="24" height="24" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"
                                    stroke-dasharray="${progressPercent * 0.628} 62.8"
                                    transform="rotate(-90 12 12)"
                                    style="stroke: var(--accent-cyan);"/>
                        </svg>
                    `;
                }
            }
        }
    }
}

function getTotalExercises(lessonNum) {
    // Total exercises per lesson for Periode 1
    const exerciseCounts = {
        1: 7,  // Was 6, nu 7 (DISTINCT toegevoegd)
        2: 8,  // Was 7, nu 8 (LIKE toegevoegd)
        3: 8,
        4: 8,
        5: 6,
        6: 8,
        7: 5
    };
    return exerciseCounts[lessonNum] || 5;
}

// Add CSS for in-progress state
const style = document.createElement('style');
style.textContent = `
    .lesson-card.in-progress {
        border-color: var(--accent-purple);
    }
    
    .lesson-card.in-progress::before {
        background: var(--accent-purple);
        opacity: 0.7;
    }
    
    .status-icon.in-progress {
        color: var(--accent-cyan);
    }
`;
document.head.appendChild(style);
