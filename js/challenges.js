// Static challenge set (client-only)
const challenges = [
  { id: 1, title: "Password Strength", desc: "What is the strongest password among: 'abc','Abc@123','password123'?", expected: "Abc@123", points: 50 },
  { id: 2, title: "SQL Injection Basics", desc: "Which input is vulnerable: 'admin' or \"' OR '1'='1\" ?", expected: "' OR '1'='1", points: 75 },
  { id: 3, title: "XSS Example", desc: "Identify which input is an XSS vector: '<script>alert(1)</script>' or 'hello'?", expected: "<script>alert(1)</script>", points: 60 }
];

let points = parseInt(localStorage.getItem('scorer_points')||'0', 10);
document.getElementById('currentPoints').textContent = points;

const listEl = document.getElementById('challenges-list');
const search = document.getElementById('challengeSearch');
const titleEl = document.getElementById('challenge-title');
const descEl = document.getElementById('challenge-desc');
const answerEl = document.getElementById('answer');
const submitBtn = document.getElementById('submitAnswer');
const showBtn = document.getElementById('autoSolve');
const resultMsg = document.getElementById('resultMsg');

function renderChallenges(filter='') {
  listEl.innerHTML = '';
  challenges.filter(c=>c.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(c=>{
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `<h4>${c.title}</h4><small>${c.points} pts</small>`;
      card.onclick = ()=>selectChallenge(c);
      listEl.appendChild(card);
    });
}
let current=null;
function selectChallenge(c){
  current=c;
  titleEl.textContent = c.title;
  descEl.textContent = c.desc;
  answerEl.value = '';
  resultMsg.textContent = '';
}
submitBtn.addEventListener('click', ()=>{
  if(!current){ resultMsg.textContent = 'Select a challenge first.'; return; }
  const user = answerEl.value.trim();
  if(!user){ resultMsg.textContent = 'Enter an answer.'; return; }
  if(user === current.expected){
    points += current.points;
    localStorage.setItem('scorer_points', points);
    document.getElementById('currentPoints').textContent = points;
    resultMsg.style.color = '#6efc9a';
    resultMsg.textContent = `✅ Correct! +${current.points} points`;
    // save to leaderboard store
    const lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
    lb.push({ name: 'You', score: points, time: Date.now() });
    localStorage.setItem('leaderboard', JSON.stringify(lb));
  } else {
    resultMsg.style.color = '#ff8b8b';
    resultMsg.textContent = `❌ Incorrect. Try again.`;
  }
});
showBtn.addEventListener('click', ()=>{
  if(!current) return resultMsg.textContent = 'Select a challenge first.';
  resultMsg.style.color = '#ffd36e';
  resultMsg.textContent = `Expected answer (for demo): ${current.expected}`;
});
search.addEventListener('input', (e)=> renderChallenges(e.target.value));
renderChallenges();
