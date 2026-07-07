const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('./app');
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes("Platform.OS === 'ios' ? 'padding' : undefined")) {
    content = content.replace(/Platform\.OS === 'ios' \? 'padding' : undefined/g, "'padding'");
    fs.writeFileSync(f, content);
    count++;
    console.log('Fixed', f);
  }
});
console.log('Total fixed:', count);
