// === js/dashboard.js ===
import { auth } from "./firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { verifyVoice } from "./voiceBiometric.js";

// === Auth Guard ===
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.warn("🚫 No user session — redirecting to login...");
    window.location.href = "login.html";
  } else {
    console.log("✅ Logged in as:", user.email);
    document.getElementById("welcome-text").textContent =
      `Welcome 👋 ${user.email.split('@')[0]}`;
  }
});

// === Initialize UI after DOM loads ===
window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  // ✅ Create dynamic voice verification button
  const voiceBtn = document.createElement("button");
  voiceBtn.id = "verify-voice-btn";
  voiceBtn.classList.add("voice-btn");
  voiceBtn.innerHTML = "🎙️ Verify My Voice";

  const statusText = document.createElement("p");
  statusText.id = "voice-status";

  const userInfo = document.querySelector(".user-info div");
  if (userInfo) {
    userInfo.appendChild(voiceBtn);
    userInfo.appendChild(statusText);
  }

  // === 🎤 Handle Voice Verification ===
  voiceBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      showToast("⚠️ Please login again.", "error");
      return;
    }

    try {
      voiceBtn.classList.add("listening");
      statusText.innerText = "🎙️ Listening... Please speak now.";
      statusText.className = "recording";
      showToast("🎧 Listening...", "recording");

      const match = await verifyVoice(user.uid);

      voiceBtn.classList.remove("listening");
      if (match) {
        statusText.innerText = "✅ Voice Verified Successfully!";
        statusText.className = "success";
        showToast("✅ Voice Verified Successfully!", "success");
        playSuccessChime();
      } else {
        statusText.innerText = "❌ Voice did not match. Try again.";
        statusText.className = "error";
        showToast("❌ Voice did not match.", "error");
      }
    } catch (error) {
      console.error("Voice verification failed:", error);
      statusText.innerText = "❌ Voice verification failed.";
      statusText.className = "error";
      showToast("❌ Voice verification failed.", "error");
      voiceBtn.classList.remove("listening");
    }
  });

  // === 🔒 Logout Handler ===
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("🔒 Signed out successfully");
      window.location.href = "login.html";
    } catch (err) {
      console.error("❌ Error signing out:", err);
    }
  });
});

// === 🔔 Toast Notification ===
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// === 🎵 Success Chime ===
function playSuccessChime() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}
