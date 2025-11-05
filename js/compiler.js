document.getElementById("run-btn").addEventListener("click", async () => {
  const code = document.getElementById("code-editor").value;
  const language = document.getElementById("language").value;
  const outputBox = document.getElementById("output");

  outputBox.textContent = "⏳ Running your code...";

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, source: code }),
    });

    const result = await response.json();
    outputBox.textContent = result.run.output || "✅ No output";
  } catch (error) {
    outputBox.textContent = "❌ Error: " + error.message;
  }
});
