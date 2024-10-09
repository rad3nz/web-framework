const owner_id = sessionStorage.getItem('owner_id');
const user_id = JSON.parse(sessionStorage.getItem('user_id'));
const level = sessionStorage.getItem('level');
const nama = sessionStorage.getItem('nama');

if (!owner_id || !user_id || !level || !nama) {
    window.location.href = 'login.html'; 
} else {
    const welcomeMessageSpan = document.getElementById('nameUser');
    welcomeMessageSpan.textContent = `${nama}`;
}

document.getElementById('logout').addEventListener('click', function() {
    sessionStorage.removeItem('owner_id');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('level');
    sessionStorage.removeItem('nama');

    // Redirect to login page
    window.location.href = 'login.html'; 
});