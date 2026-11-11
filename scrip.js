// State Management
let state = {
    cash: 10000,
    bankLoan: 0,
    sharkLoan: 0,
    health: 100,
    day: 1,
    gachaCount: 0
};

// UI Update Function
function updateUI() {
    document.getElementById('val-cash').innerText = `$${state.cash.toLocaleString()}`;
    const totalDebt = state.bankLoan + state.sharkLoan;
    document.getElementById('val-debt').innerText = `$${totalDebt.toLocaleString()}`;
    
    // Calculate Daily Compound Interest
    const dailyInterest = Math.floor(state.bankLoan * 0.005 + state.sharkLoan * 0.10);
    document.getElementById('val-interest').innerText = `$${dailyInterest.toLocaleString()} /天`;

    const healthEl = document.getElementById('val-health');
    healthEl.innerText = `${state.health}%`;
    if (state.health < 40) healthEl.style.color = 'var(--accent-red)';
    else if (state.health < 70) healthEl.style.color = 'var(--accent-gold)';
    else healthEl.style.color = 'var(--accent-green)';

    document.getElementById('val-day').innerText = `第 ${state.day} 天`;

    checkBankruptcy();
}

// Logging Function
function log(msg, type = '') {
    const container = document.getElementById('game-logs');
    const item = document.createElement('div');
    item.className = `log-item ${type}`;
    item.innerText = `[天數:${state.day}] ${msg}`;
    container.insertBefore(item, container.firstChild);
}

// Navigation Tab Switcher
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
}

// Cash Validation Helper
function checkCash(amount) {
    if (isNaN(amount) || amount <= 0) {
        alert('請輸入有效的金額！');
        return false;
    }
    if (state.cash < amount) {
        alert('現金不足！你是否正在考慮前往「借錢/地下錢莊」借款翻本？（警惕：這正是破產陷阱的開始）');
        return false;
    }
    return true;
}

// 1. Sports Betting
function playSports() {
    const amount = parseInt(document.getElementById('sports-amount').value);
    if (!checkCash(amount)) return;

    state.cash -= amount;
    const pick = document.getElementById('sports-pick').value;
    const rand = Math.random();

    if (rand < 0.45 && pick === 'A') {
        const win = Math.floor(amount * 1.90);
        state.cash += win;
        log(`[體育] 主隊獲勝！贏得 $${win - amount}`, 'success');
    } else if (rand >= 0.45 && rand < 0.90 && pick === 'B') {
        const win = Math.floor(amount * 1.90);
        state.cash += win;
        log(`[體育] 客隊獲勝！贏得 $${win - amount}`, 'success');
    } else if (rand >= 0.90 && pick === 'D') {
        const win = Math.floor(amount * 3.10);
        state.cash += win;
        log(`[體育] 爆冷平局！贏得 $${win - amount}`, 'success');
    } else {
        log(`[體育] 預測失敗，損失 $${amount}`, 'danger');
        state.health = Math.max(0, state.health - 2);
    }
    updateUI();
}

// 2. Baccarat
function playBaccarat() {
    const amount = parseInt(document.getElementById('bac-amount').value);
    if (!checkCash(amount)) return;

    state.cash -= amount;
    const pick = document.getElementById('bac-pick').value;
    const rand = Math.random();

    const pCard = Math.floor(Math.random() * 9) + 1;
    const bCard = Math.floor(Math.random() * 9) + 1;
    document.getElementById('disp-baccarat').innerHTML = `<span>🂠 ${bCard}</span> vs <span>🂠 ${pCard}</span>`;

    if (rand < 0.458 && pick === 'banker') {
        const win = Math.floor(amount * 1.95);
        state.cash += win;
        log(`[百家樂] 莊勝！(抽水 5%) 獲得 $${win}`, 'success');
    } else if (rand >= 0.458 && rand < 0.904 && pick === 'player') {
        const win = amount * 2;
        state.cash += win;
        log(`[百家樂] 閒勝！獲得 $${win}`, 'success');
    } else if (rand >= 0.904 && pick === 'tie') {
        const win = amount * 9;
        state.cash += win;
        log(`[百家樂] 和局！獲得 $${win}`, 'success');
    } else {
        log(`[百家樂] 開牌落敗，損失 $${amount}`, 'danger');
        state.health = Math.max(0, state.health - 2);
    }
    updateUI();
}

// 3. Dice (Sic Bo)
function playDice() {
    const amount = parseInt(document.getElementById('dice-amount').value);
    if (!checkCash(amount)) return;

    state.cash -= amount;
    const pick = document.getElementById('dice-pick').value;
    
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const d3 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2 + d3;

    document.getElementById('disp-dice').innerText = `🎲 ${d1} ${d2} ${d3}`;
    document.getElementById('disp-dice-val').innerText = `總點數: ${sum}`;

    if (d1 === d2 && d2 === d3) {
        log(`[骰子] 豹子/圍骰 (${sum}點) 莊家通殺！損失 $${amount}`, 'danger');
        state.health = Math.max(0, state.health - 5);
    } else if ((sum >= 11 && pick === 'big') || (sum <= 10 && pick === 'small')) {
        state.cash += amount * 2;
        log(`[骰子] 猜中 ${sum > 10 ? '大' : '小'}！贏得 $${amount}`, 'success');
    } else {
        log(`[骰子] 猜錯大小，損失 $${amount}`, 'danger');
        state.health = Math.max(0, state.health - 2);
    }
    updateUI();
}

// 4. Roulette
function playRoulette() {
    const amount = parseInt(document.getElementById('rou-amount').value);
    if (!checkCash(amount)) return;

    state.cash -= amount;
    const pick = document.getElementById('rou-pick').value;
    const num = Math.floor(Math.random() * 38);

    const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num);
    const numStr = num === 37 ? '00' : num.toString();
    document.getElementById('disp-roulette').innerText = `🎡 [ ${numStr} ]`;

    if (pick === 'red' && isRed) {
        state.cash += amount * 2;
        log(`[輪盤] 開出紅號 ${numStr}！贏得 $${amount}`, 'success');
    } else if (pick === 'black' && !isRed && num !== 0 && num !== 37) {
        state.cash += amount * 2;
        log(`[輪盤] 開出黑號 ${numStr}！贏得 $${amount}`, 'success');
    } else {
        log(`[輪盤] 莊家落球至 ${numStr}，投注歸零，損失 $${amount}`, 'danger');
        state.health = Math.max(0, state.health - 2);
    }
    updateUI();
}

// 5. Slot Machine
function playSlots() {
    const amount = parseInt(document.getElementById('slot-amount').value);
    if (!checkCash(amount)) return;

    state.cash -= amount;
    const icons = ['🍒', '🍋', '🔔', '🍉', '💎', '7️⃣'];
    const i1 = icons[Math.floor(Math.random() * icons.length)];
    const i2 = icons[Math.floor(Math.random() * icons.length)];
    const i3 = icons[Math.floor(Math.random() * icons.length)];

    document.getElementById('disp-slots').innerText = `${i1} ${i2} ${i3}`;

    if (i1 === i2 && i2 === i3) {
        const win = amount * 10;
        state.cash += win;
        log(`[老虎機] 🎉 JACKPOT 大獎！獲得 $${win}`, 'success');
    } else if (i1 === i2 || i2 === i3 || i1 === i3) {
        const win = Math.floor(amount * 1.5);
        state.cash += win;
        log(`[老虎機] 湊成兩連圖，拿回 $${win}`, 'warning');
    } else {
        log(`[老虎機] 槓龜，拉桿金額 $${amount} 沒收`, 'danger');
    }
    updateUI();
}

// 6. Lottery
function playLottery() {
    const tickets = parseInt(document.getElementById('lottery-tickets').value);
    const cost = tickets * 100;
    if (!checkCash(cost)) return;

    state.cash -= cost;
    const winRand = Math.random();

    if (winRand < 0.00001) {
        state.cash += 500000;
        log(`[彩券] 奇蹟中頭獎！獲得 $500,000！`, 'success');
    } else if (winRand < 0.05) {
        state.cash += cost * 2;
        log(`[彩券] 中小獎！獲得 $${cost * 2}`, 'warning');
    } else {
        log(`[彩券] 購買的 ${tickets} 注彩券全部摃龜，損失 $${cost}`, 'danger');
    }
    updateUI();
}

// 7. Gacha / Blind Box
function playGacha() {
    const cost = 2000;
    if (!checkCash(cost)) return;

    state.cash -= cost;
    state.gachaCount += 10;
    document.getElementById('disp-gacha-count').innerText = `已累積抽卡: ${state.gachaCount} 次`;

    const rand = Math.random();
    if (rand < 0.05) {
        document.getElementById('disp-gacha').innerText = `✨ 抽中 UR 稀有卡片！`;
        log(`[網遊抽卡] 抽中 UR 稀有虛擬寶物！但虛擬物品無法變現。`, 'warning');
    } else {
        document.getElementById('disp-gacha').innerText = `📦 全部都是 N / R 垃圾道具`;
        log(`[網遊抽卡] 10 連抽全是垃圾道具，損失 $${cost}`, 'danger');
    }
    updateUI();
}

// 8. Loan & Loan Shark System
function takeLoan() {
    const type = document.getElementById('loan-type').value;
    const amount = parseInt(document.getElementById('loan-amount').value);

    if (isNaN(amount) || amount <= 0) return;

    if (type === 'bank') {
        if (amount > 5000) {
            alert('銀行審核拒絕：信用評分過低，最多僅能貸款 $5,000。');
            return;
        }
        state.bankLoan += amount;
        state.cash += amount;
        log(`[貸款] 成功向銀行借款 $${amount} (日利息 0.5%)`, 'warning');
    } else {
        state.sharkLoan += amount;
        state.cash += amount;
        state.health = Math.max(0, state.health - 20);
        log(`[⚠️高利貸] 簽約地下錢莊借款 $${amount}！日利息 10% 每日複利滾算！`, 'danger');
    }
    updateUI();
}

// Next Day & Interest Settlement
function nextDay() {
    state.day++;
    
    const bankInt = Math.floor(state.bankLoan * 0.005);
    const sharkInt = Math.floor(state.sharkLoan * 0.10);

    state.bankLoan += bankInt;
    state.sharkLoan += sharkInt;

    log(`[每日結算] 銀行利息 +$${bankInt}，高利貸複利 +$${sharkInt}`, 'warning');

    if (state.sharkLoan > 0) {
        state.health = Math.max(0, state.health - 15);
        log(`[⚠️黑道追債] 地下錢莊登門威脅討債，心理健康值大幅下降！`, 'danger');
    }

    updateUI();
}

// Check Bankruptcy Trigger
function checkBankruptcy() {
    const totalDebt = state.bankLoan + state.sharkLoan;
    if ((state.cash <= 0 && totalDebt > 0) || state.health <= 0) {
        document.getElementById('bankruptcy-modal').style.display = 'flex';
    }
}

// Reset Game State
function resetGame() {
    state = { cash: 10000, bankLoan: 0, sharkLoan: 0, health: 100, day: 1, gachaCount: 0 };
    document.getElementById('bankruptcy-modal').style.display = 'none';
    document.getElementById('game-logs').innerHTML = '<div class="log-item">模擬器已重置。記住：遠離賭博與高利貸，才是保障人生與財務安全的唯一途徑。</div>';
    updateUI();
}

// Initialize
window.onload = function() {
    updateUI();
};
