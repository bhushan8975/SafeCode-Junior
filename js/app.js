// Firebase import and setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9nMht5GAOTujsK_K5vXocIhF9fMsqvvc",
  authDomain: "safecode-junior-ebda5.firebaseapp.com",
  databaseURL: "https://safecode-junior-ebda5-default-rtdb.firebaseio.com/",
  projectId: "safecode-junior-ebda5",
  storageBucket: "safecode-junior-ebda5.appspot.com",
  messagingSenderId: "369508348125",
  appId: "1:369508348125:web:f186b6fc342a9d8e5beb34",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to load leaderboard
function loadLeaderboard() {
  const leaderboardRef = ref(db, "leaderboard/");
  const leaderboardList = document.getElementById("leaderboardList");
  onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    leaderboardList.innerHTML = "";
    if (!data) {
      leaderboardList.innerHTML = "<li>No scores yet.</li>";
      return;
    }
    const sorted = Object.entries(data)
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 5);
    sorted.forEach(([name, { score }]) => {
      const li = document.createElement("li");
      li.textContent = `${name}: ${score} pts`;
      leaderboardList.appendChild(li);
    });
  });
}

loadLeaderboard();

// Example: add/update score
window.addScore = function (username, score) {
  set(ref(db, "leaderboard/" + username), { score });
};

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  alert("You have logged out!");
  window.location.href = "login.html";
});
