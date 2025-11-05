// === login.js ===
// Handles user login (email/password + optional voice biometric)

import { auth } from "../js/firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { verifyVoice } from "../js/voiceBiometric.js"; // You already have this file

// === DOM Elements ===
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const voiceLoginBtn = document.getElementById("voiceLoginBtn");
const voiceStatus = document.getElementById("voiceLoginStatus");

// === 🧩 Helper: Check Internet Connection ===
function checkConnection() {
  if (!navigator.onLine) {
    alert("⚠️ You are offline. Please check your internet connection.");
    throw new Error("Network offline");
  }
}

// === 🚀 Auto Redirect if Already Logged In ===
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Already logged in:", user.email);
    window.location.href = "../pages/dashboard.html";
  }
});

// === 🔐 Email/Password Login ===
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!email || !password) {
      alert("⚠️ Please fill in both email and password.");
      return;
    }

    try {
      checkConnection();
      loginBtn.disabled = true;
      loginBtn.innerText = "🔄 Logging in...";

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ Login successful:", user.email);
      alert(`✅ Welcome back, ${user.email}!`);
      window.location.href = "../pages/dashboard.html";

    } catch (error) {
      console.error("❌ Login Error:", error.code, error.message);

      switch (error.code) {
        case "auth/network-request-failed":
          alert("⚠️ Network error — please check your internet or CORS settings.");
          break;
        case "auth/invalid-email":
          alert("❌ Invalid email format.");
          break;
        case "auth/user-not-found":
          alert("❌ No account found with this email.");
          break;
        case "auth/wrong-password":
          alert("❌ Incorrect password. Try again.");
          break;
        default:
          alert("❌ Login failed: " + (error.message || error));
      }
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerText = "Login";
    }
  });
}

// === 📝 Redirect to Signup ===
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    console.log("➡️ Redirecting to signup page...");
    window.location.href = "../pages/signup.html";
  });
}

// === 🎙️ Voice Biometric Login ===
if (voiceLoginBtn) {
  voiceLoginBtn.addEventListener("click", async () => {
    try {
      checkConnection();
      voiceLoginBtn.disabled = true;

      if (voiceStatus) {
        voiceStatus.innerText = "🎙️ Listening... Please speak now.";
      }

      const user = auth.currentUser;
      if (!user) {
        voiceStatus.innerText = "⚠️ Please log in with email first or register.";
        voiceLoginBtn.disabled = false;
        return;
      }

      const verified = await verifyVoice(user.uid);
      if (verified) {
        voiceStatus.innerText = "✅ Voice matched! Redirecting...";
        setTimeout(() => (window.location.href = "../pages/dashboard.html"), 1000);
      } else {
        voiceStatus.innerText = "❌ Voice not recognized. Try again!";
      }
    } catch (err) {
      console.error("❌ Voice login error:", err);
      voiceStatus.innerText = "❌ Voice login failed. Please try again.";
    } finally {
      voiceLoginBtn.disabled = false;
    }
  });
}

console.log("✅ login.js loaded successfully");
