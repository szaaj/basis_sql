// Database Inspector Component for Lesson Pages
class DatabaseInspector {
    constructor(databaseName) {
        this.databaseName = databaseName;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create floating button
        this.createButton();
        // Create inspector panel
        this.createPanel();
        // Load database schema
        this.loadSchema();
    }

    createButton() {
        const btn = document.createElement('button');
        btn.className = 'db-inspector-btn';
        btn.innerHTML = '📚';
        btn.title = 'Database Schema';
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
        this.button = btn;
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'db-inspector-panel';
        panel.innerHTML = `
            <div class="db-inspector-header">
                <h3>📚 Database Schema</h3>
                <button class="db-inspector-close" onclick="dbInspector.close()">×</button>
            </div>
            <div id="db-schema-content">
                <p style="color: var(--text-secondary);">Schema wordt geladen...</p>
            </div>
        `;
        document.body.appendChild(panel);
        this.panel = panel;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.panel.classList.add('open');
        this.isOpen = true;
    }

    close() {
        this.panel.classList.remove('open');
        this.isOpen = false;
    }

    async loadSchema() {
        try {
            const dbManager = window.dbManager;
            if (!dbManager || !dbManager.db) {
                console.log('[DB Inspector] Database not ready yet, waiting...');
                setTimeout(() => this.loadSchema(), 500);
                return;
            }

            const db = dbManager.db;
            console.log('[DB Inspector] Loading schema for:', this.databaseName);

            // Get all tables
            const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
            
            if (!tables || tables.length === 0) {
                document.getElementById('db-schema-content').innerHTML = 
                    '<p style="color: var(--text-secondary);">Geen tabellen gevonden.</p>';
                return;
            }

            const tableNames = tables[0].values.map(row => row[0]);
            console.log('[DB Inspector] Found tables:', tableNames);

            let html = '';
            
            for (const tableName of tableNames) {
                // Get columns
                const columns = db.exec(`PRAGMA table_info(${tableName});`);
                
                html += `
                    <div class="db-table-card">
                        <div class="db-table-name">
                            📦 ${tableName}
                        </div>
                `;
                
                if (columns && columns.length > 0) {
                    columns[0].values.forEach(col => {
                        const colName = col[1];
                        const colType = col[2];
                        html += `
                            <div class="db-column">
                                <span class="db-column-name">${colName}</span>
                                <span style="color: var(--text-secondary); opacity: 0.6;"> (${colType})</span>
                            </div>
                        `;
                    });
                }
                
                // Add sample data toggle
                html += `
                    <div class="db-sample-data">
                        <button class="db-sample-toggle" data-table="${tableName}">
                            ▼ Toon sample data (3 rijen)
                        </button>
                        <div id="sample-${tableName}" style="display: none;"></div>
                    </div>
                `;
                
                html += `</div>`;
            }

            document.getElementById('db-schema-content').innerHTML = html;
            
            // Add event listeners to sample data buttons
            document.querySelectorAll('.db-sample-toggle').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tableName = e.target.dataset.table;
                    this.toggleSample(tableName, e.target);
                });
            });
            
            console.log('[DB Inspector] Schema loaded successfully');

        } catch (error) {
            console.error('[DB Inspector] Error loading schema:', error);
            document.getElementById('db-schema-content').innerHTML = 
                `<p style="color: var(--accent-pink);">❌ Fout bij laden schema</p>`;
        }
    }

    toggleSample(tableName, button) {
        const sampleDiv = document.getElementById(`sample-${tableName}`);
        
        if (sampleDiv.style.display === 'none') {
            // Load and show sample data
            this.loadSampleData(tableName, sampleDiv);
            button.innerHTML = '▲ Verberg sample data';
            sampleDiv.style.display = 'block';
        } else {
            // Hide sample data
            button.innerHTML = '▼ Toon sample data (3 rijen)';
            sampleDiv.style.display = 'none';
        }
    }

    loadSampleData(tableName, container) {
        try {
            const dbManager = window.dbManager;
            if (!dbManager || !dbManager.db) {
                container.innerHTML = '<p style="color: var(--accent-pink); font-size: 0.75rem;">❌ Database niet geladen</p>';
                return;
            }
            
            const db = dbManager.db;
            const result = db.exec(`SELECT * FROM ${tableName} LIMIT 3;`);
            
            if (!result || result.length === 0) {
                container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.75rem;">Geen data</p>';
                return;
            }

            const columns = result[0].columns;
            const values = result[0].values;

            let html = '<table class="db-sample-table"><thead><tr>';
            columns.forEach(col => {
                html += `<th>${col}</th>`;
            });
            html += '</tr></thead><tbody>';

            values.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
                    const displayValue = cell === null ? '<i>NULL</i>' : String(cell);
                    html += `<td>${displayValue}</td>`;
                });
                html += '</tr>';
            });

            html += '</tbody></table>';
            container.innerHTML = html;

        } catch (error) {
            console.error('[DB Inspector] Error loading sample data:', error);
            container.innerHTML = '<p style="color: var(--accent-pink); font-size: 0.75rem;">❌ Fout</p>';
        }
    }
}

// Initialize on page load (will be created by lesson page)
let dbInspector = null;
