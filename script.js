// ===== Пользователи (данные) =====
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ===== РЕГИСТРАЦИЯ =====
function registerUser() {
    const email = document.getElementById('reg-email').value.trim();
    const nickname = document.getElementById('reg-nick').value.trim();
    const password = document.getElementById('reg-password').value;
    const avatarInput = document.getElementById('reg-avatar');

    if(!email || !nickname || !password){
        alert('Заполните все поля');
        return;
    }

    // Проверка уникальности никнейма
    if(users.find(u => u.nickname === nickname)){
        alert('Этот никнейм уже существует');
        return;
    }

    // Загрузка аватара
    let avatar = '';
    if(avatarInput.files && avatarInput.files[0]){
        const reader = new FileReader();
        reader.onload = function(e){
            avatar = e.target.result;
            saveUser(email, nickname, password, avatar);
        }
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        saveUser(email, nickname, password, '');
    }
}

function saveUser(email, nickname, password, avatar){
    const newUser = { email, nickname, password, avatar, about:'', friends:[], blocked:[], links:{youtube:'', telegram:'', discord:''}, requests:[] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна!');
    window.location.href = 'login.html';
}

// ===== ВХОД =====
function loginUser(){
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if(!user){
        alert('Неправильная почта или пароль');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = 'index.html';
}

// ===== ВЫХОД =====
function logoutUser(){
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===== ПРОФИЛЬ =====
function loadProfile(){
    if(!currentUser) return;

    document.getElementById('profile-avatar').src = currentUser.avatar || 'default-avatar.png';
    document.getElementById('profile-nick').value = currentUser.nickname;
    document.getElementById('profile-about').value = currentUser.about;
    document.getElementById('link-youtube').value = currentUser.links.youtube;
    document.getElementById('link-telegram').value = currentUser.links.telegram;
    document.getElementById('link-discord').value = currentUser.links.discord;

    renderFriends();
    renderFriendRequests();
}

// ===== СОХРАНЕНИЕ ПРОФИЛЯ =====
function saveProfile(){
    currentUser.nickname = document.getElementById('profile-nick').value;
    currentUser.about = document.getElementById('profile-about').value;
    currentUser.links.youtube = document.getElementById('link-youtube').value;
    currentUser.links.telegram = document.getElementById('link-telegram').value;
    currentUser.links.discord = document.getElementById('link-discord').value;

    const avatarInput = document.getElementById('profile-avatar-input');
    if(avatarInput.files && avatarInput.files[0]){
        const reader = new FileReader();
        reader.onload = function(e){
            currentUser.avatar = e.target.result;
            updateStorage();
        }
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        updateStorage();
    }
}

function updateStorage(){
    const index = users.findIndex(u=>u.email===currentUser.email);
    users[index] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Профиль обновлен!');
}

// ===== ДРУЗЬЯ =====
function renderFriends(){
    const list = document.getElementById('friends-list');
    list.innerHTML = '';
    currentUser.friends.forEach(f=>{
        const li = document.createElement('li');
        li.classList.add('friend-item');
        li.innerHTML = `${f} <button onclick="removeFriend('${f}')">Удалить</button>`;
        list.appendChild(li);
    });
}

function removeFriend(nick){
    currentUser.friends = currentUser.friends.filter(f=>f!==nick);
    updateStorage();
    renderFriends();
}

// ===== ЗАЯВКИ В ДРУЗЬЯ =====
function renderFriendRequests(){
    const list = document.getElementById('friend-requests');
    list.innerHTML = '';
    currentUser.requests.forEach(r=>{
        const li = document.createElement('li');
        li.classList.add('friend-item');
        li.innerHTML = `${r} <button onclick="acceptRequest('${r}')">Принять</button> <button onclick="declineRequest('${r}')">Отклонить</button>`;
        list.appendChild(li);
    });
}

function acceptRequest(nick){
    currentUser.friends.push(nick);
    currentUser.requests = currentUser.requests.filter(r=>r!==nick);
    const friend = users.find(u=>u.nickname===nick);
    if(friend) friend.friends.push(currentUser.nickname);
    updateStorage();
    renderFriends();
    renderFriendRequests();
}

function declineRequest(nick){
    currentUser.requests = currentUser.requests.filter(r=>r!==nick);
    updateStorage();
    renderFriendRequests();
}

// ===== ПОИСК ДРУЗЕЙ =====
function searchUser(){
    const searchNick = document.getElementById('search-nick').value.trim();
    const results = users.filter(u=>u.nickname.toLowerCase().includes(searchNick.toLowerCase()) && u.nickname !== currentUser.nickname);
    const list = document.getElementById('search-results');
    list.innerHTML = '';
    results.forEach(u=>{
        const li = document.createElement('li');
        li.innerHTML = `${u.nickname} <button onclick="sendFriendRequest('${u.nickname}')">+</button>`;
        list.appendChild(li);
    });
}

function sendFriendRequest(nick){
    const user = users.find(u=>u.nickname===nick);
    if(!user.requests.includes(currentUser.nickname)) user.requests.push(currentUser.nickname);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Заявка отправлена!');
        }
