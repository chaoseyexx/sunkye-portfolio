const fs = require('fs');

let cPage = fs.readFileSync('src/components/client-page.tsx', 'utf8');

cPage = cPage.replace(/<img\s+src="https:\/\/placehold\.co[^>]+>/g, (match) => {
    return match.replace(/\s+fill\b/g, '')
                .replace(/\s+priority\b/g, '');
});

fs.writeFileSync('src/components/client-page.tsx', cPage);
console.log('Fixes applied!');
