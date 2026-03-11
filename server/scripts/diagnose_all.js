const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Check for unhandled async errors in controllers (express specific)
    if (filePath.includes('controllers') && code.includes('async (req, res)') && !code.includes('try {') && !code.includes('catch (error)')) {
        console.warn(`[WARNING] Possible unhandled async error in controller: ${filePath}`);
    }

    // Check for schema definitions missing timestamps if not intended
    if (filePath.includes('models') && code.includes('new mongoose.Schema') && !code.includes('timestamps')) {
        console.info(`[INFO] Model missing timestamps: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && !file.startsWith('.')) {
                walkDir(fullPath);
            }
        } else if (file.endsWith('.js')) {
            try {
                // Just try requiring the file to catch basic syntax/export errors
                if (!fullPath.includes('index.js') && !fullPath.includes('server.js') && !fullPath.includes('scripts')) {
                   require(fullPath);
                }
                checkFile(fullPath);
            } catch (e) {
                console.error(`[ERROR] Failed to load ${fullPath}: ${e.message}`);
            }
        }
    }
}

console.log('Running backend diagnostics...');
walkDir(__dirname);
console.log('Diagnostics complete.');
