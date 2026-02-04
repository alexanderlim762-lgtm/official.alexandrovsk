// Регистрация
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!nickname || !email || !password) return alert("Заполните все поля");

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.nickname === nickname)) return alert("Такой никнейм уже существует");

    users.push({ nickname, email, password, banned: false });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Аккаунт создан! Теперь войдите.");
    window.location.href = "login.html";
});

// Вход
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.nickname === nickname && u.password === password);

    if (!user) return alert("Неверный никнейм или пароль");
    if (user.banned) return alert("Ваш аккаунт заблокирован");

    // Сохраняем сессию
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert("Вы вошли!");
    window.location.href = "profile.html";
});
