const $ = id => document.getElementById(id);
let allOdds = [];
const today = new Date();
const localDate = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
$('matchDate').value = localDate;

function normalize(rows){
  return rows.map((r,i)=>({
    id:r.id ?? i, date:String(r.date || r.data || '').slice(0,10),
    time:r.time || r.orario || '', league:r.league || r.competition || r.campionato || '',
    home:r.home || r.homeTeam || r.casa || '', away:r.away || r.awayTeam || r.trasferta || '',
    market:r.market || r.mercato || 'N.D.', selection:r.selection || r.esito || r.outcome || '',
    odds:Number(String(r.odds ?? r.quota ?? '').replace(',','.')),
    bookmaker:r.bookmaker || r.operatore || ''
  })).filter(x=>x.home && x.away && Number.isFinite(x.odds));
}
function parseCSV(text){
  const lines=text.trim().split(/\r?\n/); if(lines.length<2) return [];
  const headers=lines.shift().split(/[;,]/).map(x=>x.trim().toLowerCase());
  return lines.map(line=>{
    const vals=line.split(/[;,]/); const obj={};
    headers.forEach((h,i)=>obj[h]=(vals[i]||'').trim()); return obj;
  });
}
function render(){
  const date=$('matchDate').value, min=$('minOdds').value===''?null:Number($('minOdds').value),
    max=$('maxOdds').value===''?null:Number($('maxOdds').value),
    market=$('market').value, q=$('search').value.trim().toLowerCase();
  let rows=allOdds.filter(x=>x.date===date);
  if(min!==null) rows=rows.filter(x=>x.odds>=min);
  if(max!==null) rows=rows.filter(x=>x.odds<=max);
  if(market) rows=rows.filter(x=>x.market===market);
  if(q) rows=rows.filter(x=>[x.home,x.away,x.league].join(' ').toLowerCase().includes(q));
  rows.sort((a,b)=>a.odds-b.odds);
  const grouped=new Map();
  rows.forEach(x=>{const k=[x.home,x.away,x.time,x.league].join('|');if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(x)});
  $('count').textContent=rows.length;
  $('games').textContent=grouped.size;
  $('dateLabel').textContent=date?new Date(date+'T12:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'';
  $('results').innerHTML='';
  $('notice').hidden=grouped.size>0;
  $('notice').textContent=allOdds.length?'Nessuna quota corrisponde ai filtri selezionati.':'Nessun dato caricato. Importa un file dati JSON/CSV.';
  for(const list of grouped.values()){
    const first=list[0], card=document.createElement('article');card.className='match';
    const top=document.createElement('div');top.className='match-top';
    top.textContent=[first.league||'Campionato N.D.',first.time].filter(Boolean).join(' · ');
    const teams=document.createElement('div');teams.className='teams';teams.textContent=first.home+' – '+first.away;
    const odds=document.createElement('div');odds.className='odds';
    list.forEach(x=>{const el=document.createElement('span');el.className='odd';el.textContent=[x.market,x.selection].filter(Boolean).join(' / ')+' ';const b=document.createElement('b');b.textContent=x.odds.toFixed(2);el.appendChild(b);if(x.bookmaker)el.title=x.bookmaker;odds.appendChild(el)});
    card.append(top,teams,odds);$('results').appendChild(card);
  }
}
$('fileInput').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const text=await file.text();const raw=file.name.toLowerCase().endsWith('.json')?JSON.parse(text):parseCSV(text);
    allOdds=normalize(Array.isArray(raw)?raw:(raw.odds||raw.data||[]));
    const markets=[...new Set(allOdds.map(x=>x.market).filter(Boolean))].sort();
    $('market').innerHTML='<option value="">Tutti i mercati importati</option>'+markets.map(m=>`<option>${escapeHtml(m)}</option>`).join('');
    $('updated').textContent=new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
    render();
  }catch(err){$('notice').hidden=false;$('notice').textContent='File non leggibile. Controlla il formato JSON/CSV.'}
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
['matchDate','minOdds','maxOdds','market','search'].forEach(id=>$(id).addEventListener('input',render));
$('refresh').addEventListener('click',render);
$('reset').addEventListener('click',()=>{$('minOdds').value='';$('maxOdds').value='';$('market').value='';$('search').value='';render()});
render();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
