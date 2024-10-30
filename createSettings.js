const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'bin', 'settings.json');
const greenText = '\x1b[32m%s\x1b[0m';

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify({}));
  console.log('Created settings.json');
} else {
  console.log('settings.json already exists');
}

console.log(greenText, '\nDone!');