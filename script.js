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
                        Interchangeable
                    </label>
                </div>
            </div>
            <div class="exchange-status">
                <small>Click to toggle resolved</small>
            </div>
        `;
        
        exchangeDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('interchangeable-checkbox')) return;
            toggleExchangeResolved(i);
        });
        
        exchangeDiv.querySelector('.interchangeable-checkbox').addEventListener('change', (e) => {
            setInterchangeable(i, e.target.checked);
        });
        
        grid.appendChild(exchangeDiv);
    }
}

function addJudge() {
    if (judges >= 7) return; // Max 7 judges
    
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
}

function updateExchangeGrid() {
    document.querySelectorAll('.exchange-item').forEach((item, index) => {
        const exchange = exchanges[index];
        const num = index + 1;
        
        // Update interchangeable indicator
        const checkbox = item.querySelector('.interchangeable-checkbox');
        checkbox.checked = exchange.interchangeable;
        
        const interchangeableEl = item.querySelector('.interchangeable');
        if (exchange.interchangeable && !interchangeableEl) {
            const header = item.querySelector('.exchange-header');
            const badge = document.createElement('span');
            badge.className = 'interchangeable';
            badge.textContent = '🟡 Interchangeable';
            header.appendChild(badge);
        } else if (!exchange.interchangeable && interchangeableEl) {
            interchangeableEl.remove();
        }
        
        // Update resolved/dissenting status
        item.classList.toggle('resolved', exchange.resolved);
        item.classList.toggle('dissenting', !exchange.resolved);
    });
}

function getJudgesCalls() {
    const calls = [];
    document.querySelectorAll('.call-select').forEach(select => {
        if (select.value) {
            calls.push(select.value);
        }
    });
    return calls;
}

function calculateDifficulty(exchangeNum) {
    const exchange = exchanges[exchangeNum - 1];
    
    // Priority 1: Judges indicating interchangeability (highest priority)
    if (exchange.interchangeable) return 0;
    
    // Priority 2: Number of judges disagreeing (mock calculation)
    const disagreementScore = Math.random() * 3; // 0-3
    
    // Priority 3: Distance of benches (mock)
    const benchDistance = Math.random() * 2;
    
    // Priority 4: Top/bottom agreement (mock)
    const agreementScore = Math.random();
    
    // Priority 5: Exchange order (later = harder)
    const orderScore = (exchangeNum - 1) / 10;
    
    return disagreementScore + benchDistance + agreementScore + orderScore;
}

function calculateRecommendations() {
    const recommendationsEl = document.getElementById('recommendations');
    const finalCallEl = document.getElementById('finalCall');
    
    const calls = getJudgesCalls();
    if (calls.length === 0) {
        recommendationsEl.innerHTML = '<p>Enter judges\' calls to see recommendations!</p>';
        finalCallEl.innerHTML = '<p>Resolve all dissenting exchanges to see consensus call</p>';
        return;
    }
    
    // Calculate difficulties and sort exchanges
    const exchangeDifficulties = exchanges.map((exchange, index) => ({
        num: index + 1,
        difficulty: calculateDifficulty(index + 1),
        resolved: exchange.resolved,
        interchangeable: exchange.interchangeable

// SAME SCRIPT AS BEFORE + PWA
// ... (copy entire previous script.js) ...

// Add PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

// Update calculateRecommendations to use new classes
function calculateRecommendations() {
    // ... same logic ...
    
    // Update button classes
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.className = 'btn-neon btn-primary';
    });
    
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.className = 'btn-neon btn-secondary';
    });
    
    document.querySelectorAll('.btn-export').forEach(btn => {
        btn.className = 'btn-neon btn-export';
    });
}
