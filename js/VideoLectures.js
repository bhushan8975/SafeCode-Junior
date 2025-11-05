// 🔐 Example Cybersecurity YouTube Videos
const videos = [
  {
    title: "Introduction to Cybersecurity",
    channel: "NetworkChuck",
    embed: "https://www.youtube.com/embed/inWWhr5tnEA"
  },
  {
    title: "How Hackers Hack Websites",
    channel: "TechHut",
    embed: "https://www.youtube.com/embed/2_lswM1S264"
  },
  {
    title: "Basics of Ethical Hacking",
    channel: "Simplilearn",
    embed: "https://www.youtube.com/embed/sD0lLYlGc6Q"
  },
  {
    title: "Top Cybersecurity Threats Explained",
    channel: "IBM Technology",
    embed: "https://www.youtube.com/embed/tmZz2O3zj8I"
  },
  {
    title: "How to Become a Cybersecurity Expert",
    channel: "FreeCodeCamp",
    embed: "https://www.youtube.com/embed/4t4kBkMsDbQ"
  }
];

const videoGrid = document.querySelector('.video-grid');

videos.forEach(video => {
  const card = document.createElement('div');
  card.classList.add('video-card');
  card.innerHTML = `
    <iframe src="${video.embed}" allowfullscreen></iframe>
    <div class="video-info">
      <h3>${video.title}</h3>
      <p>By ${video.channel}</p>
    </div>
  `;
  videoGrid.appendChild(card);
});
