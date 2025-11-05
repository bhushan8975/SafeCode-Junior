import { auth } from './firebaseConfig.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

console.log("Firebase login active ✅");

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Please enter both fields!");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Logged in successfully!");
    window.location.href = "home.html";
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      // Auto register if user doesn’t exist
      await createUserWithEmailAndPassword(auth, email, password);
      alert("🆕 Account created and logged in!");
      window.location.href = "home.html";
    } else {
      alert(`❌ Error: ${err.message}`);
    }
  }
});

document.getElementById("bioBtn").addEventListener("click", async () => {
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (available) {
      alert("✅ Biometric authentication supported on this device!");
    } else {
      alert("❌ Biometrics not available.");
    }
  } catch (e) {
    alert("Error checking biometric availability.");
  }
});
