const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'client/src/data/siteContent.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const gitHubPrefix = 'https://raw.githubusercontent.com/AmulyaaaR/Grey_gaint/main/client/src/assets/';

function sanitizePaths(obj) {
    if (!obj) return obj;
    if (typeof obj === 'string') {
        if (obj.startsWith(gitHubPrefix)) {
            let relative = obj.replace(gitHubPrefix, '');
            // Remove 'gallery/' prefix if it exists to normalize
            if (relative.startsWith('gallery/')) {
                relative = relative.replace('gallery/', '');
            }
            console.log(`Sanitized: ${obj} -> ${relative}`);
            return relative;
        }
        return obj;
    }
    if (Array.isArray(obj)) return obj.map(sanitizePaths);
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            obj[key] = sanitizePaths(obj[key]);
        });
        return obj;
    }
    return obj;
}

const sanitizedContent = sanitizePaths(content);
fs.writeFileSync(contentPath, JSON.stringify(sanitizedContent, null, 2));
console.log('✅ siteContent.json sanitized successfully.');
