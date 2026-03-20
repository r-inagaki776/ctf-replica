const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.next') {
        walk(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
};

const exts = ['.ts', '.tsx', '.json', '.md'];

walk('.', (filePath) => {
  if (!exts.includes(path.extname(filePath))) return;
  if (filePath.includes('package-lock.json')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // We map down Q2->Q1, Q3->Q2, Q4->Q3 avoiding collision by doing it carefully
  
  // Replaces:
  // q2 -> q1
  // Q2 -> Q1
  // 問題02 -> 問題01
  newContent = newContent.replace(/q2/g, 'q1');
  newContent = newContent.replace(/Q2/g, 'Q1');
  newContent = newContent.replace(/問題02/g, '問題01');

  // q3 -> q2
  // Q3 -> Q2
  // 問題03 -> 問題02
  newContent = newContent.replace(/q3/g, 'q2');
  newContent = newContent.replace(/Q3/g, 'Q2');
  newContent = newContent.replace(/問題03/g, '問題02');

  // q4 -> q3
  // Q4 -> Q3
  // 問題04 -> 問題03
  newContent = newContent.replace(/q4/g, 'q3');
  newContent = newContent.replace(/Q4/g, 'Q3');
  newContent = newContent.replace(/問題04/g, '問題03');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated: ' + filePath);
  }
});
