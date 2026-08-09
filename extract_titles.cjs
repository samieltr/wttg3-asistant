const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\samet\\Downloads\\WTG3\\WTTGSD\\Content\\RawFiles\\WebSites';
const sites = fs.readdirSync(dir);

const mapping = {};

for (const site of sites) {
  const siteDir = path.join(dir, site);
  if (fs.statSync(siteDir).isDirectory()) {
    const indexPath = path.join(siteDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      const match = content.match(/<title>([\s\S]*?)<\/title>/i);
      if (match) {
        mapping[site] = match[1].trim();
      }
    }
  }
}

console.log(JSON.stringify(mapping, null, 2));
