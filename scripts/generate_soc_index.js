const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'soc-reports');
const OUT = path.join(SRC, '_index.json');

const allowedCategories = new Set(['credential-access','email-security','endpoint','vulnerability-management','network']);

function titleCaseCategory(cat){
  return cat.split('-').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ');
}

function walk(dir){
  const res = [];
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir,name);
    const stat = fs.statSync(p);
    if(stat.isDirectory()) res.push(...walk(p));
    else if(stat.isFile() && name.toLowerCase().endsWith('.md')) res.push(p);
  }
  return res;
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
  const parts = rel.split('/');
  if(parts.length < 3) return null;
  const category = parts[1];
  if(!allowedCategories.has(category)) return null;
  const name = parts.pop();
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
    const m = line.match(/^#\s+(.+)$/);
    if(m){ title = m[1].trim();
      // look for Date on next non-empty line
      let j = i+1; while(j<lines.length){ const nxt = lines[j].trim(); if(nxt===''){ j++; continue } const dm = nxt.match(/^\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})\s*$/); if(dm){ date = dm[1]; } break }
      break;
    }
  }
  if(!date){ // fallback to git commit date
    const cd = getCommitDate(rel);
    if(cd) date = cd.slice(0,10);
  }
  if(!date) return null;
  const outCategory = titleCaseCategory(category);
  return { path: rel, url: `https://github.com/${process.env.GITHUB_REPOSITORY || 'eqqorock/portfolio'}/blob/main/${rel}`, title, date, category: outCategory };
}

function main(){
  if(!fs.existsSync(SRC)){
    console.error('soc-reports folder not found'); process.exit(2);
  }
  const files = walk(SRC);
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
