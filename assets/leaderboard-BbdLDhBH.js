import"./modulepreload-polyfill-B5Qt9EMX.js";import{a as n,d as l}from"./firebaseConfig-oADvoGp-.js";import{onAuthStateChanged as c,signOut as s}from"https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";import{query as m,collection as g,orderBy as f,limit as u,getDocs as y}from"https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";c(n,o=>{o?(console.log("✅ Logged in as:",o.email),h()):(console.warn("🚫 No user logged in. Redirecting..."),setTimeout(()=>{n.currentUser||(window.location.href="login.html")},800))});window.logoutUser=async function(){try{await s(n),window.location.href="login.html"}catch(o){console.error("Logout failed:",o)}};async function h(){const o=document.getElementById("leaderboard-body");if(o){o.innerHTML="<tr><td colspan='4'>⏳ Loading leaderboard...</td></tr>";try{const t=m(g(l,"leaderboard"),f("score","desc"),u(10)),a=await y(t);o.innerHTML="";let r=1;a.forEach(d=>{const e=d.data(),i=`
            <tr>
              <td>#${r}</td>
              <td>${e.name||"Anonymous"}</td>
              <td>${e.email||"—"}</td>
              <td>${e.score||0}</td>
            </tr>
          `;o.insertAdjacentHTML("beforeend",i),r++}),r===1&&(o.innerHTML="<tr><td colspan='4'>No players yet 🕹️</td></tr>")}catch(t){console.error("Leaderboard load error:",t),o.innerHTML="<tr><td colspan='4'>⚠️ Failed to load leaderboard</td></tr>"}}}
