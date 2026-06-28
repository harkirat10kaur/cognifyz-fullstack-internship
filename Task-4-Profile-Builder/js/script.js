// ===== STATE =====
let currentStep = 1;
let passwordStrength = 0;

// ===== ROUTING — GO TO STEP =====
function goToStep(step) {
  // Validate before proceeding
  if (step > currentStep) {
    if (!validateStep(currentStep)) return;
  }

  // Hide current, show next
  document.getElementById(`step${currentStep}`).classList.remove('active');
  document.getElementById(`step${step}`).classList.add('active');

  // Update step dots
  updateStepDots(step);

  // Update progress bar
  const progress = { 1: 33, 2: 66, 3: 100 };
  document.getElementById('progressBar').style.width = progress[step] + '%';

  // If going to step 3, build profile card
  if (step === 3) buildProfileCard();

  currentStep = step;
}

// ===== UPDATE STEP DOTS =====
function updateStepDots(step) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.classList.remove('active', 'completed');

    if (i < step) dot.classList.add('completed');
    else if (i === step) dot.classList.add('active');
  }

  // Update lines
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById(`line${i}`);
    line.classList.toggle('active', step > i);
  }
}

// ===== VALIDATION =====
function showError(msgId, inputEl, msg) {
  const el = document.getElementById(msgId);
  if (el) { el.textContent = msg; el.style.color = '#ef4444'; }
  if (inputEl) { inputEl.classList.add('invalid'); inputEl.classList.remove('valid'); }
}

function showSuccess(msgId, inputEl, msg) {
  const el = document.getElementById(msgId);
  if (el) { el.textContent = msg; el.style.color = '#10b981'; }
  if (inputEl) { inputEl.classList.add('valid'); inputEl.classList.remove('invalid'); }
}

function clearMsg(msgId, inputEl) {
  const el = document.getElementById(msgId);
  if (el) el.textContent = '';
  if (inputEl) { inputEl.classList.remove('valid', 'invalid'); }
}

function validateStep(step) {
  if (step === 1) return validateStep1();
  if (step === 2) return validateStep2();
  return true;
}

function validateStep1() {
  let valid = true;
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value.trim())) {
    showError('emailMsg', email, 'Please enter a valid email address.');
    valid = false;
  } else {
    showSuccess('emailMsg', email, '✓ Valid email');
  }

  if (passwordStrength < 2) {
    showError('passwordMsg', password, 'Password is too weak. Make it stronger.');
    valid = false;
  } else {
    showSuccess('passwordMsg', password, '✓ Strong password');
  }

  if (confirm.value !== password.value || confirm.value === '') {
    showError('confirmMsg', confirm, 'Passwords do not match.');
    valid = false;
  } else {
    showSuccess('confirmMsg', confirm, '✓ Passwords match');
  }

  return valid;
}

function validateStep2() {
  let valid = true;
  const name = document.getElementById('fullName');
  const role = document.getElementById('role');
  const bio = document.getElementById('bio');

  if (name.value.trim().length < 2) {
    showError('nameMsg', name, 'Name must be at least 2 characters.');
    valid = false;
  } else {
    showSuccess('nameMsg', name, '✓ Looks good!');
  }

  if (!role.value) {
    showError('roleMsg', role, 'Please select your role.');
    valid = false;
  } else {
    showSuccess('roleMsg', role, '✓ Selected!');
  }

  if (bio.value.trim().length < 10) {
    showError('bioMsg', null, 'Bio must be at least 10 characters.');
    valid = false;
  } else {
    clearMsg('bioMsg', null);
  }

  return valid;
}

// ===== PASSWORD STRENGTH =====
const passwordInput = document.getElementById('password');

passwordInput.addEventListener('input', function () {
  const val = this.value;
  const checks = {
    length: val.length >= 8,
    upper: /[A-Z]/.test(val),
    number: /[0-9]/.test(val),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
  };

  // Update checklist
  updateCheck('check-length', checks.length);
  updateCheck('check-upper', checks.upper);
  updateCheck('check-number', checks.number);
  updateCheck('check-special', checks.special);

  // Calculate strength score
  const score = Object.values(checks).filter(Boolean).length;
  passwordStrength = score;

  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  if (val === '') {
    fill.style.width = '0';
    label.textContent = 'Enter a password';
    label.style.color = 'var(--text-muted)';
    return;
  }

  if (score <= 1) {
    fill.style.width = '25%';
    fill.style.background = '#ef4444';
    label.textContent = '⚠ Weak';
    label.style.color = '#ef4444';
  } else if (score === 2) {
    fill.style.width = '50%';
    fill.style.background = '#f59e0b';
    label.textContent = '~ Fair';
    label.style.color = '#f59e0b';
  } else if (score === 3) {
    fill.style.width = '75%';
    fill.style.background = '#06b6d4';
    label.textContent = '✓ Good';
    label.style.color = '#06b6d4';
  } else {
    fill.style.width = '100%';
    fill.style.background = '#10b981';
    label.textContent = '✓ Strong!';
    label.style.color = '#10b981';
  }
});

function updateCheck(id, passed) {
  const el = document.getElementById(id);
  if (passed) {
    el.classList.add('passed');
    el.querySelector('i').className = 'bi bi-check-circle-fill';
  } else {
    el.classList.remove('passed');
    el.querySelector('i').className = 'bi bi-x-circle-fill';
  }
}

// ===== TOGGLE PASSWORD VISIBILITY =====
document.getElementById('togglePw').addEventListener('click', function () {
  const pw = document.getElementById('password');
  if (pw.type === 'password') {
    pw.type = 'text';
    this.className = 'bi bi-eye-slash toggle-pw';
  } else {
    pw.type = 'password';
    this.className = 'bi bi-eye toggle-pw';
  }
});

// ===== EMAIL REAL-TIME VALIDATION =====
document.getElementById('email').addEventListener('blur', function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (this.value && !emailRegex.test(this.value)) {
    showError('emailMsg', this, 'Please enter a valid email.');
  } else if (this.value) {
    showSuccess('emailMsg', this, '✓ Valid email');
  }
});

// ===== CONFIRM PASSWORD =====
document.getElementById('confirmPassword').addEventListener('input', function () {
  const pw = document.getElementById('password').value;
  if (this.value === '') {
    clearMsg('confirmMsg', this);
  } else if (this.value === pw) {
    showSuccess('confirmMsg', this, '✓ Passwords match');
  } else {
    showError('confirmMsg', this, 'Passwords do not match.');
  }
});

// ===== BIO CHARACTER COUNTER =====
document.getElementById('bio').addEventListener('input', function () {
  document.getElementById('bioCount').textContent = this.value.length + '/150';
});

// ===== SKILL TAGS LIVE PREVIEW =====
document.getElementById('skills').addEventListener('input', function () {
  const container = document.getElementById('skillTagsPreview');
  container.innerHTML = '';

  const skills = this.value.split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag-pill';
    tag.textContent = skill;
    container.appendChild(tag);
  });
});

// ===== BUILD PROFILE CARD =====
function buildProfileCard() {
  const name = document.getElementById('fullName').value.trim();
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value.trim();
  const bio = document.getElementById('bio').value.trim();
  const skillsRaw = document.getElementById('skills').value;

  // Avatar initials
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('previewAvatar').textContent = initials || '?';

  // Basic info
  document.getElementById('previewName').textContent = name || 'Your Name';
  document.getElementById('previewRole').textContent = role || 'Your Role';
  document.getElementById('previewEmail').textContent = email;
  document.getElementById('previewBio').textContent = bio || 'No bio provided.';

  // Skills
  const skillsContainer = document.getElementById('previewSkills');
  skillsContainer.innerHTML = '';
  const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);
  skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'preview-skill-tag';
    tag.textContent = skill;
    skillsContainer.appendChild(tag);
  });

  // Stats
  document.getElementById('previewSkillCount').textContent = skills.length;

  const strengthLabels = ['—', 'Weak', 'Fair', 'Good', 'Strong'];
  document.getElementById('previewStrength').textContent = strengthLabels[passwordStrength] || '—';
}

// ===== SUBMIT =====
function submitProfile() {
  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Creating...';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('successMsg').style.display = 'flex';
    btn.textContent = '✓ Profile Created!';
    btn.style.background = '#10b981';

    // Confetti-like effect using DOM
    createConfetti();
  }, 1200);
}

// ===== CONFETTI DOM EFFECT =====
function createConfetti() {
  const colors = ['#ff6b35', '#00f5ff', '#ff0080', '#10b981', '#f59e0b'];
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      left: ${Math.random() * 100}vw;
      top: -10px;
      z-index: 9999;
      pointer-events: none;
      animation: fall ${Math.random() * 2 + 1.5}s ease-in forwards;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 3000);
  }

  // Add fall animation
  if (!document.getElementById('confettiStyle')) {
    const style = document.createElement('style');
    style.id = 'confettiStyle';
    style.textContent = `
      @keyframes fall {
        to { transform: translateY(105vh) rotate(${Math.random() * 360}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}