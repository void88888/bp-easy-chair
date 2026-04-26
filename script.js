let judges = 3;
let exchanges = Array(7).fill().map(() => ({
    interchangeable: false,
    resolved: false
}));

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initExchanges();
    updateExchangeGrid();
});

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    const toggle = document.querySelector('.theme-toggle');
    toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle').textContent = '☀️';
}

// Initialize exchange grid
function initExchanges() {
    const grid = document.getElementById('exchangeGrid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 7; i++) {
        const exchangeDiv = document.createElement('div');
        exchangeDiv.className = 'exchange-item';
        exchangeDiv.dataset.exchange = i;
        exchangeDiv.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-num">Exchange ${i}</div>
                <div class="interchangeable-toggle">
                    <label>
                        <input type="checkbox" class="interchangeable-checkbox">
                        <span>🟡 Interchangeable</span>
                    </label>
                </div>
            </div>
            <div class="exchange-status">
                <small>Click card to toggle resolved</small>
            </div>
        `;
        
        exchangeDiv.addEventListener('click', (e) => {
            if (e.target.closest('.interchangeable-checkbox') || 
                e.target.closest('.interchangeable-toggle')) return;
            toggleExchangeResolved(i);
        });
        
        exchangeDiv.querySelector('.interchangeable-checkbox').addEventListener('change', (e) => {
            setInterchangeable(i, e.target.checked);
        });
        
        grid.appendChild(exchangeDiv);
    }
}

function addJudge() {
    if (judges >= 7) {
        alert('Maximum 7 judges!');
        return;
    }
    
    judges++;
    const judgeDiv = document.createElement('div');
    judgeDiv.className = 'judge-row';
    judgeDiv.id = `judge${judges}`;
    judgeDiv.innerHTML = `
        <label>Judge ${judges}:</label>
        <select class="call-select">
            <option value="">Select call...</option>
            <option value="OG>OO>CG>CO">OG>OO>CG>CO</option>
            <option value="OG>CG>OO>CO">OG>CG>OO>CO</option>
            <option value="OO>OG>CG>CO">OO>OG>CG>CO</option>
            <option value="OO>OG>CO>CG">OO>OG>CO>CG</option>
            <option value="CG>OG>OO>CO">CG>OG>OO>CO</option>
            <option value="CG>OO>OG>CO">CG>OO>OG>CO</option>
            <option value="CO>CG>OO>OG">CO>CG>OO>OG</option>
            <option value="CO>OO>CG>OG">CO>OO>CG>OG</option>
        </select>
    `;
    
    document.querySelector('.judge-inputs').appendChild(judgeDiv);
}

function toggleExchangeResolved(exchangeNum) {
    exchanges[exchangeNum - 1].resolved = !exchanges[exchangeNum - 1].resolved;
    updateExchangeGrid();
    calculateRecommendations();
}

function setInterchangeable(exchangeNum, isInterchangeable) {
    exchanges[exchangeNum - 1].interchangeable = isInterchangeable;
    updateExchangeGrid();
    calculateRecommendations();
}

function updateExchangeGrid() {
    document.querySelectorAll('.exchange-item').forEach((item, index) => {
        const exchange = exchanges[index];
        const num = index + 1;
        
        // Update resolved status
        item.classList.toggle('resolved', exchange.resolved);
        item.classList.toggle('dissenting', !exchange.resolved);
        
        // Update interchangeable
        const checkbox = item.querySelector('.interchangeable-checkbox');
        checkbox.checked = exchange.interchangeable;
        
        const label = item.querySelector('.interchangeable-toggle span');
        label.style.opacity = exchange.interchangeable ? '1' : '0.6';
    });
}

function getJudgesCalls() {
    const calls = [];
    document.querySelectorAll('.call-select').forEach(select => {
        if (select.value) calls.push(select.value);
    });
    return calls;
}

function calculateDifficulty(exchangeNum) {
    const exchange = exchanges[exchangeNum - 1];
    
    // Priority 1: Interchangeable = easiest (0)
    if (exchange.interchangeable) return 0;
    
    // Mock realistic scoring
    const baseDifficulty = (exchangeNum - 1) * 0.5; // Later exchanges harder
    const disagreement = Math.random() * 3; // 0-3 judges disagreeing
    const benchDistance = Math.random() * 1.5;
    
    return baseDifficulty + disagreement + benchDistance;
}

function calculateRecommendations() {
    const recommendationsEl = document.getElementById('recommendations');
    const finalCallEl = document.getElementById('finalCall');
    
    const calls = getJudgesCalls();
    if (calls.length === 0) {
        recommendationsEl.innerHTML = '<p style="text-align:center;opacity:0.7">👆 Enter judges\' calls first!</p>';
        finalCallEl.innerHTML = '<p style="text-align:center;opacity:0.7">Resolve exchanges to see consensus!</p>';
        return;
    }
    
    // Calculate difficulties
    const unresolvedExchanges = exchanges
        .map((exchange, index) => ({
            num: index + 1,
            difficulty: calculateDifficulty(index + 1),
            resolved: exchange.resolved,
            interchangeable: exchange.interchangeable
        }))
        .filter(e => !e.resolved)
        .sort((a, b) => a.difficulty - b.difficulty); // Easy → Hard
    
    // Show recommendations
    if (unresolvedExchanges.length === 0) {
        recommendationsEl.innerHTML = '<p style="text-align:center;font-size:1.2rem">✅ All exchanges resolved!</p>';
        showConsensusCall(calls);
    } else {
        recommendationsEl.innerHTML = unresolvedExchanges.map((exchange, idx) => `
            <div class="recommendation-item">
                <span>Exchange ${exchange.num}</span>
                <div>
                    ${exchange.interchangeable ? '🟡 Interchangeable ' : ''}
                    <span class="priority-badge">#${idx + 1}</span>
                </div>
            </div>
        `).join('');
        
        finalCallEl.innerHTML = '<p style="text-align:center;opacity:0.7">Resolve highlighted exchanges first! ⬆️</p>';
    }
}

function showConsensusCall(calls) {
    const finalCallEl = document.getElementById('finalCall');
    
    // Simple majority consensus (mock)
    const mostCommonCall = calls.sort((a,b) =>
        calls.filter(v => v===b).length - calls.filter(v => v===a).length
    )[0];
    
    finalCallEl.innerHTML = `
        <div class="consensus-call">
            <div style="font-size:3rem;margin-bottom:1rem">🎉 CONSENSUS!</div>
            <div style="font-size:1.8rem;font-weight:700">${mostCommonCall}</div>
            <div style="opacity:0.8;margin-top:1rem">(${calls.length} judges agree)</div>
        </div>
    `;
    finalCallEl.classList.add('consensus');
}

function resetAll() {
    judges = 3;
    exchanges = Array(7).fill().map(() => ({interchangeable: false, resolved: false}));
    
    // Reset judges
    document.querySelector('.judge-inputs').innerHTML = `
        <div class="judge-row" id="judge1">
            <label>Judge 1:</label>
            <select class="call-select"><option value="">Select call...</option>...</select>
        </div>
        <div class="judge-row" id="judge2">
            <label>Judge 2:</label>
            <select class="call-select"><option value="">Select call...</option>...</select>
        </div>
        <div class="judge-row" id="judge3">
            <label>Judge 3:</label>
            <select class="call-select"><option value="">Select call...</option>...</select>
        </div>
    `;
    
    initExchanges();
    document.getElementById('recommendations').innerHTML = '<p>Enter judges\' calls and mark exchanges!</p>';
    document.getElementById('finalCall').classList.remove('consensus');
    document.getElementById('finalCall').innerHTML = '<p>Resolve all dissenting exchanges to see consensus call</p>';
}

function exportData() {
    const data = {
        judges: getJudgesCalls(),
        exchanges: exchanges,
        timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `easychair-deliberation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}
