// Shared utilities
const STORAGE_KEY = "stackly_users";
const ACTIVE_USER_KEY = "stackly_active_user";

const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');
const menuToggle = document.querySelector('.menu-toggle');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    navActions?.classList.toggle('open');
  });
}

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function setUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function setActiveUser(user) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}

function getActiveUser() {
  return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY) || 'null');
}

function clearActiveUser() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

function updateNavbarUserUI() {
  const activeUser = getActiveUser();
  const userArea = document.getElementById('userArea');
  if (!userArea) return;

  if (activeUser) {
    userArea.innerHTML = `
      <span class="user-pill">Hi, ${activeUser.name}</span>
      <button class="btn btn-outline" id="logoutBtn" type="button">Logout</button>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      clearActiveUser();
      window.location.reload();
    });
  } else {
    userArea.innerHTML = `
      <a class="btn btn-outline" href="login.html">Login</a>
      <a class="btn btn-primary" href="signup.html">Sign Up</a>
    `;
  }
}

function showError(inputId, message) {
  const el = document.getElementById(`${inputId}Error`);
  if (el) el.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach((err) => (err.textContent = ''));
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(contactForm);

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let valid = true;

    if (!name) { showError('name', 'Name is required.'); valid = false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showError('email', 'Enter a valid email.'); valid = false;
    }
    if (!message || message.length < 10) {
      showError('message', 'Message must be at least 10 characters.'); valid = false;
    }

    if (valid) {
      const msg = document.getElementById('contactSuccess');
      msg.textContent = 'Thanks! Your message has been sent.';
      contactForm.reset();
    }
  });
}

// Signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(signupForm);

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let valid = true;
    if (!name) { showError('signupName', 'Name is required.'); valid = false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showError('signupEmail', 'Valid email required.'); valid = false;
    }
    if (password.length < 6) {
      showError('signupPassword', 'Minimum 6 characters required.'); valid = false;
    }
    if (password !== confirmPassword) {
      showError('confirmPassword', 'Passwords do not match.'); valid = false;
    }

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      showError('signupEmail', 'This email is already registered.');
      valid = false;
    }

    if (valid) {
      users.push({ name, email, password });
      setUsers(users);
      setActiveUser({ name, email });
      window.location.href = 'index.html';
    }
  });
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(loginForm);

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    let valid = true;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showError('loginEmail', 'Valid email required.'); valid = false;
    }
    if (!password) {
      showError('loginPassword', 'Password is required.'); valid = false;
    }

    if (!valid) return;

    const users = getUsers();
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      showError('loginPassword', 'Invalid credentials or unregistered account.');
      return;
    }

    setActiveUser({ name: foundUser.name, email: foundUser.email });
    window.location.href = 'index.html';
  });
}

// Show/hide password toggle
Array.from(document.querySelectorAll('[data-toggle-password]')).forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-toggle-password');
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? 'Hide' : 'Show';
  });
});

updateNavbarUserUI();
