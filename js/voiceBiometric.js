// === voiceBiometric.js (finalized) ===
// Handles voice recording + backend upload + mock verification for SafeCode Junior

import { db } from "../js/firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === 🎙️ Record user's voice sample ===
export async function recordVoice(duration = 4000) {
  const recordBtn = document.getElementById("recordVoiceBtn");
  const voiceStatus = document.getElementById("voiceStatus");

  try {
    if (recordBtn) {
      recordBtn.classList.add("recording-active");
      recordBtn.textContent = "🎙️ Recording...";
    }
    if (voiceStatus) voiceStatus.textContent = "Recording... please speak clearly.";

    // Request mic permission
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    // Optional waveform visualizer
    const canvas = document.getElementById("voiceCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let animationId;

    function drawVisualizer() {
      animationId = requestAnimationFrame(drawVisualizer);
      analyser.getByteFrequencyData(dataArray);

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / dataArray.length) * 2;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          ctx.fillStyle = "#00c6ff";
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
    }

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.start();
    drawVisualizer();

    console.log("🎙️ Recording started...");

    const stopPromise = new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        cancelAnimationFrame(animationId);
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        // cleanup
        stream.getTracks().forEach((t) => t.stop());
        audioContext.close();

        if (recordBtn) {
          recordBtn.classList.remove("recording-active");
          recordBtn.textContent = "🎙️ Record Voice";
        }
        if (voiceStatus) voiceStatus.textContent = "✅ Recording saved.";

        console.log("✅ Recording complete.");
        resolve(audioBlob);
      };
    });

    setTimeout(() => mediaRecorder.stop(), duration);
    return await stopPromise;
  } catch (err) {
    console.error("🎤 Microphone error:", err);
    if (voiceStatus) voiceStatus.textContent = "❌ Microphone not available.";
    alert("⚠️ Microphone access denied or unavailable.");
    throw err;
  }
}

// === 🧠 Extract mock voice vector (demo purpose only) ===
function extractMockVoiceVector(audioBlob) {
  // In a real system, you'd extract MFCC or spectral features
  // Here we simulate with random data
  const vector = Array.from({ length: 16 }, () => Math.random());
  return vector;
}

// === 💾 Save voice vector (Firestore + optional backend API) ===
export async function saveVoiceVector(userId, audioBlob) {
  const vector = extractMockVoiceVector(audioBlob);

  // 1️⃣ Try saving to backend server if available
  try {
    const response = await fetch("http://localhost:8080/api/voice/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, vector }),
    });

    if (!response.ok) throw new Error("Backend server not reachable.");
    console.log("✅ Voice vector sent to backend successfully.");
  } catch (err) {
    console.warn("⚠️ Backend not connected, falling back to Firestore:", err.message);
    await setDoc(doc(db, "voiceprints", userId), { vector });
    console.log("✅ Voice vector saved in Firestore (fallback).");
  }

  return vector;
}

// === 🔐 Verify user's voice during login ===
export async function verifyVoice(userId) {
  console.log("🎙️ Starting voice verification for:", userId);
  alert("🎧 Please say your passphrase for voice verification.");

  try {
    const audioBlob = await recordVoice(4000);
    const newVector = extractMockVoiceVector(audioBlob);

    // Try verifying via backend first
    try {
      const response = await fetch("http://localhost:8080/api/voice/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vector: newVector }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.match) {
          console.log("✅ Voice verified via backend.");
          return true;
        } else {
          console.log("❌ Voice mismatch via backend.");
          return false;
        }
      }
      throw new Error("Backend verification failed.");
    } catch (err) {
      console.warn("⚠️ Backend verification unavailable, using local mock:", err.message);

      // Fallback: use Firestore stored vector + simple mock comparison
      const docSnap = await getDoc(doc(db, "voiceprints", userId));
      if (!docSnap.exists()) {
        alert("⚠️ No voice data found for this user.");
        return false;
      }

      const storedVector = docSnap.data().vector || [];
      // simple cosine similarity (mock)
      const dot = storedVector.reduce((sum, v, i) => sum + v * newVector[i], 0);
      const magA = Math.sqrt(storedVector.reduce((s, v) => s + v * v, 0));
      const magB = Math.sqrt(newVector.reduce((s, v) => s + v * v, 0));
      const similarity = dot / (magA * magB);

      const isMatch = similarity > 0.8; // mock threshold
      console.log(isMatch ? "✅ Voice verified locally" : "❌ Voice mismatch locally");
      return isMatch;
    }
  } catch (err) {
    console.error("❌ Voice verification failed:", err);
    alert("❌ Voice verification failed: " + err.message);
    return false;
  }
}
