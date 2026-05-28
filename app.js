// 운명전쟁 App Logic
const APP = {
  currentScreen: 'splash',
  selectedStock: null,
  selectedSlot: null,
  selectedDir: null,
  selectedRange: null,
  leagueTab: 'regular',
};

// Sample Data
const STOCKS = [
  {name:'삼성전자',code:'005930',price:82300,change:2.3},
  {name:'SK하이닉스',code:'000660',price:178500,change:-1.2},
  {name:'NAVER',code:'035420',price:215000,change:0.8},
  {name:'카카오',code:'035720',price:42500,change:-2.1},
  {name:'현대차',code:'005380',price:245000,change:1.5},
  {name:'셀트리온',code:'068270',price:198000,change:3.2},
  {name:'LG에너지솔루션',code:'373220',price:365000,change:-0.5},
  {name:'테슬라',code:'TSLA',price:285.5,change:4.1},
];

const SLOTS = [
  {stock:'삼성전자',type:'⚡',typeName:'단타',dir:'up',change:'+2.3%',dday:'D-1',opinion:'반도체 호재 기대'},
  {stock:'SK하이닉스',type:'⏳',typeName:'스윙',dir:'down',change:'-1.0%',dday:'D-3',opinion:'수급 악화'},
  {stock:'NAVER',type:'⛰️',typeName:'장기',dir:'up',change:'+5.0%',dday:'D-15',opinion:'AI 사업 확대'},
];

const LEAGUE = [
  {name:'작두달인_박씨',tier:'diamond',emoji:'💎',winrate:78,streak:12,recent:'WWWWW'},
  {name:'신내림_이씨',tier:'platinum',emoji:'🔮',winrate:73,streak:9,recent:'WWWLW'},
  {name:'예언자_최씨',tier:'gold',emoji:'⭐',winrate:71,streak:7,recent:'WLWWW'},
  {name:'나',tier:'gold',emoji:'🏆',winrate:68,streak:5,recent:'WWWLW',isMe:true},
  {name:'촉이좋은_김씨',tier:'silver',emoji:'🌙',winrate:62,streak:3,recent:'WLWLW'},
  {name:'감이온다_정씨',tier:'silver',emoji:'✨',winrate:58,streak:2,recent:'LWWLW'},
  {name:'대박기원_한씨',tier:'bronze',emoji:'🙏',winrate:52,streak:1,recent:'LLWWL'},
];

const FROG_LEAGUE = [
  {name:'완벽한지표_오씨',tier:'diamond',emoji:'🐸',winrate:95,streak:20,recent:'LLLLL'},
  {name:'역신_강씨',tier:'platinum',emoji:'🔄',winrate:88,streak:15,recent:'LLLLW'},
  {name:'한강뷰_송씨',tier:'gold',emoji:'🥶',winrate:82,streak:10,recent:'LLLWL'},
];

const GUESTBOOK = [
  {author:'무당조수_A',text:'이 집 작두 잘 타네 🔥',emoji:'😎'},
  {author:'한강러버',text:'한강물 차갑다 인간아 🥶',emoji:'🐸'},
  {author:'주식고수',text:'무당 그 자체 ㄷㄷ',emoji:'🙏'},
  {author:'개미전사',text:'따라 사볼까 ㅋㅋ',emoji:'🐜'},
  {author:'세력추종자',text:'이 사람 세력임?',emoji:'👀'},
];

// Navigation
function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    APP.currentScreen = screenId;
  }
  // Update tab bar
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const tabMap = {'home':'tab-home','divine':'tab-divine','league':'tab-league','shrine':'tab-shrine','mypage':'tab-my'};
  const tab = document.getElementById(tabMap[screenId]);
  if (tab) tab.classList.add('active');
}

function enterApp() {
  navigate('home');
}

// Stock Search
function filterStocks(query) {
  const list = document.getElementById('stock-search-results');
  if (!list) return;
  const filtered = STOCKS.filter(s => s.name.includes(query) || s.code.includes(query));
  list.innerHTML = filtered.map(s => `
    <div class="slot-card ${s.change>=0?'up':'down'}" onclick="selectStock('${s.name}','${s.code}',${s.price},${s.change})">
      <div class="slot-info">
        <div class="slot-name">${s.name}</div>
        <div class="slot-dir" style="color:var(--text-dim)">${s.code}</div>
      </div>
      <div class="slot-meta">
        <div class="slot-change">${s.change>=0?'+':''}${s.change}%</div>
        <div class="slot-time">₩${s.price.toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

function selectStock(name, code, price, change) {
  APP.selectedStock = {name, code, price, change};
  navigate('divine-slot');
  document.getElementById('selected-stock-name').textContent = `${name} (${code})`;
  document.getElementById('selected-stock-price').textContent = `₩${price.toLocaleString()}`;
  // Mini chart
  const chart = document.getElementById('stock-mini-chart');
  const bars = Array.from({length:20}, () => Math.random()*50+10);
  chart.innerHTML = bars.map(h => `<div class="bar" style="height:${h}%"></div>`).join('');
}

function selectQuickStock(name) {
  const s = STOCKS.find(st => st.name === name);
  if (s) selectStock(s.name, s.code, s.price, s.change);
}

// Slot Type
function selectSlotType(type) {
  APP.selectedSlot = type;
  document.querySelectorAll('.slot-type-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function goToOpinion() {
  if (!APP.selectedSlot) { APP.selectedSlot = 'short'; }
  navigate('divine-opinion');
  const typeNames = {short:'⚡단타 (내일 장마감)',swing:'⏳스윙 (D+3~5)',long:'⛰️장기 (D+20)'};
  document.getElementById('opinion-slot-type').textContent = `슬롯: ${typeNames[APP.selectedSlot]}`;
  document.getElementById('opinion-stock-name').textContent = APP.selectedStock ? `${APP.selectedStock.name} (${APP.selectedStock.code})` : '삼성전자 (005930)';
  document.getElementById('opinion-stock-price').textContent = APP.selectedStock ? `₩${APP.selectedStock.price.toLocaleString()}` : '₩82,300';
}

function toggleKeyword(el) {
  el.classList.toggle('active');
}

// AI Preview
function goToAIPreview() {
  navigate('ai-preview');
  const opinion = document.getElementById('opinion-text')?.value || '반도체 호재 기대, 상승 예상';
  document.getElementById('ai-opinion-echo').textContent = opinion;
}

function selectDirection(dir) {
  APP.selectedDir = dir;
  document.querySelectorAll('.dir-buttons .btn').forEach(b => {
    b.style.opacity = '0.4'; b.style.transform = 'scale(0.95)';
  });
  event.currentTarget.style.opacity = '1';
  event.currentTarget.style.transform = 'scale(1.05)';
  document.getElementById('range-section').style.display = 'block';
  // Update range button labels based on direction
  const sign = dir === 'up' ? '+' : '-';
  const rangeBtns = document.querySelectorAll('.range-btn');
  if (rangeBtns.length >= 3) {
    rangeBtns[0].textContent = `${sign}1~3%`;
    rangeBtns[1].textContent = `${sign}3~5%`;
    rangeBtns[2].textContent = `${sign}5% 이상`;
  }
}

function selectRange(range) {
  APP.selectedRange = range;
  document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

// Deploy
function deploy() {
  navigate('deploy-complete');
  const stockName = APP.selectedStock?.name || '삼성전자';
  const dirText = APP.selectedDir === 'up' ? '상승' : '하락';
  document.getElementById('charm-stock').textContent = stockName;
  document.getElementById('charm-dir').textContent = `${dirText} 점사 완료`;
  document.getElementById('charm-share-text').textContent = `${stockName} 내일 ${dirText} 점사 완료 🔮`;
  launchConfetti();
}

function launchConfetti() {
  const container = document.getElementById('confetti');
  container.innerHTML = '';
  const colors = ['#FF4757','#2E6FF2','#FFD700','#00ced1','#ff6b81','#7bed9f'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random()*100+'%';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay = Math.random()*1+'s';
    piece.style.animationDuration = (1.5+Math.random())+'s';
    piece.style.borderRadius = Math.random()>0.5?'50%':'2px';
    piece.style.width = (6+Math.random()*8)+'px';
    piece.style.height = (6+Math.random()*8)+'px';
    container.appendChild(piece);
  }
  setTimeout(() => container.innerHTML = '', 3000);
}

// Result
function showResult() {
  navigate('result');
}

// League Tab
function switchLeagueTab(tab) {
  APP.leagueTab = tab;
  document.querySelectorAll('#league .tab-switch button').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderLeague();
}

function renderLeague() {
  const list = document.getElementById('league-list');
  const data = APP.leagueTab === 'regular' ? LEAGUE : FROG_LEAGUE;
  const label = APP.leagueTab === 'regular' ? '승률' : '역승률';
  list.innerHTML = data.map((u, i) => `
    <div class="league-card" onclick="navigate('user-detail')" style="${u.isMe?'border:1px solid var(--accent);background:rgba(46,111,242,0.08)':''}">
      <div class="league-rank ${i===0?'top1':i===1?'top2':i===2?'top3':''}">${i+1}</div>
      <div class="league-avatar">${u.emoji}</div>
      <div class="league-info">
        <div class="league-name">${u.name} ${u.isMe?'(나)':''}</div>
        <div class="league-stats"><span class="tier-badge tier-${u.tier}">${u.tier.toUpperCase()}</span> 연속${u.streak}적중</div>
      </div>
      <div class="league-winrate" style="color:${APP.leagueTab==='regular'?'var(--up)':'var(--down)'}">${u.winrate}%</div>
    </div>
  `).join('');
}

// Guestbook
function renderGuestbook() {
  const list = document.getElementById('guestbook-list');
  list.innerHTML = GUESTBOOK.map(g => `
    <div class="gb-item">
      <div class="gb-avatar">${g.emoji}</div>
      <div class="gb-content">
        <div class="gb-author">${g.author}</div>
        <div class="gb-text">${g.text}</div>
      </div>
    </div>
  `).join('');
}

function addGuestbook() {
  const input = document.getElementById('gb-input');
  const text = input.value.trim();
  if (!text || text.length > 30) return;
  GUESTBOOK.unshift({author:'나', text, emoji:'🙋'});
  input.value = '';
  renderGuestbook();
}

// Init
function initApp() {
  // Stock search
  const searchInput = document.getElementById('stock-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterStocks(e.target.value));
    filterStocks('');
  }
  renderLeague();
  renderGuestbook();
}

document.addEventListener('DOMContentLoaded', initApp);

// Theme Toggle
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('theme-toggle');
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  btn.textContent = isLight ? '☀️' : '🌙';
  btn.title = isLight ? '다크모드로 전환' : '라이트모드로 전환';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  syncDarkModeLabel();
}

function syncDarkModeLabel() {
  const isLight = document.body.classList.contains('light');
  const label = document.getElementById('darkmode-status');
  if (label) {
    label.textContent = isLight ? 'OFF' : 'ON';
    label.style.color = isLight ? 'var(--text-dim)' : 'var(--accent)';
  }
}

// Load saved theme
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    const btn = document.getElementById('theme-toggle');
    if (btn) { btn.textContent = '☀️'; btn.title = '다크모드로 전환'; }
  }
  // Sync on page load after DOM is ready
  document.addEventListener('DOMContentLoaded', syncDarkModeLabel);
})();
