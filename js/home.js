const lessons = [
  { title: "Introduction to Cybersecurity", video: "../videos/intro.mp4" },
  { title: "Phishing Awareness", video: "../videos/phishing.mp4" },
  { title: "Strong Passwords", video: "../videos/password.mp4" },
  { title: "Network Security Basics", video: "../videos/network.mp4" }
];

const lessonList = document.getElementById("lesson-list");
const searchInput = document.getElementById("searchInput");
const videoSource = document.getElementById("video-source");
const video = document.getElementById("lesson-video");
const lessonTitle = document.getElementById("lesson-title");
const notes = document.getElementById("notes");
const saveNotesBtn = document.getElementById("saveNotes");

// Display Lessons
function displayLessons(filteredLessons) {
  lessonList.innerHTML = "";
  filteredLessons.forEach((lesson) => {
    const card = document.createElement("div");
    card.classList.add("lesson-card");
    card.innerHTML = `<h3>${lesson.title}</h3>`;
    card.addEventListener("click", () => loadLesson(lesson));
    lessonList.appendChild(card);
  });
}

// Load Selected Lesson
function loadLesson(lesson) {
  lessonTitle.textContent = lesson.title;
  videoSource.src = lesson.video;
  video.load();
  const savedNote = localStorage.getItem(lesson.title) || "";
  notes.value = savedNote;
}

// Save Notes
saveNotesBtn.addEventListener("click", () => {
  const title = lessonTitle.textContent;
  if (title !== "Select a Lesson") {
    localStorage.setItem(title, notes.value);
    alert("✅ Notes saved successfully!");
  } else {
    alert("⚠️ Please select a lesson first.");
  }
});

// Search Lessons
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = lessons.filter((l) =>
    l.title.toLowerCase().includes(keyword)
  );
  displayLessons(filtered);
});

// Initialize
displayLessons(lessons);
