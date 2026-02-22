// Progress tracking system using localStorage

// XP & Levels Configuration
const XP_CONFIG = {
    EXERCISE_XP: 10,
    DEBUG_XP: 5,
    LESSON_BONUS: 50,  // Bonus for completing a lesson
    MAX_XP: 1825, // P1: 500+350 | P2: 500+350 | Debug: 125 = 1825
    LEVELS: [
        { level: 1, minXP: 0, maxXP: 200, name: "SQL Rookie", icon: "🥉" },
        { level: 2, minXP: 200, maxXP: 500, name: "Query Writer", icon: "🥈" },
        { level: 3, minXP: 500, maxXP: 900, name: "Database Explorer", icon: "🥇" },
        { level: 4, minXP: 900, maxXP: 1400, name: "SQL Master", icon: "💎" },
        { level: 5, minXP: 1400, maxXP: 1825, name: "Debug Champion", icon: "👑" }
    ]
};

class ProgressTracker {
    constructor() {
        this.storageKey = 'sqlQuestProgress';
        this.init();
    }

    init() {
        // Initialize progress if not exists
        if (!localStorage.getItem(this.storageKey)) {
            const initialProgress = {
                periode1: {
                    lessons: {
                        les1: { completed: false, exercises: [] },
                        les2: { completed: false, exercises: [] },
                        les3: { completed: false, exercises: [] },
                        les4: { completed: false, exercises: [] },
                        les5: { completed: false, exercises: [] },
                        les6: { completed: false, exercises: [] },
                        les7: { completed: false, exercises: [] }
                    },
                    xp: 0
                },
                periode2: {
                    lessons: {
                        les1: { completed: false, exercises: [] },
                        les2: { completed: false, exercises: [] },
                        les3: { completed: false, exercises: [] },
                        les4: { completed: false, exercises: [] },
                        les5: { completed: false, exercises: [] },
                        les6: { completed: false, exercises: [] },
                        les7: { completed: false, exercises: [] }
                    },
                    xp: 0
                },
                debugQuest: {
                    completed: [],
                    xp: 0
                },
                totalXP: 0,
                level: 1,
                streak: 0,
                lastVisit: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialProgress));
        }
    }

    getProgress() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    saveProgress(progress) {
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    markExerciseComplete(periode, lesson, exerciseId) {
        const progress = this.getProgress();
        const lessonData = progress[`periode${periode}`].lessons[`les${lesson}`];
        
        console.log(`[DEBUG] Marking exercise P${periode}-L${lesson}-E${exerciseId}`);
        console.log(`[DEBUG] Current exercises:`, lessonData.exercises);
        console.log(`[DEBUG] Already includes?`, lessonData.exercises.includes(exerciseId));
        
        if (!lessonData.exercises.includes(exerciseId)) {
            lessonData.exercises.push(exerciseId);
            
            console.log(`[DEBUG] ✅ NEW! Adding XP. New exercises:`, lessonData.exercises);
            
            // Award XP (10 XP per exercise)
            progress[`periode${periode}`].xp += 10;
            progress.totalXP += 10;
            
            this.saveProgress(progress);
            this.checkLessonCompletion(periode, lesson);
            return true;
        }
        
        console.log(`[DEBUG] ❌ Already completed - no XP`);
        return false;
    }

    checkLessonCompletion(periode, lesson) {
        const progress = this.getProgress();
        const lessonData = progress[`periode${periode}`].lessons[`les${lesson}`];
        
        // Count exercises per lesson - UPDATED for Periode 1
        const totalExercises = {
            les1: 7,  // Was 6, now 7 (DISTINCT added)
            les2: 8,  // Was 7, now 8 (LIKE added)
            les3: 8, 
            les4: 8,
            les5: 6, 
            les6: 8, 
            les7: 5
        };
        
        const completed = lessonData.exercises.length >= totalExercises[`les${lesson}`];
        
        if (completed && !lessonData.completed) {
            lessonData.completed = true;
            // Bonus XP for completing lesson
            const exerciseXP = totalExercises[`les${lesson}`] * 10;
            const bonusXP = 50;
            progress[`periode${periode}`].xp += bonusXP;
            progress.totalXP += bonusXP;
            this.saveProgress(progress);
            
            // Show detailed completion notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #00ff88, #00f0ff);
                color: #0a0e27;
                padding: 2rem;
                border-radius: 1rem;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 20px 60px rgba(0,255,136,0.4);
                text-align: center;
                min-width: 300px;
            `;
            notification.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
                <div style="font-size: 1.5rem; margin-bottom: 1rem;">Les ${lesson} Voltooid!</div>
                <div style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 0.5rem;">
                    +${exerciseXP} XP (oefeningen)<br>
                    +${bonusXP} XP (voltooiingsbonus)
                </div>
                <div style="font-size: 1.25rem; font-weight: 800;">
                    = ${exerciseXP + bonusXP} XP Totaal
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        }
    }

    getStats(periode) {
        const progress = this.getProgress();
        const periodeData = progress[`periode${periode}`];
        const lessons = Object.values(periodeData.lessons);
        const completedCount = lessons.filter(l => l.completed).length;
        const totalLessons = periode === 1 ? 7 : 8; // P1 = 7 lessen, P2 = 8 lessen
        const percentage = Math.round((completedCount / totalLessons) * 100);
        
        return {
            completed: completedCount,
            total: totalLessons,
            percentage: percentage,
            xp: periodeData.xp
        };
    }

    getTotalStats() {
        const progress = this.getProgress();
        const p1Stats = this.getStats(1);
        const p2Stats = this.getStats(2);
        
        return {
            totalXP: progress.totalXP,
            periode1: p1Stats,
            periode2: p2Stats,
            streak: progress.streak
        };
    }

    resetProgress() {
        if (confirm('Weet je zeker dat je al je voortgang wilt resetten?')) {
            localStorage.removeItem(this.storageKey);
            this.init();
            location.reload();
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ff88, #00f0ff);
            color: #0a0e27;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize global tracker
window.progressTracker = new ProgressTracker();

// XP Animation
const xpStyle = document.createElement('style');
xpStyle.textContent = `
    @keyframes xpFloat {
        0% { transform: translate(-50%, 0); opacity: 1; }
        100% { transform: translate(-50%, -100px); opacity: 0; }
    }
`;
document.head.appendChild(xpStyle);

// Add Level Functions to ProgressTracker
ProgressTracker.prototype.getCurrentLevel = function() {
    const xp = this.getProgress().totalXP || 0;
    for (let i = XP_CONFIG.LEVELS.length - 1; i >= 0; i--) {
        if (xp >= XP_CONFIG.LEVELS[i].minXP) {
            return XP_CONFIG.LEVELS[i];
        }
    }
    return XP_CONFIG.LEVELS[0];
};

ProgressTracker.prototype.getNextLevel = function() {
    const currentLevel = this.getCurrentLevel();
    if (currentLevel.level < XP_CONFIG.LEVELS.length) {
        return XP_CONFIG.LEVELS[currentLevel.level];
    }
    return null;
};

ProgressTracker.prototype.getXPToNextLevel = function() {
    const nextLevel = this.getNextLevel();
    if (!nextLevel) return 0;
    const xp = this.getProgress().totalXP || 0;
    return nextLevel.minXP - xp;
};

ProgressTracker.prototype.getProgressPercentage = function() {
    const xp = this.getProgress().totalXP || 0;
    return Math.round((xp / XP_CONFIG.MAX_XP) * 100);
};

ProgressTracker.prototype.getLevelProgress = function() {
    const currentLevel = this.getCurrentLevel();
    const nextLevel = this.getNextLevel();
    if (!nextLevel) return 100;
    
    const xp = this.getProgress().totalXP || 0;
    const levelXP = xp - currentLevel.minXP;
    const levelRange = nextLevel.minXP - currentLevel.minXP;
    return Math.round((levelXP / levelRange) * 100);
};

ProgressTracker.prototype.addDebugXP = function(questionId) {
    const progress = this.getProgress();
    if (!progress.debugQuest) {
        progress.debugQuest = { completed: [], xp: 0 };
    }
    
    if (!progress.debugQuest.completed.includes(questionId)) {
        progress.debugQuest.completed.push(questionId);
        progress.debugQuest.xp += XP_CONFIG.DEBUG_XP;
        progress.totalXP += XP_CONFIG.DEBUG_XP;
        this.saveProgress(progress);
        this.showXPGain(XP_CONFIG.DEBUG_XP);
        return true;
    }
    return false;
};

ProgressTracker.prototype.showXPGain = function(xp) {
    const notification = document.createElement('div');
    notification.innerHTML = `<strong>+${xp} XP</strong>`;
    notification.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, 0);
        background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
        color: white;
        padding: 1rem 2rem;
        border-radius: 1rem;
        font-size: 1.5rem;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0,255,136,0.4);
        animation: xpFloat 2s ease-out forwards;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
};
