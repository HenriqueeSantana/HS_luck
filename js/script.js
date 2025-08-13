// ==========================
// Inicialização
// ==========================
let points = parseInt(localStorage.getItem('points')) || 1000;
let best = parseInt(localStorage.getItem('best')) || points;
let bonusClaimed = localStorage.getItem('bonusClaimed') === new Date().toDateString();

const pointsValue = document.getElementById('pointsValue');
const bestValue = document.getElementById('bestValue');
const bonusBtn = document.getElementById('bonusBtn');
const historyList = document.getElementById('historyList');

updateDisplay();
updateBonusButton();

// ==========================
// Atualizar Tela
// ==========================
function updateDisplay(change = 0) {
    pointsValue.textContent = points;
    bestValue.textContent = best;
    if (change !== 0) {
        const className = change > 0 ? 'up' : 'down';
        pointsValue.classList.add(className);
        setTimeout(() => pointsValue.classList.remove(className), 800);
    }
}

// ==========================
// Histórico
// ==========================
function addHistory(text) {
    const div = document.createElement('div');
    div.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
    div.style.opacity = 0;
    historyList.prepend(div);
    setTimeout(() => div.style.opacity = 1, 50);
}

// ==========================
// Toast
// ==========================
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// ==========================
// Alternar Jogos
// ==========================
const gameSelect = document.getElementById('gameSelect');
const cards = {
    flip: document.getElementById('card-flip'),
    dice: document.getElementById('card-dice'),
    wheel: document.getElementById('card-wheel')
};

function showGame(game) {
    for (const key in cards) {
        if (cards[key]) cards[key].style.display = key === game ? 'block' : 'none';
    }
}
showGame('flip'); // inicia com Cara ou Coroa

gameSelect.addEventListener('change', () => {
    showGame(gameSelect.value);
});

// ==========================
// Bônus Diário
// ==========================
bonusBtn.addEventListener('click', () => {
    const today = new Date().toDateString();
    if (bonusClaimed) return;
    const bonus = 100;
    points += bonus;
    bonusClaimed = true;
    localStorage.setItem('points', points);
    localStorage.setItem('bonusClaimed', today);
    addHistory(`Bônus diário: +${bonus} pontos`);
    updateDisplay(bonus);
    updateBonusButton();
    showToast(`Bônus diário coletado: +${bonus} pontos`);
});

function updateBonusButton() {
    if (bonusClaimed) {
        bonusBtn.disabled = true;
        bonusBtn.textContent = 'Resgatado';
    } else {
        bonusBtn.disabled = false;
        bonusBtn.textContent = 'Resgatar Bônus';
    }
}

// ==========================
// Reiniciar Pontos
// ==========================
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Deseja realmente reiniciar seus pontos?')) {
        points = 1000;
        best = 1000;
        localStorage.setItem('points', points);
        localStorage.setItem('best', best);
        addHistory('Pontos reiniciados');
        updateDisplay();
    }
});

// ==========================
// Função de aposta segura
// ==========================
function safeBet(bet) {
    bet = Math.min(bet, points);
    if (bet <= 0) {
        showToast("Você não tem pontos suficientes!");
        return null;
    }
    return bet;
}

// ==========================
// Cara ou Coroa
// ==========================
let selectedFlip = null;
document.getElementById('btnCara').addEventListener('click', () => selectFlip('cara'));
document.getElementById('btnCoroa').addEventListener('click', () => selectFlip('coroa'));

function selectFlip(choice) {
    selectedFlip = choice;
    document.getElementById('btnCara').classList.toggle('active', choice === 'cara');
    document.getElementById('btnCoroa').classList.toggle('active', choice === 'coroa');
}

document.getElementById('playFlip').addEventListener('click', () => {
    if (!selectedFlip) { showToast('Escolha Cara ou Coroa!'); return; }

    let bet = parseInt(document.getElementById('betInput').value) || 50;
    bet = safeBet(bet);
    if (!bet) return;

    const outcome = Math.random() < 0.6 ? (selectedFlip === 'cara' ? 'coroa' : 'cara') : selectedFlip;
    const el = document.getElementById('flipResult');

    setTimeout(() => {
        if (selectedFlip === outcome) {
            points += bet;
            addHistory(`Ganhou Cara ou Coroa: +${bet}`);
            showToast(`Você ganhou +${bet} pontos 🎉`);
            el.textContent = `Saiu ${outcome}! Você ganhou +${bet} pontos 🎉`;
            updateDisplay(bet);
        } else {
            points -= bet;
            addHistory(`Perdeu Cara ou Coroa: -${bet}`);
            showToast(`Você perdeu -${bet} pontos 😢`);
            el.textContent = `Saiu ${outcome}. Você perdeu -${bet} pontos 😢`;
            updateDisplay(-bet);
        }
        if (points < 0) points = 0;
        if (points > best) best = points;
        localStorage.setItem('points', points);
        localStorage.setItem('best', best);
        checkAchievements();
    }, 500);
});

// ==========================
// Dado
// ==========================
let selectedDice = null;
document.querySelectorAll('#card-dice .toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedDice = parseInt(btn.dataset.choice);
        document.querySelectorAll('#card-dice .toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.getElementById('playDice').addEventListener('click', () => {
    if (!selectedDice) { showToast('Escolha um número!'); return; }

    let bet = parseInt(document.getElementById('betInput').value) || 50;
    bet = safeBet(bet);
    if (!bet) return;

    let outcome = Math.floor(Math.random() * 6) + 1;
    if (Math.random() < 0.6 && selectedDice === outcome) {
        outcome = selectedDice === 6 ? 5 : selectedDice + 1;
    }

    const el = document.getElementById('diceResult');
    setTimeout(() => {
        if (selectedDice === outcome) {
            points += bet * 6;
            addHistory(`Ganhou Dado: +${bet*6}`);
            showToast(`Você ganhou +${bet*6} pontos 🎉`);
            el.textContent = `Saiu ${outcome}! Você ganhou +${bet*6} pontos 🎉`;
            updateDisplay(bet*6);
        } else {
            points -= bet;
            addHistory(`Perdeu Dado: -${bet}`);
            showToast(`Você perdeu -${bet} pontos 😢`);
            el.textContent = `Saiu ${outcome}. Você perdeu -${bet} pontos 😢`;
            updateDisplay(-bet);
        }
        if (points < 0) points = 0;
        if (points > best) best = points;
        localStorage.setItem('points', points);
        localStorage.setItem('best', best);
        checkAchievements();
    }, 500);
});

// ==========================
// Roda de multiplicadores
// ==========================
document.getElementById('playWheel').addEventListener('click', () => {
    let bet = parseInt(document.getElementById('betInput').value) || 50;
    bet = safeBet(bet);
    if (!bet) return;

    const multipliers = [0,0,1,1,2,3,5];
    const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const winAmount = bet * multiplier;
    points = points - bet + winAmount;
    if (points < 0) points = 0;

    const el = document.getElementById('wheelResult');
    setTimeout(() => {
        if (winAmount > 0) {
            addHistory(`Ganhou Roda: +${winAmount} (x${multiplier})`);
            showToast(`Ganhou +${winAmount} pontos 🎉`);
            el.textContent = `Multiplicador x${multiplier}! +${winAmount} pontos 🎉`;
            updateDisplay(winAmount);
        } else {
            addHistory(`Perdeu Roda: -${bet}`);
            showToast(`Você perdeu -${bet} pontos 😢`);
            el.textContent = `Multiplicador x${multiplier}. Você perdeu ${bet} pontos 😢`;
            updateDisplay(-bet);
        }
        if (points > best) best = points;
        localStorage.setItem('points', points);
        localStorage.setItem('best', best);
        checkAchievements();
    }, 500);
});

// ==========================
// Conquistas
// ==========================
function checkAchievements() {
    if (points >= 1000) document.getElementById('ach-first').classList.add('active');
    if (points >= 5000) document.getElementById('ach-big').classList.add('active');
    if (points >= 5000) document.getElementById('ach-rich').classList.add('active');
}

// ======== Verificar usuário ========
const headerRight = document.querySelector('.header-right');
const currentUser = localStorage.getItem('currentUser');

if (currentUser) {
    // Esconder botões de login e cadastrar
    const loginBtnHeader = document.querySelector('.btn-login');
    const registerBtnHeader = document.querySelector('.btn-register');
    if (loginBtnHeader) loginBtnHeader.style.display = 'none';
    if (registerBtnHeader) registerBtnHeader.style.display = 'none';

    // Cria div para mostrar o nome
    const userDisplay = document.createElement('span');
    userDisplay.textContent = `Olá, ${currentUser}!`;
    userDisplay.className = 'user-display';
    headerRight.appendChild(userDisplay);

    // Cria botão sair
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Sair';
    logoutBtn.className = 'btn logout-btn';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
    headerRight.appendChild(logoutBtn);
} else {
    window.location.href = 'login.html';
}
