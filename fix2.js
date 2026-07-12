const fs = require('fs');

let cPage = fs.readFileSync('src/components/client-page.tsx', 'utf8');

cPage = cPage.replace(/<img([\s\S]*?)fill/g, function(match, p1) {
    if (match.includes('https://placehold.co')) {
        return '<img' + p1 + ' className="w-full h-full object-cover"';
    }
    return match;
});

cPage = cPage.replace(/<img([\s\S]*?)priority/g, function(match, p1) {
    if (match.includes('https://placehold.co')) {
        return '<img' + p1;
    }
    return match;
});

cPage = cPage.replace(/<img([\s\S]*?)fill([\s\S]*?)\/>/g, function(match, p1, p2) {
    if (match.includes('https://placehold.co')) {
         return '<img' + p1 + ' className="w-full h-full object-cover"' + p2 + '/>';
    }
    return match;
});

// A cleaner approach: just remove `fill` and `priority` from the placeholder image lines.
fs.writeFileSync('src/components/client-page.tsx', cPage);
console.log('Fixes applied!');
