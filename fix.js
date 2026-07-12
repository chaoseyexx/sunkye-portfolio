const fs = require('fs');

// Fix button.tsx
let btn = fs.readFileSync('src/components/ui/button.tsx', 'utf8');
btn = btn.replace(/from-rose-600 to-red-600/g, 'from-purple-600 to-purple-800')
         .replace(/from-rose-500 hover:to-red-500/g, 'from-purple-500 hover:to-purple-700')
         .replace(/shadow-rose-900\/20/g, 'shadow-purple-900/20')
         .replace(/shadow-rose-900\/30/g, 'shadow-purple-900/30');
fs.writeFileSync('src/components/ui/button.tsx', btn);

// Fix client-page.tsx
let cPage = fs.readFileSync('src/components/client-page.tsx', 'utf8');

// Replace Red/Rose colors
cPage = cPage.replace(/from-rose-600/g, 'from-purple-600')
             .replace(/to-red-600/g, 'to-purple-800')
             .replace(/from-rose-500/g, 'from-purple-500');

// Replace Image with img for placeholders
cPage = cPage.replace(/<Image\s+src="https:\/\/placehold\.co\/960x540\/0a0a0a\/8b5cf6\?text=Sunkye\+Builds"/g, '<img src="https://placehold.co/960x540/0a0a0a/8b5cf6?text=Sunkye+Builds"');
cPage = cPage.replace(/<Image\s+src="https:\/\/placehold\.co\/800x600\/0a0a0a\/8b5cf6\?text=Featured\+Build"/g, '<img src="https://placehold.co/800x600/0a0a0a/8b5cf6?text=Featured+Build"');
cPage = cPage.replace(/<Image\s+src="https:\/\/placehold\.co\/140x40\/0a0a0a\/8b5cf6\?text=Sunkye"/g, '<img src="https://placehold.co/140x40/0a0a0a/8b5cf6?text=Sunkye"');
cPage = cPage.replace(/<Image\s+src="https:\/\/placehold\.co\/400x400\/0a0a0a\/8b5cf6\?text=Sunkye"/g, '<img src="https://placehold.co/400x400/0a0a0a/8b5cf6?text=Sunkye"');

// Delete Groups section (lines between {/* Groups I've Worked With Section */} and {/* Contact Section */})
const startIdx = cPage.indexOf("{/* Groups I've Worked With Section */}");
const endIdx = cPage.indexOf("{/* Contact Section */}");
if (startIdx !== -1 && endIdx !== -1) {
    cPage = cPage.substring(0, startIdx) + cPage.substring(endIdx);
}

fs.writeFileSync('src/components/client-page.tsx', cPage);
console.log('Fixes applied!');
