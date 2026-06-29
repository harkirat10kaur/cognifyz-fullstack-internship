const API = 'http://localhost:5000/api/tasks';

// Load tasks on page load
window.onload = loadTasks;

async function loadTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px">Loading tasks...</p>';
    
    try {
      const res = await fetch(API);
      const tasks = await res.json();
      
      container.innerHTML = '';
      
      // UPDATE STATS
      document.getElementById('total-count').textContent = tasks.length;
      document.getElementById('done-count').textContent = tasks.filter(t => t.status === 'done').length;
      
      if (tasks.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="icon">📋</div>
            <p>No tasks yet. Add your first task above!</p>
          </div>`;
        return;
      }
      
      tasks.forEach(task => renderTask(task));
    } catch (err) {
      container.innerHTML = '<p style="text-align:center;color:#c0392b;padding:40px">Error loading tasks. Is the server running?</p>';
    }
  }

function renderTask(task) {
  const container = document.getElementById('tasks-container');
  const nextStatus = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': 'todo'
  };

  const card = document.createElement('div');
  card.className = 'task-card';
  card.id = `task-${task._id}`;
  card.innerHTML = `
    <div class="task-info">
      <h3>${task.title}</h3>
      <p>${task.description || 'No description'}</p>
      <div class="task-meta">
        <span class="badge priority-${task.priority}">${task.priority}</span>
        <span class="badge status-${task.status}">${task.status}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-status" onclick="updateStatus('${task._id}', '${nextStatus[task.status]}')">
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

  if (!title) {
    alert('Please enter a task title!');
    return;
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, priority })
    });
    const task = await res.json();
    
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('priority').value = 'medium';
    
    renderTask(task);
  } catch (err) {
    alert('Error adding task!');
  }
}

async function updateStatus(id, newStatus) {
  try {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    loadTasks();
  } catch (err) {
    alert('Error updating task!');
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    document.getElementById(`task-${id}`).remove();
  } catch (err) {
    alert('Error deleting task!');
  }
}