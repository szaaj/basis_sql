# SQL Quest - Test Instructies

## Lokaal Testen (zonder server)

### Stap 1: Extract het bestand
```bash
tar -xzf sql-quest-FINAL.tar.gz
cd sql-quest
```

### Stap 2: Open in Browser
Open `index.html` in je browser:
- Windows: Dubbelklik op `index.html`
- Mac: Dubbelklik op `index.html`
- Linux: `xdg-open index.html`

OF via command line:
```bash
# Chrome
google-chrome index.html

# Firefox
firefox index.html

# Safari (Mac)
open index.html
```

## Functies Testen

### ✅ Homepage
- [ ] XP badge toont 0
- [ ] Periode cards zijn klikbaar
- [ ] Progress bars zijn op 0%
- [ ] Keyboard shortcuts werken (1, 2, s, c)

### ✅ Periode 1 Overview
- [ ] 7 lessen worden getoond
- [ ] Status icons zijn zichtbaar
- [ ] Cards zijn klikbaar
- [ ] Stats in header tonen 0/7

### ✅ Les 1
- [ ] Database laadt (zie console: F12)
- [ ] Tekstarea is typbaar
- [ ] "Uitvoeren" knop werkt
- [ ] "Wissen" knop werkt
- [ ] Ctrl+Enter voert query uit
- [ ] Results worden getoond in tabel
- [ ] Foute query toont error message
- [ ] Hints en Oplossingen zijn klapbaar
- [ ] "Query kopiëren" knop werkt
- [ ] Progress bar update na correcte query
- [ ] XP notification verschijnt

## Troubleshooting

### Database laadt niet
**Probleem:** Console toont "Failed to load database"

**Oplossingen:**
1. Check of `data/reizen.sql` bestaat
2. Open browser console (F12) voor details
3. Probeer een andere browser (Chrome werkt best)

### CORS Errors
**Probleem:** Console toont "CORS policy" errors

**Oplossing:**
Start een lokale server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (als je http-server hebt)
npx http-server

# PHP
php -S localhost:8000
```

Dan open: `http://localhost:8000`

### SQL.js laadt niet
**Probleem:** "initSqlJs is not defined"

**Oplossing:**
Check internet connectie - SQL.js wordt geladen van CDN:
`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js`

### Buttons werken niet
**Probleem:** Uitvoeren/Wissen buttons doen niets

**Check:**
1. Open console (F12)
2. Typ: `editors`
3. Zou object met editors moeten zijn
4. Typ: `editors[1].executeQuery()`
5. Zou query moeten uitvoeren

Als dit werkt maar buttons niet:
- Refresh de pagina (Ctrl+F5)
- Clear cache en refresh

## Browser Compatibiliteit

### ✅ Goed Getest
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### ⚠️ Mogelijk Problemen
- Internet Explorer (NIET ONDERSTEUND)
- Oude browsers zonder ES6 support

## Development Tips

### Live Reload Setup
```bash
# Install live-server (eenmalig)
npm install -g live-server

# Start met live reload
cd sql-quest
live-server
```

Nu opent browser automatisch en refresht bij wijzigingen!

### Browser Console Shortcuts
- **F12** - Open Developer Tools
- **Ctrl+Shift+C** - Inspect Element
- **Ctrl+Shift+I** - Open Console
- **Ctrl+Shift+J** - Open Console (Chrome)

### Useful Console Commands
```javascript
// Check progress
progressTracker.getProgress()

// Check total stats
progressTracker.getTotalStats()

// Reset progress
progressTracker.resetProgress()

// Check database
dbManager.getTableNames()

// Run query manually
dbManager.executeQuery('SELECT * FROM klant LIMIT 5')
```

## Performance Check

### Database Loading
Normaal: 1-3 seconden
Te lang (>10 sec): Check internet connectie

### Query Execution
Normaal: <100ms voor simple queries
Te lang (>1 sec): Check query complexity

## Known Issues

### 1. Database Reset
**Issue:** Database blijft in oude state na refresh
**Fix:** Huidige implementatie laadt elke keer opnieuw (goed!)

### 2. Progress Lost
**Issue:** Progress verloren na cache clear
**Fix:** Verwacht gedrag - data zit in localStorage

### 3. Mobile Layout
**Issue:** Layout niet optimaal op kleine schermen
**Fix:** Responsive CSS is aanwezig, maar kan verbeterd

## Success Criteria

Website werkt correct als:
1. ✅ Homepage laadt zonder errors
2. ✅ Database laadt binnen 5 seconden
3. ✅ Queries worden uitgevoerd
4. ✅ Results worden getoond
5. ✅ Progress wordt opgeslagen
6. ✅ XP notifications verschijnen
7. ✅ Alle buttons werken
8. ✅ Keyboard shortcuts werken

## Support

Bij problemen:
1. Check browser console (F12)
2. Check dit document
3. Test in andere browser
4. Check internet connectie (voor CDN resources)
