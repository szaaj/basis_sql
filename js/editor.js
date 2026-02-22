// SQL Editor Component

class SQLEditor {
    constructor(editorId, resultsId, exerciseData = null) {
        this.editorElement = document.getElementById(editorId);
        this.resultsElement = document.getElementById(resultsId);
        this.exerciseData = exerciseData;
        this.queryHistory = [];
        
        if (this.editorElement) {
            this.setupEditor();
        }
    }

    setupEditor() {
        // Add keyboard shortcuts
        this.editorElement.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to execute
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.executeQuery();
            }
            
            // Tab to insert spaces instead of changing focus
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.editorElement.selectionStart;
                const end = this.editorElement.selectionEnd;
                const value = this.editorElement.value;
                
                this.editorElement.value = value.substring(0, start) + '    ' + value.substring(end);
                this.editorElement.selectionStart = this.editorElement.selectionEnd = start + 4;
            }
        });

        // Auto-resize textarea
        this.editorElement.addEventListener('input', () => {
            this.autoResize();
        });
    }

    autoResize() {
        this.editorElement.style.height = 'auto';
        this.editorElement.style.height = (this.editorElement.scrollHeight) + 'px';
    }

    async executeQuery() {
        const sql = this.editorElement.value.trim();
        
        if (!sql) {
            this.showError('Voer een SQL query in');
            return;
        }

        // BRUTAL RESET - vervang hele node
        const parent = this.resultsElement.parentNode;
        const newResults = document.createElement('div');
        newResults.className = this.resultsElement.className;
        newResults.id = this.resultsElement.id;
        parent.replaceChild(newResults, this.resultsElement);
        this.resultsElement = newResults;

        // Show loading state
        this.showLoading();

        try {
            // Execute query
            const result = dbManager.executeQuery(sql);
            
            if (result.success) {
                // Display results
                this.displayResults(result.results);
                
                // Add to history
                this.queryHistory.push({
                    sql: sql,
                    timestamp: new Date(),
                    success: true
                });

                // Check if answer is correct (if this is an exercise)
                if (this.exerciseData) {
                    this.checkAnswer(result);
                }
            } else {
                this.showError(result.error);
                this.queryHistory.push({
                    sql: sql,
                    timestamp: new Date(),
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showLoading() {
        this.resultsElement.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Query wordt uitgevoerd...</p>
            </div>
        `;
    }

    displayResults(results) {
        // Clear ALL content first (including any lingering feedback)
        this.resultsElement.innerHTML = '';
        
        if (!results || results.length === 0) {
            // Check if this was a data modification query (INSERT, UPDATE, DELETE)
            const sql = this.editorElement.value.trim().toUpperCase();
            const isModification = sql.startsWith('INSERT') || 
                                   sql.startsWith('UPDATE') || 
                                   sql.startsWith('DELETE');
            
            if (isModification) {
                this.resultsElement.innerHTML = `
                    <div class="results-empty">
                        <p>✅ Query succesvol uitgevoerd</p>
                        <p class="hint-text">Data is gewijzigd in de database</p>
                    </div>
                `;
            } else {
                // This was a SELECT that returned nothing
                this.resultsElement.innerHTML = `
                    <div class="results-empty">
                        <p>⚠️ Query succesvol - maar 0 rijen gevonden</p>
                        <p class="hint-text">Check je WHERE voorwaarde, misschien is die te streng?</p>
                    </div>
                `;
            }
            return;
        }

        const formatted = dbManager.formatResults(results);
        
        if (formatted.rows.length === 0) {
            // SELECT that returned 0 rows
            this.resultsElement.innerHTML = `
                <div class="results-empty">
                    <p>⚠️ Query succesvol - maar 0 rijen gevonden</p>
                    <p class="hint-text">Check je WHERE voorwaarde, misschien is die te streng?</p>
                </div>
            `;
            return;
        }

        // Create table HTML
        let html = '<div class="results-success">';
        html += `<div class="results-header">`;
        html += `<span class="results-count">📊 ${formatted.rows.length} rij${formatted.rows.length !== 1 ? 'en' : ''} gevonden</span>`;
        html += `</div>`;
        html += '<div class="results-table-container">';
        html += '<table class="results-table">';
        
        // Header
        html += '<thead><tr>';
        formatted.columns.forEach(col => {
            html += `<th>${this.escapeHtml(col)}</th>`;
        });
        html += '</tr></thead>';
        
        // Body
        html += '<tbody>';
        formatted.rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                const value = cell === null ? '<span class="null-value">NULL</span>' : this.escapeHtml(String(cell));
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';
        
        html += '</table>';
        html += '</div>';
        html += '</div>';
        
        this.resultsElement.innerHTML = html;
    }

    showError(errorMessage) {
        // Clear ALL content first
        this.resultsElement.innerHTML = '';
        
        this.resultsElement.innerHTML += `
            <div class="results-error">
                <div class="error-icon">⚠️</div>
                <div class="error-content">
                    <h4>SQL Error</h4>
                    <p>${this.escapeHtml(errorMessage)}</p>
                    <div class="error-hints">
                        <p><strong>Tips:</strong></p>
                        <ul>
                            <li>Check je spelling (tabelnamen en kolomnamen)</li>
                            <li>Vergeet geen puntkomma aan het einde</li>
                            <li>Gebruik enkele quotes ' voor tekstwaarden</li>
                            <li>Kijk naar de syntax in de cheat sheet</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    checkAnswer(result) {
        if (!this.exerciseData) return;

        const { checkType, expectedRows, expectedColumns, expectedValues } = this.exerciseData;
        let isCorrect = false;
        let feedback = '';

        switch (checkType) {
            case 'rowCount':
                isCorrect = result.results[0]?.values.length === expectedRows;
                feedback = isCorrect 
                    ? '✅ Correct aantal rijen!' 
                    : `❌ Je hebt ${result.results[0]?.values.length || 0} rijen, maar er moeten ${expectedRows} zijn.`;
                break;
                
            case 'columnCount':
                isCorrect = result.results[0]?.columns.length === expectedColumns;
                feedback = isCorrect
                    ? '✅ Correct aantal kolommen!'
                    : `❌ Je hebt ${result.results[0]?.columns.length || 0} kolommen geselecteerd, maar er moeten ${expectedColumns} zijn.`;
                break;
                
            case 'tableContent':
                // Just check if query returned something
                isCorrect = result.results.length > 0 && result.results[0].values.length > 0;
                feedback = isCorrect 
                    ? '✅ Query succesvol uitgevoerd!' 
                    : '❌ Je query geeft geen resultaten terug.';
                break;
                
            case 'custom':
                // Custom validation function - pass both result and query
                if (typeof this.exerciseData.validator === 'function') {
                    const validation = this.exerciseData.validator(result, this.editorElement.value);
                    isCorrect = validation.correct;
                    feedback = validation.feedback;
                }
                break;
                
            default:
                // Generic check - just see if it executed without error
                isCorrect = result.success;
                feedback = '✅ Query uitgevoerd!';
        }

        // Show feedback
        this.showFeedback(isCorrect, feedback);

        // Mark exercise as complete if correct
        if (isCorrect && this.exerciseData.exerciseId) {
            const periode = this.exerciseData.periode;
            const lesson = this.exerciseData.lesson;
            const exerciseId = this.exerciseData.exerciseId;
            
            const wasNew = progressTracker.markExerciseComplete(periode, lesson, exerciseId);
            
            if (wasNew) {
                progressTracker.showNotification(`🎉 Oefening ${exerciseId} voltooid! +10 XP`);
            }
        }
    }

    showFeedback(isCorrect, message) {
        // Find or create a feedback container OUTSIDE results
        const exerciseDiv = this.resultsElement.parentElement;
        let feedbackContainer = exerciseDiv.querySelector('.feedback-container-fixed');
        
        if (!feedbackContainer) {
            feedbackContainer = document.createElement('div');
            feedbackContainer.className = 'feedback-container-fixed';
            feedbackContainer.style.cssText = 'margin: 1rem 0;';
            // Insert BEFORE results, not inside
            exerciseDiv.insertBefore(feedbackContainer, this.resultsElement);
        }
        
        // Clear old feedback
        feedbackContainer.innerHTML = '';
        
        // Create feedback element
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
        feedbackDiv.style.cssText = `
            padding: 1rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            background: ${isCorrect ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,110,0.1)'};
            border: 2px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-pink)'};
            color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-pink)'};
        `;
        feedbackDiv.innerHTML = `
            <div style="font-size: 1.5rem;">${isCorrect ? '✅' : '❌'}</div>
            <div>${message}</div>
        `;
        
        // Add to feedback container (NOT results)
        feedbackContainer.appendChild(feedbackDiv);
        
        // Keep feedback visible - don't auto-remove
        // Users can see it until next query
    }

    clearFeedback() {
        // Clear feedback container if it exists
        const exerciseDiv = this.resultsElement.parentElement;
        const feedbackContainer = exerciseDiv.querySelector('.feedback-container-fixed');
        if (feedbackContainer) {
            feedbackContainer.innerHTML = '';
        }
    }

    clearEditor() {
        this.editorElement.value = '';
        this.resultsElement.innerHTML = '';
    }

    setQuery(sql) {
        this.editorElement.value = sql;
        this.autoResize();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Helper function to create editors for exercises
function createExerciseEditor(exerciseNumber, exerciseData) {
    return new SQLEditor(
        `sql-input-${exerciseNumber}`,
        `results-${exerciseNumber}`,
        exerciseData
    );
}

// Export for use in other files
window.SQLEditor = SQLEditor;
window.createExerciseEditor = createExerciseEditor;
