import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                  */import{a as r}from"./firebaseConfig-oADvoGp-.js";import{onAuthStateChanged as c,signOut as l}from"https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";import{v as s}from"./voiceBiometric-Bu1dBzvN.js";import"https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";c(r,o=>{o?(console.log("✅ Logged in as:",o.email),document.getElementById("welcome-text").textContent=`Welcome 👋 ${o.email.split("@")[0]}`):(console.warn("🚫 No user session — redirecting to login..."),window.location.href="login.html")});window.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("logout-btn"),e=document.createElement("button");e.id="verify-voice-btn",e.innerHTML="🎙️ Verify My Voice",e.style=`
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        margin-top: 10px;
        box-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
        transition: all 0.3s ease;
      `;const t=document.createElement("p");t.style="color:#00ffcc; font-size:14px; margin-top:8px;";const i=document.querySelector(".user-info div");i&&(i.appendChild(e),i.appendChild(t)),e.addEventListener("click",async()=>{const n=r.currentUser;if(!n){t.innerText="⚠️ Please login again.";return}try{e.disabled=!0,e.innerText="🎧 Listening...",t.innerText="🎙️ Please speak now...",await s(n.uid)?t.innerText="✅ Voice Verified Successfully!":t.innerText="❌ Voice did not match. Try again."}catch(a){console.error("Voice verification failed:",a),t.innerText="❌ Voice verification failed."}finally{e.disabled=!1,e.innerText="🎙️ Verify My Voice"}}),o.addEventListener("click",async()=>{try{await l(r),console.log("🔒 Signed out successfully"),window.location.href="login.html"}catch(n){console.error("❌ Logout failed:",n)}})});
