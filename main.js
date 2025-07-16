const CONFIG = {
  allowedUsername: "Mousavi",
  allowedPassword: "1234"
};
const rememberMeCheckbox = document.getElementById('rememberMe');

// هنگام بارگذاری صفحه بررسی کن که اطلاعات ذخیره‌شده هست یا نه
window.addEventListener('DOMContentLoaded', () => {
  const savedUsername = localStorage.getItem('savedUsername');
  const savedPassword = localStorage.getItem('savedPassword');
  if (savedUsername && savedPassword) {
    usernameInput.value = savedUsername;
    passwordInput.value = savedPassword;
    rememberMeCheckbox.checked = true;
  }
});
let currentSecretKey = "";
let isAuthenticated = false;

const loginTab = document.getElementById('login');
const generatorTab = document.getElementById('generator');
const loginError = document.getElementById('loginError');
const passwordOutput = document.getElementById('passwordOutput');
const loginBtn = document.getElementById('loginBtn');
const generateBtn = document.getElementById('generateBtn');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const secretKeyInput = document.getElementById('secretKey');
const usernameInput = document.getElementById('username');
const copyBtn = document.getElementById('copyBtn');
const backBtn = document.getElementById('backBtn');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Login function
function login() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('savedUsername', username);
    localStorage.setItem('savedPassword', password);
  } else {
    localStorage.removeItem('savedUsername');
    localStorage.removeItem('savedPassword');
  }

  if (!username || !password) {
    loginError.textContent = "Please fill all fields";
    return;
  }

  if (username !== CONFIG.allowedUsername || password !== CONFIG.allowedPassword) {
    loginError.textContent = "Invalid username or password";
    return;
  }

  isAuthenticated = true;
  loginError.textContent = "";
  loginTab.style.display = 'none';
  generatorTab.style.display = 'block';
}

// Attach login event
loginBtn.addEventListener('click', login);
[usernameInput, passwordInput, secretKeyInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
  });
});

// Generate password function
generateBtn.addEventListener('click', () => {
  const code = document.getElementById('hdcpCode').value.trim();
  const date = document.getElementById('dateInput').value;
  const hour = document.getElementById('hourInput').value;

  if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
    passwordOutput.textContent = "Please fill all fields correctly";
    passwordOutput.style.color = "#ff6b6b";
    copyBtn.style.display = "none";  // مخفی کردن دکمه کپی در صورت خطا
    return;
  }
  const secretKey = document.getElementById('secretKey').value.trim();
  if (!secretKey) {
    passwordOutput.textContent = "Please enter the Certificate";
    passwordOutput.style.color = "#ff6b6b";
    copyBtn.style.display = "none";
    return;
  }
  try {
    const combinedInput = `${code}-${date}-${hour}`;
    const finalKey = `${combinedInput}-${secretKey}-${CONFIG.allowedUsername}`;

    let hash = 0;
    for (let i = 0; i < finalKey.length; i++) {
      hash = (hash << 5) - hash + finalKey.charCodeAt(i);
      hash |= 0;
    }

    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const index = Math.abs(hash + i) % charset.length;
      password += charset[index];
    }

    passwordOutput.textContent = `HDCP Password: ${password}`;
    passwordOutput.style.color = "#327c34";

    copyBtn.style.display = "inline-block";
    copyBtn.dataset.password = password;

  } catch (error) {
    passwordOutput.textContent = "Error: " + error.message;
    passwordOutput.style.color = "#ff6b6b";
    copyBtn.style.display = "none";
  }
});

// Copy to clipboard with feedback
copyBtn.addEventListener('click', () => {
  const password = copyBtn.dataset.password;
  if (!password) return;

  if (!navigator.clipboard) {
    alert('Clipboard API not supported or insecure context');
    return;
  }

  navigator.clipboard.writeText(password).then(() => {
    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#327c34" viewBox="0 0 24 24">
      <path d="M20.285 6.709l-11.285 11.293-5.285-5.293 1.415-1.414 3.87 3.879 9.87-9.879z"/>
    </svg>`;
    setTimeout(() => {
      copyBtn.textContent = "📋";
    }, 2000);
  }).catch(err => {
    alert("Failed to copy: " + err);
  });
});

// Back button to login
backBtn.addEventListener('click', () => {
  generatorTab.style.display = 'none';
  loginTab.style.display = 'block';

  // Reset form and outputs on back if needed
  passwordOutput.textContent = "";
  copyBtn.style.display = "none";
  document.getElementById('hdcpCode').value = "";
  document.getElementById('dateInput').value = "";
  document.getElementById('hourInput').value = "";
  document.getElementById('secretKey').value = "";
});