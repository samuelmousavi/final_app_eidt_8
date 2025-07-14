// const codeInput = document.getElementById("codeInput");
// const dateInput = document.getElementById("dateInput");
// const hourInput = document.getElementById("hourInput");
// const outputEl = document.getElementById("output");
// const errorEl = document.getElementById("error");

// function showError(msg) {
//   errorEl.textContent = msg;
//   outputEl.textContent = "";
// }

// async function generateCode() {
//   const code = codeInput.value.trim();
//   const date = dateInput.value.trim();
//   const hour = hourInput.value.trim();

//   // Validate inputs
//   if (!/^\d+$/.test(code)) {
//     showError("❌ Code must contain digits only.");
//     codeInput.classList.add("invalid");
//     return;
//   } else {
//     codeInput.classList.remove("invalid");
//   }

//   if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     showError("❌ Date must be in YYYY-MM-DD format.");
//     dateInput.classList.add("invalid");
//     return;
//   } else {
//     dateInput.classList.remove("invalid");
//   }

//   const hourInt = parseInt(hour);
//   if (isNaN(hourInt) || hourInt < 0 || hourInt > 23) {
//     showError("❌ Hour must be a number between 0 and 23.");
//     hourInput.classList.add("invalid");
//     return;
//   } else {
//     hourInput.classList.remove("invalid");
//   }

//   errorEl.textContent = "";

//   try {
//     const combined = `${code}-${date}-${hourInt}`;
//     const result = await encryptTo12DigitNumber(combined, "htcp-secret-key");
//     outputEl.textContent = `✅ Your HTCP password: ${result}`;
//   } catch (err) {
//     showError("❌ Encryption error.");
//     console.error(err);
//   }
// }

// async function encryptTo12DigitNumber(input, password) {
//   // Generate a deterministic hash from input+password for salt and iv
//   const inputBytes = stringToBytes(input + password);
//   const fullHashBuffer = await crypto.subtle.digest("SHA-256", inputBytes);
//   const fullHash = new Uint8Array(fullHashBuffer);

//   const salt = fullHash.slice(0, 16);
//   const iv = fullHash.slice(16, 28);

//   const key = await getKey(password, salt);
//   const contentBytes = stringToBytes(input);

//   const encrypted = new Uint8Array(
//     await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, contentBytes)
//   );

//   const allBytes = new Uint8Array([...salt, ...iv, ...encrypted]);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", allBytes);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));

//   const hashHex = hashArray
//     .slice(0, 8)
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");

//   const hashNum = BigInt("0x" + hashHex);
//   const code12Digit = (hashNum % 1_000_000_000_000n).toString().padStart(12, "0");

//   return code12Digit;
// }

// async function getKey(password, salt) {
//   const passwordBytes = stringToBytes(password);
//   const initialKey = await crypto.subtle.importKey(
//     "raw",
//     passwordBytes,
//     { name: "PBKDF2" },
//     false,
//     ["deriveKey"]
//   );

//   return crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt,
//       iterations: 100000,
//       hash: "SHA-256"
//     },
//     initialKey,
//     { name: "AES-GCM", length: 256 },
//     false,
//     ["encrypt", "decrypt"]
//   );
// }

// function stringToBytes(str) {
//   return new TextEncoder().encode(str);
// }
// const codeInput = document.getElementById("codeInput");
// const dateInput = document.getElementById("dateInput");
// const hourInput = document.getElementById("hourInput");
// const outputEl = document.getElementById("output");
// const errorEl = document.getElementById("error");

// function showError(msg) {
//   errorEl.textContent = msg;
//   outputEl.textContent = "";
// }

// async function generateCode() {
//   const code = codeInput.value.trim();
//   const date = dateInput.value.trim();
//   const hour = hourInput.value.trim();

//   // Validate inputs
//   if (!/^\d+$/.test(code)) {
//     showError("❌ Code must contain digits only.");
//     codeInput.classList.add("invalid");
//     return;
//   } else {
//     codeInput.classList.remove("invalid");
//   }

//   if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     showError("❌ Date must be in YYYY-MM-DD format.");
//     dateInput.classList.add("invalid");
//     return;
//   } else {
//     dateInput.classList.remove("invalid");
//   }

//   const hourInt = parseInt(hour);
//   if (isNaN(hourInt) || hourInt < 0 || hourInt > 23) {
//     showError("❌ Hour must be a number between 0 and 23.");
//     hourInput.classList.add("invalid");
//     return;
//   } else {
//     hourInput.classList.remove("invalid");
//   }

//   errorEl.textContent = "";

//   try {
//     const combined = `${code}-${date}-${hourInt}`;
//     const result = await generateStablePassword(combined, "htcp-secret-key");
//     outputEl.textContent = `✅ Your HTCP password: ${result}`;
//   } catch (err) {
//     showError("❌ Error generating password.");
//     console.error(err);
//   }
// }

// async function generateStablePassword(input, secret) {
//   // Combine input with secret and normalize
//   const normalizedInput = `${input}-${secret}`.normalize('NFC');
  
//   // Create SHA-256 hash
//   const msgBuffer = new TextEncoder().encode(normalizedInput);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
  
//   // Convert to 12-digit number
//   const hashHex = hashArray
//     .slice(0, 6) // Use first 6 bytes (48 bits)
//     .map(b => b.toString(16).padStart(2, '0'))
//     .join('');
  
//   const hashNum = BigInt('0x' + hashHex);
//   const code12Digit = (hashNum % 1_000_000_000_000n).toString().padStart(12, '0');
  
//   return code12Digit;
// }

// // Helper function for testing
// function testPasswordGeneration() {
//   const testCases = [
//     ["1234", "2023-01-01", "12"],
//     ["5678", "2023-02-15", "8"],
//     ["1234", "2023-01-01", "12"] // Should be same as first test
//   ];

//   testCases.forEach(async (testCase, i) => {
//     const [code, date, hour] = testCase;
//     const combined = `${code}-${date}-${hour}`;
//     const result = await generateStablePassword(combined, "htcp-secret-key");
//     console.log(`Test ${i+1}:`, {code, date, hour}, "Password:", result);
//   });
// }

// // Uncomment to run tests
// // testPasswordGeneration();
// const codeInput = document.getElementById("codeInput");
// const dateInput = document.getElementById("dateInput");
// const hourInput = document.getElementById("hourInput");
// const outputEl = document.getElementById("output");
// const errorEl = document.getElementById("error");

// function showError(msg) {
//   errorEl.textContent = msg;
//   outputEl.textContent = "";
// }

// async function generateCode() {
//   const code = codeInput.value.trim();
//   const date = dateInput.value.trim();
//   const hour = hourInput.value.trim();

//   // Validate inputs
//   if (!/^\d+$/.test(code)) {
//     showError("❌ Code must contain digits only.");
//     codeInput.classList.add("invalid");
//     return;
//   } else {
//     codeInput.classList.remove("invalid");
//   }

//   if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     showError("❌ Date must be in YYYY-MM-DD format.");
//     dateInput.classList.add("invalid");
//     return;
//   } else {
//     dateInput.classList.remove("invalid");
//   }

//   const hourInt = parseInt(hour);
//   if (isNaN(hourInt) || hourInt < 0 || hourInt > 23) {
//     showError("❌ Hour must be a number between 0 and 23.");
//     hourInput.classList.add("invalid");
//     return;
//   } else {
//     hourInput.classList.remove("invalid");
//   }

//   errorEl.textContent = "";

//   try {
//     const combined = `${code}-${date}-${hourInt}`;
//     const result = await generateStablePassword(combined, "hdcp-secret-key");
//     outputEl.textContent = `✅ Your HDCP password: ${result}`;
//   } catch (err) {
//     showError("❌ Error generating password.");
//     console.error(err);
//   }
// }

// async function generateStablePassword(input, secret) {
//   // Combine input with secret and normalize
//   const normalizedInput = `${input}-${secret}`.normalize('NFC');
  
//   // Create SHA-256 hash
//   const msgBuffer = new TextEncoder().encode(normalizedInput);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
  
//   // Convert to 12-digit number
//   const hashHex = hashArray
//     .slice(0, 6) // Use first 6 bytes (48 bits)
//     .map(b => b.toString(16).padStart(2, '0'))
//     .join('');
  
//   const hashNum = BigInt('0x' + hashHex);
//   const code12Digit = (hashNum % 1_000_000_000_000n).toString().padStart(12, '0');
  
//   return code12Digit;
// }

// const codeInput = document.getElementById("codeInput");
// const dateInput = document.getElementById("dateInput");
// const hourInput = document.getElementById("hourInput");
// const outputEl = document.getElementById("output");
// const errorEl = document.getElementById("error");

// // تنظیمات رمز ترکیبی
// const PASSWORD_CONFIG = {
//   length: 12,
//   charset: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // حذف I,1,0,O برای جلوگیری از اشتباه
// };

// function showError(msg) {
//   errorEl.textContent = msg;
//   outputEl.textContent = "";
// }

// async function generateAdvancedHdcpPassword(input, secret) {
//   // 1. ترکیب ورودی با کلید مخفی
//   const combined = `${input}-${secret}`;
  
//   // 2. تولید هش SHA-256
//   const hashBuffer = await crypto.subtle.digest(
//     'SHA-256',
//     new TextEncoder().encode(combined)
//   );
  
//   // 3. تبدیل به رمز ترکیبی
//   const hashArray = new Uint8Array(hashBuffer);
//   let password = "";
  
//   for (let i = 0; i < PASSWORD_CONFIG.length; i++) {
//     const byteIndex = i % hashArray.length;
//     const charIndex = hashArray[byteIndex] % PASSWORD_CONFIG.charset.length;
//     password += PASSWORD_CONFIG.charset[charIndex];
//   }
  
//   return password;
// }

// async function generateCode() {
//   const code = codeInput.value.trim();
//   const date = dateInput.value.trim();
//   const hour = hourInput.value.trim();

//   // اعتبارسنجی ورودی‌ها
//   if (!/^\d+$/.test(code)) {
//     showError("❌ Code must contain digits only.");
//     codeInput.classList.add("invalid");
//     return;
//   }
  
//   if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     showError("❌ Date must be in YYYY-MM-DD format.");
//     dateInput.classList.add("invalid");
//     return;
//   }
  
//   const hourInt = parseInt(hour);
//   if (isNaN(hourInt) || hourInt < 0 || hourInt > 23) {
//     showError("❌ Hour must be a number between 0 and 23.");
//     hourInput.classList.add("invalid");
//     return;
//   }

//   errorEl.textContent = "";
//   codeInput.classList.remove("invalid");
//   dateInput.classList.remove("invalid");
//   hourInput.classList.remove("invalid");

//   try {
//     const combined = `${code}-${date}-${hourInt}`;
//     const password = await generateAdvancedHdcpPassword(combined, "hdcp-secret-key");
//     outputEl.innerHTML = `✅ Your HDCP Password: <strong>${password}</strong>`;
//   } catch (err) {
//     showError("❌ Error generating password.");
//     console.error(err);
//   }
// }

// // تست خودکار
// async function testPasswordGeneration() {
//   const testCases = [
//     ["1234", "2023-01-01", "11"],
//     ["5678", "2023-01-01", "11"],
//     ["1234", "2023-01-02", "11"]
//   ];

//   for (const [code, date, hour] of testCases) {
//     const combined = `${date}${code}${hour}`;
//     const password = await generateAdvancedHdcpPassword(combined, "hdcp-secret-key");
//     console.log(`Test: ${combined} → ${password}`);
//   }
// }

// // اجرای تست (غیرفعال در حالت تولید)
// // testPasswordGeneration();
// تنظیمات سیستم
// const CONFIG = {
//   allowedUsername: "Mousavi",
//   allowedPasswordHash: "d0a3c83b5f6b8a9c2e4f7d1b5a8c3e2b" // هش SHA-256 رمز "MySecretPassword123"
// };

// // متغیرهای سیستمی
// let currentSecretKey = "";
// let isAuthenticated = false;

// // عناصر DOM
// const tabBtns = document.querySelectorAll('.tab-btn');
// const tabContents = document.querySelectorAll('.tab-content');
// const loginError = document.getElementById('loginError');
// const passwordOutput = document.getElementById('passwordOutput');
// const loginBtn = document.getElementById('loginBtn');
// const generateBtn = document.getElementById('generateBtn');

// // مدیریت تب‌ها
// tabBtns.forEach(btn => {
//   btn.addEventListener('click', () => {
//     const tabId = btn.dataset.tab;
    
//     // اگر کاربر بخواهد به تب تولید رمز برود بدون احراز هویت
//     if (tabId === 'generator' && !isAuthenticated) {
//       loginError.textContent = "لطفاً ابتدا احراز هویت کنید";
//       return;
//     }
    
//     // تغییر تب‌ها
//     tabBtns.forEach(b => b.classList.remove('active'));
//     tabContents.forEach(c => c.classList.remove('active'));
    
//     btn.classList.add('active');
//     document.getElementById(tabId).classList.add('active');
//   });
// });

// // تابع تولید هش SHA-256
// async function sha256(message) {
//   const msgBuffer = new TextEncoder().encode(message);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
// }

// // احراز هویت کاربر
// loginBtn.addEventListener('click', async () => {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value;
//   const secretKey = document.getElementById('secretKey').value.trim();

//   // اعتبارسنجی ورودی‌ها
//   if (!username || !password || !secretKey) {
//     loginError.textContent = "لطفاً تمام فیلدها را پر کنید";
//     return;
//   }

//   // بررسی نام کاربری
//   if (username !== CONFIG.allowedUsername) {
//     loginError.textContent = "نام کاربری نامعتبر است";
//     return;
//   }

//   // بررسی رمز عبور
//   const hashedPassword = await sha256(password);
//   if (hashedPassword !== CONFIG.allowedPasswordHash) {
//     loginError.textContent = "رمز عبور نادرست است";
//     return;
//   }

//   // ذخیره کلید و تغییر وضعیت
//   currentSecretKey = secretKey;
//   isAuthenticated = true;
//   loginError.textContent = "";
  
//   // رفتن به تب تولید رمز
//   document.querySelector('.tab-btn[data-tab="generator"]').click();
// });

// // تولید رمز HDCP
// generateBtn.addEventListener('click', async () => {
//   const code = document.getElementById('hdcpCode').value.trim();
//   const date = document.getElementById('dateInput').value;
//   const hour = document.getElementById('hourInput').value;

//   // اعتبارسنجی ورودی‌ها
//   if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
//     passwordOutput.textContent = "لطفاً تمام فیلدها را به درستی پر کنید";
//     passwordOutput.className = "error";
//     return;
//   }

//   try {
//     // ترکیب ورودی‌ها با کلید
//     const combinedInput = `${code}-${date}-${hour}`;
//     const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
//     // تولید هش
//     const hash = await sha256(finalKey);
//     const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let password = "";
    
//     // تولید رمز 12 کاراکتری
//     for (let i = 0; i < 12; i++) {
//       const byteIndex = i % 32;
//       const charIndex = parseInt(hash.substr(byteIndex*2, 2), 16) % charset.length;
//       password += charset[charIndex];
//     }
    
//     // نمایش نتیجه
//     passwordOutput.textContent = `رمز HDCP شما: ${password}`;
//     passwordOutput.className = "success";
//   } catch (error) {
//     passwordOutput.textContent = "خطا در تولید رمز: " + error.message;
//     passwordOutput.className = "error";
//   }
// });
// تنظیمات سیستم
// const CONFIG = {
//   allowedUsername: "Mousavi",
//   allowedPassword: "1234" // رمز عبور ساده
// };

// // متغیرهای سیستمی
// let currentSecretKey = "";
// let isAuthenticated = false;

// // عناصر DOM
// const tabBtns = document.querySelectorAll('.tab-btn');
// const tabContents = document.querySelectorAll('.tab-content');
// const loginError = document.getElementById('loginError');
// const passwordOutput = document.getElementById('passwordOutput');
// const loginBtn = document.getElementById('loginBtn');
// const generateBtn = document.getElementById('generateBtn');

// // مدیریت تب‌ها
// tabBtns.forEach(btn => {
//   btn.addEventListener('click', () => {
//     const tabId = btn.dataset.tab;
    
//     if (tabId === 'generator' && !isAuthenticated) {
//       loginError.textContent = "لطفاً ابتدا احراز هویت کنید";
//       return;
//     }
    
//     tabBtns.forEach(b => b.classList.remove('active'));
//     tabContents.forEach(c => c.classList.remove('active'));
    
//     btn.classList.add('active');
//     document.getElementById(tabId).classList.add('active');
//   });
// });

// // احراز هویت کاربر
// loginBtn.addEventListener('click', () => {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value;
//   const secretKey = document.getElementById('secretKey').value.trim();

//   if (!username || !password || !secretKey) {
//     loginError.textContent = "لطفاً تمام فیلدها را پر کنید";
//     return;
//   }

//   if (username !== CONFIG.allowedUsername) {
//     loginError.textContent = "نام کاربری نامعتبر است";
//     return;
//   }

//   if (password !== CONFIG.allowedPassword) {
//     loginError.textContent = "رمز عبور نادرست است";
//     return;
//   }

//   currentSecretKey = secretKey;
//   isAuthenticated = true;
//   loginError.textContent = "";
//   document.querySelector('.tab-btn[data-tab="generator"]').click();
// });

// // تولید رمز HDCP
// generateBtn.addEventListener('click', async () => {
//   const code = document.getElementById('hdcpCode').value.trim();
//   const date = document.getElementById('dateInput').value;
//   const hour = document.getElementById('hourInput').value;

//   if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
//     passwordOutput.textContent = "لطفاً تمام فیلدها را به درستی پر کنید";
//     passwordOutput.className = "error";
//     return;
//   }

//   try {
//     const combinedInput = `${code}-${date}-${hour}`;
//     const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
//     // تابع ساده شده تولید هش
//     const hash = await simpleHash(finalKey);
//     const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let password = "";
    
//     for (let i = 0; i < 12; i++) {
//       const charIndex = (hash + i) % charset.length;
//       password += charset[charIndex];
//     }
    
//     passwordOutput.textContent = `رمز HDCP شما: ${password}`;
//     passwordOutput.className = "success";
//   } catch (error) {
//     passwordOutput.textContent = "خطا در تولید رمز: " + error.message;
//     passwordOutput.className = "error";
//   }
// });

// // تابع ساده شده برای تولید هش
// async function simpleHash(str) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash << 5) - hash + str.charCodeAt(i);
//     hash |= 0; // تبدیل به عدد 32 بیتی
//   }
//   return Math.abs(hash);
// }
// System configuration
// const CONFIG = {
//   allowedUsername: "Mousavi", // Authorized username
//   allowedPassword: "1234"     // Simple password (no hashing)
// };

// // System variables
// let currentSecretKey = "";    // HDCP key entered by user
// let isAuthenticated = false;  // Authentication status

// // DOM elements
// const tabBtns = document.querySelectorAll('.tab-btn');         // Tab buttons
// const tabContents = document.querySelectorAll('.tab-content'); // Tab contents
// const loginError = document.getElementById('loginError');      // Login error message
// const passwordOutput = document.getElementById('passwordOutput'); // Password output
// const loginBtn = document.getElementById('loginBtn');          // Login button
// const generateBtn = document.getElementById('generateBtn');    // Generate button

// // Tab management
// tabBtns.forEach(btn => {
//   btn.addEventListener('click', () => {
//     const tabId = btn.dataset.tab;
    
//     // Prevent access to generator without authentication
//     if (tabId === 'generator' && !isAuthenticated) {
//       loginError.textContent = "Please authenticate first";
//       return;
//     }
    
//     // Deactivate all tabs
//     tabBtns.forEach(b => b.classList.remove('active'));
//     tabContents.forEach(c => c.classList.remove('active'));
    
//     // Activate selected tab
//     btn.classList.add('active');
//     document.getElementById(tabId).classList.add('active');
//   });
// });

// // Authentication
// loginBtn.addEventListener('click', () => {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value;
//   const secretKey = document.getElementById('secretKey').value.trim();

//   // Input validation
//   if (!username || !password || !secretKey) {
//     loginError.textContent = "Please fill all fields";
//     return;
//   }

//   // Check username
//   if (username !== CONFIG.allowedUsername) {
//     loginError.textContent = "Invalid username";
//     return;
//   }

//   // Check password (simple comparison)
//   if (password !== CONFIG.allowedPassword) {
//     loginError.textContent = "Invalid password";
//     return;
//   }

//   // Successful authentication
//   currentSecretKey = secretKey;
//   isAuthenticated = true;
//   loginError.textContent = "";
  
//   // Switch to generator tab
//   document.querySelector('.tab-btn[data-tab="generator"]').click();
// });

// // Password generation
// generateBtn.addEventListener('click', () => {
//   const code = document.getElementById('hdcpCode').value.trim();
//   const date = document.getElementById('dateInput').value;
//   const hour = document.getElementById('hourInput').value;

//   // Input validation
//   if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
//     passwordOutput.textContent = "Please fill all fields correctly";
//     passwordOutput.className = "error";
//     return;
//   }

//   try {
//     // Combine inputs with secret key
//     const combinedInput = `${code}-${date}-${hour}`;
//     const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
//     // Simple hash function
//     let hash = 0;
//     for (let i = 0; i < finalKey.length; i++) {
//       hash = (hash << 5) - hash + finalKey.charCodeAt(i);
//       hash |= 0; // Convert to 32-bit integer
//     }
    
//     // Generate 12-character password
//     const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let password = "";
//     for (let i = 0; i < 12; i++) {
//       const index = Math.abs(hash + i) % charset.length;
//       password += charset[index];
//     }
    
//     // Display result
//     passwordOutput.textContent = `HDCP Password: ${password}`;
//     passwordOutput.className = "success";
//   } catch (error) {
//     passwordOutput.textContent = "Error: " + error.message;
//     passwordOutput.className = "error";
//   }
// });
// System configuration
// const CONFIG = {
//   allowedUsername: "Mousavi",
//   allowedPassword: "1234" // Simple password (no hashing)
// };

// // System variables
// let currentSecretKey = "";
// let isAuthenticated = false;

// // DOM elements
// const loginTab = document.getElementById('login');
// const generatorTab = document.getElementById('generator');
// const loginError = document.getElementById('loginError');
// const passwordOutput = document.getElementById('passwordOutput');
// const loginBtn = document.getElementById('loginBtn');
// const generateBtn = document.getElementById('generateBtn');

// // Authentication
// loginBtn.addEventListener('click', () => {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value;
//   const secretKey = document.getElementById('secretKey').value.trim();

//   // Input validation
//   if (!username || !password || !secretKey) {
//     loginError.textContent = "Please fill all fields";
//     return;
//   }

//   // Check credentials
//   if (username !== CONFIG.allowedUsername || password !== CONFIG.allowedPassword) {
//     loginError.textContent = "Invalid username or password";
//     return;
//   }

//   // Successful login
//   currentSecretKey = secretKey;
//   isAuthenticated = true;
//   loginError.textContent = "";
  
//   // Switch to generator tab
//   loginTab.style.display = 'none';
//   generatorTab.style.display = 'block';
// });

// // Password generation
// generateBtn.addEventListener('click', () => {
//   const code = document.getElementById('hdcpCode').value.trim();
//   const date = document.getElementById('dateInput').value;
//   const hour = document.getElementById('hourInput').value;

//   // Input validation
//   if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
//     passwordOutput.textContent = "Please fill all fields correctly";
//     passwordOutput.className = "error";
//     return;
//   }

//   try {
//     // Combine inputs
//     const combinedInput = `${code}-${date}-${hour}`;
//     const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
//     // Simple hash function
//     let hash = 0;
//     for (let i = 0; i < finalKey.length; i++) {
//       hash = (hash << 5) - hash + finalKey.charCodeAt(i);
//       hash |= 0; // Convert to 32-bit integer
//     }
    
//     // Generate 12-character password
//     const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let password = "";
//     for (let i = 0; i < 12; i++) {
//       const index = Math.abs(hash + i) % charset.length;
//       password += charset[index];
//     }
    
//     // Display result
//     passwordOutput.textContent = `HDCP Password: ${password}`;
//     passwordOutput.className = "success";
//   } catch (error) {
//     passwordOutput.textContent = "Error: " + error.message;
//     passwordOutput.className = "error";
//   }
// });
// System configuration
// const CONFIG = {
//   allowedUsername: "Mousavi",
//   allowedPassword: "1234"
// };

// // System variables
// let currentSecretKey = "";
// let isAuthenticated = false;

// // DOM elements
// const loginTab = document.getElementById('login');
// const generatorTab = document.getElementById('generator');
// const loginError = document.getElementById('loginError');
// const passwordOutput = document.getElementById('passwordOutput');
// const loginBtn = document.getElementById('loginBtn');
// const generateBtn = document.getElementById('generateBtn');
// const passwordInput = document.getElementById('password');
// const togglePassword = document.querySelector('.toggle-password');

// // Toggle password visibility
// togglePassword.addEventListener('click', () => {
//   const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//   passwordInput.setAttribute('type', type);
//   togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
// });

// // Authentication
// loginBtn.addEventListener('click', () => {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value;
//   const secretKey = document.getElementById('secretKey').value.trim();

//   if (!username || !password || !secretKey) {
//     loginError.textContent = "Please fill all fields";
//     return;
//   }

//   if (username !== CONFIG.allowedUsername || password !== CONFIG.allowedPassword) {
//     loginError.textContent = "Invalid username or password";
//     return;
//   }

//   currentSecretKey = secretKey;
//   isAuthenticated = true;
//   loginError.textContent = "";
//   loginTab.style.display = 'none';
//   generatorTab.style.display = 'block';
// });

// // Password generation (same as before)
// generateBtn.addEventListener('click', () => {
//   const code = document.getElementById('hdcpCode').value.trim();
//   const date = document.getElementById('dateInput').value;
//   const hour = document.getElementById('hourInput').value;

//   if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
//     passwordOutput.textContent = "Please fill all fields correctly";
//     passwordOutput.className = "error";
//     return;
//   }

//   try {
//     const combinedInput = `${code}-${date}-${hour}`;
//     const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
//     let hash = 0;
//     for (let i = 0; i < finalKey.length; i++) {
//       hash = (hash << 5) - hash + finalKey.charCodeAt(i);
//       hash |= 0;
//     }
    
//     const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let password = "";
//     for (let i = 0; i < 12; i++) {
//       const index = Math.abs(hash + i) % charset.length;
//       password += charset[index];
//     }
    
//     passwordOutput.textContent = `HDCP Password: ${password}`;
//     passwordOutput.className = "success";
//   } catch (error) {
//     passwordOutput.textContent = "Error: " + error.message;
//     passwordOutput.className = "error";
//   }
// });
// System configuration
// const CONFIG = {
//   allowedUsername: "Mousavi",
//   allowedPassword: "1234"
// };

// // System variables
// let currentSecretKey = "";
// let isAuthenticated = false;

// // DOM elements
// const loginTab = document.getElementById('login');
// const generatorTab = document.getElementById('generator');
// const loginError = document.getElementById('loginError');
// const passwordOutput = document.getElementById('passwordOutput');
// const loginBtn = document.getElementById('loginBtn');
// const generateBtn = document.getElementById('generateBtn');
// const passwordInput = document.getElementById('password');
// const togglePassword = document.querySelector('.toggle-password');
// const secretKeyInput = document.getElementById('secretKey');

// // Toggle password visibility
// togglePassword.addEventListener('click', () => {
//   const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//   passwordInput.setAttribute('type', type);
//   togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
// });

// // Login function
// function login() {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value;
//   const secretKey = secretKeyInput.value.trim();

//   if (!username || !password || !secretKey) {
//     loginError.textContent = "Please fill all fields";
//     return;
//   }

//   if (username !== CONFIG.allowedUsername || password !== CONFIG.allowedPassword) {
//     loginError.textContent = "Invalid username or password";
//     return;
//   }

//   currentSecretKey = secretKey;
//   isAuthenticated = true;
//   loginError.textContent = "";
//   loginTab.style.display = 'none';
//   generatorTab.style.display = 'block';
// }

// // Login button click
// loginBtn.addEventListener('click', login);

// // Enter key login
// document.querySelectorAll('input').forEach(input => {
//   input.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       if (e.target.id === 'password' || e.target.id === 'secretKey') {
//         login();
//       }
//     }
//   });
// });

// // Password generation
// generateBtn.addEventListener('click', () => {
//   const code = document.getElementById('hdcpCode').value.trim();
//   const date = document.getElementById('dateInput').value;
//   const hour = document.getElementById('hourInput').value;

//   if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
//     passwordOutput.textContent = "Please fill all fields correctly";
//     passwordOutput.className = "error";
//     return;
//   }

//   try {
//     const combinedInput = `${code}-${date}-${hour}`;
//     const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
//     let hash = 0;
//     for (let i = 0; i < finalKey.length; i++) {
//       hash = (hash << 5) - hash + finalKey.charCodeAt(i);
//       hash |= 0;
//     }
    
//     const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let password = "";
//     for (let i = 0; i < 12; i++) {
//       const index = Math.abs(hash + i) % charset.length;
//       password += charset[index];
//     }
    
//     passwordOutput.textContent = `HDCP Password: ${password}`;
//     passwordOutput.className = "success";
//   } catch (error) {
//     passwordOutput.textContent = "Error: " + error.message;
//     passwordOutput.className = "error";
//   }
// });
// System configuration
const CONFIG = {
  allowedUsername: "Mousavi",
  allowedPassword: "1234"
};

// System variables
let currentSecretKey = "";
let isAuthenticated = false;

// DOM elements
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
  const secretKey = secretKeyInput.value.trim();

  if (!username || !password || !secretKey) {
    loginError.textContent = "Please fill all fields";
    return;
  }

  if (username !== CONFIG.allowedUsername || password !== CONFIG.allowedPassword) {
    loginError.textContent = "Invalid username or password";
    return;
  }

  currentSecretKey = secretKey;
  isAuthenticated = true;
  loginError.textContent = "";
  loginTab.style.display = 'none';
  generatorTab.style.display = 'block';
}

// Login button click
loginBtn.addEventListener('click', login);

// Enter key login
[usernameInput, passwordInput, secretKeyInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      login();
    }
  });
});

// Password generation
generateBtn.addEventListener('click', () => {
  const code = document.getElementById('hdcpCode').value.trim();
  const date = document.getElementById('dateInput').value;
  const hour = document.getElementById('hourInput').value;

  if (!code || !date || hour === "" || isNaN(hour) || hour < 0 || hour > 23) {
    passwordOutput.textContent = "Please fill all fields correctly";
    passwordOutput.style.color = "#ff6b6b";
    return;
  }

  try {
    const combinedInput = `${code}-${date}-${hour}`;
    const finalKey = `${combinedInput}-${currentSecretKey}-${CONFIG.allowedUsername}`;
    
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
    passwordOutput.style.color = "#51cf66";
  } catch (error) {
    passwordOutput.textContent = "Error: " + error.message;
    passwordOutput.style.color = "#ff6b6b";
  }
});