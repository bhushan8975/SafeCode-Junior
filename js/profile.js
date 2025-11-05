// ✅ Import Firebase Auth instance from your shared config
import { auth } from "../js/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// === 🧠 AUTH CHECK (fixed: delay redirect so page doesn’t flash/close) ===
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.warn("🚫 No user logged in. Redirecting to login...");
    // Delay redirect to give Firebase time to restore the session
    setTimeout(() => {
      if (!auth.currentUser) {
        window.location.href = "../pages/login.html";
      }
    }, 800); // You can adjust 800ms if needed
  } else {
    console.log("✅ Logged in as:", user.email);
  }
});

// === 🚪 LOGOUT FUNCTION ===
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("🔒 User signed out.");
      window.location.href = "../pages/login.html";
    } catch (error) {
      console.error("Logout error:", error);
    }
  });
}

// === 💾 LOCAL USER PROFILE STORAGE ===
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name") || "";
  const email = localStorage.getItem("email") || "";
  const mobile = localStorage.getItem("mobile") || "";
  const photo = localStorage.getItem("profilePhoto");

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const mobileEl = document.getElementById("mobile");
  const photoEl = document.getElementById("profileImage");

  if (nameEl) nameEl.value = name;
  if (emailEl) emailEl.value = email;
  if (mobileEl) mobileEl.value = mobile;
  if (photoEl && photo) photoEl.src = photo;
});

// === 💾 SAVE PROFILE DATA ===
const saveBtn = document.querySelector(".save-btn");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    localStorage.setItem("name", document.getElementById("name").value);
    localStorage.setItem("email", document.getElementById("email").value);
    localStorage.setItem("mobile", document.getElementById("mobile").value);
    alert("✅ Profile updated successfully!");
  });
}

// === 📸 UPLOAD PROFILE PHOTO ===
const photoUpload = document.getElementById("photoUpload");
if (photoUpload) {
  photoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("profileImage").src = reader.result;
        localStorage.setItem("profilePhoto", reader.result);
      };
      reader.readAsDataURL(file);
    }
  });
}
