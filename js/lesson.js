// Lesson page JavaScript

// Make editors globally accessible
window.editors = {};

// Wait for both DOM and database manager to be ready
let dbReady = false;
let domReady = false;

// Listen for database manager ready
document.addEventListener('dbManagerReady', () => {
    console.log('Database manager is ready');
    dbReady = true;
    tryInitialize();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is ready');
    domReady = true;
    tryInitialize();
});

async function tryInitialize() {
    // Only initialize when both are ready
    if (!dbReady || !domReady) {
        console.log('Waiting... dbReady:', dbReady, 'domReady:', domReady);
        return;
    }
    
    if (typeof lessonConfig === 'undefined') {
        console.error('lessonConfig not defined!');
        return;
    }

    console.log('Starting lesson initialization...');

    // Load database
    await loadLessonDatabase();
    
    // Initialize editors
    initializeEditors();
    
    // Update progress display
    updateLessonProgress();
    
    console.log('Lesson initialized successfully!');
    console.log('Editors available:', window.editors);
}

async function loadLessonDatabase() {
    try {
        // Show loading message
        console.log(`Loading ${lessonConfig.database} database...`);
        showDatabaseStatus('⏳ Database laden...', false, 0);
        
        await dbManager.loadDatabase(lessonConfig.database);
        console.log('Database loaded successfully!');
        
        // Verify database is working
        const tables = dbManager.getTableNames();
        console.log('Available tables:', tables);
        
        if (tables.length === 0) {
            throw new Error('Database loaded but no tables found');
        }
        
        // Show success message
        showDatabaseStatus('✅ Database geladen - ' + tables.length + ' tabellen beschikbaar', false, 3000);
    } catch (error) {
        console.error('Failed to load database:', error);
        showDatabaseStatus('⚠️ Database laden mislukt: ' + error.message, true, 0);
        
        // Show detailed error to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 110, 0.95);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        errorDiv.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Database Laad Fout</h3>
            <p style="margin-bottom: 1rem;">${error.message}</p>
            <p style="font-size: 0.875rem; opacity: 0.8;">Check de browser console (F12) voor meer details.</p>
            <button onclick="location.reload()" style="
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: white;
                color: #ff006e;
                border: none;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
            ">Opnieuw proberen</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

function showDatabaseStatus(message, isError = false, duration = 2000) {
    const statusDiv = document.createElement('div');
    statusDiv.className = 'database-status-message';
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        background: ${isError ? 'rgba(255, 0, 110, 0.9)' : 'rgba(0, 255, 136, 0.9)'};
        color: ${isError ? '#fff' : '#0a0e27'};
        border-radius: 0.75rem;
        font-weight: 600;
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    
    if (duration > 0) {
        setTimeout(() => {
            statusDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => statusDiv.remove(), 300);
        }, duration);
    }
}

function initializeEditors() {
    console.log('Initializing editors...');
    
    // Initialize an editor for each exercise
    for (let i = 1; i <= lessonConfig.totalExercises; i++) {
        const exerciseData = lessonConfig.exercises[i];
        
        console.log(`Creating editor ${i}...`);
        
        window.editors[i] = new SQLEditor(
            `sql-input-${i}`,
            `results-${i}`,
            {
                ...exerciseData,
                periode: lessonConfig.periode,
                lesson: lessonConfig.lesson,
                exerciseId: i
            }
        );
        
        // Add event listeners to buttons
        setupExerciseButtons(i);
    }
    
    console.log('All editors initialized:', window.editors);
}

function setupExerciseButtons(exerciseNum) {
    console.log(`Setting up buttons for exercise ${exerciseNum}...`);
    
    // Find all buttons in this exercise
    const exercise = document.getElementById(`exercise-${exerciseNum}`);
    if (!exercise) {
        console.error(`Exercise ${exerciseNum} not found!`);
        return;
    }
    
    // Execute button
    const executeBtn = exercise.querySelector('.btn-execute');
    if (executeBtn) {
        console.log(`Found execute button for exercise ${exerciseNum}`);
        executeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Execute clicked for exercise ${exerciseNum}`);
            if (window.editors[exerciseNum]) {
                window.editors[exerciseNum].executeQuery();
            } else {
                console.error(`Editor ${exerciseNum} not found!`);
            }
        });
    } else {
        console.error(`Execute button not found for exercise ${exerciseNum}`);
    }
    
    // Clear button
    const clearBtn = exercise.querySelector('.btn-clear');
    if (clearBtn) {
        console.log(`Found clear button for exercise ${exerciseNum}`);
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Clear clicked for exercise ${exerciseNum}`);
            if (window.editors[exerciseNum]) {
                window.editors[exerciseNum].clearEditor();
            }
        });
    }
    
    // Copy button in solution
    const copyBtn = exercise.querySelector('.btn-copy');
    if (copyBtn) {
        console.log(`Found copy button for exercise ${exerciseNum}`);
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Copy clicked for exercise ${exerciseNum}`);
            const solution = copyBtn.previousElementSibling;
            if (solution && solution.tagName === 'PRE') {
                const code = solution.querySelector('code');
                if (code && window.editors[exerciseNum]) {
                    window.editors[exerciseNum].setQuery(code.textContent);
                }
            }
        });
    }
}

function updateLessonProgress() {
    const progress = progressTracker.getProgress();
    const periodeKey = `periode${lessonConfig.periode}`;
    const lessonKey = `les${lessonConfig.lesson}`;
    const lessonData = progress[periodeKey].lessons[lessonKey];
    
    const completed = lessonData.exercises.length;
    const total = lessonConfig.totalExercises;
    const percentage = Math.round((completed / total) * 100);
    
    // Update progress display
    const progressText = document.getElementById('lessonProgress');
    const progressFill = document.getElementById('progressFill');
    
    if (progressText) {
        progressText.textContent = `${completed}/${total} oefeningen`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    // Mark completed exercises
    lessonData.exercises.forEach(exerciseId => {
        const exerciseElement = document.getElementById(`exercise-${exerciseId}`);
        if (exerciseElement) {
            exerciseElement.classList.add('completed-exercise');
            
            // Add checkmark
            const header = exerciseElement.querySelector('.exercise-header');
            if (header && !header.querySelector('.completed-badge')) {
                const badge = document.createElement('span');
                badge.className = 'completed-badge';
                badge.innerHTML = '✅ Voltooid';
                badge.style.cssText = `
                    padding: 0.4rem 0.75rem;
                    background: linear-gradient(135deg, #00ff88, #00f0ff);
                    color: #0a0e27;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                `;
                header.appendChild(badge);
            }
        }
    });
}

// Add CSS for completed exercises
const lessonStyle = document.createElement('style');
lessonStyle.textContent = `
    .completed-exercise {
        border-color: var(--accent-green);
        opacity: 0.8;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(lessonStyle);

// Listen for exercise completions to update progress
window.addEventListener('storage', (e) => {
    if (e.key === progressTracker.storageKey) {
        updateLessonProgress();
    }
});

// Update progress when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateLessonProgress();
    }
});
