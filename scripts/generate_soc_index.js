const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'soc-reports');
const OUT = path.join(SRC, 'index.json');

function titleCaseCategory(cat){
  return cat.split('-').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ');
}

function inferCategoryFromContent(filename, title){
  const combined = (filename + ' ' + title).toLowerCase();
  if(/phishing|email/i.test(combined)) return 'Email Security';
  if(/persistence|endpoint/i.test(combined)) return 'Endpoint';
  if(/credential|password|hash|weak.*credential/i.test(combined)) return 'Credential Access';
  if(/wireshark|packet|network|traffic/i.test(combined)) return 'Network';
  if(/vulnerability|assessment|cloud|scoutsuite|legacy.*system/i.test(combined)) return 'Vulnerability Management';
  return 'Other';
}

function getCommitDate(filePath){
  try{
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, {cwd: ROOT, encoding: 'utf8'}).trim();
    if(out) return out;
  }catch(e){}
  return null;
}

function parseFile(fpath){
  const rel = path.relative(ROOT, fpath).replace(/\\/g, '/');
  const name = path.basename(rel);
  if(name.toLowerCase() === 'readme.md') return null;
  
  const text = fs.readFileSync(fpath, 'utf8');
  const lines = text.split(/\r?\n/);
  let inCode = false;
  let title = name.replace(/\.md$/i,'');
  let date = null;
  
  for(let i=0;i<lines.length;i++){
    const line = lines[i];
    if(line.trim().startsWith('```')){ inCode = !inCode; continue; }
    if(inCode) continue;
    
    // Look for H1
    const m = line.match(/^#\s+(.+)$/);
    if(m){ 
      title = m[1].trim();
    }
    
    // Look for Date anywhere in first 15 lines
    if(i < 15){
      const dm = line.match(/^\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/);
      if(dm){ date = dm[1]; }
    }
    
    if(title !== name.replace(/\.md$/i,'') && date) break;
  }
  
  if(!date){ // fallback to git commit date
    const cd = getCommitDate(rel);
    if(cd) date = cd.slice(0,10);
  }
  if(!date) return null;
  
  const category = inferCategoryFromContent(name, title);
  return { 
    path: rel, 
    url: `https://github.com/${process.env.GITHUB_REPOSITORY || 'eqqorock/portfolio'}/blob/main/${rel}`, 
    title, 
    date, 
    category 
  };
}

function main(){
  if(!fs.existsSync(SRC)){
    console.error('soc-reports folder not found'); process.exit(2);
  }
  
  const files = fs.readdirSync(SRC)
    .filter(name => name.toLowerCase().endsWith('.md'))
    .map(name => path.join(SRC, name));
    
  const items = [];
  for(const f of files){
    const parsed = parseFile(f);
    if(parsed) items.push(parsed);
  }
  
  items.sort((a,b)=> b.date.localeCompare(a.date));
  fs.writeFileSync(OUT, JSON.stringify(items, null, 2), 'utf8');
  console.log('Wrote', OUT, items.length, 'items');
}

main();
