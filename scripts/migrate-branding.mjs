import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..'); // Assuming scripts/ is one level deep

const MOVES = [
    { from: 'src/agents/pi-embedded-helpers.ts', to: 'src/agents/brainyx-embedded-helpers.ts' },
    // Add other file moves if needed, e.g. pi-embedded.ts
    { from: 'src/agents/pi-embedded.ts', to: 'src/agents/brainyx-embedded.ts' },
    { from: 'src/agents/pi-embedded-messaging.ts', to: 'src/agents/brainyx-embedded-messaging.ts' },
    { from: 'src/agents/pi-embedded-subscribe.ts', to: 'src/agents/brainyx-embedded-subscribe.ts' },
    { from: 'src/agents/pi-embedded-utils.ts', to: 'src/agents/brainyx-embedded-utils.ts' },
];

const REPLACEMENTS = [
    { from: /pi-embedded-helpers\.js/g, to: 'brainyx-embedded-helpers.js' },
    { from: /pi-embedded\.js/g, to: 'brainyx-embedded.js' },
    { from: /pi-embedded-messaging\.js/g, to: 'brainyx-embedded-messaging.js' },
    { from: /pi-embedded-subscribe\.js/g, to: 'brainyx-embedded-subscribe.js' },
    { from: /pi-embedded-utils\.js/g, to: 'brainyx-embedded-utils.js' },
    { from: /pi-settings\.js/g, to: 'brainyx-settings.js' },
    { from: /pi-tool-definition-adapter\.js/g, to: 'brainyx-tool-definition-adapter.js' },
    { from: /pi-tools\.js/g, to: 'brainyx-coding-tools.js' },
    { from: /pi-tools\.policy\.js/g, to: 'brainyx-tools.policy.js' },
    { from: /pi-tools\.read\.js/g, to: 'brainyx-tools.read.js' },
    { from: /pi-tools\.schema\.js/g, to: 'brainyx-tools.schema.js' },
    { from: /pi-tools\.types\.js/g, to: 'brainyx-tools.types.js' },
    { from: /pi-tools\.abort\.js/g, to: 'brainyx-tools.abort.js' },
];

function walk(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                if (!file.includes('node_modules') && !file.includes('.git')) {
                    results = results.concat(walk(file));
                }
            } else {
                if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                    results.push(file);
                }
            }
        });
    } catch (e) {
        console.error(`Error walking ${dir}:`, e.message);
    }
    return results;
}

// 1. Rename files
MOVES.forEach(({ from, to }) => {
    const src = path.resolve(rootDir, from);
    const dest = path.resolve(rootDir, to);
    if (fs.existsSync(src)) {
        try {
            fs.renameSync(src, dest);
            console.log(`Renamed ${from} -> ${to}`);
        } catch (e) {
            console.error(`Failed to rename ${src}: ${e.message}`);
        }
    } else {
        console.log(`Skipping rename (src not found): ${from}`);
    }
});

// 2. Update imports
const allFiles = walk(path.resolve(rootDir, 'src'));
console.log(`Scanning ${allFiles.length} files for import updates...`);

allFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        REPLACEMENTS.forEach(({ from, to }) => {
            content = content.replace(from, to);
        });

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated imports in ${path.relative(rootDir, file)}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

console.log('Migration complete.');
