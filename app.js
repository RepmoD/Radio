{
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ld = (k, d) => { try { const v = localStorage.getItem('br.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const sv = (k, v) => { try { localStorage.setItem('br.' + k, JSON.stringify(v)); } catch (e) {} };
const IA = 'https://archive.org';
const SHORT_MO = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
const MONTHS = ['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
const DAYS = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];

// Sources, checked Nov. 2026. Order sets which copy wins when two hold the same game.
const COLLECTIONS = [
  {id:'cbotrarchive', label:'Classic Baseball on the Radio'},
  {id:'classicmlbbaseballradio', label:'Classic Baseball Radio Broadcasts'},
  {id:'vintagebaseballradio', label:'Classic Baseball on the Radio'},
  {id:'chicago-ws-1970s', label:'White Sox 1970s on the Radio'},
  {id:'yankeesclassicradio', label:'Yankees Vintage Radio'},
  {id:'classicbaseballotr2', label:'1940s Classic MLB Radio'},
  {id:'baseball_otr', label:'Baseball OTR'},
  {id:'bluejaysradio', label:'Blue Jays Radio'},
  {id:'seattle-baseball-radio', label:'Pilots and Mariners Radio'},
  {id:'67-06-04-yankees-g-2', label:'Tigers Radio', yy:'Tigers'},
  {id:'1978-world-series-game-4-dodgers-yankees-wcbs-radio', label:'World Series on the Radio', video:true, skip:/discusses/i},
  {id:'1976-world-series-game-1-cincinnati-10-16-76-original-nbc-broadcast', label:'1976 Postseason Radio', video:true, only:/radio/i, skip:/\bABC\b|postgame|reconstruction/i},
  {id:'1975-world-series-game-6-nbc-radio-wnws-fm-new-york', label:'1975 World Series on NBC Radio', video:true},
  {id:'1975-nlcs-pirates-vs-reds-complete-series-baseball-radio-broadcast-stream-merry-christmas', label:'1975 Playoffs Radio', video:true, skip:/TV|complete series/i},
  {id:'wcco-am-minnesota-twins-1987-ws-replay-pt.-1', label:'WCCO Twins 1987'},
  {id:'giantsclassicradio', label:'Giants Classic Radio'}
];
const RSR = 'Retro Sports Radio';
const STATIONS = [
  {key:'buck', label:'Jack Buck', list:'PLiX7Uzt79vPTVpTePdFhDQJzdJOMRmPj0', ann:'Jack Buck', by:RSR},
  {key:'cards', label:'Cardinals Radio', list:'PLiX7Uzt79vPTK8uLaubnKt4TyUkZ1Ski7', by:RSR},
  {key:'s70', label:'The 1970s', list:'PLiX7Uzt79vPS0T9XwEFnYSZrsAVyMKyNn', by:RSR},
  {key:'cbr', label:'Classic Baseball on the Radio', list:'UUVSJblsQs4cOylK64l-medA', by:'Classic Baseball on the Radio', blurb:'1,100+ games'},
  {key:'classic', label:'Vintage Classics', list:'PLiX7Uzt79vPSEnGuCz2flNLslq3sQj2Si', by:RSR},
  {key:'caray', label:'Harry Caray', list:'PLiX7Uzt79vPRiZBt56cv6Kw3Vl3ahmM8R', ann:'Harry Caray', by:RSR},
  {key:'kalas', label:'Harry Kalas', list:'PLiX7Uzt79vPRCJs5_2vZ9zlRmWehwqege', ann:'Harry Kalas', by:RSR},
  {key:'prince', label:'Bob Prince', list:'PLiX7Uzt79vPTwY7-vHix1Jpmo0QOaztT-', ann:'Bob Prince', by:RSR},
  {key:'tigers', label:'Tigers Radio', list:'PLiX7Uzt79vPSFB9w3Q1QSv0stR3f9Vse7', by:RSR},
  {key:'cubs', label:'Cubs Radio', list:'PLiX7Uzt79vPTw21OHdcgpvPR7uLTK-ho5', by:RSR},
  {key:'dodgers', label:'Dodgers Radio', list:'PLiX7Uzt79vPQvWfB8m1YcvEz0Q53OnHze', by:RSR},
  {key:'yankees', label:'Yankees Radio', list:'PLiX7Uzt79vPRe94CXrZr8Ux_enxO5xgvr', by:RSR},
  {key:'as', label:'A’s Radio', list:'PLiX7Uzt79vPQIS8EByOBbjFTFQFH0uvtC', by:RSR},
  {key:'pirates', label:'Pirates Radio', list:'PLiX7Uzt79vPSp0TOjo4bpNk4uwDF0odd5', by:RSR}
];
const AD_SOURCES = ['HFCradio1979','Old_Radio_Adverts_01','50RadioCommercialsPart1','RadiosGoldenMomentsPart2RadioCommercials'];
const ANNOUNCERS = ['Jack Buck','Mike Shannon','Harry Caray','Jim Woods','Bob Starr','Joe Garagiola','Dizzy Dean','France Laux','Vin Scully','Jerry Doggett','Ross Porter','Red Barber','Mel Allen','Phil Rizzuto','Bill White','Frank Messer','Ernie Harwell','George Kell','Paul Carey','Bob Prince','Jim Woods','Lanny Frattare','Bob Elson','Jack Brickhouse','Jack Quinlan','Lou Boudreau','Vince Lloyd','Milo Hamilton','Harry Kalas','Richie Ashburn','By Saam','Bob Murphy','Lindsey Nelson','Ralph Kiner','Russ Hodges','Lon Simmons','Curt Gowdy','Ned Martin','Ken Coleman','Chuck Thompson','Herb Carneal','Al Michaels','Marty Brennaman','Joe Nuxhall','Waite Hoyt','Gene Elston','Denny Matthews','Fred White','Bob Uecker','Monte Moore','Dick Enberg','Jerry Coleman','Dave Niehaus','Ernie Johnson','Jon Miller','Ken Harrelson','Jimmy Piersall','Pee Wee Reese','Bob Wolff','Ted Husing','Graham McNamee','Tom Manning','Hal Totten'];
const TEAMS = ['cardinals','cubs','reds','pirates','dodgers','giants','mets','phillies','braves','astros','colt','expos','padres','yankees','red sox','tigers','white sox','indians','orioles','browns','senators','athletics','twins','angels','royals','brewers','pilots','rangers','blue jays','mariners','all-star','all star'];

const S = {
  on:false, band:'am', cat:[], byId:new Map(), cur:null, view:{kind:'year', y:1974},
  favs:ld('favs', {}), tags:ld('tags', {}), pos:ld('pos', {}), annFav:ld('annfav', []), last:ld('last', null),
  yt:null, ytReady:false, ytWant:null, delay:null, kids:{}, extra:{}, season:false, loading:true, failed:false, recent:ld('recent', [])
};
const au = $('au');

/* ---------- parsing archive.org files ---------- */
function parseName(base) {
  const b = base.split('/').pop().replace(/_/g, ' ');
  let y = 0, mo = 0, d = 0, rest = b;
  const m = b.match(/^((?:18|19|20)\d{2})[\s.\-]+(\d{1,2})[\s.\-]+(\d{1,2})(?!\d)[\s.\-]*(.*)$/);
  const mn = b.match(/^((?:19|20)\d{2})-([A-Za-z]{3})-(\d{1,2})[\s•\-]*(.*)$/);
  const mc = b.match(/^((?:19|20)\d{2})(\d{2})-?(\d{2})-?(.*)$/);
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; rest = m[4]; }
  else if (mn) { y = +mn[1]; mo = SHORT_MO.findIndex(x => x.slice(0, 3).toLowerCase() === mn[2].toLowerCase()) + 1; d = +mn[3]; rest = mn[4]; }
  else if (mc) { y = +mc[1]; mo = +mc[2]; d = +mc[3]; rest = mc[4].replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/\b(At|Vs)\b/g, w => w.toLowerCase()); }
  else { const m2 = b.match(/\b((?:18|19|20)\d{2})\b/); if (m2) y = +m2[1]; }
  if (mo < 1 || mo > 12 || d < 1 || d > 31) { mo = 0; d = 0; }
  rest = rest.replace(/(^|•)\s*[A-Z]{3}\s[A-Z]{3}\s*•/g, '').replace(/\bWS\b/g, 'World Series').replace(/•/g, '-').replace(/\bG(?:m|ame)?\s*(\d)\b/g, 'Game $1').replace(/\s+-\s+Radio$/i, '').replace(/\bclassic (radio )?baseball( radio)?\b/ig, '').replace(/\bcomplete (mlb )?broadcast\b/ig, '');
  let title = rest.replace(/^[\s\-–]+/, '').replace(/complete radio (baseball )?broadcast/ig, '').replace(/radio broadcast/ig, '')
    .replace(/\bcopy\b/ig, '').replace(/\s{2,}/g, ' ').replace(/[\s\-–]+$/, '').trim();
  if (!title) title = b;
  return {y, mo, d, title};
}
const YY_ABBR = {NYY:'Yankees', BOS:'Red Sox', CHI:'White Sox', CLE:'Indians', TOR:'Blue Jays', 'A s':'Athletics'};
function parseYY(base, team) {
  const b = base.split('/').pop().replace(/_/g, ' ');
  const m = b.match(/^(\d{2})-(\d{2})-(\d{2})\s*-?\s*(.*)$/);
  if (!m) return parseName(base);
  const y = 1900 + +m[1]; let mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) { mo = 0; d = 0; }
  let rest = m[4].trim(), gm = '';
  const g = rest.match(/\s+G(\d)$/i); if (g) { gm = g[1]; rest = rest.slice(0, g.index).trim(); }
  const opp = YY_ABBR[rest] || rest;
  let title = team + ' vs ' + opp;
  if (gm) title += (mo === 10 && /cardinals|cubs/i.test(opp) ? ' World Series' : '') + ' Game ' + gm;
  return {y, mo, d, title};
}
const ALIAS = [[/\bbuck\b/i, /cardinal|shannon|kmox|caray|buck &|& buck|buck-|-buck/i, 'Jack Buck'], [/\bbuck-white\b/i, null, 'Bill White'], [/\bshannon\b/i, /cardinal|buck|kmox/i, 'Mike Shannon'], [/\bcaray\b/i, null, 'Harry Caray'], [/\bscully\b/i, null, 'Vin Scully'], [/\bharwell\b/i, null, 'Ernie Harwell'], [/\bgaragiola\b/i, null, 'Joe Garagiola'], [/\brizzuto\b/i, null, 'Phil Rizzuto'], [/\bbrickhouse\b/i, null, 'Jack Brickhouse'], [/\bmichaels\b/i, null, 'Al Michaels'], [/\bnuxhall\b/i, null, 'Joe Nuxhall'], [/\bbrennaman\b/i, null, 'Marty Brennaman'], [/\bkalas\b/i, null, 'Harry Kalas'], [/\buecker\b/i, null, 'Bob Uecker'], [/\bniehaus\b/i, null, 'Dave Niehaus'], [/\bgowdy\b/i, null, 'Curt Gowdy']];
function annsIn(text) {
  const t = text.toLowerCase(), out = ANNOUNCERS.filter(a => t.includes(a.toLowerCase()));
  ALIAS.forEach(([re, cond, name]) => { if (re.test(text) && (!cond || cond.test(text))) out.push(name); });
  return [...new Set(out)];
}
function gameKey(g) {
  const t = g.title.toLowerCase();
  const teams = TEAMS.filter(n => t.includes(n)).sort().join(',');
  const gm = (t.match(/game (\d)/) || [])[1] || '';
  const part = /partial|inning/.test(t) ? 'p' : '';
  return teams ? [g.y, g.mo, g.d, teams, gm, part].join('|') : [g.y, g.mo, g.d, t.replace(/[^a-z0-9]/g, '')].join('|');
}
function fileUrl(ident, name) { return IA + '/download/' + encodeURIComponent(ident) + '/' + name.split('/').map(encodeURIComponent).join('/'); }
function pickMedia(files, allowVideo) {
  const groups = new Map();
  for (const f of files) {
    const n = f.name || '';
    const ext = (n.match(/\.(mp3|m4a|mp4|ogg)$/i) || [])[1];
    if (!ext) continue;
    const e = ext.toLowerCase();
    if (e === 'ogg') continue;
    if (e === 'mp4' && !allowVideo) continue;
    const base = n.replace(/(_64kb|_128kb|_vbr)?\.(mp3|m4a|mp4)$/i, '');
    let rank = e === 'mp3' ? (f.source === 'original' ? 0 : 1) : e === 'm4a' ? 2 : 3;
    if (/_64kb\.mp3$/i.test(n)) rank = 1.5;
    const cur = groups.get(base);
    if (!cur || rank < cur.rank) groups.set(base, {f, rank, base});
  }
  return [...groups.values()];
}
function buildGames(col, files, allowVideo) {
  return pickMedia(files, allowVideo || col.video).filter(({f}) => (!col.only || col.only.test(f.name)) && (!col.skip || !col.skip.test(f.name))).map(({f, base}) => {
    const p = col.yy ? parseYY(base, col.yy) : parseName(base);
    return {kind:'am', id:col.id + '/' + f.name, ident:col.id, file:f.name, col:col.label, len:+f.length || 0, y:p.y, mo:p.mo, d:p.d, title:p.title, video:/\.mp4$/i.test(f.name)};
  });
}
function setCatalog(list) {
  const seen = new Set(); S.cat = []; S.byId = new Map();
  for (const g of list) {
    if (!g.y) continue;
    const k = gameKey(g), k2 = g.mo && g.len ? [g.y, g.mo, g.d, Math.round(g.len / 5)].join('|') : '';
    if (seen.has(k) || (k2 && seen.has(k2))) continue;
    seen.add(k); if (k2) seen.add(k2); S.cat.push(g); S.byId.set(g.id, g);
  }
  S.cat.sort((a, b) => (a.y - b.y) || (a.mo - b.mo) || (a.d - b.d) || a.title.localeCompare(b.title));
}
const pack = g => [g.ident, g.file, g.y, g.mo, g.d, g.title, g.col, Math.round(g.len)];
const unpack = a => ({kind:'am', id:a[0] + '/' + a[1], ident:a[0], file:a[1], y:a[2], mo:a[3], d:a[4], title:a[5], col:a[6], len:a[7]});

async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }
async function loadCatalog(force) {
  const cached = ld('cat3', null);
  if (cached && cached.items && cached.items.length) {
    setCatalog(cached.items.map(unpack)); S.loading = false;
    if (!force && Date.now() - cached.at < 7 * 864e5) return;
  }
  const res = await Promise.allSettled(COLLECTIONS.map(c => getJSON(IA + '/metadata/' + encodeURIComponent(c.id)).then(j => buildGames(c, j.files || [], false))));
  const all = [];
  res.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value); });
  if (!all.length) { S.loading = false; if (!S.cat.length) S.failed = true; render(); return; }
  setCatalog(all); S.loading = false; S.failed = false;
  sv('cat3', {at:Date.now(), items:S.cat.map(pack)});
  buildDial(); render();
}

/* live archive.org search for single uploads outside the collections */
function cleanQ(q) { return q.replace(/[^\p{L}\p{N}\s'\-]/gu, ' ').replace(/\s+/g, ' ').trim(); }
async function iaSearch(term, year) {
  const skip = COLLECTIONS.map(c => c.id).join(' OR ');
  let q = '(baseball OR "world series" OR "all-star game") AND mediatype:(audio OR movies) AND NOT identifier:(' + skip + ')';
  if (term) q = '(' + term + ') AND ' + q;
  if (year) q += ' AND (year:' + year + ' OR title:' + year + ')';
  const p = new URLSearchParams({q, rows:'40', output:'json'});
  ['identifier', 'title', 'year', 'date', 'mediatype'].forEach(f => p.append('fl[]', f));
  const j = await getJSON(IA + '/advancedsearch.php?' + p.toString());
  return (j.response && j.response.docs || []).map(doc => {
    const t = String(Array.isArray(doc.title) ? doc.title[0] : doc.title || doc.identifier);
    const p2 = parseName(t);
    const y = p2.y || +String(doc.year || doc.date || '').slice(0, 4) || 0;
    return {kind:'item', id:'item:' + doc.identifier, ident:doc.identifier, title:t, y, mo:p2.mo, d:p2.d, col:'archive.org upload', video:doc.mediatype === 'movies'};
  });
}
async function openItem(it) {
  if (S.kids[it.ident]) return S.kids[it.ident];
  const j = await getJSON(IA + '/metadata/' + encodeURIComponent(it.ident));
  const col = {id:it.ident, label:'archive.org upload'};
  let games = buildGames(col, j.files || [], false);
  if (!games.length) games = buildGames(col, j.files || [], true);
  games.forEach(g => { if (!g.y) { g.y = it.y; } if (games.length === 1) { g.title = it.title; g.mo = g.mo || it.mo; g.d = g.d || it.d; } S.byId.set(g.id, g); });
  S.kids[it.ident] = games;
  return games;
}

/* ---------- formatting ---------- */
function fmtDate(g) {
  if (g.y && g.mo && g.d) { const wd = new Date(Date.UTC(g.y, g.mo - 1, g.d)).getUTCDay(); return DAYS[wd] + ' ' + MONTHS[g.mo - 1] + ' ' + g.d + ', ' + g.y; }
  return g.y ? String(g.y) : '';
}
function short(g) { return g.mo && g.d ? SHORT_MO[g.mo - 1] + ' ' + g.d : (g.y || ''); }
function hms(t) { t = Math.max(0, Math.floor(t || 0)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); }
function annsOf(g) { return [...new Set([...(annsIn(g.title || '')), ...(g.ann || []), ...(S.tags[g.id] || [])])]; }
const isCards = g => /cardinal/i.test(g.title);
function toast(msg, ms) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, ms || 3200); }

/* ---------- playback ---------- */
function setOn(v) {
  $('powLbl').textContent = v ? 'Turn off' : 'Turn on';
  $('capR').textContent = v ? 'swipe or tap a year to change games' : 'swipe to look, power on to play';
  S.on = v; document.body.classList.toggle('on', v); document.body.classList.toggle('off', !v);
  $('power').classList.toggle('lit', v); $('power').setAttribute('aria-label', v ? 'Power off' : 'Power on');
}
function setPlaying(v) {
  document.body.classList.toggle('playing', v); $('icoPlay').hidden = v; $('icoPause').hidden = !v;
  $('play').setAttribute('aria-label', v ? 'Pause' : 'Play');
}
function markPlayed(id) { if (!id || /^st:/.test(id)) return; S.recent = [id].concat(S.recent.filter(x => x !== id)).slice(0, 60); sv('recent', S.recent); }
function remember(g) {
  markPlayed(g.id);
  const keep = {kind:g.kind, id:g.id, ident:g.ident, file:g.file, title:g.title, y:g.y, mo:g.mo, d:g.d, col:g.col, vid:g.vid, list:g.list, station:g.station, ann:g.ann};
  S.last = keep; sv('last', keep); return keep;
}
function savePos() {
  const g = S.cur; if (!g || S.delay) return;
  let t, dur;
  if (g.kind === 'yt') { if (!S.yt || !S.yt.getCurrentTime) return; t = S.yt.getCurrentTime(); dur = S.yt.getDuration(); }
  else { t = au.currentTime; dur = au.duration || g.len; }
  if (!t) return;
  S.pos[g.id] = {t:Math.round(t), dur:Math.round(dur || 0), at:Date.now()};
  const ids = Object.keys(S.pos); if (ids.length > 300) { ids.sort((a, b) => S.pos[a].at - S.pos[b].at).slice(0, ids.length - 300).forEach(k => delete S.pos[k]); }
  sv('pos', S.pos);
}
function resumeAt(id) { const p = S.pos[id]; return p && p.t > 20 && (!p.dur || p.t < p.dur - 90) ? p.t : 0; }
function stopYT() { if (S.yt && S.yt.pauseVideo) { try { S.yt.pauseVideo(); } catch (e) {} } }

function playAM(g, from) {
  stopYT(); $('ytWrap').hidden = true;
  if (S.cur && S.cur.kind !== 'yt' && !S.delay) savePos();
  S.cur = g; S.delay = null; if (g.kind !== 'ad') { remember(g); setBandQuiet('am'); if (g.y) dialTo(g.y, true); }
  setOn(true);
  const start = from != null ? from : resumeAt(g.id);
  au.src = fileUrl(g.ident, g.file);
  au.dataset.start = start;
  const pr = au.play();
  if (pr && pr.catch) pr.catch(() => { setPlaying(false); toast('Tap play to start it'); });
  showNow(); media(g);
  if (g.kind !== 'ad' && g.y && S.view.kind === 'year' && S.view.y !== g.y && !S.season) setView({kind:'year', y:g.y}); else render(true);
  if (g.y && S.band === 'am' && !S.season) dialTo(g.y);
  if (start > 0) toast('Picking up at ' + hms(start));
}
au.addEventListener('loadedmetadata', () => { const s = +au.dataset.start || 0; if (s > 0) { try { au.currentTime = s; } catch (e) {} } au.dataset.start = 0; tickTime(); });
au.addEventListener('playing', () => setPlaying(true));
au.addEventListener('pause', () => { if (!S.cur || S.cur.kind !== 'yt') setPlaying(false); savePos(); });
au.addEventListener('error', () => { if (!au.getAttribute('src')) return; setPlaying(false); toast('Static on this one. It won’t load right now, so try another.', 4200); });
au.addEventListener('ended', () => {
  if (S.delay) { const back = S.delay; S.delay = null; toast('Back to the ballgame'); back.g.kind === 'yt' ? playYT(back.g, back.t) : playAM(back.g, back.t); return; }
  if (S.cur) { S.pos[S.cur.id] = {t:0, dur:0, at:Date.now(), done:1}; sv('pos', S.pos); }
  if (S.season) { const nx = nextInView(); if (nx) { play(nx); return; } S.season = false; }
  if (S.on && S.cur && S.cur.kind !== 'ad') { toast('That’s the ballgame. Here’s another one.'); nextGame(); return; }
  setPlaying(false); render(true);
});
let lastSave = 0;
au.addEventListener('timeupdate', () => { tickTime(); if (Date.now() - lastSave > 4000) { lastSave = Date.now(); savePos(); } });
function tickTime() {
  if (S.cur && S.cur.kind === 'yt') return;
  const d = au.duration || (S.cur && S.cur.len) || 0, t = au.currentTime || 0;
  $('tCur').textContent = hms(t); $('tDur').textContent = d && isFinite(d) ? hms(d) : '--:--';
  if (!seeking) { const v = d ? Math.round(t / d * 1000) : 0; $('seek').value = v; $('seek').style.setProperty('--p', v / 10 + '%'); }
}

/* YouTube (FM band) */
function loadYTApi() {
  if (loadYTApi.p) return loadYTApi.p;
  loadYTApi.p = new Promise((res, rej) => {
    window.onYouTubeIframeAPIReady = () => res();
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.onerror = () => { loadYTApi.p = null; rej(new Error('yt')); };
    document.head.appendChild(s);
  });
  return loadYTApi.p;
}
async function playYT(g, from) {
  // g: {kind:'yt', station, list, vid?, index?, random?}
  if (S.cur && S.cur.kind !== 'yt') savePos();
  au.pause(); S.delay = null; setOn(true); setPlaying(false); setBandQuiet('fm');
  $('tCur').textContent = '0:00'; $('tDur').textContent = '--:--'; $('seek').value = 0; $('seek').style.setProperty('--p', '0%');
  $('ytWrap').hidden = false;
  clearTimeout(playYT.hint); playYT.hint = setTimeout(() => { if (S.cur && S.cur.kind === 'yt' && !(S.yt && S.yt.getPlayerState && S.yt.getPlayerState() === 1)) toast('If it doesn’t start, tap the video once. YouTube sometimes wants its own tap.'); }, 7000);
  const st = STATIONS.find(s => s.key === g.station) || STATIONS[0];
  S.cur = {kind:'yt', id:g.vid ? 'yt:' + g.vid : 'st:' + st.key, station:st.key, list:st.list, vid:g.vid, title:g.title || st.label, y:g.y, ann:st.ann ? [st.ann] : [], col:'YouTube · ' + (st.by || RSR)};
  showNow(); render(true); dialTo(st.key, true);
  const start = from != null ? from : (g.vid ? resumeAt('yt:' + g.vid) : 0);
  S.ytWant = {random:!!g.random && !g.vid};
  if (S.yt && S.yt.loadPlaylist && S.ytReady && g.random && !g.vid && S.yt.getPlaylistId && S.yt.getPlaylistId() === st.list && S.yt.getPlaylist && S.yt.getPlaylist()) {
    // same station already loaded: jump straight to a fresh game
    const pl = S.yt.getPlaylist(), curV = S.yt.getVideoData ? S.yt.getVideoData().video_id : '';
    const idx = pl.map((v, i) => i).filter(i => pl[i] !== curV && !S.recent.includes('yt:' + pl[i]));
    const pool = idx.length ? idx : pl.map((v, i) => i).filter(i => pl[i] !== curV);
    if (pool.length) { S.ytWant = null; S.yt.playVideoAt(pool[Math.floor(Math.random() * pool.length)]); return; }
  }
  try { await loadYTApi(); } catch (e) { toast('YouTube didn’t answer. Check the connection and try again.'); return; }
  const opts = g.vid ? {videoId:g.vid, startSeconds:start} : {list:st.list, listType:'playlist', index:0};
  if (!S.yt) {
    const pv = {playsinline:1, rel:0, autoplay:1, modestbranding:1};
    if (g.vid) { pv.start = Math.floor(start); }
    else { pv.listType = 'playlist'; pv.list = st.list; }
    S.yt = new YT.Player('yt', {width:'100%', height:'100%', videoId:g.vid || undefined, playerVars:pv, events:{
      onReady: e => { S.ytReady = true; try { e.target.playVideo(); } catch (x) {} },
      onStateChange: ytState,
      onError: () => toast('That video won’t play here. Try the next one.')
    }});
  } else if (S.ytReady) {
    g.vid ? S.yt.loadVideoById(opts) : S.yt.loadPlaylist(opts);
  }
}
function ytState(e) {
  const st = e.data;
  if (st === 1) {
    setPlaying(true);
    if (S.ytWant && S.ytWant.random) {
      const pl = S.yt.getPlaylist && S.yt.getPlaylist();
      if (pl && pl.length > 1) {
        S.ytWant = null;
        const idx = pl.map((v, i) => i).filter(i => !S.recent.includes('yt:' + pl[i]));
        const pool = idx.length ? idx : pl.map((v, i) => i);
        S.yt.playVideoAt(pool[Math.floor(Math.random() * pool.length)]); return;
      }
    }
    S.ytWant = null;
    const d = S.yt.getVideoData ? S.yt.getVideoData() : null;
    if (d && d.video_id && S.cur && S.cur.kind === 'yt') {
      const y = +((d.title || '').match(/\b(19[2-9]\d)\b/) || [])[1] || 0;
      Object.assign(S.cur, {id:'yt:' + d.video_id, vid:d.video_id, title:d.title || S.cur.title, y});
      remember(S.cur); showNow(); render(true);
      const r = resumeAt(S.cur.id);
      if (r && Math.abs(S.yt.getCurrentTime() - r) > 30 && !ytState.jumped) { ytState.jumped = S.cur.id; S.yt.seekTo(r, true); toast('Picking up at ' + hms(r)); }
    }
  } else if (st === 2) { setPlaying(false); savePos(); }
  else if (st === 0) { savePos(); setPlaying(false); }
}
setInterval(() => {
  if (!S.cur || S.cur.kind !== 'yt' || !S.yt || !S.yt.getCurrentTime) return;
  const t = S.yt.getCurrentTime(), d = S.yt.getDuration();
  $('tCur').textContent = hms(t); $('tDur').textContent = d ? hms(d) : '--:--';
  if (!seeking) { const v = d ? Math.round(t / d * 1000) : 0; $('seek').value = v; $('seek').style.setProperty('--p', v / 10 + '%'); }
  if (Date.now() - lastSave > 5000) { lastSave = Date.now(); savePos(); }
}, 1000);

function play(g, from) { if (g.kind === 'yt' || g.kind === 'station') return playYT(g.kind === 'station' ? {station:g.station, random:true} : g, from); if (g.kind === 'item') return playItem(g); return playAM(g, from); }
async function playItem(it) {
  toast('Tuning in ' + it.title.slice(0, 60) + '…');
  try {
    const kids = await openItem(it);
    if (!kids.length) { toast('Nothing playable in that upload.'); return; }
    if (kids.length === 1) playAM(kids[0]); else { render(); toast(kids.length + ' recordings in that upload. Pick one below it.'); }
  } catch (e) { toast('archive.org didn’t answer. Try again in a moment.'); }
}
function togglePlay() {
  if (!S.on || !S.cur) return powerOn();
  if (S.cur.kind === 'yt') { if (!S.yt || !S.yt.getPlayerState) return; S.yt.getPlayerState() === 1 ? S.yt.pauseVideo() : S.yt.playVideo(); return; }
  if (au.paused) au.play().catch(() => toast('Tap play again to start it')); else au.pause();
}
function skip(sec) {
  if (!S.cur) return;
  if (S.cur.kind === 'yt') { if (S.yt && S.yt.seekTo) S.yt.seekTo(Math.max(0, S.yt.getCurrentTime() + sec), true); return; }
  if (au.duration) au.currentTime = Math.max(0, Math.min(au.duration - 1, au.currentTime + sec));
}
const RESUME_MS = 12 * 36e5;
function unfinished(L) { return !!(L && L.id && resumeAt(L.id)); }
function freshResume(L) { return unfinished(L) && Date.now() - (S.pos[L.id].at || 0) < RESUME_MS; }
function playLast(L) { play(L.kind === 'yt' ? {kind:'yt', station:L.station, vid:L.vid, title:L.title, y:L.y} : (S.byId.get(L.id) || L)); }
function powerOn() {
  setOn(true);
  const L = S.last;
  if (freshResume(L)) { playLast(L); return; }
  if (S.cat.length) { setBandQuiet('am'); playAM(pickFresh(S.cat)); } else spin();
  if (unfinished(L)) setTimeout(() => toast('A new game for you. ' + L.title + ' waits under Faves.', 4200), 1500);
}
function powerOff() {
  savePos(); au.pause(); stopYT(); S.season = false; setOn(false); setPlaying(false);
  $('rDate').innerHTML = '<span class="onair"></span>Off the air';
}

/* ---------- picking games ---------- */
function weight(g) { let w = g.y >= 1970 && g.y <= 1989 ? 8 : g.y >= 1960 ? 2.5 : 1; if (isCards(g)) w *= 2.5; if (annsOf(g).some(a => S.annFav.includes(a))) w *= 3; if (S.pos[g.id] && S.pos[g.id].done) w *= .2; return w; }
function pickW(list) { const ws = list.map(weight); let r = Math.random() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; } return list[list.length - 1]; }
function freshOf(list) { const cur = S.cur && S.cur.id; return list.filter(g => g.id !== cur && !S.recent.includes(g.id)); }
function pickFresh(list) {
  if (!list.length) return null;
  const f = freshOf(list); if (f.length) return pickW(f);
  const cur = S.cur && S.cur.id, rest = list.filter(g => g.id !== cur);
  if (!rest.length) return list[0];
  // everything here was played lately: take the one heard longest ago
  return rest.reduce((a, b) => S.recent.indexOf(b.id) > S.recent.indexOf(a.id) ? b : a);
}
function spin() {
  if (!S.cat.length || Math.random() < .3) { const pool = ['buck', 'cards', 's70', 'cbr']; const st = S.annFav.includes('Jack Buck') && Math.random() < .5 ? 'buck' : pool[Math.floor(Math.random() * pool.length)]; return playYT({station:st, random:true}); }
  playAM(pickFresh(S.cat));
}
function nextGame() {
  setOn(true);
  if (S.cur && S.cur.kind === 'yt') return playYT({station:S.cur.station, random:true});
  const l = viewList().filter(g => g.kind === 'am');
  const g = pickFresh(freshOf(l).length ? l : S.cat);
  if (g) playAM(g); else spin();
}
function tuneYear(y) {
  const l = S.cat.filter(g => g.y === y);
  if (!l.length) { toast('Nothing but static on ' + y + '. Turn a little further.'); return; }
  if (S.cur && S.cur.kind === 'am' && S.cur.y === y) return;
  playAM(pickFresh(l));
}
function todayGames() {
  const n = new Date(), m = n.getMonth() + 1, d = n.getDate();
  const doy = (mo, dd) => Math.round((Date.UTC(2001, mo - 1, dd) - Date.UTC(2001, 0, 1)) / 864e5);
  const t = doy(m, d), dated = S.cat.filter(g => g.mo && g.d);
  const exact = dated.filter(g => g.mo === m && g.d === d);
  if (exact.length >= 3) return {list:exact, exact:true, any:true, m, d};
  const withD = dated.map(g => { const k = Math.abs(doy(g.mo, g.d) - t); return {g, k:Math.min(k, 365 - k)}; }).sort((a, b) => a.k - b.k);
  if (!withD.length) return {list:[], exact:false, any:false, m, d};
  const cut = withD[Math.min(4, withD.length - 1)].k;
  return {list:withD.filter(x => x.k <= cut).map(x => x.g), exact:false, any:exact.length > 0, m, d};
}
async function rainDelay() {
  if (!S.cur) { toast('Turn on a game first, then call a rain delay.'); return; }
  const back = {g:S.cur.kind === 'yt' ? {kind:'yt', station:S.cur.station, vid:S.cur.vid, title:S.cur.title, y:S.cur.y} : S.cur, t:S.cur.kind === 'yt' ? (S.yt && S.yt.getCurrentTime ? S.yt.getCurrentTime() : 0) : au.currentTime};
  savePos();
  toast('Rain delay. A word from our sponsors…');
  try {
    if (!rainDelay.pool) {
      const res = await Promise.allSettled(AD_SOURCES.map(id => getJSON(IA + '/metadata/' + encodeURIComponent(id)).then(j => buildGames({id, label:'Vintage commercial'}, j.files || [], false).filter(g => !g.len || g.len < 420))));
      rainDelay.pool = res.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    }
    if (!rainDelay.pool.length) { toast('The sponsors didn’t show. Back to the game.'); return; }
    const ad = Object.assign({}, rainDelay.pool[Math.floor(Math.random() * rainDelay.pool.length)], {kind:'ad'});
    stopYT(); $('ytWrap').hidden = true;
    S.cur = ad; S.delay = back;
    au.src = fileUrl(ad.ident, ad.file); au.dataset.start = 0;
    au.play().catch(() => toast('Tap play to hear the spot'));
    showNow(); render(true);
  } catch (e) { toast('The sponsors didn’t show. Back to the game.'); }
}

/* ---------- views ---------- */
function viewList() {
  const v = S.view;
  if (v.kind === 'year') return S.cat.filter(g => g.y === v.y);
  if (v.kind === 'cards') return S.cat.filter(isCards);
  if (v.kind === 'decade') return S.cat.filter(g => g.y >= v.from && g.y <= v.to);
  if (v.kind === 'today') return todayGames().list.slice().sort((a, b) => b.y - a.y);
  if (v.kind === 'ann') return S.cat.filter(g => annsOf(g).includes(v.name));
  if (v.kind === 'faves') {
    const fav = Object.values(S.favs).map(f => S.byId.get(f.id) || f);
    const viaAnn = S.cat.filter(g => !S.favs[g.id] && annsOf(g).some(a => S.annFav.includes(a)));
    return fav.concat(viaAnn);
  }
  if (v.kind === 'search') {
    const words = cleanQ(v.q).toLowerCase().replace(/\bcards\b/g, 'cardinals').replace(/\bws\b/g, 'world series').split(' ').filter(Boolean);
    return S.cat.filter(g => { const hay = (g.title + ' ' + g.y + ' ' + (g.mo ? MONTHS[g.mo - 1] : '') + ' ' + g.col + ' ' + annsOf(g).join(' ')).toLowerCase(); return words.every(w => hay.includes(w)); });
  }
  return [];
}
function nextInView() { const l = viewList(); const i = l.findIndex(g => S.cur && g.id === S.cur.id); return i >= 0 ? l[i + 1] : null; }
function heading() {
  const v = S.view;
  if (S.band === 'fm' && v.kind === 'fm') return 'FM · full games on YouTube';
  return {year:v.y + ' season', cards:'Cardinals games', decade:'The ' + String(v.from).slice(2) + 's', faves:'Your favorites', ann:v.name, search:'“' + v.q + '”'}[v.kind] ||
    (v.kind === 'today' ? (todayGames().exact ? 'On this date' : 'Around this date') : '');
}
function rowHtml(g) {
  const p = S.pos[g.id], pct = p && p.dur ? Math.min(100, Math.round(p.t / p.dur * 100)) : p && p.done ? 100 : 0;
  const cur = S.cur && S.cur.id === g.id;
  const anns = annsOf(g);
  const sub = [g.kind === 'item' ? 'archive.org upload' + (g.video ? ' (TV audio)' : '') : g.kind === 'yt' ? 'YouTube' : g.col, anns.join(', '), g.len ? hms(g.len) : ''].filter(Boolean).join(' · ');
  const star = g.kind === 'item' ? '' : '<button class="star' + (S.favs[g.id] ? ' on' : '') + '" data-star="' + esc(g.id) + '" aria-label="' + (S.favs[g.id] ? 'Unstar' : 'Star') + ' this game">' + (S.favs[g.id] ? '★' : '☆') + '</button>';
  return '<li class="' + (cur ? 'cur' : '') + '"><button class="row" data-play="' + esc(g.id) + '"><span class="d">' + esc(short(g)) + '<small>' + esc(g.mo ? g.y : '') + '</small></span><span class="t">' + esc(g.title) +
    '<span class="s">' + esc(sub) + '</span>' + (pct ? '<span class="bar"><i style="width:' + pct + '%"></i></span>' : '') + '</span></button>' + star + '</li>' +
    (g.kind === 'item' && S.kids[g.ident] && S.kids[g.ident].length > 1 ? S.kids[g.ident].map(rowHtml).join('') : '');
}
function stationRow(st) {
  const cur = S.cur && S.cur.kind === 'yt' && S.cur.station === st.key;
  return '<li class="' + (cur ? 'cur' : '') + '"><button class="row" data-station="' + st.key + '"><span class="d">FM<small>YouTube</small></span><span class="t">' + esc(st.label) + '<span class="s">' + esc((st.blurb ? st.blurb + ' · ' : '') + (st.by || RSR)) + ' · tap for a game</span></span></button><span></span></li>';
}
function render(soft) {
  const v = S.view;
  $('lTitle').textContent = heading();
  let rows = '', count = '', more = '';
  if (S.band === 'fm' && v.kind === 'fm') {
    const favYT = Object.values(S.favs).filter(f => f.kind === 'yt');
    rows = STATIONS.map(stationRow).join('') + (favYT.length ? '<li class="sub">Starred on FM</li>' + favYT.map(rowHtml).join('') : '');
    count = STATIONS.length + ' stations';
    more = '<p class="note">The video plays in the grille window. YouTube stops when the screen locks, so keep the phone awake for FM. AM keeps playing on the lock screen.</p>';
  } else {
    const list = viewList();
    if (v.kind === 'faves') {
      const favYT = list.filter(g => g.kind === 'yt');
      const am = list.filter(g => g.kind !== 'yt');
      const sts = STATIONS.filter(s => s.ann && S.annFav.includes(s.ann));
      const open = Object.keys(S.pos).filter(id => resumeAt(id)).sort((a, b) => S.pos[b].at - S.pos[a].at).slice(0, 5)
        .map(id => S.byId.get(id) || (S.last && S.last.id === id ? S.last : null) || S.favs[id]).filter(Boolean);
      rows = (open.length ? '<li class="sub">Pick up where you left off</li>' + open.map(rowHtml).join('') + (list.length || sts.length ? '<li class="sub">Starred</li>' : '') : '') +
        sts.map(stationRow).join('') + am.map(rowHtml).join('') + favYT.map(rowHtml).join('');
      if (!list.length && !sts.length && !open.length) rows = '<li class="empty">Tap ☆ on a game, or ♥ an announcer under “On the call”, and they collect here.</li>';
      count = list.length + ' games';
    } else {
      if (v.kind === 'ann') rows = STATIONS.filter(s => s.ann === v.name).map(stationRow).join('');
      rows += list.map(rowHtml).join('');
      count = list.length ? list.length + (list.length === 1 ? ' game' : ' games') : '';
      if (!list.length && !rows) rows = '<li class="empty">' + (S.loading ? 'Warming up the tubes… loading the archive.' : S.failed ? 'Couldn’t reach archive.org just now. The FM band still works.' : v.kind === 'year' ? 'No games from ' + v.y + ' in the big collections. Checking other uploads below.' : 'No games match that here.') + '</li>';
      const key = v.kind === 'year' ? 'y' + v.y : v.kind === 'search' ? 's' + v.q.toLowerCase() : '';
      const ex = key && S.extra[key];
      if (Array.isArray(ex) && ex.length) more = '<div class="sub">More archive.org uploads</div><ol class="list">' + ex.map(rowHtml).join('') + '</ol>';
      else if (ex === 'wait') more = '<p class="note">Checking other archive.org uploads…</p>';
      if (v.kind === 'search') more += '<p class="note"><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(cleanQ(v.q) + ' baseball radio broadcast') + '">Look for “' + esc(v.q) + '” on YouTube</a> (opens the YouTube app).</p>';
      if (v.kind === 'year' && list.length >= 5) more = '<p class="note"><button class="addann" id="season">▶ Play the ' + v.y + ' games in order</button></p>' + more;
    }
  }
  $('lCount').textContent = count; $('list').innerHTML = rows; $('more').innerHTML = more;
  const sb = $('season'); if (sb) sb.onclick = () => { const l = viewList(); if (l.length) { S.season = true; play(l[0]); toast('Playing ' + S.view.y + ' in order. The next game starts when one ends.'); } };
  renderCall();
}
function renderCall() {
  const g = S.cur, el = $('callbar');
  if (!g || g.kind === 'ad') { el.innerHTML = '<span class="cap">On the call</span><span class="note" style="margin:0">' + (g ? 'Commercial break' : 'Start a game to see or add its announcers.') + '</span>' + favAnnChips(); return; }
  const anns = annsOf(g), mine = S.tags[g.id] || [];
  el.innerHTML = '<span class="cap">On the call</span>' + anns.map(a => '<span class="chip">' + esc(a) + '<button class="' + (S.annFav.includes(a) ? 'fav' : '') + '" data-fav="' + esc(a) + '" aria-label="Favorite ' + esc(a) + '">' + (S.annFav.includes(a) ? '♥' : '♡') + '</button>' +
    (mine.includes(a) ? '<button data-untag="' + esc(a) + '" aria-label="Remove ' + esc(a) + '">×</button>' : '') + '</span>').join('') +
    '<button class="addann" id="addAnn">+ Add who’s calling it</button>' + favAnnChips(anns);
}
function favAnnChips(skip) {
  const rest = S.annFav.filter(a => !(skip || []).includes(a));
  return rest.length ? '<span class="note" style="width:100%;margin:6px 0 0">Favorite voices: ' + rest.map(a => '<button class="addann" data-annview="' + esc(a) + '">' + esc(a) + '</button>').join(' ') + '</span>' : '';
}
function showNow() {
  const g = S.cur; if (!g) return;
  if (g.kind === 'ad') { $('nowStar').hidden = true; $('rDate').innerHTML = '<span class="onair"></span>Rain delay'; $('rTitle').textContent = 'A word from our sponsors'; $('rMeta').textContent = g.title + ' · the game picks back up when it ends'; return; }
  $('rDate').innerHTML = '<span class="onair"></span>' + esc(g.kind === 'yt' ? (g.y ? 'FM · ' + g.y : 'FM · ' + (STATIONS.find(s => s.key === g.station) || {}).label) : fmtDate(g));
  $('rTitle').textContent = g.title;
  const anns = annsOf(g);
  $('rMeta').textContent = [g.col, anns.length ? anns.join(' & ') : ''].filter(Boolean).join(' · ');
  showStar();
}
function media(g) {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({title:g.title, artist:[fmtDate(g), annsOf(g).join(' & ')].filter(Boolean).join(' · '), album:'Ballgame Radio', artwork:[{src:'icon-512.png', sizes:'512x512', type:'image/png'}]});
  } catch (e) {}
}
if ('mediaSession' in navigator) {
  const ms = navigator.mediaSession, h = (a, f) => { try { ms.setActionHandler(a, f); } catch (e) {} };
  h('play', () => au.play()); h('pause', () => au.pause());
  h('seekbackward', () => skip(-30)); h('seekforward', () => skip(30)); h('nexttrack', () => nextGame());
}

/* ---------- dial ---------- */
let dialQuiet = 0, dialTimer = 0;
function buildDial() {
  const dial = $('dial');
  if (S.band === 'fm') {
    dial.innerHTML = STATIONS.map(s => '<button class="tick st" data-st="' + s.key + '" role="option"><b>' + esc(s.label) + '</b><span>YouTube</span></button>').join('');
    $('capL').textContent = 'FM · YouTube stations'; return;
  }
  const counts = {};
  S.cat.forEach(g => counts[g.y] = (counts[g.y] || 0) + 1);
  const ys = Object.keys(counts).map(Number);
  const lo = Math.min(1934, ...ys), hi = Math.max(1989, ...ys);
  let h = '';
  for (let y = lo; y <= hi; y++) h += '<button class="tick' + (counts[y] ? '' : ' empty') + '" data-y="' + y + '" role="option"><b>' + y + '</b><span>' + (counts[y] ? counts[y] : '') + '</span></button>';
  dial.innerHTML = h;
  $('capL').textContent = 'AM · archive.org';
  if (S.view.kind === 'year') dialTo(S.view.y, true);
}
function dialTo(key, instant) {
  const t = $('dial').querySelector(S.band === 'fm' ? '[data-st="' + key + '"]' : '[data-y="' + key + '"]');
  if (!t) return;
  dialQuiet = Date.now() + 1500;
  const d = $('dial');
  d.scrollTo({left:t.offsetLeft - d.clientWidth / 2 + t.offsetWidth / 2, behavior:instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
}
function centered() {
  const d = $('dial'), mid = d.scrollLeft + d.clientWidth / 2;
  let best = null, bd = 1e9;
  for (const t of d.children) { const c = t.offsetLeft + t.offsetWidth / 2, k = Math.abs(c - mid); if (k < bd) { bd = k; best = t; } }
  return best;
}
$('dial').addEventListener('scroll', () => {
  clearTimeout(dialTimer);
  dialTimer = setTimeout(() => {
    if (Date.now() < dialQuiet) return;
    const t = centered(); if (!t) return;
    tuneTick(t, false);
  }, 220);
}, {passive:true});
function tuneTick(t, tapped) {
  if (t.dataset.y) {
    const y = +t.dataset.y;
    if (S.view.kind !== 'year' || S.view.y !== y) setView({kind:'year', y});
    if (S.on) tuneYear(y);
  } else if (t.dataset.st) {
    if (S.view.kind !== 'fm') setView({kind:'fm'});
    if ((S.on || tapped) && !(S.cur && S.cur.kind === 'yt' && S.cur.station === t.dataset.st)) playYT({station:t.dataset.st, random:true});
  }
}
$('dial').addEventListener('click', e => {
  const t = e.target.closest('.tick'); if (!t) return;
  dialTo(t.dataset.y || t.dataset.st); setOn(true); tuneTick(t, true);
});
function stepDial(dir) {
  const c = centered(); if (!c) return;
  let t = dir > 0 ? c.nextElementSibling : c.previousElementSibling;
  if (S.band === 'am') while (t && t.classList.contains('empty')) t = dir > 0 ? t.nextElementSibling : t.previousElementSibling;
  if (!t) return;
  dialTo(t.dataset.y || t.dataset.st); tuneTick(t, true);
}
$('dPrev').onclick = () => stepDial(-1);
$('dNext').onclick = () => stepDial(1);

function setView(v) {
  S.view = v; S.season = false; if (v.kind !== 'search') $('q').value = '';
  document.querySelectorAll('.key').forEach(k => k.classList.toggle('on', k.dataset.k === v.preset));
  render();
  const key = v.kind === 'year' ? 'y' + v.y : v.kind === 'search' ? 's' + v.q.toLowerCase() : '';
  if (key && S.extra[key] === undefined && (v.kind === 'search' || viewList().length < 12)) {
    S.extra[key] = 'wait'; render(true);
    iaSearch(v.kind === 'search' ? cleanQ(v.q) : '', v.kind === 'year' ? v.y : 0)
      .then(r => { const ids = new Set(S.cat.map(g => g.ident)); S.extra[key] = r.filter(x => !ids.has(x.ident)).sort((a, b) => (a.y - b.y) || (a.mo - b.mo) || (a.d - b.d)); })
      .catch(() => { S.extra[key] = []; })
      .then(() => { if (S.view === v) render(true); });
  }
}
function setBand(b) {
  S.band = b; $('bAM').classList.toggle('sel', b === 'am'); $('bFM').classList.toggle('sel', b === 'fm');
  buildDial();
  if (b === 'fm') { setView({kind:'fm'}); dialTo((S.cur && S.cur.station) || 'buck', true); }
  else setView({kind:'year', y:(S.cur && S.cur.y) || (S.last && S.last.y) || 1974});
}

/* ---------- presets ---------- */
const PRESETS = [
  {k:'cards', label:'Cards', hint:'Cardinals', run(){ setBandQuiet('am'); setView({kind:'cards', preset:'cards'}); const l = viewList(); l.length ? playAM(pickFresh(l)) : playYT({station:'cards', random:true}); }},
  {k:'buck', label:'Buck', hint:'Jack Buck', run(){ setView({kind:'ann', name:'Jack Buck', preset:'buck'}); playYT({station:'buck', random:true}); }},
  {k:'70s', label:'’70s', hint:'1970 to ’79', run(){ setBandQuiet('am'); setView({kind:'decade', from:1970, to:1979, preset:'70s'}); const l = viewList(); l.length ? playAM(pickFresh(l)) : spin(); }},
  {k:'faves', label:'Faves', hint:'your stars', run(){ setView({kind:'faves', preset:'faves'}); const l = viewList(); const g = pickFresh(l); if (g) play(g); else if (S.annFav.includes('Jack Buck')) playYT({station:'buck', random:true}); else toast('Tap ☆ on a game or ♡ an announcer, and they collect here.'); }},
  {k:'today', label:'Today', hint:'this date', run(){ setBandQuiet('am'); setView({kind:'today', preset:'today'}); const tg = todayGames(); if (!tg.list.length) return; const same = tg.list.filter(g => g.mo === tg.m && g.d === tg.d); const f = freshOf(same); playAM(f.length ? pickW(f) : pickFresh(tg.list)); if (!tg.any) toast('No games on ' + MONTHS[tg.m - 1] + ' ' + tg.d + ' yet, so these are from the days around it.'); }},
  {k:'spin', label:'Spin', hint:'any game', run(){ spin(); }},
  {k:'next', label:'Next', hint:'new game', run(){ nextGame(); }},
  {k:'delay', label:'Rain delay', hint:'old ads', run(){ rainDelay(); }}
];
function setBandQuiet(b) { if (S.band !== b) { S.band = b; dialQuiet = Date.now() + 900; $('bAM').classList.toggle('sel', b === 'am'); $('bFM').classList.toggle('sel', b === 'fm'); buildDial(); } }
$('presets').innerHTML = PRESETS.map(p => '<button class="key" data-k="' + p.k + '"><b>' + p.label + '</b><small>' + p.hint + '</small></button>').join('');
$('presets').addEventListener('click', e => { const b = e.target.closest('.key'); if (!b) return; const p = PRESETS.find(x => x.k === b.dataset.k); if (p) { setOn(true); p.run(); } });

/* ---------- events ---------- */
$('power').onclick = () => S.on ? powerOff() : powerOn();
$('play').onclick = togglePlay;
$('back').onclick = () => skip(-30);
$('fwd').onclick = () => skip(30);
$('band').onclick = () => setBand(S.band === 'am' ? 'fm' : 'am');
let seeking = false;
const seek = $('seek');
seek.addEventListener('input', () => { seeking = true; seek.style.setProperty('--p', seek.value / 10 + '%'); const d = S.cur && S.cur.kind === 'yt' ? (S.yt && S.yt.getDuration ? S.yt.getDuration() : 0) : au.duration; $('tCur').textContent = hms(d * seek.value / 1000); });
seek.addEventListener('change', () => {
  seeking = false; if (!S.cur) return;
  if (S.cur.kind === 'yt') { if (S.yt && S.yt.seekTo) S.yt.seekTo(S.yt.getDuration() * seek.value / 1000, true); }
  else if (au.duration) au.currentTime = au.duration * seek.value / 1000;
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-play],[data-star],[data-station],[data-fav],[data-untag],[data-annview],#addAnn');
  if (!t) return;
  if (t.dataset.play) {
    const id = t.dataset.play;
    let g = S.byId.get(id) || Object.values(S.extra).flat().find(x => x && x.id === id) || S.favs[id] || (S.last && S.last.id === id ? S.last : null);
    if (!g) return;
    if (g.kind === 'yt') return playYT({kind:'yt', station:g.station, vid:g.vid, title:g.title, y:g.y});
    play(g);
  } else if (t.dataset.star) { toggleStar(t.dataset.star);
  } else if (t.dataset.station) { playYT({station:t.dataset.station, random:true});
  } else if (t.dataset.fav) {
    const a = t.dataset.fav; S.annFav = S.annFav.includes(a) ? S.annFav.filter(x => x !== a) : S.annFav.concat(a); sv('annfav', S.annFav);
    toast(S.annFav.includes(a) ? a + ' is a favorite. Spin and Faves lean toward those games now.' : a + ' removed from favorites.'); render(true);
  } else if (t.dataset.untag) {
    const g = S.cur; if (!g) return; S.tags[g.id] = (S.tags[g.id] || []).filter(x => x !== t.dataset.untag); sv('tags', S.tags); showNow(); render(true);
  } else if (t.dataset.annview) { setView({kind:'ann', name:t.dataset.annview});
  } else if (t.id === 'addAnn') { annForm(); }
});
function toggleStar(id) {
  if (S.favs[id]) { delete S.favs[id]; toast('Taken off your favorites.'); }
  else { const g = S.byId.get(id) || (S.cur && S.cur.id === id ? S.cur : null) || Object.values(S.extra).flat().find(x => x && x.id === id); if (g) { S.favs[id] = {kind:g.kind, id:g.id, ident:g.ident, file:g.file, title:g.title, y:g.y, mo:g.mo, d:g.d, col:g.col, len:g.len, vid:g.vid, station:g.station}; toast('Starred. Find it under Faves.'); } }
  sv('favs', S.favs); showStar(); render(true);
}
function showStar() {
  const b = $('nowStar'), g = S.cur;
  if (!g || g.kind === 'ad' || /^st:/.test(g.id)) { b.hidden = true; return; }
  const on = !!S.favs[g.id]; b.hidden = false; b.classList.toggle('on', on);
  b.textContent = on ? '★ Starred' : '☆ Star this game'; b.setAttribute('aria-pressed', on);
}
$('nowStar').onclick = () => { if (S.cur) toggleStar(S.cur.id); };
function annForm() {
  const el = $('callbar');
  el.innerHTML = '<form class="annform" id="annF"><input type="text" id="annIn" list="annList" placeholder="Who’s on the call?" autocomplete="off" aria-label="Announcer name"><button class="go" type="submit">Add</button></form><datalist id="annList">' + ANNOUNCERS.map(a => '<option value="' + esc(a) + '">').join('') + '</datalist>';
  const inp = $('annIn'); inp.focus();
  $('annF').onsubmit = e => {
    e.preventDefault(); const g = S.cur; const name = inp.value.replace(/\s+/g, ' ').trim().slice(0, 40);
    if (g && name) { const fixed = ANNOUNCERS.find(a => a.toLowerCase() === name.toLowerCase()) || name; S.tags[g.id] = [...new Set((S.tags[g.id] || []).concat(fixed))]; sv('tags', S.tags); showNow(); }
    render(true);
  };
}
$('sform').addEventListener('submit', e => { e.preventDefault(); const q = cleanQ($('q').value); if (!q) return; $('q').blur(); setBandQuiet('am'); setView({kind:'search', q}); });
let qTimer = 0;
$('q').addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { const q = cleanQ($('q').value); if (q.length > 2) { S.view = {kind:'search', q}; render(); } }, 250); });
addEventListener('pagehide', savePos);
document.addEventListener('visibilitychange', () => { if (document.hidden) savePos(); });

/* ---------- start ---------- */
if (S.last && S.last.y) S.view = {kind:'year', y:S.last.y};
if (freshResume(S.last)) $('rMeta').textContent = 'Turn it on to pick up ' + S.last.title + ' where you left off.';
else if (unfinished(S.last)) $('rMeta').textContent = 'Turn it on for a new game. ' + S.last.title + ' waits under Faves.';
setOn(false);
buildDial(); render();
loadCatalog(false).then(() => { buildDial(); render(); }).catch(() => { S.loading = false; S.failed = !S.cat.length; render(); });
}
