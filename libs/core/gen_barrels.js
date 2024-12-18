import * as fs from 'fs';
import * as path from 'path';

const libDir = path.join(__dirname, 'src', 'lib');
const indexPath = path.join(__dirname, 'src', 'index.ts');

// Check if the directory exists
if (!fs.existsSync(libDir)) {
  console.error(`Directory ${libDir} does not exist.`);
  process.exit(1);
}

// Get all .ts files in the directory, excluding .spec.ts files
const files = fs
  .readdirSync(libDir)
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'));

// Create export statements for each file
const exportStatements = files.map(
  (file) => `export * from './lib/${path.parse(file).name}';`
);

// Write the export statements to the index.ts file
fs.writeFileSync(indexPath, exportStatements.join('\n'));

console.log('index.ts generated successfully!');
