// Fetch and display notes from Rust backend
async function loadNotes() {
  try {
    const response = await fetch("http://127.0.0.1:8080/notes");
    const notes = await response.json();

    const notesContainer = document.getElementById("notes-container");
    notesContainer.innerHTML = "";

    notes.forEach(note => {
      const div = document.createElement("div");
      div.className = "note-card";
      div.innerHTML = `
        <h3>📝 Note ${note.id}</h3>
        <p>${note.content}</p>
      `;
      notesContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load notes:", err);
  }
}

// Save a new note to Rust backend
async function saveNote() {
  const content = document.getElementById("note-input").value;
  if (!content.trim()) return alert("Please write something first!");

  const response = await fetch("http://127.0.0.1:8080/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Date.now(), content })
  });

  const result = await response.json();
  alert(result);
  document.getElementById("note-input").value = "";
  loadNotes();
}

document.addEventListener("DOMContentLoaded", loadNotes);
