const API = 'http://localhost:5000/api/tasks';
const token = localStorage.getItem('token');
const userName = localStorage.getItem('userName');

if (!token) {
  window.location.href = 'auth.html';
}

document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  if (document.getElementById('github-container').dataset.locked) return;
  const container = document.getElementById('tasks-container');
  container.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px">Loading...</p>';
  
  try {
    const res = await fetch(API, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await res.json();
    container.innerHTML = '';
    document.getElementById('total-count').textContent = tasks.length;
    document.getElementById('done-count').textContent = tasks.filter(t => t.status === 'done').length;
    if (tasks.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="icon">📋</div><p>No tasks yet!</p></div>`;
      return;
    }
    tasks.forEach(task => renderTask(task));
  } catch (err) {
    container.innerHTML = '<p style="text-align:center;color:#c0392b;padding:40px">Error loading tasks.</p>';
  }
}

function renderTask(task) {
  const container = document.getElementById('tasks-container');
  const nextStatus = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
  const card = document.createElement('div');
  card.className = 'task-card';
  card.id = `task-${task._id}`;
  card.innerHTML = `
    <div class="task-info">
      <h3>${task.title}</h3>
      <p>${task.description || 'No description'}</p>
      <div class="task-meta">
        <span class="badge priority-${task.priority}">${task.priority}</span>
        <span class="badge status-${task.status}" id="status-${task._id}">${task.status}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-status" id="btn-${task._id}" onclick="updateStatus('${task._id}', '${nextStatus[task.status]}')">
        → ${nextStatus[task.status]}
      </button>
      <button class="btn-delete" onclick="deleteTask('${task._id}')">Delete</button>
    </div>
  `;
  container.appendChild(card);
}

async function addTask() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const priority = document.getElementById('priority').value;
  if (!title) { alert('Please enter a task title!'); return; }
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title, description, priority })
    });
    const task = await res.json();
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('priority').value = 'medium';
    renderTask(task);
    document.getElementById('total-count').textContent = 
      parseInt(document.getElementById('total-count').textContent) + 1;
  } catch (err) {
    alert('Error adding task!');
  }
}

async function updateStatus(id, newStatus) {
  const nextStatus = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
  try {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    document.getElementById(`status-${id}`).textContent = newStatus;
    document.getElementById(`status-${id}`).className = `badge status-${newStatus}`;
    document.getElementById(`btn-${id}`).textContent = `→ ${nextStatus[newStatus]}`;
    document.getElementById(`btn-${id}`).onclick = () => updateStatus(id, nextStatus[newStatus]);
    document.getElementById('done-count').textContent = 
      [...document.querySelectorAll('[id^="status-"]')].filter(e => e.textContent === 'done').length;
  } catch (err) {
    alert('Error updating task!');
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    await fetch(`${API}/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    document.getElementById(`task-${id}`).remove();
    document.getElementById('total-count').textContent = 
      parseInt(document.getElementById('total-count').textContent) - 1;
  } catch (err) {
    alert('Error deleting task!');
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'auth.html';
}

async function fetchGithub() {
  const username = document.getElementById('github-username').value.trim();
  const container = document.getElementById('github-container');
  if (!username) return;
  container.innerHTML = '<p class="github-placeholder">Loading...</p>';
  
  // Store github data so loadTasks can't wipe it
  container.dataset.locked = 'true';
  try {
    const res = await fetch(`http://localhost:5000/api/github/${username}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    if (res.status >= 400) {
      const err = await res.json();
      container.innerHTML = `<p class="github-placeholder">${err.message}</p>`;
      return;
    }
    const data = await res.json();
    container.innerHTML = `
      <div class="github-profile">
        <img src="${data.user.avatar}" alt="${data.user.name}">
        <div class="github-profile-info">
          <h3>${data.user.name || username}</h3>
          <p>${data.user.bio || 'No bio available'}</p>
        </div>
        <div class="github-profile-stats">
          <div class="github-stat"><span>${data.user.followers}</span><p>Followers</p></div>
          <div class="github-stat"><span>${data.user.public_repos}</span><p>Repos</p></div>
        </div>
      </div>
      <div class="repos-grid">
        ${data.repos.map(repo => `
          <a href="${repo.url}" target="_blank" class="repo-card">
            <h4>${repo.name}</h4>
            <p>${repo.description || 'No description'}</p>
            <div class="repo-meta">
              <span class="repo-lang">${repo.language || 'N/A'}</span>
              <span>⭐ ${repo.stars}</span>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<p class="github-placeholder">Error fetching GitHub data.</p>';
  }
}