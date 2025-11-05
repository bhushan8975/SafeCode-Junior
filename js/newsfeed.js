// === News Feed Script ===
// ✅ Works with Vite or plain HTML (module type="module")

const newsList = document.getElementById("news-list");
const searchInput = document.getElementById("searchNews");
const filterSelect = document.getElementById("filterNews");

// === Free Cybersecurity News API ===
// You can replace with your own later if you have a backend
const API_URL = "https://api.cybernewsapi.com/news?limit=20";

// === Fetch & Display News ===
async function loadNews() {
  try {
    // Clear old news and show placeholders
    newsList.innerHTML = `
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
    `;

    // Fetch cyber news
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch news");
    const data = await response.json();

    renderNews(data.articles || []);
  } catch (error) {
    console.error("⚠️ Error loading news:", error);
    newsList.innerHTML = `<p style="color:#f66;">⚠️ Unable to load news right now.</p>`;
  }
}

// === Render News Cards ===
function renderNews(articles) {
  if (!articles.length) {
    newsList.innerHTML = `<p style="color:#ccc;">No news articles found.</p>`;
    return;
  }

  newsList.innerHTML = articles.map(article => `
    <div class="news-card">
      <h3>${article.title || "Untitled"}</h3>
      <p>${article.description ? article.description.slice(0, 100) + "..." : "No description available."}</p>
      <a href="${article.url}" target="_blank">Read More →</a>
    </div>
  `).join("");
}

// === Search Filter ===
searchInput.addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();
  const response = await fetch(API_URL);
  const data = await response.json();

  const filtered = data.articles.filter(article =>
    article.title.toLowerCase().includes(term) ||
    article.description.toLowerCase().includes(term)
  );

  renderNews(filtered);
});

// === Category Filter ===
filterSelect.addEventListener("change", async (e) => {
  const category = e.target.value;
  const response = await fetch(API_URL);
  const data = await response.json();

  let filtered = data.articles;
  if (category !== "latest") {
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(category)
    );
  }

  renderNews(filtered);
});

// === Initial Load ===
loadNews();
