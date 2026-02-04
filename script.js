// Проверка текущего пользователя
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userInfoDiv = document.querySelector('.user-info');

function updateUserUI() {
    if(currentUser){
        userInfoDiv.innerHTML = `<img src="${currentUser.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}"> ${currentUser.nickname}`;
        userInfoDiv.onclick = () => window.location.href='profile.html';
    } else {
        userInfoDiv.textContent = 'Войти';
        userInfoDiv.onclick = () => window.location.href='login.html';
    }
}
updateUserUI();

// Функции для login.html
function registerUser(nick, avatar){
    if(users.find(u=>u.nickname===nick)) return false;
    const newUser = {nickname:nick, avatar:avatar||'', friends:[]};
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
}

function loginUser(nick){
    const u = users.find(u=>u.nickname===nick);
    if(u){ localStorage.setItem('currentUser', JSON.stringify(u)); return true; }
    return false;
}

// Функции для profile.html
function addFriend(nick){
    const target = users.find(u=>u.nickname===nick);
    if(!target) return 'not found';
    if(currentUser.friends.includes(nick)) return 'already';
    currentUser.friends.push(nick);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    const index = users.findIndex(u=>u.nickname===currentUser.nickname);
    users[index] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    return 'added';
}
