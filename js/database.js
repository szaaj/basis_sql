// Database initialization and SQL.js integration

class DatabaseManager {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.currentDatabase = null;
    }

    async init() {
        // Load SQL.js
        this.SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        console.log('SQL.js loaded successfully');
    }

    async loadDatabase(databaseName) {
        try {
            console.log(`Starting to load database: ${databaseName}`);
            
            // Detect if we're in root or in a subdirectory
            const path = window.location.pathname;
            const isInSubdir = path.includes('/periode');
            const dataPath = isInSubdir ? `../data/${databaseName}.sql` : `./data/${databaseName}.sql`;
            
            console.log(`Loading from: ${dataPath}`);
            
            // Load SQL file
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error(`Failed to load database file: ${response.status} ${response.statusText} - Path: ${dataPath}`);
            }
            
            const sqlText = await response.text();
            console.log(`SQL file loaded, size: ${sqlText.length} bytes`);
            
            // Create new database
            this.db = new this.SQL.Database();
            console.log('Empty database created');
            
            // Convert MySQL to SQLite
            let convertedSQL = this.convertMySQLToSQLite(sqlText);
            
            // Split into statements
            const statements = this.splitSQLStatements(convertedSQL);
            console.log(`Executing ${statements.length} SQL statements...`);
            
            let successCount = 0;
            let errorCount = 0;
            
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                try {
                    this.db.run(statement);
                    successCount++;
                    if (successCount <= 5) {
                        console.log(`✓ Statement ${i + 1} OK`);
                    }
                } catch (e) {
                    errorCount++;
                    if (errorCount <= 5) {
                        console.warn(`✗ Statement ${i + 1} failed:`, e.message);
                        console.warn('First 200 chars:', statement.substring(0, 200));
                    }
                }
            }
            
            console.log(`Database loaded: ${successCount} statements successful, ${errorCount} skipped`);
            
            // Verify tables exist
            const tables = this.getTableNames();
            console.log('Tables created:', tables);
            
            if (tables.length === 0) {
                throw new Error('No tables were created - database loading failed');
            }
            
            this.currentDatabase = databaseName;
            return true;
        } catch (error) {
            console.error('Error loading database:', error);
            console.error('Error details:', error.message);
            throw error;
        }
    }

    convertMySQLToSQLite(sql) {
        let converted = sql;
        
        // Remove MySQL-specific SET commands
        converted = converted.replace(/SET\s+SQL_MODE\s*=\s*[^;]+;/gi, '');
        converted = converted.replace(/SET\s+AUTOCOMMIT\s*=\s*[^;]+;/gi, '');
        converted = converted.replace(/SET\s+time_zone\s*=\s*[^;]+;/gi, '');
        converted = converted.replace(/START\s+TRANSACTION\s*;/gi, '');
        converted = converted.replace(/COMMIT\s*;/gi, '');
        
        // Remove MySQL comments
        converted = converted.replace(/\/\*!.*?\*\//gs, '');
        converted = converted.replace(/--.*$/gm, '');
        
        // Remove MySQL table options (keep CREATE TABLE and data)
        converted = converted.replace(/\)\s*ENGINE\s*=\s*\w+[^;]*/gi, ')');
        
        // Convert AUTO_INCREMENT to AUTOINCREMENT (SQLite syntax)
        converted = converted.replace(/\s+AUTO_INCREMENT\b/gi, ' AUTOINCREMENT');
        
        // Convert backticks to quotes
        converted = converted.replace(/`/g, '"');
        
        // Remove COLLATE
        converted = converted.replace(/COLLATE\s+\w+/gi, '');
        
        // Convert varchar to TEXT (SQLite doesn't care about length)
        converted = converted.replace(/varchar\(\d+\)/gi, 'TEXT');
        
        // Convert int types to INTEGER
        converted = converted.replace(/int\(\d+\)/gi, 'INTEGER');
        converted = converted.replace(/\bint\b/gi, 'INTEGER');
        
        // Convert decimal to REAL
        converted = converted.replace(/decimal\([^)]+\)/gi, 'REAL');
        
        return converted;
    }

    splitSQLStatements(sql) {
        // Split by semicolon but be smart about it
        const statements = [];
        let current = '';
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < sql.length; i++) {
            const char = sql[i];
            const prevChar = i > 0 ? sql[i - 1] : '';
            
            // Track if we're inside a string
            if ((char === "'" || char === '"') && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }
            
            // Split on semicolon only if not in string
            if (char === ';' && !inString) {
                const statement = current.trim();
                if (statement.length > 0 && 
                    !statement.startsWith('--') && 
                    !statement.startsWith('/*') &&
                    !statement.match(/^SET\s/i)) {
                    statements.push(statement);
                }
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last statement if exists
        if (current.trim().length > 0) {
            statements.push(current.trim());
        }
        
        return statements;
    }

    executeQuery(sql) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            const results = this.db.exec(sql);
            return {
                success: true,
                results: results,
                rowCount: results.length > 0 ? results[0].values.length : 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    getTableNames() {
        if (!this.db) return [];
        
        try {
            const result = this.db.exec(`
                SELECT name FROM sqlite_master 
                WHERE type='table' 
                ORDER BY name;
            `);
            
            if (result.length > 0) {
                return result[0].values.map(row => row[0]);
            }
            return [];
        } catch (error) {
            console.error('Error getting table names:', error);
            return [];
        }
    }

    getTableStructure(tableName) {
        if (!this.db) return null;
        
        try {
            const result = this.db.exec(`PRAGMA table_info(${tableName});`);
            
            if (result.length > 0) {
                return result[0].values.map(row => ({
                    cid: row[0],
                    name: row[1],
                    type: row[2],
                    notnull: row[3],
                    dflt_value: row[4],
                    pk: row[5]
                }));
            }
            return null;
        } catch (error) {
            console.error('Error getting table structure:', error);
            return null;
        }
    }

    getSampleData(tableName, limit = 5) {
        if (!this.db) return null;
        
        try {
            const result = this.db.exec(`SELECT * FROM ${tableName} LIMIT ${limit};`);
            return result;
        } catch (error) {
            console.error('Error getting sample data:', error);
            return null;
        }
    }

    // Helper method to format results for display
    formatResults(results) {
        if (!results || results.length === 0) {
            return {
                columns: [],
                rows: []
            };
        }

        const result = results[0];
        return {
            columns: result.columns || [],
            rows: result.values || []
        };
    }

    // Close database connection
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

// Create global instance
window.dbManager = new DatabaseManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing database manager...');
        await window.dbManager.init();
        console.log('Database manager ready');
        
        // Dispatch event to let other scripts know we're ready
        const event = new Event('dbManagerReady');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Failed to initialize database manager:', error);
        
        // Show error to user
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
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3 style="margin-bottom: 1rem;">⚠️ SQL.js kan niet laden</h3>
            <p style="margin-bottom: 1rem;">De database library kon niet worden geladen.</p>
            <p style="font-size: 0.875rem; opacity: 0.8;">Check je internet connectie en probeer opnieuw.</p>
            <button onclick="location.reload()" style="
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: white;
                color: #ff006e;
                border: none;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
            ">Opnieuw laden</button>
        `;
        document.body.appendChild(errorDiv);
    }
});
