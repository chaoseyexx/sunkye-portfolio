const fs = require('fs');

let cPage = fs.readFileSync('src/components/client-page.tsx', 'utf8');

// Remove animate-pulse-slow to fix massive GPU lag
cPage = cPage.replace(/ animate-pulse-slow/g, '');

// Also let's check globals.css to see if there's any crazy heavy animation or if we should just remove the bg-grid-pattern if it's lagging.
// The main issue is usually the pulse on massive blurs.

fs.writeFileSync('src/components/client-page.tsx', cPage);
console.log('Performance fixes applied to client-page.tsx');
