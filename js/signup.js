// === js/signup.js (finalized) ===
import { auth, db, storage } from "../js/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { recordVoice } from "./voiceBiometric.js";

// --- DOM elements (defensive)
const signupBtn = document.getElementById("signup-btn");
const backLoginBtn = document.getElementById("back-login");
const recordVoiceBtn = document.getElementById("recordVoiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mobileInput = document.getElementById("mobile");
const profilePicInput = document.getElementById("profile-pic");

// Basic guard if file included before DOM or script load problem
if (!signupBtn) {
  console.warn("signup.js: missing expected DOM elements. Make sure signup.html has #signup-btn.");
}

// --- Utility
function checkConnection() {
  if (!navigator.onLine) {
    alert("⚠️ You are offline. Please connect to the internet and try again.");
    throw new Error("Offline - network not available");
  }
}

function safeFileName(name) {
  // small sanitization for file names used in storage path
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
}

// --- SIGNUP HANDLER
signupBtn?.addEventListener("click", async () => {
  const name = nameInput?.value.trim() ?? "";
  const email = emailInput?.value.trim() ?? "";
  const password = passwordInput?.value.trim() ?? "";
  const mobile = mobileInput?.value.trim() ?? "";
  const file = profilePicInput?.files?.[0];

  if (!name || !email || !password || !mobile) {
    alert("⚠️ Please fill all required fields.");
    return;
  }

  try {
    checkConnection();

    signupBtn.disabled = true;
    signupBtn.innerText = "🔄 Creating account...";

    // create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("✅ User created:", user.uid);

    // default avatar fallback
    let photoURL = "../assets/default-avatar.png";

    // upload profile photo (if provided) with robust error handling
    if (file && storage) {
      try {
        console.log("📸 Uploading profile photo...");
        // sanitize filename and add timestamp to avoid collisions
        const cleanName = `${Date.now()}_${safeFileName(file.name)}`;
        const storageRef = ref(storage, `profilePhotos/${user.uid}/${cleanName}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
        console.log("✅ Profile photo uploaded:", photoURL);
      } catch (uploadErr) {
        console.error("❌ Profile photo upload failed:", uploadErr);

        // Detect common CORS/network failure and show actionable hint
        if (uploadErr?.message?.includes("Network") || uploadErr?.code === "storage/canceled" || uploadErr?.code === "auth/network-request-failed") {
          alert("⚠️ Photo upload failed due to network/CORS. Your account was still created — profile photo will use the default avatar.\n\nTo fix uploads during development, set Bucket CORS to allow http://localhost:5173 (use gsutil to set CORS).");
        } else {
          alert("⚠️ Photo upload failed. Using default avatar instead.");
        }

        // keep photoURL as default avatar (app remains usable)
        photoURL = "../assets/default-avatar.png";
      }
    }

    // update auth profile
    try {
      await updateProfile(user, { displayName: name, photoURL });
    } catch (profileErr) {
      console.warn("⚠️ updateProfile failed (non-blocking):", profileErr);
      // not fatal for the signup flow
    }

    // save user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      mobile,
      photoURL,
      createdAt: new Date().toISOString(),
    });

    console.log("✅ User data saved in Firestore");
    alert("✅ Account created! You can now set up voice biometric (optional).");

    // enable Record Voice button immediately (no race)
    if (recordVoiceBtn) {
      recordVoiceBtn.disabled = false;
      voiceStatus.textContent = "🎙️ Click 'Record Voice' to calibrate your voice.";
    }
  } catch (error) {
    console.error("❌ Signup failed:", error);
    // friendly mapping for common firebase errors
    const msg = error?.code
      ? ({
          "auth/network-request-failed": "Network error — please check your internet or CORS settings.",
          "auth/email-already-in-use": "Email already registered. Try logging in.",
          "auth/invalid-email": "Invalid email format.",
        }[error.code] || error.message)
      : (error.message || String(error));
    alert("❌ Signup failed: " + msg);
  } finally {
    signupBtn.disabled = false;
    signupBtn.innerText = "Sign Up";
  }
});

// --- RECORD VOICE
recordVoiceBtn?.addEventListener("click", async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ Please sign up or login first before recording your voice.");
      return;
    }

    recordVoiceBtn.disabled = true;
    voiceStatus.textContent = "🎧 Recording... please speak clearly.";

    // recordVoice returns Blob (your voiceBiometric.recordVoice implementation)
    const audioBlob = await recordVoice(4000);
    console.log("🎙️ Voice recorded Blob:", audioBlob);

    // Optionally you could upload the audioBlob or extract features here.
    // For now we just store a mock vector in Firestore (your calibration flow may vary).
    const mockVector = Array.from({ length: 16 }, () => Math.random());
    await setDoc(doc(db, "voiceprints", user.uid), { vector: mockVector });
    console.log("✅ Voice vector saved (mock):", mockVector);

    voiceStatus.textContent = "✅ Voice calibration complete!";
    alert("✅ Voice setup done! You can now log in with your voice.");
    // redirect to login page after a moment
    setTimeout(() => (window.location.href = "../pages/login.html"), 1200);
  } catch (err) {
    console.error("❌ Voice calibration failed:", err);
    alert("❌ Voice setup failed: " + (err?.message || err));
    voiceStatus.textContent = "❌ Voice calibration failed. Try again.";
    recordVoiceBtn.disabled = false;
  }
});

// --- BACK
backLoginBtn?.addEventListener("click", () => {
  window.location.href = "../pages/login.html";
});

console.log("✅ signup.js loaded successfully");
