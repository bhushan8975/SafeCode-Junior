// leaderboard.js — Plain JavaScript version for Vite + Firebase (no React)

import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "../js/firebaseConfig.js"; // Adjust if your Firebase config file path differs

const db = getFirestore(app);

async function loadLeaderboard() {
  const leaderboardContainer = document.getElementById("leaderboard");
  leaderboardContainer.innerHTML = "<p>Loading leaderboard...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "leaderboard"));
    const data = querySnapshot.docs.map((doc) => doc.data());
    const sorted = data.sort((a, b) => b.score - a.score);

    let html = `
      <h2>🏆 Top Coders Leaderboard</h2>
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
    `;

    sorted.forEach((item, index) => {
      html += `
        <tr>
          <td>#${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.score}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    leaderboardContainer.innerHTML = html;
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    leaderboardContainer.innerHTML = "<p>⚠️ Failed to load leaderboard.</p>";
  }
}

// Add test score
async function addTestScore() {
  const name = document.getElementById("testName").value.trim();
  const score = parseInt(document.getElementById("testScore").value);

  if (!name || isNaN(score)) {
    alert("Please enter a valid name and score!");
    return;
  }

  try {
    await addDoc(collection(db, "leaderboard"), { name, score });
    alert("✅ Score added!");
    document.getElementById("testName").value = "";
    document.getElementById("testScore").value = "";
    loadLeaderboard(); // Refresh leaderboard
  } catch (error) {
    console.error("Error adding score:", error);
    alert("❌ Failed to add score. Check console for details.");
  }
}

// Search filter
function setupSearch() {
  const searchInput = document.getElementById("lbSearch");
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll(".leaderboard-table tbody tr");
    rows.forEach((row) => {
      const name = row.children[1].textContent.toLowerCase();
      row.style.display = name.includes(filter) ? "" : "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
  setupSearch();
  document.getElementById("addTestScore").addEventListener("click", addTestScore);
});
