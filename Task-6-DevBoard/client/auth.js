localStorage.clear()
const API = 'http://localhost:5000/api';

// Redirect if already logged in
if (localStorage.getItem('token')) {
  window.location.href = 'index.html';
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
}

async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) { errorEl.textContent = data.message; return; }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.name);
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = 'Server error. Is the server running?';
  }
}

async function register() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('reg-error');

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) { errorEl.textContent = data.message; return; }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.name);
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = 'Server error. Is the server running?';
  }
}