import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}`}') || content.includes('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}') || content.includes('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `http://localhost:5000`}`}')) {
      console.log(`Fixing double replacement in ${filePath}`);
      // Replace the nested mistake with just the simple fallback
      content = content.split("${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}").join("${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
      fs.writeFileSync(filePath, content, 'utf8');
  }
};

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const allFiles = walkSync(directoryPath);
allFiles.forEach(replaceInFile);
console.log('Cleanup complete');
