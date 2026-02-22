let userAnswers = {};
let currentFilter = { les: 'all', type: 'all' };

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderQuestions();
});

function renderQuestions() {
    const container = document.getElementById('debugChallenges');
    const filtered = filterQuestions();
    
    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">Geen oefeningen gevonden met deze filters.</div>';
        return;
    }
    
    container.innerHTML = filtered.map(q => `
        <div class="exercise" id="debug-${q.id}">
            <div class="exercise-header">
                <h3>Oefening ${q.id} - ${q.title}</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="difficulty ${q.difficulty}">${getDifficultyText(q.difficulty)}</span>
                    <span class="difficulty" style="background: ${getTypeColor(q.type)};">${getTypeText(q.type)}</span>
                </div>
            </div>
            
            <div style="background: rgba(255,0,110,0.1); border: 2px solid var(--accent-pink); padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0;">
                <h4 style="color: var(--accent-pink); margin-bottom: 0.75rem;">❌ Foute Query:</h4>
                <pre style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 0.5rem; margin: 0;"><code style="color: var(--accent-pink); font-family: 'Courier New', monospace;">${escapeHtml(q.wrongQuery)}</code></pre>
            </div>
            
            <p class="exercise-question"><strong>${q.question}</strong></p>
            
            <div class="debug-options" style="margin: 1.5rem 0;">
                ${q.options.map((opt, i) => `
                    <label class="debug-option" style="display: block; padding: 1rem; margin: 0.5rem 0; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="q${q.id}" value="${i}" onchange="checkAnswer(${q.id}, ${i})" style="margin-right: 0.75rem;">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
            
            <div id="result-${q.id}" class="debug-result" style="display: none;"></div>
        </div>
    `).join('');
}

function checkAnswer(questionId, selectedAnswer) {
    const question = debugQuestions.find(q => q.id === questionId);
    const resultDiv = document.getElementById(`result-${questionId}`);
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Check if this is first time correct
    const wasAlreadyCorrect = userAnswers[questionId] && userAnswers[questionId].correct;
    
    userAnswers[questionId] = { selected: selectedAnswer, correct: isCorrect };
    saveProgress();
    
    // Award XP if correct and first time
    if (isCorrect && !wasAlreadyCorrect && typeof progressTracker !== 'undefined') {
        progressTracker.addDebugXP(questionId);
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="padding: 1.5rem; border-radius: 0.75rem; ${isCorrect ? 'background: rgba(0,255,136,0.1); border: 2px solid var(--accent-green);' : 'background: rgba(255,0,110,0.1); border: 2px solid var(--accent-pink);'}">
            <h4 style="color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-pink)'}; margin-bottom: 0.75rem;">
                ${isCorrect ? '✅ Correct!' + (!wasAlreadyCorrect ? ' +5 XP' : '') : '❌ Helaas, niet helemaal'}
            </h4>
            <p style="margin-bottom: 1rem;">${question.explanation}</p>
            <div style="background: rgba(0,255,136,0.1); padding: 1rem; border-radius: 0.5rem;">
                <strong style="color: var(--accent-green);">✅ Correcte Query:</strong>
                <pre style="margin: 0.5rem 0 0 0; background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 0.25rem;"><code style="color: var(--accent-green); font-family: 'Courier New', monospace; font-size: 0.875rem;">${escapeHtml(question.correctQuery)}</code></pre>
            </div>
        </div>
    `;
    
    updateScore();
}

function filterQuestions() {
    return debugQuestions.filter(q => {
        const lesMatch = currentFilter.les === 'all' || q.les === currentFilter.les;
        const typeMatch = currentFilter.type === 'all' || q.type === currentFilter.type;
        return lesMatch && typeMatch;
    });
}

function applyFilters() {
    currentFilter.les = document.getElementById('lesFilter').value;
    currentFilter.type = document.getElementById('typeFilter').value;
    renderQuestions();
}

function shuffleQuestions() {
    debugQuestions.sort(() => Math.random() - 0.5);
    renderQuestions();
}

function updateScore() {
    const total = debugQuestions.length;
    const correct = Object.values(userAnswers).filter(a => a.correct).length;
    const percentage = Math.round((correct / total) * 100);
    
    document.getElementById('debugScore').textContent = `${correct}/${total} correct`;
    document.getElementById('debugProgressFill').style.width = `${percentage}%`;
}

function saveProgress() {
    localStorage.setItem('debugQuestProgress', JSON.stringify(userAnswers));
}

function loadProgress() {
    const saved = localStorage.getItem('debugQuestProgress');
    if (saved) {
        userAnswers = JSON.parse(saved);
        updateScore();
    }
}

function resetProgress() {
    if (confirm('Weet je zeker dat je je score wilt resetten?')) {
        userAnswers = {};
        localStorage.removeItem('debugQuestProgress');
        updateScore();
        renderQuestions();
    }
}

function getDifficultyText(diff) {
    return { easy: 'Makkelijk', medium: 'Gemiddeld', hard: 'Moeilijk' }[diff];
}

function getTypeText(type) {
    return { syntax: 'Syntax', logic: 'Logica', danger: 'Gevaar!' }[type];
}

function getTypeColor(type) {
    return {
        syntax: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
        logic: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
        danger: 'linear-gradient(135deg, #ff0000, var(--accent-pink))'
    }[type];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
