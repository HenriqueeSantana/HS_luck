

const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');

// Pré-cadastrar usuários
if (!localStorage.getItem('users')) {
    const users = {
        henrique: { password: '123' },
        juan: { password: '123' }
    };
    localStorage.setItem('users', JSON.stringify(users));
}

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        loginMessage.style.color = '#FF5555';
        loginMessage.textContent = 'Preencha todos os campos!';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        loginMessage.style.color = '#00FF00';
        loginMessage.textContent = 'Login realizado com sucesso!';
        setTimeout(() => {
            window.location.href = 'index.html'; // Redireciona para o jogo
        }, 1000);
    } else {
        loginMessage.style.color = '#FF5555';
        loginMessage.textContent = 'Usuário ou senha incorretos!';
    }
});
